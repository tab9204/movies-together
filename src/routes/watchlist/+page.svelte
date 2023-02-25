<script>
    import Nav from "$lib/components/Nav.svelte";
    import Botnav from "$lib/components/Botnav.svelte";
    import Popup from "$lib/components/Popup.svelte";
    import Error from "$lib/components/Error.svelte";
    import Iconbtn from "$lib/components/Iconbtn.svelte";
    import Listsection from "../../lib/components/Listsection.svelte";
    import {pbSub} from "$lib/pb.js";

    export let data;


    let numberOfRecs = data.numberOfRecs;
    let userMovies = data.movies;
    let userLists = data.lists;
    let addListPopupToggle = false;
    let addListInputValue = "";
    let showError = false;
    let errorMessage = "Error";


    
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
            }
            else if (e.action == "delete"){
                userLists.forEach((list, i) => {
                    if(list.id == e.record.id){
                        userLists.splice(i,1);
                    }
                });
                userLists = userLists;
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
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="pageContainer">
    <Error bind:showError={showError} {errorMessage}></Error>
    <div id="movies">
        {#each userLists as list (list.id)}
            <Listsection listName={list.name} listId={list.id} {userMovies} {userLists}></Listsection>
        {/each}
        <Listsection listName={"Unlisted"} listId={null} {userMovies} {userLists}></Listsection>
        <!--movies not in an existing list-->
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
</style>
