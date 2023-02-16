<script>
    import Loading from "$lib/components/Loading.svelte";
    import Nav from "$lib/components/Nav.svelte";
    import {pbSub} from "$lib/pb.js";

    export let data;
    export let form;
    let numRecs = data.numRecs;

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

    const buddy = data.user.buddy_username;
</script>

{#if !buddy}
    <div id="navigation"></div>
{:else}
    <Nav numRecs={numRecs}/>
{/if}
<div id="pageContainer">
    <Loading></Loading>
    <div id="pageContent">
        {#if !buddy}
            <p>Add a watch buddy to get started.</p>
            <form method="POST">
                <input name="username" placeholder="Watch buddy username" type="text"/>
                <button formaction="?/add">Add</button>
                {#if form?.invalidUser}<p class="error">User does not exist</p>{/if}
            </form>   
        {:else}
            <p>Your current watch buddy is: {buddy}</p>
            <p>You can add a new one but doing so will replace your current watch buddy.</p>
            <form method="POST">
                <input name="username" placeholder="New Watch buddy" type="text"/>
                <button formaction="?/add">Add</button>
                {#if form?.invalidUser}<p class="error">User does not exist.</p>{/if}
                {#if form?.addSelf}<p class="error">Cannot add yourself.</p>{/if}
            </form> 
        {/if}
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
    form{
        display: flex;
        flex-direction: column;
        gap: 5px; 
    }
    button{
        width: 50%;
        background: var(--blue); 
        border-radius: 3px; 
        border:none; 
        padding: 5px;
        font-size: 1.2em;
    }
    .error{
        position: absolute;
        top: 100%;
    }
</style>
