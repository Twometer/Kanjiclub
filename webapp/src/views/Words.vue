<template>
    <div class="words">
        <h1>
            {{ this.strengthToString($route.params.strength) }} Words
            <div class="float-right mt-1">
                <button
                    class="btn btn-secondary mr-2"
                    v-on:click="$router.back()"
                >
                    Go back
                </button>
                <button
                    class="btn btn-success"
                    v-if="words.length > 0"
                    v-on:click="createPractice()"
                >
                    Practice
                </button>
            </div>
            <div class="clearfix"></div>
        </h1>
        <hr />
        <spinner v-if="loading" />
        <word-list
            v-if="!loading"
            :emptyText="
                'You currently don\'t have any ' +
                $route.params.strength +
                ' words'
            "
            :words="words"
        />
    </div>
</template>

<script>
import Api from '../services/api';
import Spinner from '../components/Spinner.vue';
import WordList from '../components/WordList.vue';
const strengthStrings = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
};

export default {
    components: { Spinner, WordList },
    name: 'Dashboard',
    data() {
        return {
            loading: true,
            words: [],
        };
    },
    methods: {
        strengthToString(strength) {
            return strengthStrings[strength];
        },
        async createPractice() {
            let strength = this.$route.params.strength;

            await this.$store.dispatch('NewPractice', {
                target: 'strength',
                strength: strength,
            });
            this.$router.push('/practice');
        },
    },
    async mounted() {
        let strength = this.$route.params.strength;
        if (!(strength in strengthStrings)) {
            console.error('Unknown strength type ', strength);
            return;
        }

        let language = this.$store.getters.Language;
        this.words = (await Api.Words.getByStrength(language, strength)).data;
        this.loading = false;
    },
};
</script>
