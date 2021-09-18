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

<style lang="postcss">
  :root {
    --width-basis: 100vw;
    --score-tile-size: 50px;
    --grid-gap: 10px;
  }

  .blue {
    @apply bg-blue-600;
  }
  .red {
    @apply bg-red-600;
  }
  .orange {
    @apply bg-yellow-600;
  }
  .green {
    @apply bg-green-600;
  }

  .panel {
    @apply flex justify-around items-center m-0 p-0 flex-shrink-0;
    flex-basis: var(--width-basis);
    scroll-snap-align: start;
  }

  .scores {;
    @apply box-border grid;
    grid-template-columns: repeat(4, var(--score-tile-size));
    grid-template-rows: repeat(5, var(--score-tile-size));
    gap: var(--grid-gap);
  }

  .buttons {;
    @apply box-border grid;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: repeat(4, var(--score-tile-size));
    gap: var(--gap);
  }

  .chain {
    --grid-template-units: calc(var(--width-basis, 25vw)/5 - 15px);
    @apply self-center grid gap-2 mt-2.5 grid-cols-4 grid-rows-5 border-none p-0;
  }

  .score {
    @apply box-border text-center text-4xl p-0 rounded-md w-14 h-14;
    line-height: 50px;
  }

  .buttons {
    @apply pt-4 border-none border-0;
  }

  .buttons div {
    @apply flex flex-row gap-1;
  }

  .buttons div + div {
    @apply mt-2;
  }

  button {
    @apply block h-3/6 m-0 rounded-md;
    height: var(--score-tile-size);
  }

  .reset {
    grid-column: span 3;
  }

  .score,
  button {
    @apply bg-white border-solid border-2 border-black;
  }

  button span {
    @apply text-3xl;
  }

  button[value="*"] {
    @apply bg-white text-black;
  }

  button[value="delete"],
  button[value="add"] {
    @apply bg-black text-white;
  }

  .disabled {
    @apply bg-transparent border-dashed rounded-r-md;
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