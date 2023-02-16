<script>
    export let click;

</script>


<button on:click={click}>
    <slot></slot>
</button>


<style>
    button{
        background: var(--blue); 
        border-radius: 3px; 
        border:none; 
        padding: 8px;
        text-align: left;
        font-size: 1.2em;
    }
</style>