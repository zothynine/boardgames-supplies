<script>
  import { appTitle } from '../stores';
	import Card from './Card.svelte';
  appTitle.set("Uno Dice Game");
</script>

<main>
  <Card bgColor="blue"/>
  <Card bgColor="red"/>
  <Card bgColor="orange"/>
  <Card bgColor="green"/>
</main>

<style>
  :root {
    --width-basis: 100vw;
  }

  main {
    display: flex;
    height: 100vh;
    inset: 0;
    overflow-x: auto;
    overflow-y: hidden;
    position: absolute;
    scroll-snap-type: x mandatory;
  }
</style>
