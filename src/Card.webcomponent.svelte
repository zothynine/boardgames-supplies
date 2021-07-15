<svelte:options tag="uno-card"/>

<script>
    export let color = "white";
</script>

<div class="card" style="--card-color: {color}">
    <span class="branding">
        <strong>Uno</strong>
        Würfelspiel
    </span>
    <form>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain"></div>
        <div class="chain additional"></div>
        <div class="chain additional"></div>
        <div class="chain additional"></div>
        <div class="chain additional"></div>
        <div class="chain additional"></div>
        <div class="chain additional"></div>
        <div class="chain additional"></div>
        <div class="chain additional"></div>
    </form>
</div>

<style>
    .card {
        background-color: var(--card-color);
        border-radius: 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        /* height: min(130vw, 90vh); */
        padding: 16px 32px 32px;
        position: relative;
        /* width: clamp(320px, 60vh, 90vw); */
    }

    .branding {
        align-self: flex-start;
        color: white;
        display: inline;
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

    form {
        --grid-template-units: clamp(50px, 10vw, 90px);
        align-self: center;
        display: grid;
        grid-template-columns: repeat(4, var(--grid-template-units));
        grid-template-rows: repeat(5, var(--grid-template-units));
        gap: clamp(40px, 10vw, 30px) clamp(20px, 6vw, 30px);
        margin-top: 20px
    }

    .chain {
        background-color: white;
        border: 3px solid black;
        border-radius: 5px;
        box-sizing: border-box;
    }

    .additional {
        background-color: transparent;
        border-style: dashed;
    }
</style>