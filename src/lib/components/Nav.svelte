<script>
    import { goto } from '$app/navigation';
    import Iconbtn from "$lib/components/Iconbtn.svelte";
    export let numRecs;
    export let open = false;

    const togglePane = ()=>{
        open = !open;
    }

</script>

<div id="navigation">
    <div id="topBar">
        <!--<Iconbtn icon="menu" click={()=>{goto(`/watchlist`, true) }}></Iconbtn>-->
        <Iconbtn icon="menu" click={togglePane}></Iconbtn>
        {#if numRecs > 0}
            <div class="notification"></div>
        {/if}
    </div>
    {#if open}
        <div id="sidePane">
            <a href="/">Movies</a>
            <a href="/watchlist">Watchlists</a>
            <div style="display:flex;">
                <a href="/recs">Recommendations</a>
                {#if numRecs > 0}
                    <div class="notification"></div>
                {/if}
            </div>
            <a href="/buddy">Movie Buddy</a>
            <!--<a href="/options">Options</a>-->
            <a href="/login">Logout</a>
        </div>
        <div id="close" on:click={togglePane} on:keypress={togglePane}></div>
    {/if}
</div>

<style>
    #topBar{
        display: flex;
        padding: 7px;
        background: var(--yellow);
    }
    .notification{
        width: 10px;
        height: 10px;
        border-radius: 7px;
        background: var(--red);
    }
    #topBar  .notification{
        margin: 0 0 0 -5px;
    }
    #sidePane{
        width: 200px;
        height: 100%;
        background: var(--smoke);
        border: 1px solid;
        position: absolute;
        z-index: 98;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
    }
    #sidePane a {
        color: black;
        text-decoration: none;
    }
    #close{
        width: 100%;
        height: 100%;
        background: none;
        position: absolute;
        z-index: 97;  
    }
</style>
