<script>
    export let color = "white";
</script>

<section>
    <div class="card" style="--card-color: {color}">
        <span>{color}</span>
    </div>
</section>

<style>
    section {
        align-items: center;
        display: flex;
        flex: 0 0 100vw;
        justify-content: space-around;
        margin: 0;
        padding: 0;
        scroll-snap-align: start;
    }

    .card {
        background-color: var(--card-color);
        border-radius: 16px;
        box-sizing: border-box;
        height: min(130vw, 90vh);
        padding: 16px;
        width: clamp(320px, 60vh, 90vw);
    }
</style>