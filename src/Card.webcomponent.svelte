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
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="">
        <input type="text" value="" disabled>
        <input type="text" value="" disabled>
        <input type="text" value="" disabled>
        <input type="text" value="" disabled>
        <input type="text" value="" disabled>
        <input type="text" value="" disabled>
        <input type="text" value="" disabled>
        <input type="text" value="" disabled>
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
        --grid-template-units: 50px;
        align-self: center;
        display: grid;
        grid-template-columns: repeat(4, var(--grid-template-units));
        grid-template-rows: repeat(5, var(--grid-template-units));
        /* gap: clamp(10px, 6vw, 25px) clamp(5px, 6vw, 20px); */
        gap: 15px 10px;
        margin-top: 20px
    }

    input {
        background-color: white;
        border: 3px solid black;
        border-radius: 5px;
        box-sizing: border-box;
    }

    [disabled] {
        background-color: transparent;
        border-style: dashed;
    }
</style>