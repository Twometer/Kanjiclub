<template>
    <div class="home">
        <h1>Dashboard</h1>
        <hr />

        <div v-if="!loading" class="shadow-lg p-3 bg-white mt-5 rounded">
            <div class="card-body">
                <h2 class="mb-2">Welcome back, {{ username }}</h2>
                <p class="lead mb-0">
                    Continue learning <strong>{{ language }}</strong> today!
                </p>
                <!--You are on a {{ stats.streak }} day streak! -->
            </div>
        </div>

        <WordStats
            v-if="!loading"
            v-bind:weak="stats.weak"
            v-bind:medium="stats.medium"
            v-bind:strong="stats.strong"
            v-on:select="showStrengthDetails"
        />
        <Spinner v-if="loading" />

        <div class="text-center text-muted my-5">
            You can do this!
        </div>
    </div>
</template>

<style>
.col-md {
    margin-bottom: 20px;
}
</style>

<script>
import WordStats from '@/components/WordStats.vue';
import Spinner from '@/components/Spinner.vue';
import axios from 'axios';

export default {
    name: 'Dashboard',
    data() {
        return {
            loading: true,
            stats: {}
        };
    },
    computed: {
        username: function() {
            let user = this.$store.getters.User;
            return user == null ? '' : user.username;
        },
        language() {
            let languages = this.$store.getters.UserLanguages;
            return languages.filter(
                l => l.code == this.$store.getters.Language
            )[0].name;
        }
    },
    components: {
        WordStats,
        Spinner
    },
    async mounted() {
        let response = await axios.get('stats');
        this.stats = response.data;
        this.loading = false;
    },
    methods: {
        showStrengthDetails(strength) {
            this.$router.push({
                name: 'Words',
                params: { strength: strength }
            });
        }
    }
};
</script>
