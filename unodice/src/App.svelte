<script>
	import './Card.webcomponent.svelte';
</script>

<main>
	<uno-card color="blue"/>
	<uno-card color="red"/>
	<uno-card color="orange"/>
	<uno-card color="green"/>
</main>

<style>
	main {
		display: flex;
		position: absolute;
		inset: 0;
		overflow-x: auto;
		overflow-y: hidden;
    	scroll-snap-type: x mandatory;
		height: 100vh;
	}

    uno-card {
        align-items: center;
        display: flex;
        flex: 0 0 100vw;
        justify-content: space-around;
        margin: 0;
        padding: 0;
        scroll-snap-align: start;
    }

	@media (orientation: landscape) and (min-width: 1280px) {
		uno-card {
			flex: 1 1 auto;
		}
	}
</style>