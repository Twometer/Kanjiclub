<template>
    <div class="home">
        <h1>Dashboard</h1>
        <hr />

        <div v-if="!loading" class="shadow-lg p-3 bg-white mt-5 rounded">
            <div class="card-body">
                <h2>Welcome back, {{ username }}</h2>
                You are on a {{ stats.streak }} day streak!
            </div>
        </div>

        <WordStats v-if="!loading" v-bind:weak="stats.weak" v-bind:medium="stats.medium" v-bind:strong="stats.strong" />
        <Spinner v-if="loading"/>
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
import Spinner from '@/components/Spinner.vue';
import axios from 'axios'

export default {
    name: 'Dashboard',
    data() {
        return {
            loading: true,
            stats: {}
        };
    },
    computed: {
        username: function () {
            return this.$store.getters.User.username;
        },
    },
    components: {
        WordStats,
        Spinner,
    },
    async mounted () {
        let response = await axios.get('stats');
        this.stats = response.data;
        this.loading = false
    }
};
</script>
