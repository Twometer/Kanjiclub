<template>
    <div class="home">
        <h1>Dashboard</h1>
        <hr />

        <div class="shadow-lg p-3 bg-white mt-5 rounded">
            <div class="card-body">
                <h2>Welcome back, username</h2>
                You are on a 50 day streak!
            </div>
        </div>

        <WordStats weak="5" medium="10" strong="159" />
    </div>
</template>

<style>
.col-md {
    margin-bottom: 20px;
}
</style>

<script>
// @ is an alias to /src
import WordStats from '@/components/WordStats.vue';

export default {
    name: 'Dashboard',
    components: {
        WordStats,
    },
};
</script>
