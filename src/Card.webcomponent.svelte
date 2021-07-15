<svelte:options tag="uno-card"/>

<script>
    export let color = "white";
</script>

<div class="card" style="--card-color: {color}">
    <span>{color}</span>
</div>

<style>
    .card {
        background-color: var(--card-color);
        border-radius: 16px;
        box-sizing: border-box;
        height: min(130vw, 90vh);
        padding: 16px;
        width: clamp(320px, 60vh, 90vw);
    }
</style>