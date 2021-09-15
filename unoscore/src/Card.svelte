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
    const card = event.target.offsetParent;
    const nextInput = card.querySelectorAll(".chain .score")[chainIndex];
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
    <form>
      <fieldset class="chain">
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
          <button type="button" on:click={reset}><span>R</span></button>
        </div>
      </fieldset>
    </form>
  </div>
</div>

<style lang="postcss">
  :root {
    --width-basis: 100vw;
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
    @apply flex justify-around items-center m-0 p-0 flex-grow-0 flex-shrink-0;
    flex-basis: var(--width-basis);
  }

  .card {;
    @apply box-border flex flex-col h-full relative p-4 pb-8;
  }

  .chain {
    --grid-template-units: calc(var(--width-basis, 25vw)/5 - 15px);
    @apply self-center grid gap-2 mt-2.5 grid-cols-4 grid-rows-5 border-none p-0;
  }

  .score {
    @apply box-border text-center text-3xl p-0 pointer-events-none rounded-md w-14 h-14;
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
  }

  .score,
  button {
    @apply bg-white border-solid border-2 border-black;
    flex-basis: 50px;
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
</style>