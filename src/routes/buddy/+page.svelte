<script>
    export let data;
    export let form;

    const buddy = data.user.buddy_username;
</script>

{#if !buddy}
    <p>Add a watch buddy to start building a watchlist.</p>
    <p>Insert the username of the person you want to watch movies with and click Add.</p>
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
        {#if form?.invalidUser}<p class="error">User does not exist</p>{/if}
        {#if form?.addSelf}<p class="error">Cannot add yourself</p>{/if}
    </form> 
{/if}
