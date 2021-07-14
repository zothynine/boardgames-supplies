<script>
	import Card from './Card.svelte'
</script>

<main>
	<Card color="blue"/>
	<Card color="red"/>
	<Card color="yellow"/>
	<Card color="green"/>
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
</style>