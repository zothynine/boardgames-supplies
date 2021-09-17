<script>
	import Card from './Card.svelte';

	const VERSION = "1.0.76c";
</script>

<main class="flex absolute inset-0 overflow-x-auto overflow-y-hidden h-full">
  <em class="text-white text-xs fixed inset-0.5 opacity-50 text-right not-italic">{VERSION}</em>
  <Card bgColor="blue"/>
  <Card bgColor="red"/>
  <Card bgColor="orange"/>
  <Card bgColor="green"/>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --width-basis: 100vw;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }


  main {
    @apply flex absolute inset-0 overflow-x-auto overflow-y-hidden;
    scroll-snap-type: x mandatory;
    height: 100vh;
  }

  .version {
    @apply text-white text-xs inset-1 opacity-50 fixed text-right not-italic;
  }
 
</style>