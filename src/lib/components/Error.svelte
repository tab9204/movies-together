<script>
    import Iconbtn from "$lib/components/Iconbtn.svelte";

    export let showError;
    export let errorMessage;


</script>

{#if showError}
    <div class="errorMessage">
        <div>{errorMessage}</div>
        <Iconbtn icon="cross" click={()=>{showError = false;}}></Iconbtn>
    </div>
{/if}

<style>
    .errorMessage{
        position: absolute;
        transform: translate(-50%,-50%);
        left: 50%;
        top: 50%;
        z-index: 99;
        width: 90%;
        background: #fa3e3e;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border:1px soild;
    }
</style>