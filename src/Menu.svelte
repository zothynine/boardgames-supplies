<script>
  import { app as storedApp } from "./stores";
  import Unoscore from "./unoscore/Unoscore.svelte";
</script>

<main>
  <button on:click={ () => storedApp.set(Unoscore) }>Unoscore</button>
</main>

<style lang="postcss">
  main {
    @apply p-9;
  }

  button {
    @apply border-current border-solid border-2 p-2;
  }
</style>