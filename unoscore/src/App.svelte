<script>
	import './Card.webcomponent.svelte';

	const VERSION = "1.0.2";

	function reset() {
		window.location.reload();
	}
</script>

<main>
	<em class="version" on:click={reset}>{VERSION}</em>
	<uno-card color="blue" style="--card-color: blue"/>
	<uno-card color="red" style="--card-color: red"/>
	<uno-card color="orange" style="--card-color: orange"/>
	<uno-card color="green" style="--card-color: green"/>
</main>

<style>
    :root {
        --width-basis: 100vw;
    }

	main {
		display: flex;
		position: absolute;
		inset: 0;
		overflow-x: auto;
		overflow-y: hidden;
    	scroll-snap-type: x mandatory;
		height: 100vh;
	}

	.version {
		color: white;
		font-size: 10px;
		inset: 5px;
		opacity: 0.5;
		position: fixed;
		text-align: right;
		font-style: normal;
	}

    uno-card {
        align-items: center;
		background-color: var(--card-color);
        display: flex;
        flex: 0 0 var(--width-basis);
        justify-content: space-around;
        margin: 0;
        padding: 0;
        scroll-snap-align: start;
    }

	@media (min-width: 600px) {
		uno-card {
			--width-basis: 50vw;
			flex: 1 1 auto;
		}
	}

	@media (min-width: 1024px) {
		uno-card {
			--width-basis: 25vw;
			flex: 1 1 auto;
		}
	}
</style>