<svelte:options tag="uno-card"/>

<script>
    export let color = "white";
</script>

<div class="card" style="--card-color: {color}">
    <span class="branding">
        <strong>Uno</strong>
        Würfelspiel
    </span>
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

    .branding {
        color: white;
        display: inline-block;
        font-weight: bold;
        text-align: center;
        text-shadow: -2px 0 0 black;
        transform: rotate(-8deg);
    }

    .branding strong {
        display: block;
        font-size: 2rem;
        text-shadow: -4px 0 0 black;
    }
</style>