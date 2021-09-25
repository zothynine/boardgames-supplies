<script>
  import Unoscore from "./unoscore/Unoscore.svelte";
	
  const VERSION = "1.0.9a";
  $: app = null;
</script>

<div>
  <svelte:component this={app} />
  <em class="version">{VERSION}</em>
  <button on:click={ () => app = Unoscore }>Unoscore</button>
</div>

<style global lang="postcss">
.version {
    @apply text-black text-xs opacity-50 fixed not-italic top-0 right-0;
}
</style>