<script>
  import Menu from "./Menu.svelte";
  import { app as storedApp } from "./stores";

  const VERSION = "1.0.11";
  $: app = Menu;
  storedApp.subscribe(value => app = value);
</script>

<svelte:component this={app} />

{#if app !== Menu}
  <button class="back" type="button" on:click={() => app = Menu}>Back</button>
{/if}
<em class="version">{VERSION}</em>

<style global>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
  }

  .back {
    position: fixed;
    top: 0.25rem;
    right: 0.25rem;
    font-size: 0.75rem;
    line-height: 1rem;
    opacity: 0.5;
    background: transparent;
    border-width: 0;
  }

  .version {
      position: fixed;
      top: 0.25rem;
      left: 0.25rem;
      color: black;
      font-size: 0.75rem;
      line-height: 1rem;
      opacity: 0.5;
  }
</style>
