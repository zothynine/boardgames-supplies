<script>
  export let bgColor;
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

  function reset() {
    const reset = confirm("Really reset?")
    if (reset) {
      window.location.reload();
    }
  }
</script>

<div class="panel {bgColor}">
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
          <button type="button" on:click={reset}><span>R</span></button>
        </div>
      </fieldset>
    </form>
  </div>
</div>

<style lang="postcss">
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
    @apply flex justify-around items-center m-0 p-0;
  }

  .card {;
    @apply box-border flex flex-col h-full relative p-4 pb-8;
  }

  .chain {
    --grid-template-units: calc(var(--width-basis, 25vw)/5 - 15px);
    @apply self-center grid gap-1 mt-2.5 grid-cols-4 grid-rows-5 border-none p-0;
    /* grid-template-columns: repeat(4, var(--grid-template-units));
    grid-template-rows: repeat(5, var(--grid-template-units)); */
  }

  input {
    @apply box-border text-center text-3xl p-0 pointer-events-none rounded-md;
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
    flex-basis: 50px;
    @apply block h-3/6 m-0 rounded-md;
  }

  input,
  button {
    @apply bg-white border-solid border-4 border-black;
  }

  button span {
    @apply text-3xl;
  }

  button[value="*"] {
    @apply bg-white text-black;
  }

  /* button[value="*"] span {
    @apply text-5xl;
  } */

  button[value="delete"],
  button[value="add"] {
    @apply bg-black text-white;
  }

  [disabled] {
    @apply bg-transparent border-dashed rounded-r-md;
  }
</style>