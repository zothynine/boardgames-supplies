<svelte:options tag="uno-card"/>

<script>
import { onMount } from "svelte";


    // * 1 2 3 4 5 6 +1 -1
    export let color = "white";
    const values = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
    let chainIndex = 0;


    function onButtonClick(event) {
        const val = event?.target?.closest("button")?.value;
        if (!val || val === "delete" || val === "add") return;

        values[chainIndex] = val;
        chainIndex++;
    }
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
        <fieldset class="buttons" on:click={onButtonClick}>
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
                <button type="button" value="delete"><span>-1</span></button>
                <button type="button" value="add"><span>+1</span></button>
            </div>
        </fieldset>
    </form>
</div>

<style>
    .card {
        --bg-color: white;
        --border-radius: 5px;
        --border: 3px solid black;
        background-color: var(--card-color);
        border-radius: 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: 16px 32px 32px;
        position: relative;
    }

    fieldset {
        border: none;
    }

    .branding {
        align-self: flex-start;
        color: rgba(255, 255, 0, 0.774);
        display: inline;
        font-size: 0.75rem;
        font-weight: bold;
        text-align: center;
        -webkit-text-stroke: 1px white;
        text-shadow: -2px 0 0 black,
                    2px 0 0 black,
                    0 -2px 0 black,
                    0 2px 0 black,
                    -2px -2px 0 black,
                    2px 2px 0 black,
                    2px -2px 0 black,
                    -2px 2px 0 black;
    }

    .branding strong {
        font-size: 1rem;
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
        background-color: var(--bg-color);
        border: var(--border);
        border-radius: var(--border-radius);
        box-sizing: border-box;
        text-align: center;
        font-size: 2rem;
        padding: 0;
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
        background-color: var(--bg-color);
        border: var(--border);
        border-radius: var(--border-radius);
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

    button[value="delete"],
    button[value="add"] {
        background-color: black;
        color: white;
    }

    [disabled] {
        background-color: transparent;
        border-style: dashed;
    }
</style>