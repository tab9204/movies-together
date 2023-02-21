<script>
    import {page} from '$app/stores';
    import {goto,beforeNavigate} from '$app/navigation';
    import Iconbtn from "$lib/components/Iconbtn.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import {fly} from 'svelte/transition';

    const navigate = (url)=>{
        console.log("test")
    }


    export let numberOfRecs;
    export let sidePaneOpen = false;

</script>

<div id="navigation">
    <div id="topBar">
        <Iconbtn icon="menu" click={()=>{sidePaneOpen = !sidePaneOpen;}}></Iconbtn>
        {#if numberOfRecs > 0}
            <div class="notification"></div>
        {/if}
    </div>
    <Loading></Loading>
    {#if sidePaneOpen}
        <div id="sidePane"
            in:fly ="{{x: -222, duration: 300, opacity: 1 }}"
            out:fly ="{{x: -222, duration: 0, opacity: 1 }}"
            on:outroend="{()=>{console.log("end")}}"
        >
            <a href="/" class:selected="{$page.url.pathname == '/'}">Find Movies</a>
            <a href="/watchlist" class:selected="{$page.url.pathname == '/watchlist'}">Watchlists</a>
            <div style="display:flex;">
                <a href="/recs" class:selected="{$page.url.pathname == '/recs'}">Recommendations</a>
                {#if numberOfRecs > 0}
                    <div class="notification"></div>
                {/if}
            </div>
            <a href="/buddy" class:selected="{$page.url.pathname == '/buddy'}">Movie Buddy</a>
            <!--<a href="/options">Options</a>-->
            <a href="/login" class:selected="{$page.url.pathname == '/login'}">Logout</a>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div id="close" on:click={()=>{sidePaneOpen = !sidePaneOpen;}}></div>
    {/if}
</div>

<style>
    #navigation{
        z-index: 99;
    }
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
    #sidePane a.selected {
        color: var(--blue);
        text-decoration: underline;
    }
    #close{
        width: 100%;
        height: 100%;
        background: none;
        position: absolute;
        z-index: 97;  
    }
</style>
