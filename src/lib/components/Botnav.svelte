<div class="botnav">
    <slot></slot>
</div>


<style>
    .botnav{
        background: var(--smoke);
        padding: 5px;
        display: flex;
        justify-content: space-around;
        max-width: 630px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        border-top: 1px solid;
    }
</style>