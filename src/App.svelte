<script>
  import Unoscore from "./unoscore/Unoscore.svelte";
  import { app as storedApp } from "./stores";
	
  const VERSION = "1.0.9a";
  $: app = null;
  storedApp.subscribe(value => app = value);
</script>

{#if app === null}
  <div class="apps">
    <button on:click={ () => app = Unoscore }>Unoscore</button>
  </div>
{:else}
  <svelte:component this={app} />
{/if}

{#if app !== null}
  <button class="back" type="button" on:click={() => app = null}>Back</button>
{/if}
<em class="version">{VERSION}</em>

<style global lang="postcss">
  .back {
    @apply fixed top-0 left-0;
  }
  .version {
      @apply text-black text-xs opacity-50 fixed not-italic top-0 right-0;
  }
</style>