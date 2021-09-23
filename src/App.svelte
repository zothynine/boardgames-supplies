<script>
  import Unoscore from "./unoscore/Unoscore.svelte";
  
  $: app = null;
</script>

<div>
  <svelte:component this={app} />
  <button on:click={ () => app = Unoscore }>Unoscore</button>
</div>
