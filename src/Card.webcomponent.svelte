<svelte:options tag="uno-card"/>

<script>
    // * 1 2 3 4 5 6 +1 -1
    export let color = "white";
    const values = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
</script>

<div class="card" style="--card-color: {color}">
    <span class="branding">
        <strong>Uno</strong>
        Würfelspiel
    </span>
    <form>
        <fieldset class="chain">
            <input bind:value={values[0]} type="text">
            <input bind:value={values[1]} type="text">
            <input bind:value={values[2]} type="text">
            <input bind:value={values[3]} type="text">
            <input bind:value={values[4]} type="text">
            <input bind:value={values[5]} type="text">
            <input bind:value={values[6]} type="text">
            <input bind:value={values[7]} type="text">
            <input bind:value={values[8]} type="text">
            <input bind:value={values[9]} type="text">
            <input bind:value={values[10]} type="text">
            <input bind:value={values[11]} type="text">
            <input bind:value={values[12]} type="text" disabled>
            <input bind:value={values[13]} type="text" disabled>
            <input bind:value={values[14]} type="text" disabled>
            <input bind:value={values[15]} type="text" disabled>
            <input bind:value={values[16]} type="text" disabled>
            <input bind:value={values[17]} type="text" disabled>
            <input bind:value={values[18]} type="text" disabled>
            <input bind:value={values[19]} type="text" disabled>
        </fieldset>
        <fieldset class="buttons">
            <div>
                <button type="button" value="1"><span>1</span></button>
                <button type="button" value="2"><span>2</span></button>
                <button type="button" value="3"><span>3</span></button>
                <button type="button" value="4"><span>4</span></button>
                <button type="button" value="5"><span>5</span></button>
            </div>
            <div>
                <button type="button" value="6"><span>6</span></button>
                <button type="button" value="*"><span>*</span></button>
                <button type="button" value="-1"><span>-1</span></button>
                <button type="button" value="+1"><span>+1</span></button>
            </div>
        </fieldset>
    </form>
</div>

<style>
    fieldset {
        border: none;
    }

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
        font-size: 0.6rem;
        font-weight: bold;
        text-align: center;
        text-shadow: -2px 0 0 black;
        transform: rotate(-8deg);
    }

    .branding strong {
        display: block;
        font-size: 1rem;
        text-shadow: -4px 0 0 black;
    }

    .chain {
        --grid-template-units: 50px;
        align-self: center;
        display: grid;
        grid-template-columns: repeat(4, var(--grid-template-units));
        grid-template-rows: repeat(5, var(--grid-template-units));
        gap: 15px 10px;
        margin-top: 10px
    }

    input {
        background-color: white;
        border: 3px solid black;
        border-radius: 5px;
        box-sizing: border-box;
    }

    .buttons div {
        display: flex;
        flex-direction: row;
        /* gap: 10px; */
        justify-content: space-between;
    }

    .buttons div + div {
        margin-top: 10px;
    }

    button {
        background-color: white;
        border: 1px solid black;
        border-radius: 3px;
        display: block;
        flex-basis: 50px;
        height: 50px;
    }

    button span {
        font-size: 2rem;
    }

    button[value="*"] {
        background-color: white;
        color: black;
    }

    button[value="*"] span {
        font-size: 3.5rem;
    }

    button[value="-1"],
    button[value="+1"] {
        background-color: black;
        color: white;
    }

    [disabled] {
        background-color: transparent;
        border-style: dashed;
    }
</style>