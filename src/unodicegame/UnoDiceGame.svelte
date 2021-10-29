<script>
	import Card from './Card.svelte';
	const VERSION = "1.0.9a";
</script>

<main class="flex absolute inset-0 overflow-x-auto overflow-y-hidden h-full">
  <Card bgColor="blue"/>
  <Card bgColor="red"/>
  <Card bgColor="orange"/>
  <Card bgColor="green"/>
</main>

<style lang="postcss">
  :root {
    --width-basis: 100vw;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }

  main {
    @apply flex absolute inset-0 overflow-x-auto overflow-y-hidden;
    scroll-snap-type: x mandatory;
    height: 100vh;
  } 
</style>