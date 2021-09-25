<script>
  import Menu from "./Menu.svelte";
  import { app as storedApp } from "./stores";
	
  const VERSION = "1.0.9a";
  $: app = Menu;
  storedApp.subscribe(value => app = value);
</script>

<svelte:component this={app} />

{#if app !== Menu}
  <button class="back" type="button" on:click={() => app = Menu}>Back</button>
{/if}
<em class="version">{VERSION}</em>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .back {
    @apply fixed top-0 left-0;
  }
  .version {
      @apply text-black text-xs opacity-50 fixed not-italic top-0 right-0;
  }
</style>