<script>
    import {writable} from 'svelte/store';

    export let data;

    export let form;

</script>

{#if data.user}
    <form method="POST">
        <button formaction="?/logout">Logout</button>
    </form>
{:else}
    <form method="POST">
        {#if form?.signupError}<p class="error">Failed to signup.</p>{/if}
        {#if form?.loginError}<p class="error">Failed to login.</p>{/if}
        <input name="username" placeholder="Username" type="text"/>

        <input name="password"  placeholder="Password (min 8 characters)" type="password"/>

        <button formaction="?/signup">Sign Up</button>
        <button formaction="?/login">Login</button>
    </form>   
{/if}

<style>
    form {margin-top: 20px;}
</style>
