<script>
  import { app as storedApp } from "./stores";
  import Unoscore from "./unoscore/Unoscore.svelte";
</script>

<main>
  <button on:click={ () => storedApp.set(Unoscore) }>Unoscore</button>
  <button on:click={ () => storedApp.set(Unoscore) }>Whatever Comes Next</button>
</main>

<style lang="postcss">
  main {
    @apply flex flex-col bg-green-600 p-9 min-h-screen;
  }

  button {
    @apply bg-white border-current border-solid border-4 p-2 font-bold uppercase;
  }

  button + button {
    @apply mt-4;
  }
</style>