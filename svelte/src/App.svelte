<script>
  import Menu from "./Menu.svelte";
  import { app as storedApp, appTitle } from "./stores";

  const VERSION = "1.0.11";
  $: app = Menu;
  $: title = null;
  storedApp.subscribe(value => app = value);
  appTitle.subscribe(value => title = value);

</script>

{#if app !== Menu}
<header>
  <button class="back" type="button" on:click={() => app = Menu}>Back</button>
  {#if title}<h1>{title}</h1>{/if}
  <em class="version">v{VERSION}</em>
</header>
{/if}

<svelte:component this={app} />


<style global>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
  }

  header {
    align-items: center;
    background-color: white;
    display: flex;
    font-size: 0.75rem;
    line-height: 1rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 1;
  }

  header button {
    padding: 3px 6px;
  }

  header h1 {
    font-size: 1rem;
    flex-grow: 1;
    margin: 0;
    text-align: center;
  }

  .back {
    background: transparent;
    border-width: 0;
    padding: 3px 6px;
  }

  .version {
    padding: 3px 6px;
  }
</style>
