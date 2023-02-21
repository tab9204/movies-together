<script>
  import Nav from "$lib/components/Nav.svelte";
  import Popup from "$lib/components/Popup.svelte";
  import Botnav from "$lib/components/Botnav.svelte";
  import Error from "$lib/components/Error.svelte";
  import Iconbtn from "$lib/components/Iconbtn.svelte";
  import {pbSub} from "$lib/pb.js";
	import Textbtn from "../lib/components/Textbtn.svelte";


  export let data;

  let randomMovies = data.movies;
  let numberOfRecs = data.numberOfRecs;
  let userLists = data.lists;
  let recPopupToggle = false;
  let showError = false;
  let errorMessage = "Error";

  
  const nextMovie = async ()=>{
    randomMovies.shift();
    randomMovies = randomMovies;
    //since we want a constant list of movies for the user to look through
    //we get move once the current list gets low
    if(randomMovies.length <= 10){
      getMoreRandomMovies();
    }
  }

  const getMoreRandomMovies = async ()=>{
    const resp = await fetch("/api/getmovies");
    const data = await resp.json();
    randomMovies = randomMovies.concat(data);
  }

  //id => TMDB movie id 
  //list => the user list the movie is being recommended for
  const recommendMovie = async (id,list)=>{
    //closed and move on to the next movie before the db operations complete 
    //if the db fails and the movie is not recommended oh well
    recPopupToggle = false;
    nextMovie();
    const resp = await fetch("/api/recmovie",{
      method: 'POST',
      body: JSON.stringify({id,list}),
      headers: {'content-type': 'application/json'}
    });
    const data = await resp.json();
    var error = data.message;
    if(error){
      errorMessage = `Operation could not be completed`;
      showError = true;
    }
  }

  pbSub('recommended_movies',(e)=>{
    if(e.record.to == data.user.id){  
      if(e.action == "create"){
        numberOfRecs += 1;
      }
    }
  });

  pbSub('lists',(e)=>{
    //we only want lists where the owner has both the user and their current buddy 
    if(e.record.owners.includes(data.user.id) && e.record.owners.includes(data.user.buddy_id)){
      if(e.action == "create"){
        const newList = {
          id: e.record.id ,
          name: e.record.name
        }
        userLists.push(newList);
        userLists = userLists;
      }
      else if(e.action == "delete"){
        userLists.forEach((list, i) => {
          if(list.id == e.record.id){
            userLists.splice(i,1);
          }
        });
        userLists = userLists;
      }
    }
  });

</script>

<Nav {numberOfRecs}/>
<Popup bind:show={recPopupToggle}>
  <div id="listContainer">
    {#each userLists as list}
    <Textbtn click={()=>{recommendMovie(randomMovies[0].id,list.name);}}>{list.name}</Textbtn>
    {/each}
    <Textbtn click={()=>{recommendMovie(randomMovies[0].id,"");}}>No list</Textbtn>
  </div>
</Popup>
<div id="pageContainer">
  <Error bind:showError={showError} {errorMessage}></Error>
  {#if randomMovies?.length > 0}
    {#if randomMovies[0].backdrop_path != null}
      <img class="poster" alt="Movie poster" loading="lazy" src="https://image.tmdb.org/t/p/w300/{randomMovies[0].backdrop_path}">
    {:else}
      <div class="poster"></div>
    {/if}
    <div class="textContainer">
      <h2>{randomMovies[0].title}</h2>
      <h4>{new Date(randomMovies[0].release_date).getFullYear()}</h4>
      <p>{randomMovies[0].overview}</p>
    </div>
  {:else}
    <div class="textContainer">
      <p>No more movies to view. Adjust your search options.</p>
    </div>
  {/if}
</div>
<Botnav>
  <Iconbtn icon="recommend" click={()=>{recPopupToggle = true;}}></Iconbtn>
  <Iconbtn icon="next" click={nextMovie}></Iconbtn>
</Botnav>

<style>
  #listContainer{
    display: flex;
    flex-direction: column;
    gap:5px;
    margin-bottom: 10px;
  }
  .poster{
    min-width: 300px;
    min-height: 169px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    background: var(--smoke);
  }
  .textContainer{
    padding: 10px;
  }
</style>
