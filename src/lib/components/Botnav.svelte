<div class="botnav">
    <slot></slot>
</div>


<style>
    .botnav{
        background: var(--yellow);
        padding: 5px;
        display: flex;
        justify-content: space-around;
        max-width: 630px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
    }
</style>