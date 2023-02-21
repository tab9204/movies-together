<script>
    import Nav from "$lib/components/Nav.svelte";
    import Botnav from "$lib/components/Botnav.svelte";
    import Error from "$lib/components/Error.svelte";
    import Iconbtn from "$lib/components/Iconbtn.svelte";
    import {pbSub} from "$lib/pb.js";
    
    
    export let data;

    let movieRecs = data.movieRecs;
    let numberOfRecs = data.movieRecs.length;
    let showError = false;
    let errorMessage = "Error";


    const acceptMovieRec = async (movie)=>{
        //the accept and decline buttons are active even without a current movie recommendation 
        //so we return out to prevent any uneeded fetch requests 
        if(!movie){return;}
        const resp = await fetch("/api/acceptrec",{
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {'content-type': 'application/json'}
        });
        const data = await resp.json();
        const error = data.message;
        if(error){
            errorMessage = data.message;
            showError = true;
        }
        else{
            movieRecs.shift();
            movieRecs = movieRecs;
        }
    }

    const declineMovieRec = async (movie)=>{
        if(!movie){return;}
        const resp = await fetch("/api/declinerec",{
            method: 'POST',
            body: JSON.stringify(movie.id),
            headers: {'content-type': 'application/json'}
        });
        const data = await resp.json();
        const error = data.message;
        if(error){
            errorMessage = data.message;
            showError = true;
        }
        else{
            movieRecs.shift();
            movieRecs = movieRecs;
        }
    }

    pbSub('recommended_movies',(e)=>{
        if(e.record.to == data.user.id){
            if(e.action == "create"){
                const new_rec = {
                    id: e.record.id,
                    movie: e.record.movie,
                    list: e.record.tag
                }
                movieRecs.push(new_rec);
                movieRecs = movieRecs;
                numberOfRecs += 1;
            }
            else if(e.action == "delete"){
                numberOfRecs -= 1;
            }  
        }
    });
        
</script>

<Nav {numberOfRecs}/>
<div id="pageContainer">
    <Error bind:showError={showError} {errorMessage}></Error>
    {#if numberOfRecs > 0}
        <img class="poster" alt="Movie poster" loading="lazy" src="https://image.tmdb.org/t/p/w300/{movieRecs[0].movie.image}">
        <div class="textContainer">
            {#if movieRecs[0].list}<p>{movieRecs[0].list}</p>{/if}
            <h2>{movieRecs[0].movie.title}</h2>
            <h4>{movieRecs[0].movie.release_date}</h4>
            <h4>{movieRecs[0].movie.runtime} minutes</h4>
            {#each movieRecs[0].movie.genres as genre}
                <p>{genre}</p>
            {/each}
            <p>{movieRecs[0].movie.overview}</p>
        </div>
    {:else}
        <div class="textContainer">
            <p>You have no recommended movies</p>
        </div>
    {/if}
</div>
<Botnav>
    <Iconbtn icon="check" click={()=>{acceptMovieRec(movieRecs[0])}}></Iconbtn>
    <Iconbtn icon="cross" click={()=>{declineMovieRec(movieRecs[0])}}></Iconbtn>
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