<script>
    export let icon;
    export let click = null;//optional click event


</script>

<button on:click={click}>
    {#if icon == "recommend"}
        <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M15 29.292h9.458q.625 0 1.084-.292.458-.292.75-.833l3.333-7.792q.083-.208.125-.542.042-.333.042-.541v-1.125q0-.625-.334-.959-.333-.333-.958-.333H20l1.125-5.75q.083-.333 0-.667-.083-.333-.333-.541l-1-1.042-7 7.625q-.25.333-.417.688-.167.354-.167.77V26.5q0 1.083.834 1.938.833.854 1.958.854Zm5 7.375q-3.417 0-6.458-1.313-3.042-1.312-5.313-3.583t-3.583-5.313Q3.333 23.417 3.333 20q0-3.458 1.313-6.5 1.312-3.042 3.583-5.292t5.313-3.562Q16.583 3.333 20 3.333q3.458 0 6.5 1.313 3.042 1.312 5.292 3.562t3.562 5.292q1.313 3.042 1.313 6.5 0 3.417-1.313 6.458-1.312 3.042-3.562 5.313T26.5 35.354q-3.042 1.313-6.5 1.313Zm0-2.792q5.792 0 9.833-4.042 4.042-4.041 4.042-9.833t-4.042-9.833Q25.792 6.125 20 6.125t-9.833 4.042Q6.125 14.208 6.125 20t4.042 9.833q4.041 4.042 9.833 4.042ZM20 20Z"/></svg>
    {:else if icon == "next"}
        <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="m12.917 36.625-2.542-2.583 14.083-14.084L10.375 5.833l2.542-2.541 16.666 16.666Z"/></svg>
    {:else if icon == "menu"}
        <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M5 30v-2.792h30V30Zm0-8.625v-2.75h30v2.75Zm0-8.583V10h30v2.792Z"/></svg>
    {:else if icon == "delete"}
        <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M11.125 35Q10 35 9.188 34.167q-.813-.834-.813-1.959V9.167H6.667V6.375h8V5h10.666v1.375h8v2.792h-1.708v23.041q0 1.125-.813 1.959Q30 35 28.875 35Zm4.083-6.292h2.75V12.625h-2.75Zm6.834 0h2.75V12.625h-2.75Z"/></svg>
    {:else if icon == "add"}
        <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M18.625 31.667V21.375H8.333v-2.75h10.292V8.333h2.75v10.292h10.292v2.75H21.375v10.292Z"/></svg>
    {:else if icon == "cross"}
        <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="m10.458 31.458-1.916-1.916 9.5-9.542-9.5-9.542 1.916-1.916 9.542 9.5 9.542-9.5 1.916 1.916-9.5 9.542 9.5 9.542-1.916 1.916-9.542-9.5Z"/></svg>
    {:else if icon == "check"}
        <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="m15.792 29.833-9.375-9.375 2-2 7.375 7.417 15.791-15.792 1.959 2Z"/></svg>
    {:else if icon == "expand"}
        <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="m20 25.625-10-10 1.958-1.958L20 21.708l8.042-8.041 1.958 2Z"/></svg>
    {:else}
        <p>No icon</p>
    {/if}
</button>

<style>
    button{
        background: none; 
        border-radius: 3px; 
        border:none; 
        padding: 0px;
        width: 40px;
        height: 40px;
    }
</style>