<script>
  import { app as storedApp } from "./stores";
  import UnoDiceGame from "./unodicegame/UnoDiceGame.svelte";
</script>

<main>
  <button on:click={ () => storedApp.set(UnoDiceGame) }>Uno Dice Game</button>
  <!-- <button on:click={ () => storedApp.set(UnoDiceGame) }>Whatever Comes Next</button> -->
</main>

<style>
  main {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: rgb(22 163 74);
    padding: 2.25rem;
    min-height: 100vh;
  }

  button {
    background-color: white;
    border-color: currentColor;
    border-style: solid;
    border-width: 4px;
    padding: 0.5rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  button + button {
    margin-top: 1rem;
  }
</style>
