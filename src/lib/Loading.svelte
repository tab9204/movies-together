<script>
    import { navigating } from '$app/stores';
    import { beforeNavigate } from '$app/navigation';
    import { onDestroy } from 'svelte';
    let show = true;
    let delay;
    //only show the loading animation if the user has waited at least 1 second
    beforeNavigate(()=>{
        show = false;
        delay = setTimeout(()=>{
            console.log("delay goes off");
            show = true;
        },1000)
    })

    onDestroy(()=>{
        clearTimeout(delay) ;
    })

</script>


{#if $navigating}
    {#if show}
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
        z-index: 10;
        background: var(--white);
        margin: 0; 
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