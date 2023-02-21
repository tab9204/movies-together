<script>
    import Nav from "$lib/components/Nav.svelte";
    import {pbSub} from "$lib/pb.js";

    export let data;
    export let form;

    let numberOfRecs = data.numberOfRecs;

     pbSub('recommended_movies',(e)=>{
        if(e.record.to == data.user.id){ 
            if(e.action == "create"){
                numberOfRecs += 1;
            }
        }
    });

</script>

<!--
    We don't want the user to access the rest of the app if they are not logged in
    so we show a blank navigation header so they cannot navigate to the other pages 
-->
{#if data.user}
    <Nav {numberOfRecs}/>
{:else}
    <div id="navigation"></div>
{/if}
<div id="pageContainer">
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
        margin-top: 30px;
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
        background: #fa3e3e;
        position: absolute;
        top: 36px;
        padding: 5px
    }
    #navigation{
        height: 30px;
        padding: 10px;
        background: var(--red);
        display: flex;
        justify-content: space-between;
    }
</style>
