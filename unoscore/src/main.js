import App from './App.svelte';

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js')
	.then(reg => {
		console.log('Registration succeeded.');
		reg.update();
	}).catch(error => {
		console.log('Registration failed with ' + error);
	});
}

const app = new App({
	target: document.body
});

export default app