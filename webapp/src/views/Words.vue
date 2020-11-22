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
        <div class="list-group mb-5" v-if="!loading">
            <div class="list-group-item" v-for="word in words" :key="word.id">
                <h5 class="lang-jp">
                    {{ word.data.foreign }}
                    {{
                        word.data.synonym != null
                            ? `(${word.data.synonym})`
                            : ''
                    }}
                </h5>
                {{ word.data.native }}
            </div>
        </div>
        <div v-if="!loading && words.length == 0">
            <div class="alert alert-secondary">
                You currently don't have any {{ $route.params.strength }} words
            </div>
        </div>
    </div>
</template>

<script>
import Api from '../services/api';
import Spinner from '../components/Spinner.vue';
const strengthStrings = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong'
};

export default {
    components: { Spinner },
    name: 'Dashboard',
    data() {
        return {
            loading: true,
            words: []
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
                strength: strength
            });
            this.$router.push('/practice');
        }
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
    }
};
</script>
