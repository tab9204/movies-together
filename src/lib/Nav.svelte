<script>
    export let numRecs;

</script>

<div id="navigation">
    <a href="/watchlist">Watchlist</a>
    <a href="/">Movies</a>
    <a href="/recs">
        Recommendations
        {#if numRecs > 0}
            | {numRecs}
        {/if}
    </a>
</div>

<style>
    #navigation{
        height: 30px;
        padding: 10px;
        background: var(--red);
        display: flex;
        justify-content: space-between;
    }
    #navigation a{
        color: black;
        text-decoration: none;
    }
</style>
