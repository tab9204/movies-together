<script>
    import Nav from "$lib/components/Nav.svelte";
    import Error from "$lib/components/Error.svelte";
    import {pbSub} from "$lib/pb.js";

    export let data;


    let numberOfRecs = data.numberOfRecs;
    let allUsers = data.allUsers;
    //used to refer back to the full list of users
    //needed since all users will change based on the filtering params 
    const allUsersCopy = allUsers;
    const watchBuddy = data.user.buddy_username;
    const thisUser = data.user;
    let showError = false;
    let errorMessage = "Error";
    let filterString = "";

    //id => db entry id of the user we are adding
    const addNewBuddy = async (buddy_username,buddy_id)=>{
        if(buddy_id == thisUser.buddy_id){return;}

        const resp = await fetch("/api/addbuddy",{
        method: 'POST',
        body: JSON.stringify({buddy_username,buddy_id}),
        headers: {'content-type': 'application/json'}
        });

        const data = await resp.json();
        var error = data.message;

        if(error){
        errorMessage = `Could not add new watch buddy`;
        showError = true;
        }
        else{
            thisUser.buddy_username = buddy_username;
            thisUser.buddy_id = buddy_id;
        }
    }

    const filterUserList = ()=>{
        let filteredUsers = allUsersCopy.filter(user => user.username.toLowerCase().includes(filterString.toLowerCase()));
        allUsers = filteredUsers;
    }

    pbSub('recommended_movies',(e)=>{
        if(e.record.to == data.user.id){ 
            if(e.action == "create"){
                numberOfRecs += 1;
            }
        }
    });

</script>

<!--
    We don't want the user to access the rest of the app if they do not have a watch buddy set 
    so we show a blank navigation header so they cannot navigate to the other pages 
-->
{#if !watchBuddy}
    <div id="navigation"></div>
{:else}
    <Nav {numberOfRecs}/>
{/if}
<div id="pageContainer">
    <Error bind:showError={showError} {errorMessage}></Error>
    <div id="pageContent">
        <div id="filterList">
            <input bind:value={filterString} on:keyup={filterUserList} class="filterInput" type="text" placeholder="Filter users">
        </div>
        <div id="userList">
            {#each allUsers as user}
                {#if user.username != thisUser.username}
                    <button on:click={()=>{addNewBuddy(user.username,user.id)}} class="user" class:selected="{thisUser.buddy_username == user.username}">{user.username}</button>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    #pageContent{
        padding: 10px;
    }
    #navigation{
        height: 30px;
        padding: 10px;
        background: var(--red);
        display: flex;
        justify-content: space-between;
    }
    #filterList{
        display: flex;
        padding: 10px 0;
        margin: 10px 0;
        border-bottom: 2px solid;
    }
    .filterInput {
        width: 100%;
    }
    #userList{
        display: flex;
        flex-direction: column;
        gap: 5px; 
        align-items: center;  
    }
    .user{
        width: 50%;
        background: var(--white); 
        border-radius: 3px; 
        border: 1px solid; 
        padding: 5px;
        font-size: 1.2em;
    }
    .user.selected{
        background: var(--blue); 
        border: none;
    }
</style>
