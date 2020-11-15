<template>
    <div class="lessons">
        <h1>Practice</h1>
        <hr />
        <p class="lead clearfix">
            <span class="d-inline-block pt-1">Select lessons you want to practice</span>
            <router-link to="/practice">
                <button class="btn btn-success float-right">Go!</button>
            </router-link>
        </p>
        <div>
            <ul class="list-group">
                <li class="list-group-item active">Lorem ipsum</li>
                <li class="list-group-item">Dapibus ac facilisis in</li>
                <li class="list-group-item">Morbi leo risus</li>
                <li class="list-group-item">Porta ac consectetur ac</li>
                <li class="list-group-item">Vestibulum at eros</li>
            </ul>
        </div>
        <div class="text-center mt-5"></div>
    </div>
</template>

<style scoped>
button {
    padding: 6px 24px;
}
</style>