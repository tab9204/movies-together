<script>
    export let show;

</script>

{#if show}
    <div class="popupMenu">
        <slot></slot>
    </div>
{/if}

<style>
    .popupMenu{
        position: absolute;
        width: 90%;
        max-width: 540px;
        z-index: 5;
        padding: 10px;
        background: #bfbbbb;  
        transform: translate(-50%,-50%);
        left: 50%;
        top: 50%;
        max-height: 80%;
        overflow: scroll;
    }
</style>