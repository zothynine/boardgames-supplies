<svelte:options tag="uno-card"/>

<script>
    export let color = "white";
    const chain = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
    let chainIndex = 0;

    function deleteLast() {
        if (chainIndex === 0) return;
        chain[chainIndex-1] = null;
        chainIndex-=1;
    }

    function addField(card) {
        if(!card) return;
        const nextField = card.querySelector("[disabled]");
        if (nextField) nextField.removeAttribute("disabled")
    }

    function addToChain(val) {
        chain[chainIndex] = val;
        chainIndex++;
        return val;
    }

    function onButtonClick(event) {
        const card = event.target.offsetParent;
        const nextInput = card.querySelectorAll(".chain input")[chainIndex];
        const val = event?.target?.closest("button")?.value;

        if (!val) return;

        switch (val) {
            case "delete":
                deleteLast();
                break;
            case "add":
                addField(card);
                break;
            default:
                !!nextInput && !nextInput.disabled && addToChain(val);
                break;
        }
    }
</script>

<div class="card">
    <form>
        <fieldset class="chain">
            <input bind:value={chain[0]} type="text">
            <input bind:value={chain[1]} type="text">
            <input bind:value={chain[2]} type="text">
            <input bind:value={chain[3]} type="text">
            <input bind:value={chain[4]} type="text">
            <input bind:value={chain[5]} type="text">
            <input bind:value={chain[6]} type="text">
            <input bind:value={chain[7]} type="text">
            <input bind:value={chain[8]} type="text">
            <input bind:value={chain[9]} type="text">
            <input bind:value={chain[10]} type="text">
            <input bind:value={chain[11]} type="text">
            <input bind:value={chain[12]} type="text" disabled>
            <input bind:value={chain[13]} type="text" disabled>
            <input bind:value={chain[14]} type="text" disabled>
            <input bind:value={chain[15]} type="text" disabled>
            <input bind:value={chain[16]} type="text" disabled>
            <input bind:value={chain[17]} type="text" disabled>
            <input bind:value={chain[18]} type="text" disabled>
            <input bind:value={chain[19]} type="text" disabled>
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
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px 32px 32px;
        position: relative;
    }

    fieldset {
        border: none;
        padding: 0;
    }
    
    fieldset + fieldset {
        padding-top: 15px;
    }

    .chain {
        --grid-template-units: calc(var(--width-basis, 25vw)/5 - 15px);
        align-self: center;
        display: grid;
        grid-template-columns: repeat(4, var(--grid-template-units));
        grid-template-rows: repeat(5, var(--grid-template-units));
        gap: 10px;
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
        pointer-events: none;
    }

    .buttons div {
        display: flex;
        flex-direction: row;
        gap: 3px;
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
        margin: 0;
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