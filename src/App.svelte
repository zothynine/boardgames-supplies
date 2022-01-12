<script>
  import Menu from "./Menu.svelte";
  import { app as storedApp } from "./stores";

  const VERSION = "1.0.10";
  $: app = Menu;
  storedApp.subscribe(value => app = value);
</script>

<svelte:component this={app} />

{#if app !== Menu}
  <button class="back" type="button" on:click={() => app = Menu}>Back</button>
{/if}
<em class="version">{VERSION}</em>

<style global>
  .back {
    position: fixed;
    inset: 0.25rem 0 0 0.25rem;
    font-size: 0.75rem;
    line-height: 1rem;
    opacity: 0.5;
  }

  .version {
      position: fixed;
      inset: 0.25rem 0.25rem 0 0;
      color: black;
      font-size: 0.75rem;
      line-height: 1rem;
      opacity: 0.5;
  }
</style>
