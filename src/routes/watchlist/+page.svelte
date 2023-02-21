<script>
    import Nav from "$lib/components/Nav.svelte";
    import Botnav from "$lib/components/Botnav.svelte";
    import Popup from "$lib/components/Popup.svelte";
    import Error from "$lib/components/Error.svelte";
    import Iconbtn from "$lib/components/Iconbtn.svelte";
    import {pbSub} from "$lib/pb.js";
    import {fly} from 'svelte/transition';

    export let data;


    let numberOfRecs = data.numberOfRecs;
    let userMovies = data.movies;
    let userLists = data.lists;
    let addListPopupToggle = false;
    let deleteListPopupToggle = false;
    let deleteMoviePopupToggle = false;
    let showError = false;
    let errorMessage = "Error";
    let holdTimer;
    //prevents a list section from being clicked on while it is being held on
    let held = false;
    //used to keep track of the visibility of each list section delete button
    let deleteMatrix = [];
    userLists.forEach((list,i)=>{
        deleteMatrix.push(false);
    });
    //data passed to popup menus that they need in order to carry out their function 
    //IE to delete a list, to delete a movie 
    let indexOfListBeingDeleted;
    let idOfMovieBeingDeleted;
    let addListInputValue = "";


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

    //section => the list section clicked on 
    //i => the sections index in the delete matrix
    const listSectionExpandCollapse = (section,i)=>{
        //we don't want to allow user clicked if they are already holding the section 
        if(held) {return;}
        //we also want to make sure the delete icon is closed before allowing the user to click a section 
        if(deleteMatrix[i]){
            deleteMatrix[i] = false;
            return;
        }
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
    const addNewList = async ()=>{ 
        //input value cannot be blank
        if(addListInputValue == ""){return;}
        const resp = await fetch("/api/addlist",{
            method: 'POST',
            body: JSON.stringify({name:addListInputValue}),
            headers: {'content-type': 'application/json'}
        });
        addListInputValue = "";
        addListPopupToggle = false;
        const data = await resp.json();
        var error = data.message;
        if(error){
            errorMessage = `Could not create new list. Try again`;
            showError = true;
        }

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

    pbSub('recommended_movies',(e)=>{
        if(e.record.to == data.user.id){ 
            if(e.action == "create"){
                numberOfRecs += 1;
            }
        }
    });

    pbSub('lists',(e)=>{
        //we only want lists where the owners are both the user and their current buddy
        if(e.record.owners.includes(data.user.id) && e.record.owners.includes(data.user.buddy_id)){  
            if(e.action == "create"){
                const newList = {
                    id: e.record.id ,
                    name: e.record.name
                }
                userLists.push(newList);
                userLists = userLists;
                //need to keep the delete matrix in sync with the lists
                deleteMatrix.push(false);
                deleteMatrix = deleteMatrix;
            }
            else if (e.action == "delete"){
                userLists.forEach((list, i) => {
                    if(list.id == e.record.id){
                        userLists.splice(i,1);
                        deleteMatrix.splice(i,1);
                    }
                });
                userLists = userLists;
                deleteMatrix = deleteMatrix;
            }
        }
    });

    pbSub('movies',(e)=>{
        if(e.record.owners.includes(data.user.id) && e.record.owners.includes(data.user.buddy_id)){ 
            if(e.action == "create"){
                const newMovie = {
                    id: e.record.id ,
                    list: e.record.list,
                    movie: e.record.movie
                }
                userMovies.push(newMovie);
                userMovies = userMovies;
            }
            else if (e.action == "delete"){
                userMovies.forEach((item, i) => {
                    if(item.id == e.record.id){
                        userMovies.splice(i,1);
                    }
                });
                userMovies = userMovies; 
            }
        }
    });

</script>

<Nav {numberOfRecs}/>
<Popup bind:show={addListPopupToggle}>
    <p>Add a new watch list?</p>
    <div style="display:flex; flex-drection:column; gap:5px;">
        <input id="listInput" type="text" bind:value={addListInputValue} placeholder="Add a new list" style="flex-grow:2;" />
        <Iconbtn icon="check" click={addNewList}></Iconbtn>
    </div>
</Popup>
<Popup bind:show={deleteListPopupToggle}>
    <p>Delete this list?</p>
    <div style="display: flex; justify-content: space-around;">
        <Iconbtn icon="check" click={()=>{deleteList(userLists[indexOfListBeingDeleted].id);}}></Iconbtn>
        <Iconbtn icon="cross" click={()=>{deleteMatrix[indexOfListBeingDeleted] = false; deleteListPopupToggle = false;}}></Iconbtn>
    </div>
</Popup>
<Popup bind:show={deleteMoviePopupToggle}>
    <p>Delete this movie?</p>
    <div style="display:flex; justify-content: space-evenly;">
        <Iconbtn icon="check" click={deleteMovie}></Iconbtn>
        <Iconbtn icon="cross" click={()=>{deleteMoviePopupToggle = false;}}></Iconbtn>
    </div>
</Popup>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="pageContainer">
    <Error bind:showError={showError} {errorMessage}></Error>
    <div id="movies">
        <!--movies in an existing list-->
        {#each userLists as list, i (i)}
            <div class="listSection collapsed">
                <div class="list"
                    on:click={(e)=>{listSectionExpandCollapse(e.currentTarget.parentNode,i)}} 
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
                            on:click={(e)=>{e.stopPropagation(); deleteListPopupToggle = true; indexOfListBeingDeleted = i;}}
                        >
                            <Iconbtn icon="delete"></Iconbtn>
                        </div>
                    {/if}
                </div>
                <div class="movies">
                    {#each userMovies as movie}
                        {#if movie.list == list.name}
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
            </div>
        {/each}
        <!--movies not in an existing list-->
        <div class="listSection collapsed">
            <div class="list" on:click={(e)=>{listSectionExpandCollapse(e.currentTarget.parentNode)}}>
                Unlisted
                <div class="expandIcon">
                    <Iconbtn icon="expand"></Iconbtn>
                </div>
            </div>
            <div class="movies">
                {#each userMovies as movie}
                    {#if !userLists.find(list => list.name == movie.name)}
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
        </div>
    </div>
</div>
<Botnav>
    <Iconbtn icon="add" click={()=>{addListPopupToggle = true;}}></Iconbtn>
</Botnav>

<style>

    #movies{
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
