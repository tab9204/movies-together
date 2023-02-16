<script>
    import Nav from "$lib/components/Nav.svelte";
    import Botnav from "$lib/components/Botnav.svelte";
    import Popup from "$lib/components/Popup.svelte";
    import Error from "$lib/components/Error.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Iconbtn from "$lib/components/Iconbtn.svelte";
    import {pbSub} from "$lib/pb.js";
    import {fly} from 'svelte/transition';

    export let data;


    //number of recs the user has
    let numRecs = data.numRecs;
    //all movies in the user watchlist
    let watchlist = data.watchlist;
    //all the lists the user has
    let lists = data.lists;
    //popup menu toggles
    let addListMenu = false;
    let deleteListMenu = false;
    let deleteMovieMenu = false;
    //error message flag and text
    let showError = false;
    let errorText = "Error";
    //timer before the start hold function goes off 
    let holdTimer;
    let held = false;
    //matrix containing bool values to toggle delete button visiblity 
    let deleteMatrix = [];
    lists.forEach((list,i)=>{
        deleteMatrix.push(false);
    });
    //index of the list to be deleted 
    let deleteListIndex;
    //id of the movie to be deleted 
    let deleteMovieId;
    //value of the add list input
    let addListVal = "";

    //when the user starts holding
    //i => index of the list section within the delete matrix
    const startHold = (i)=>{
        held = false;
        holdTimer = setTimeout(()=>{
            held = true;
            deleteMatrix[i] = true;
        },1000)
    }

    const cancelHold = ()=>{
        clearTimeout(holdTimer);
    }

    //collapses and expands a list section
    //section => the list section clicked on 
    //i => the sections index in the delete matrix
    const listSectionClick = (section,i)=>{
        //ignore if the user is holding
        if(held) {return;}
        //ignore if the delete icon is showing
        if(deleteMatrix[i]){
            deleteMatrix[i] = false;
            return;
        }
        //expand or collapse the section
        if(section.classList.contains("collapsed")){
            section.classList.remove("collapsed");
            section.style.height = "fit-content";
        }
        else{
            section.classList.add("collapsed"); 
            section.style.height = "42px";
        }
    }
    
    //adds a new list to the db
    const addList = async ()=>{
        //if empty exit out 
        if(addListVal == ""){return;}
        const resp = await fetch("/api/addlist",{
            method: 'POST',
            body: JSON.stringify({name:addListVal}),
            headers: {'content-type': 'application/json'}
        });
        //reset the text input and close popup
        addListVal = "";
        addListMenu = false;

        const data = await resp.json();
        //message = error
        if(data.message){
            errorText = `Could not create new list. Try again`;
            showError = true;
        }

    }

    //deletes a list from the db
    //id => db entry id 
    const deleteList = async (id)=>{
        const resp = await fetch("/api/deletelist",{
            method: 'POST',
            body: JSON.stringify({id:id}),
            headers: {'content-type': 'application/json'}
        });
        //close the popup
        deleteListMenu = false; 
        const data = await resp.json();
        //no message no error
        if(data.message){
            errorText = `Could not delete list. Try again`;
            showError = true;
        }

    }

    //deletes a movies fomr the db 
    //id => db entry id
    const deleteMovie = async (id)=>{
        const resp = await fetch("/api/deletemovie",{
            method: 'POST',
            body: JSON.stringify({id:deleteMovieId}),
            headers: {'content-type': 'application/json'}
        });
        //close the popup
        deleteMovieMenu = false;
        const data = await resp.json();
        //no message no error
        if(data.message){
            errorText = `Could not delete the movie. Try again`;
            showError = true;
        }

    }

    //set up realtime listeners 

    pbSub('recommended_movies',(e)=>{
        if(e.record.to == data.user.id){ 
            //newly added
            if(e.action == "create"){
                numRecs += 1;
            }
        }
    });

    pbSub('lists',(e)=>{
        if(e.record.owners.includes(data.user.id) && e.record.owners.includes(data.user.buddy_id)){  
            if(e.action == "create"){
                const newList = {
                    id: e.record.id ,
                    name: e.record.name
                }
                lists.push(newList);
                lists = lists;
                //need to keep the delete matrix in sync with the lists
                deleteMatrix.push(false);
                deleteMatrix = deleteMatrix;
            }
            else if (e.action == "delete"){
                lists.forEach((list, i) => {
                    if(list.id == e.record.id){
                        lists.splice(i,1);
                        deleteMatrix.splice(i,1);
                    }
                });
                lists = lists;
                deleteMatrix = deleteMatrix;
            }
        }
    });

    pbSub('watchlist',(e)=>{
        if(e.record.owners.includes(data.user.id) && e.record.owners.includes(data.user.buddy_id)){ 
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

</script>

<Nav numRecs={numRecs}/>
<Popup bind:show={addListMenu}>
    <p>Add a new watch list?</p>
    <div style="display:flex; flex-drection:column; gap:5px;">
        <input id="listInput" type="text" bind:value={addListVal} placeholder="Add a new list" style="flex-grow:2;" />
        <Iconbtn icon="check" click={addList}></Iconbtn>
    </div>
</Popup>
<Popup bind:show={deleteListMenu}>
    <p>Delete this list?</p>
    <div style="display: flex; justify-content: space-around;">
        <Iconbtn icon="check" click={()=>{deleteList(lists[deleteListIndex].id);}}></Iconbtn>
        <Iconbtn icon="cross" click={()=>{deleteMatrix[deleteListIndex] = false; deleteListMenu = false;}}></Iconbtn>
    </div>
</Popup>
<Popup bind:show={deleteMovieMenu}>
    <p>Delete this movie?</p>
    <div style="display:flex; justify-content: space-evenly;">
        <Iconbtn icon="check" click={deleteMovie}></Iconbtn>
        <Iconbtn icon="cross" click={()=>{deleteMovieMenu = false;}}></Iconbtn>
    </div>
</Popup>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="pageContainer">
    <Loading></Loading>
    <Error bind:show={showError} errorMsg={errorText}></Error>
    <div id="watchlist">
        <!--movies in an existing list-->
        {#each lists as list, i (i)}
            <div class="listSection collapsed">
                <div class="list"
                    on:click={(e)=>{listSectionClick(e.currentTarget.parentNode,i)}} 
                    on:touchstart={(e)=>{startHold(i);}}
                    on:mousedown={(e)=>{startHold(i);}}
                    on:touchend={(e)=>{cancelHold();}}
                    on:mouseup={(e)=>{cancelHold();}}
                >
                    {list.name}
                    <div class="expandIcon">
                        <Iconbtn icon="expand"></Iconbtn>
                    </div>
                    {#if deleteMatrix[i]}
                        <div class="deleteIcon" 
                            in:fly ="{{x: 80, duration: 300, opacity: 1 }}" 
                            out:fly ="{{x:80, duration: 300, opacity: 1 }}" 
                            on:click={(e)=>{e.stopPropagation(); deleteListMenu = true; deleteListIndex = i;}}
                        >
                            <Iconbtn icon="delete"></Iconbtn>
                        </div>
                    {/if}
                </div>
                <div class="movies">
                    {#each watchlist as entry}
                        {#if entry.list == list.name}
                            <div class="movie">
                                <div class="title">
                                    <div>
                                        <div class="name">{entry.movie.title}</div>
                                        <div class="date">({entry.movie.release_date})</div>
                                    </div>
                                    <div>
                                        <Iconbtn icon="delete" click={()=>{deleteMovieMenu = true; deleteMovieId = entry.id;}}></Iconbtn>
                                    </div>
                                </div>
                                <div class="genres">
                                    {#each entry.movie.genres as genre, i}
                                        <div>{genre}</div>
                                    {/each}
                                </div>
                                <div class="time">{entry.movie.runtime} minutes</div>
                                <p>{entry.movie.overview}</p>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        {/each}
        <!--movies not in an existing list-->
        <div class="listSection collapsed">
            <div class="list" on:click={(e)=>{listSectionClick(e.currentTarget.parentNode)}}>
                Unlisted
                <div class="expandIcon">
                    <Iconbtn icon="expand"></Iconbtn>
                </div>
            </div>
            <div class="movies">
                {#each watchlist as entry}
                    {#if !lists.find(list => list.name == entry.name)}
                        <div class="movie">
                            <div class="title">
                                <div>
                                    <div class="name">{entry.movie.title}</div>
                                    <div class="date">({entry.movie.release_date})</div>
                                </div>
                                <div>
                                    <Iconbtn icon="delete" click={()=>{deleteMovieMenu = true; deleteMovieId = entry.id;}}></Iconbtn>
                                </div>
                            </div>
                            <div class="genres">
                                {#each entry.movie.genres as genre, i}
                                    <div>{genre}</div>   
                                {/each}
                            </div>
                            <div class="time">{entry.movie.runtime} minutes</div>
                            <p>{entry.movie.overview}</p>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </div>
</div>
<Botnav>
    <Iconbtn icon="add" click={()=>{addListMenu = true;}}></Iconbtn>
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
        border-radius: 6px;
    }
    .listSection.collapsed{
        height: 42px;
    }
    .list{
        position:relative;
        height: 20px;
        background: var(--grey);
        border: 1px solid;
        box-shadow: 0.5px 1px 1px black;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 6px;
    }
    .listSection.collapsed .list .expandIcon{
        transform: rotate(270deg);
    }
    .expandIcon{
        width: 40px;
        height: 40px;
    }
    .deleteIcon{
        position: absolute;
        left: calc(100% - 80px);
        background: var(--blue);
        border-radius: 6px;
        width: 80px;
        display: flex;
        justify-content: center;
    }
    .movies{
        margin-top: 5px;
        min-height: 50px;
        border-radius: 6px; 
        padding: 10px;
    }
    .movie{
        border-bottom: 1px solid;
    }
    .movie .title{
        display: flex;
        gap: 15px;
        margin: 5px 0; 
        justify-content: space-between; 
    }
    .movie .title .name{
        word-break: break-word;
        font-size: 1.5em;
    }
    .movie .title .date{
        font-size: 1.2em;
    }
    .movie .genres{
        margin: 15px 0;
    }
    .movie .time{
        margin:10px 0;
    }
</style>
