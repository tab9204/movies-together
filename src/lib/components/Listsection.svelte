<script>
    import Iconbtn from "$lib/components/Iconbtn.svelte";
    import Popup from "$lib/components/Popup.svelte";
    import Error from "$lib/components/Error.svelte";
    import {fly} from 'svelte/transition';

    export let listName;
    //listId is optional because we use a default list that cannot be deleted and is always present 
    //so we use listId = null to flag that the list is the default and not user generated 
    export let listId = null;
    export let userMovies;
    export let userLists;

    let showError = false;
    let errorMessage = "Error";
    let expandList = false;
    let showDeleteBtn = false;
    let deleteListPopupToggle = false;
    let deleteMoviePopupToggle = false;
    let idOfMovieBeingDeleted;
    let holdTimer;
    //prevents a list section from being clicked on while it is being held
    let held = false;

    const startHold = ()=>{
        held = false;
        holdTimer = setTimeout(()=>{
            held = true;
            showDeleteBtn = true;
        },1000)
    }

    const cancelHold = ()=>{
        clearTimeout(holdTimer);
    }

    const expandCollapse = ()=>{
        //we don't want to allow user to click if they are already holding the section 
        if(held) {return;}
        //we also want to make sure the delete icon is closed before allowing the user to click a section 
        if(showDeleteBtn){
            showDeleteBtn = false;
            return;
        }
        expandList = !expandList;
    }

    //id =>  list db entry id 
    const deleteList = async (id)=>{
        const resp = await fetch("/api/deletelist",{
            method: 'POST',
            body: JSON.stringify({id:id}),
            headers: {'content-type': 'application/json'}
        });
        deleteListPopupToggle = false; 
        const data = await resp.json();
        var error = data.message;
        if(error){
            errorMessage = `Could not delete list. Try again`;
            showError = true;
        }

    }

    //id =>  movie db entry id
    const deleteMovie = async (id)=>{
        const resp = await fetch("/api/deletemovie",{
            method: 'POST',
            body: JSON.stringify({id:idOfMovieBeingDeleted}),
            headers: {'content-type': 'application/json'}
        });
        deleteMoviePopupToggle = false;
        const data = await resp.json();
        var error = data.message;
        if(error){
            errorMessage = `Could not delete the movie. Try again`;
            showError = true;
        }

    }



</script>

<Popup bind:show={deleteListPopupToggle}>
    <p>Delete this list?</p>
    <div style="display: flex; justify-content: space-around;">
        <Iconbtn icon="check" click={()=>{deleteList(listId);}}></Iconbtn>
        <Iconbtn icon="cross" click={()=>{deleteListPopupToggle = false;}}></Iconbtn>
    </div>
</Popup>
<Popup bind:show={deleteMoviePopupToggle}>
    <p>Delete this movie?</p>
    <div style="display:flex; justify-content: space-evenly;">
        <Iconbtn icon="check" click={deleteMovie(idOfMovieBeingDeleted)}></Iconbtn>
        <Iconbtn icon="cross" click={()=>{deleteMoviePopupToggle = false;}}></Iconbtn>
    </div>
</Popup>
<Error bind:showError={showError} {errorMessage}></Error>
<div class="list" class:collapsed={!expandList}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#if listId != null}
        <div class="listHeader"
            on:click={(e)=>{expandCollapse()}} 
            on:touchstart={(e)=>{startHold();}}
            on:mousedown={(e)=>{startHold();}}
            on:touchend={(e)=>{cancelHold();}}
            on:mouseup={(e)=>{cancelHold();}}
        >
            {listName}
            <div class="expandIcon">
                <Iconbtn icon="expand"></Iconbtn>
            </div>
            {#if showDeleteBtn}
                <div class="deleteIcon" 
                    in:fly ="{{x: 80, duration: 300, opacity: 1 }}" 
                    out:fly ="{{x:80, duration: 300, opacity: 1 }}" 
                    on:click={(e)=>{e.stopPropagation(); deleteListPopupToggle = true;}}
                >
                    <Iconbtn icon="delete"></Iconbtn>
                </div>
            {/if}
        </div>
    {:else}
        <div class="listHeader" on:click={(e)=>{expandCollapse()}}>
            Unlisted
            <div class="expandIcon">
                <Iconbtn icon="expand"></Iconbtn>
            </div>
        </div> 
    {/if}
    {#if expandList}
        <div class="listContent">
            {#each userMovies as movie}
                {#if movie.list == listName || (listId == null && !userLists.find(list => list.name == movie.list))}
                    <div class="movie">
                        <div class="title">
                            <div>
                                <div class="name">{movie.movie.title}</div>
                                <div class="date">({movie.movie.release_date})</div>
                            </div>
                            <div>
                                <Iconbtn icon="delete" click={()=>{deleteMoviePopupToggle = true; idOfMovieBeingDeleted = movie.id;}}></Iconbtn>
                            </div>
                        </div>
                        <div class="genres">
                            {#each movie.movie.genres as genre, i}
                                <div>{genre}</div>
                            {/each}
                        </div>
                        <div class="time">{movie.movie.runtime} minutes</div>
                        <p>{movie.movie.overview}</p>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .list{
        overflow: hidden;
        min-height: 42px;
        margin: 4px 0;
        border-radius: 6px;
    }
    .list.collapsed{
        height: 42px;
    }
    .listHeader{
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
        z-index: 2;
    }
    .list.collapsed .listHeader .expandIcon{
        transform: rotate(-90deg);
    }
    .expandIcon{
        width: 40px;
        height: 40px;
        transition: .3s;
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
    .listContent{
        margin-top: -5px;
        min-height: 50px;
        border-radius: 6px; 
        padding: 10px;
        background-color: var(--red);
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