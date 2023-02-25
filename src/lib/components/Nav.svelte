<script>
    import {page} from '$app/stores';
    import {goto,beforeNavigate} from '$app/navigation';
    import Iconbtn from "$lib/components/Iconbtn.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import {fly} from 'svelte/transition';

    export let numberOfRecs;
    export let sidePaneOpen = false;

    let navigationRoute = undefined;

    const navigate = ()=>{
        if(navigationRoute == $page.url.pathname || !navigationRoute){return;}
        goto(navigationRoute);
    }


</script>

<div id="navigation">
    <div id="topBar">
        <Iconbtn icon="menu" click={()=>{ navigationRoute = undefined; sidePaneOpen = !sidePaneOpen;}}></Iconbtn>
        {#if numberOfRecs > 0}
            <div class="notification"></div>
        {/if}
    </div>
    <Loading></Loading>
    {#if sidePaneOpen}
        <div id="sidePane"
            in:fly ="{{x: -222, duration: 200, opacity: 1 }}"
            out:fly ="{{x: -222, duration: 200, opacity: 1 }}"
            on:outroend="{navigate}"
        >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="link" class:selected="{$page.url.pathname == '/'}" on:click={()=>{navigationRoute = "/"; sidePaneOpen=false;}}>Find Movies</div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="link" class:selected="{$page.url.pathname == '/watchlist'}" on:click={()=>{navigationRoute = "/watchlist"; sidePaneOpen=false;}}>Watchlists</div>
            <div style="display:flex;">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="link" class:selected="{$page.url.pathname == '/recs'}" on:click={()=>{navigationRoute = "/recs"; sidePaneOpen=false;}}>Recommendations</div>
                {#if numberOfRecs > 0}
                    <div class="notification"></div>
                {/if}
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="link" class:selected="{$page.url.pathname == '/buddy'}" on:click={()=>{navigationRoute = "/buddy"; sidePaneOpen=false;}}>Movie Buddy</div>
            <!--<a href="/options">Options</a>-->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="link" class:selected="{$page.url.pathname == '/login'}" on:click={()=>{navigationRoute = "/login"; sidePaneOpen=false;}}>Logout</div>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div id="close" on:click={()=>{navigationRoute = undefined; sidePaneOpen =false;}}></div>
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
    #sidePane .link {
        color: black;
        text-decoration: none;
        font-size: 1.2rem;
        cursor: pointer;
    }
    #sidePane .link.selected {
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
