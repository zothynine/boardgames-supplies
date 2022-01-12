<script>
  export let bgColor;
  let chain = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
  let chainIndex = 0;

  function deleteLast() {
    if (chainIndex === 0) return;
    chain[chainIndex-1] = null;
    chainIndex-=1;
  }

  function addField(card) {
    if(!card) return;
    const nextField = card.querySelector(".disabled");
    if (nextField) nextField.classList.remove("disabled")
  }

  function addToChain(val) {
    chain[chainIndex] = val;
    chainIndex++;
    return val;
  }

  function onButtonClick(event) {
    const card = event.target.closest(".card");
    const nextInput = card.querySelectorAll(".scores .score")[chainIndex];
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
        !!nextInput && !nextInput.classList.contains("disabled") && addToChain(val);
        break;
    }
  }

  function reset() {
    const reset = confirm("Really reset?")
    if (reset) {
      chainIndex = 0
      chain.forEach((item, index) => chain[index] = null);
      document.querySelectorAll(".score.extra").forEach(item => item.classList.add("disabled"));
    }
  }
</script>

<div class="panel {bgColor} sm:flex-auto">
  <div class="card">
    <div class="scores">
      <div class="score">{chain[0] || ""}</div>
      <div class="score">{chain[1] || ""}</div>
      <div class="score">{chain[2] || ""}</div>
      <div class="score">{chain[3] || ""}</div>
      <div class="score">{chain[4] || ""}</div>
      <div class="score">{chain[5] || ""}</div>
      <div class="score">{chain[6] || ""}</div>
      <div class="score">{chain[7] || ""}</div>
      <div class="score">{chain[8] || ""}</div>
      <div class="score">{chain[9] || ""}</div>
      <div class="score">{chain[10] || ""}</div>
      <div class="score">{chain[11] || ""}</div>
      <div class="score extra disabled">{chain[12] || ""}</div>
      <div class="score extra disabled">{chain[13] || ""}</div>
      <div class="score extra disabled">{chain[14] || ""}</div>
      <div class="score extra disabled">{chain[15] || ""}</div>
      <div class="score extra disabled">{chain[16] || ""}</div>
      <div class="score extra disabled">{chain[17] || ""}</div>
      <div class="score extra disabled">{chain[18] || ""}</div>
      <div class="score extra disabled">{chain[19] || ""}</div>
    </div>

    <div class="buttons" on:click={onButtonClick}>
      <button type="button" value="1"><span>1</span></button>
      <button type="button" value="2"><span>2</span></button>
      <button type="button" value="3"><span>3</span></button>
      <button type="button" value="4"><span>4</span></button>
      <button type="button" value="5"><span>5</span></button>

      <button type="button" value="6"><span>6</span></button>
      <button type="button" value="*"><span>*</span></button>
      <button type="button" value="delete"><span>-1</span></button>
      <button type="button" value="add"><span>+1</span></button>
      <button type="button" class="reset" on:click={reset}><span>Reset</span></button>
    </div>
  </div>
</div>

<style>
  :root {
    --width-basis: 100vw;
    --score-tile-size: 50px;
    --grid-gap: 10px;
  }

  .blue {
    background-color: rgb(37 99 235);
  }
  .red {
    background-color: rgb(220 38 38);
  }
  .orange {
    background-color: rgb(202 138 4);
  }
  .green {
    background-color: rgb(22 163 74);
  }

  .panel {
    display: flex;
    flex-basis: var(--width-basis);
    flex-shrink: 0;
    justify-content: space-around;
    align-items: center;
    scroll-snap-align: start;
    margin: 0;
    padding: 0;
  }

  .scores {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(4, var(--score-tile-size));
    grid-template-rows: repeat(5, var(--score-tile-size));
    gap: var(--grid-gap);
  }

  .buttons {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: repeat(4, var(--score-tile-size));
    gap: 10px;
  }

  .chain {
    --grid-template-units: calc(var(--width-basis, 25vw)/5 - 15px);
    align-self: center;
    display: grid;
    gap: 0.5rem;
    margin-top: 0.625rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: repeat(5, minmax(0, 1fr));
    border-style: none;
    padding: 0;
  }

  .score {
    line-height: 50px;
    box-sizing: border-box;
    text-align: center;
    font-size: 2.25rem;
    line-height: 2.5rem;
    padding: 0;
    border-radius: 0.375rem;
    width: 3.5rem;
    height: 3.5rem;
  }

  .buttons {
    padding-top: 1rem;
    border-style: none;
    border-width: 0;
  }

  .buttons div {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
  }

  .buttons div + div {
    margin-top: 0.5rem;
  }

  button {
    border-radius: 0.375rem;
    display: block;
    height: var(--score-tile-size);
    margin: 0;
  }

  .reset {
    grid-column: span 3;
  }

  .score,
  button {
    background-color: white;
    border: 2px solid black;
  }

  button span {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  button[value="*"] {
    background-color: white;
    color: black;
  }

  button[value="delete"],
  button[value="add"] {
    background-color: black;
    color: white;
  }

  .disabled {
    background-color: transparent;
    border-bottom-right-radius: 0.375rem;
    border-style: dashed;
    border-top-right-radius: 0.375rem;
  }

  @media (min-width: 640px) {
    .panel {
      --width-basis: 50vw;
    }
  }

  @media (min-width: 1024px) {
    .panel {
      --width-basis: 25vw;
    }
  }

  @media (min-height: 661px) {
    :root {
      --score-tile-size: 60px;
      --grid-gap: 5px;
    }
  }
</style>
