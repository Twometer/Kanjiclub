<template>
    <div class="edit-select">
        <h1>Edit</h1>
        <hr />
        <p class="lead clearfix">
            <span class="d-inline-block pt-1">Select lessons you want to edit</span>
            <button class="btn btn-success float-right">Create new</button>
        </p>
        <div>
            <ul class="list-group shadow">
                <router-link to="/edit" class="list-group-item list-group-item-action" v-for="index in 5" :key="index">
                    Lorem ipsum
                </router-link>
            </ul>
        </div>
        <div class="text-center mt-5"></div>
    </div>
</template>

<style scoped>
a {
    text-decoration: none !important;
    color: #222 !important;
}
</style>