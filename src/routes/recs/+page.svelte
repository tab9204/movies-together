<script>
    import Nav from "$lib/Nav.svelte";
    import Botnav from "$lib/Botnav.svelte";
    import Error from "$lib/Error.svelte";
    import Loading from "$lib/Loading.svelte";
    import {pbSub} from "$lib/pb.js";
    
    
    export let data;

    //list of movie recommendations the user has
    let recs = data.recs;
    //total number of recs
    let numRecs = data.recs.length;
    //error message flag and text
    let showError = false;
    let errorText = "Error";

    //set up realtime listeners 
    pbSub('recommended_movies',(e)=>{
        //increase and descrease the recs notification in the nav
        if(e.record.to == data.user.id){
            if(e.action == "create"){
                const new_rec = {
                    id: e.record.id,
                    movie: e.record.movie,
                    list: e.record.tag
                }
                recs.push(new_rec);
                recs = recs;
                numRecs += 1;
            }
            else if(e.action == "delete"){
                numRecs -= 1;
            }  
        }
    });

    //rec accept
    const accept = async (movie)=>{
        if(!movie){return;}
        const resp = await fetch("/api/acceptrec",{
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {'content-type': 'application/json'}
        });
        const data = await resp.json();
        //error
        if(data.message){
            errorText = data.message;
            showError = true;
        }
        //no error
        else{
            //remove the first rec so we can show the next one
            recs.shift();
            recs = recs;
        }
    }

    //rec decline
    const decline = async (movie)=>{
        if(!movie){return;}
        console.log(movie)
        const resp = await fetch("/api/declinerec",{
            method: 'POST',
            body: JSON.stringify(movie.id),
            headers: {'content-type': 'application/json'}
        });
        const data = await resp.json();
        //error
        if(data.message){
            errorText = data.message;
            showError = true;
        }
        //no error
        else{
            //remove the first rec so we can show the next one
            recs.shift();
            recs = recs;
        }
    }
        
</script>

<Nav numRecs={numRecs}/>
<div id="pageContainer">
    <Loading></Loading>
    <Error show={showError} errorMsg={errorText} hide={() => showError = false}></Error>
    {#if recs.length > 0}
        <img class="poster" alt="Movie poster" loading="lazy" src="https://image.tmdb.org/t/p/w300/{recs[0].movie.image}">
        <div class="textContainer">
            {#if recs[0].list != ""}<p>{recs[0].list}</p>{/if}
            <h2>{recs[0].movie.title}</h2>
            <h4>{recs[0].movie.release_date}</h4>
            <h4>{recs[0].movie.runtime} minutes</h4>
            {#each recs[0].movie.genres as genre}
                <p>{genre}</p>
            {/each}
            <p>{recs[0].movie.overview}</p>
        </div>
    {:else}
        <div class="textContainer">
            <p>You have no recommended movies</p>
        </div>
    {/if}
</div>
<Botnav>
    <button on:click={()=>{accept(recs[0])}}>Yeah</button>
    <button on:click={()=>{decline(recs[0])}}>Nah</button>
</Botnav>

<style>
    .poster{
        width: 300px;
        height: 169px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        background: var(--blue);
    }
    .textContainer{
        padding: 10px;
    }
</style>