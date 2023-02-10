<script>
    import {afterUpdate} from 'svelte';

    export let show;
    export let errorMsg;
    export let hide;

</script>

{#if show}
    <div class="errortext">
        <div>{errorMsg}</div>
        <button on:click={hide}>Close</button>
    </div>
{/if}

<style>
    .errortext{
        position: absolute;
        transform: translate(-50%,-50%);
        left: 50%;
        top: 50%;
        z-index: 99;
        width: 90%;
        background: red;
        padding: 10px;
    }
</style>