<script>
    import Nav from "$lib/nav.svelte";
    import Botnav from "$lib/botnav.svelte";
    import Popup from "$lib/popup.svelte";
    import Error from "$lib/error.svelte";
    import Loading from "$lib/loading.svelte";
    import {pbSub} from "$lib/pb.js";

    export let data;
    let numRecs = data.numRecs;
    let watchlist = data.watchlist;
    let lists = data.lists;
    let addMenu = false;
    let deleteMenu = false;
    //error message flag and text
    let showError = false;
    let errorText = "Error";
    
      //set up realtime listeners 
    pbSub('recommended_movies',(e)=>{
        //if the rec to field matches the user's id
        if(e.record.to == data.user.id){ 
            //if a new rec was added 
            if(e.action == "create"){
                //increase the number of recs shown in the nav 
                numRecs += 1;
            }
        }
    });

    pbSub('lists',(e)=>{
        console.log("test")
        //if the rec to field matches the user's id
        if(e.record.owners.includes(data.user.id) && e.record.owners.includes(data.user.buddy_id)){ 
            //if a new rec was added 
            if(e.action == "create"){
                const newList = {
                    id: e.record.id ,
                    name: e.record.name
                }
                lists.push(newList);
                lists = lists;
            }
            else if (e.action == "delete"){
                lists.forEach((list, i) => {
                    if(list.id == e.record.id){
                        lists.splice(i,1);
                    }
                });
                lists = lists;
            }
        }
    });

    pbSub('watchlist',(e)=>{
        //if the rec to field matches the user's id
        if(e.record.owners.includes(data.user.id) && e.record.owners.includes(data.user.buddy_id)){ 
            //if a new rec was added 
            if(e.action == "create"){
                const newMovie = {
                    id: e.record.id ,
                    list: e.record.list,
                    movie: e.record.movie
                }
                lists.push(newMovie);
                watchlist = watchlist;
            }
            else if (e.action == "delete"){
                watchlist.forEach((item, i) => {
                    if(item.id == e.record.id){
                        watchlist.splice(i,1);
                    }
                });
                watchlist = watchlist; 
            }
        }
    });

    //collapses and expands a tag section
    const listSectionClick = (section)=>{
        //if already collapsed
        if(section.classList.contains("collapsed")){
            section.classList.remove("collapsed");
            section.style.height = "fit-content";
        }
        else{
            section.classList.add("collapsed"); 
            section.style.height = "42px";
        }
    }

    const addList = async ()=>{
        //get the name of the new tag
        const name = document.querySelector("#listInput").value;
        //if empty exit out 
        if(name == ""){return;}
        //reset the input text 
        document.querySelector("#listInput").value = "";
        //add the new tag
        const resp = await fetch("/api/addlist",{
            method: 'POST',
            body: JSON.stringify({name:name}),
            headers: {'content-type': 'application/json'}
        });
        const data = await resp.json();
        //no message no error
        if(data.message){
            errorText = `Could not create new list. Try again`;
            showError = true;
        }

    }

    const deleteList = async (id)=>{
        //add the new tag
        const resp = await fetch("/api/deletelist",{
            method: 'POST',
            body: JSON.stringify({id:id}),
            headers: {'content-type': 'application/json'}
        });
        const data = await resp.json();
        //no message no error
        if(data.message){
            errorText = `Could not delete list. Try again`;
            showError = true;
        }

    }
</script>

<Nav numRecs={numRecs}/>
<Popup show={addMenu}>
    <p>Lists are used to organize your movies</p>
    <input id="listInput" type="text" placeholder="Create new list" />
    <button on:click={addList}>Create</button>
</Popup>
<Popup show={deleteMenu}>
{#if lists.length > 0}
    <div id="lists">
    {#each lists as list}
        <div class="deleteList">
            <div>{list.name}</div>
            <button on:click={()=>{deleteList(list.id)}}>Delete</button>
        </div>
    {/each}
    </div>
{:else}
    <p>You have no lists yet</p>
{/if}
</Popup>
<div id="pageContainer" on:click={()=>{deleteMenu = false; addMenu = false;}} on:keypress={()=>{deleteMenu = false; addMenu = false;}}>
    <Loading></Loading>
    <Error show={showError} errorMsg={errorText} hide={() => showError = false}></Error>
    <div id="watchlist">
        {#each lists as list}
        <!--movies in lists-->
            <div class="listSection collapsed">
                <div class="list" on:click={(e)=>{listSectionClick(e.currentTarget.parentNode)}} on:keypress={(e)=>{listSectionClick(e.currentTarget.parentNode)}}>{list.name}</div>
                <div class="movie">
                    {#each watchlist as entry}
                        {#if entry.list == list.name}
                            <h2>{entry.movie.title}</h2>
                            <h4>{entry.movie.release_date}</h4>
                            <h4>{entry.movie.runtime} minutes</h4>
                            {#each entry.movie.genres as genre}
                                <p>{genre}</p>
                            {/each}
                            <p>{entry.movie.overview}</p>
                        {/if}
                    {/each}
                </div>
            </div>
        {/each}
        <!--movies not in lists-->
        <div class="listSection">
            <div class="list" on:click={(e)=>{listSectionClick(e.currentTarget.parentNode)}} on:keypress={(e)=>{listSectionClick(e.currentTarget.parentNode)}}>Unlisted movies</div>
            <div class="movie">
                {#each watchlist as entry}
                    {#if entry.list == ""}
                        <h2>{entry.movie.title}</h2>
                        <h4>{entry.movie.release_date}</h4>
                        <h4>{entry.movie.runtime} minutes</h4>
                        {#each entry.movie.genres as genre}
                            <p>{genre}</p>
                        {/each}
                        <p>{entry.movie.overview}</p>
                    {/if}
                {/each}
            </div>
        </div>
    </div>
</div>
<Botnav>
    <button on:click={()=>{addMenu = true; deleteMenu = false;}}>Add list</button>
    <button on:click={()=>{deleteMenu = true; addMenu = false;}}>Delete List</button>
</Botnav>

<style>

    #watchlist{
        position: relative;
        left: 50%; transform: translateX(-50%);
        height: 100%; 
        max-width: 640px;
        padding: 10px;
    }
    .listSection{
        overflow: hidden;
        height: fit-content;
        background-color: var(--red);
        margin: 4px 0;
    }
    .listSection.collapsed{
        height: 42px;
    }
    .list{
        height: 20px;
        background: #e0e0e0;
        border: 1px solid;
        box-shadow: 0.5px 1px 1px black;
        padding: 10px;
    }
    .deleteList{
        display: flex;
        justify-content: space-between;
        margin: 5px 0;
    }
    .movie{
        margin-top: 5px;
        min-height: 50px;
    }
</style>
