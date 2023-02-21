<script>
    import { navigating } from '$app/stores';
    import { beforeNavigate } from '$app/navigation';
    import { onDestroy } from 'svelte';
    let showLoadingIcon = false;
    let delayIconShow;

    //if user connection is fast we don't want to show the loading icon everytime they navigate 
    //so we wait at least 1 second before showing it 
    beforeNavigate(()=>{
        console.log("nav starting");
        showLoadingIcon = false;
        clearTimeout(delayIconShow);
        delayIconShow = setTimeout(()=>{
            console.log("delay goes off");
            showLoadingIcon = true;
        },1000)
    })

    onDestroy(()=>{
        clearTimeout(delayIconShow);
        showLoadingIcon = false;
    })

</script>


{#if $navigating}
    {#if showLoadingIcon}
        <div id="loading">
            <div id="spinner">
                <div class="rotate"></div>
                <div class="rotate"></div>
                <div class="rotate"></div>
                <div class="rotate"></div>
            </div>
        </div>
    {:else}
        <div id="nothing"></div>
    {/if}
{/if}

<style>
    #loading{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 99;
        background: var(--white);
        margin: 0; 
        left: 0;
    }
    #spinner{
        width: 200px;
        height: 200px;
        position: relative;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    #spinner div{
        position: absolute;
        width: 200px;
        height: 200px;
        border: 5px solid;
        border-radius: 200px;
        border-color: var(--blue) transparent transparent transparent;
    }

    #spinner div:nth-child(2){
        animation-delay: 0.1s;
    }
    #spinner div:nth-child(3){
        animation-delay: 0.2s;
    }
    #spinner div:nth-child(4){
        animation-delay: 0.3s;
    }

    .rotate{
        animation: rotate 2.0s;
        animation-iteration-count: infinite;
    }
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        80% {
            transform: rotate(360deg);
        }
        100%{
            transform: rotate(360deg);
        }

    }
</style>