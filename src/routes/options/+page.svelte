<script>
    import {goto} from '$app/navigation';
    import Nav from "$lib/components/Nav.svelte";
    import Error from "$lib/components/Error.svelte";
    import Botnav from  "$lib/components/Botnav.svelte";
    import Iconbtn from "$lib/components/Iconbtn.svelte";
    import {pbSub} from "$lib/pb.js";

    export let data;

    let selectedGenres = data.searchOptions;
    let numberOfRecs = data.numberOfRecs;
    let genres =[
        {"id":28,"name":"Action"},
        {"id":12,"name":"Adventure"},
        {"id":16,"name":"Animation"},
        {"id":35,"name":"Comedy"},
        {"id":80,"name":"Crime"},
        {"id":99,"name":"Documentary"},
        {"id":18,"name":"Drama"},
        {"id":10751,"name":"Family"},
        {"id":14,"name":"Fantasy"},
        {"id":36,"name":"History"},
        {"id":27,"name":"Horror"},
        {"id":10402,"name":"Music"},
        {"id":9648,"name":"Mystery"},
        {"id":10749,"name":"Romance"},
        {"id":878,"name":"Science Fiction"},
        {"id":10770,"name":"TV Movie"},
        {"id":53,"name":"Thriller"},
        {"id":10752,"name":"War"},
        {"id":37,"name":"Western"}];
    let showError = false;
    let errorMessage = "Error";

    //id => id of the genre we are selecting
    const selectGenreOption = (id)=>{
        if(selectedGenres.includes(id)){
            const index = selectedGenres.indexOf(id);
            selectedGenres.splice(index, 1);
            selectedGenres = selectedGenres;
        }
        else{
            selectedGenres.push(id); 
            selectedGenres = selectedGenres;
        }
    }

    const saveOptions = async ()=>{
        const resp = await fetch("/api/saveoptions",{
            method: 'POST',
            body: JSON.stringify({selectedGenres}),
            headers: {'content-type': 'application/json'}
        });
        const data = await resp.json();
        var error = data.message;
        if(error){
            errorMessage = `Could not save your search options`;
            showError = true;
        }
        else{
            goto("/");
        }
    }

    pbSub('recommended_movies',(e)=>{
        if(e.record.to == data.user.id){  
            if(e.action == "create"){
                numberOfRecs += 1;
            }
        }
    });



 </script>

<Nav {numberOfRecs}/>
<div id="pageContainer">
    <Error bind:showError={showError} {errorMessage}></Error>
    <div id="genres">
        {#each genres as genre}
            <button class:selected="{selectedGenres.includes(genre.id)}" on:click={()=>{selectGenreOption(genre.id)}}>{genre.name}</button>
        {/each}
    </div>
</div>
<Botnav>
  <Iconbtn icon="check" click={saveOptions}></Iconbtn>
</Botnav>

<style>
    #genres{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        padding: 10px;
    }
    button{
        background: var(--white);
        border-radius: 3px;
        border: 1px solid;
        padding: 8px;
        text-align: left;
        font-size: 1.2em;
        width: 150px;
    }
    button.selected{
        background: var(--blue); 
    }
</style>