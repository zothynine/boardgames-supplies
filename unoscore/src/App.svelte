<script>
	import './Card.webcomponent.svelte';

	const VERSION = "1.0.75";
</script>

<main class="flex absolute inset-0 overflow-x-auto overflow-y-hidden h-full">
	<em class="text-white text-xs fixed inset-0.5 opacity-50 text-right not-italic">{VERSION}</em>
	<uno-card class="flex justify-around items-center bg m-0 p-0" color="blue" style="--card-color: blue"/>
	<uno-card class="flex justify-around items-center bg m-0 p-0" color="red" style="--card-color: red"/>
	<uno-card class="flex justify-around items-center bg m-0 p-0" color="orange" style="--card-color: orange"/>
	<uno-card class="flex justify-around items-center bg m-0 p-0" color="green" style="--card-color: green"/>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
      --width-basis: 100vw;
  }

	/* main {
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
  */

  uno-card {
    background-color: var(--card-color);
    flex: 0 0 var(--width-basis);
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