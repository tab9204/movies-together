<script>
  import Nav from "$lib/components/nav.svelte";
  import Popup from "$lib/components/popup.svelte";
  import Botnav from "$lib/components/botnav.svelte";
  import Error from "$lib/components/error.svelte";
  import Loading from "$lib/components/loading.svelte";
  import {pbSub} from "$lib/pb.js";


  export let data;
  //array of movies from TMDB api
  let movies = data.movies;
  //number of recommendations the user has
  let numRecs = data.numRecs;
  //the movie lists the user has availabile to them
  let lists = data.lists;
  //flag to show or hide the recommend menu
  let recMenu = false;
  //error message flag and text
  let showError = false;
  let errorText = "Error";

  //listen for new movie recs
  pbSub('recommended_movies',(e)=>{
    //if the rec to field matches the user's id
    if(e.record.to == data.user.id){ 
      //if a new rec was added 
      if(e.action == "create"){
        numRecs += 1;
      }
    }
  });

  //listen for lists being added or deleted 
  pbSub('lists',(e)=>{
    console.log(e);
    if(e.record.owners.includes(data.user.id) && e.record.owners.includes(data.user.buddy_id)){
      //add to lists
      if(e.action == "create"){
        const newList = {
          id: e.record.id ,
          name: e.record.name
        }
        lists.push(newList);
        lists = lists;
      }
      //remove from lists
      else if(e.action == "delete"){
        lists.forEach((list, i) => {
          if(list.id == e.record.id){
            lists.splice(i,1);
          }
        });
        lists = lists;
      }
    }
  });

  
  //shows the next movie in the movie array
  const next = async ()=>{
    recMenu = false; 
    movies.shift();
    movies = movies;
    //if there are less then 10 movies left to view fetch more 
    if(movies.length <= 10){
      more();
    }
  }

  //fetches more movies from TMDB api
  const more = async ()=>{
    const resp = await fetch("/api/getmovies");
    const data = await resp.json();
    movies = movies.concat(data);
  }

  //sends a new movie recommendation 
  const recommend = async (id,list)=>{
    //close the menu and move to the next movie
    //if there is an error we wil alert the user but otherwise we don't want to hold up the user 
    recMenu = false;
    next();
    //recommendation fetch request
    const resp = await fetch("/api/recmovie",{
      method: 'POST',
      body: JSON.stringify({id,list}),
      headers: {'content-type': 'application/json'}
    });
    const data = await resp.json();
    //message = error
    if(data.message){
      errorText = `Operation could not be completed`;
      showError = true;
    }
  }

</script>

<Nav numRecs={numRecs}/>
<Popup show={recMenu}>
  <p>Recommend this movie for which list?</p>
  <div id="listContainer">
    {#each lists as list}
    <button on:click={()=>{recommend(movies[0].id,list.name);}}>{list.name}</button>
    {/each}
  <button on:click={()=>{recommend(movies[0].id,"");}}>No list</button>
  </div>
</Popup>
<div id="pageContainer" on:click={()=>{recMenu = false;}} on:keypress={()=>{recMenu = false;}}>
  <Loading></Loading>
  <Error show={showError} errorMsg={errorText} hide={() => showError = false}></Error>
  {#if movies?.length > 0}
    <img class="poster" alt="Movie poster" loading="lazy" src="https://image.tmdb.org/t/p/w300/{movies[0].backdrop_path}">
    <div class="textContainer">
      <h2>{movies[0].title}</h2>
      <h4>{new Date(movies[0].release_date).getFullYear()}</h4>
      <p>{movies[0].overview}</p>
    </div>
  {:else}
    <div class="textContainer">
      <p>No more movies to view. Adjust your search options.</p>
    </div>
  {/if}
</div>
<Botnav>
  <button on:click={()=>{recMenu = true;}}>Recommend</button>
  <button on:click={next}>Next</button>
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
    background: var(--blue);
  }
  .textContainer{
    padding: 10px;
  }
</style>
