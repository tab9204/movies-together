<script>
    export let show;

</script>

{#if show}
    <div class="popupMenu">
        <slot></slot>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="closeLayer"  on:click={(e)=>{show = false;}}></div>
{/if}

<style>
    .popupMenu{
        position: absolute;
        width: 90%;
        max-width: 540px;
        z-index: 5;
        padding: 10px;
        background: var(--yellow);  
        transform: translateX(-50%);
        left: 50%;
        top: 100px;
        max-height: 60%;
        overflow-y: scroll;
        border: 1px solid;
        border-radius: 5px;
        box-shadow: 0.5px 0.5px;
    }
    .closeLayer{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 4;
    }
</style>