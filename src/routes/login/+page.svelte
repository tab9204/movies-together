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

</script>

{#if data.user}
    <Nav numRecs={numRecs}/>
{:else}
    <div id="navigation"></div>
{/if}
<div id="pageContainer">
    <Loading></Loading>
    {#if data.user}
        <form method="POST">
            <button formaction="?/logout">Logout</button>
        </form>
    {:else}
        <form method="POST">
            <input name="username" placeholder="Username" type="text"/>

            <input name="password"  placeholder="Password (min 8 characters)" type="password"/>
            <div>
                <button formaction="?/login">Login</button>
                <button formaction="?/signup">Sign Up</button>
            </div>
            {#if form?.signupError}<p class="error">Failed to signup.</p>{/if}
            {#if form?.loginError}<p class="error">Failed to login.</p>{/if}
        </form>   
    {/if}
</div>

<style>
    form {
        margin-top: 20px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    form div{
        display: flex;
        justify-content: space-between;
    }
    form button{
        background: var(--blue); 
        border-radius: 3px; 
        border:none; 
        padding: 5px;
        font-size: 1.2em;
    }
    form div button{
        background: var(--blue); 
        border-radius: 3px; 
        border:none; 
        padding: 5px;
        width: 45%;
    }
    .error{
        position: absolute;
        top: 100%;
    }
    #navigation{
        height: 30px;
        padding: 10px;
        background: var(--red);
        display: flex;
        justify-content: space-between;
    }
</style>
