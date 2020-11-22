<template>
    <div class="add-language">
        <h1>Add language</h1>
        <hr />

        <div class="input-group mb-4 shadow">
            <div class="input-group-prepend">
                <span class="input-group-text">
                    <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                        class="bi bi-search"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"
                        />
                        <path
                            fill-rule="evenodd"
                            d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"
                        />
                    </svg>
                </span>
            </div>
            <input
                type="text"
                class="form-control"
                id="search"
                placeholder="Search..."
                autocomplete="off"
                v-model="query"
            />
        </div>

        <div class="alert alert-danger" v-if="error">
            Could not create language. Please try again later.
        </div>

        <ul class="list-group shadow mb-5 select-panel" v-if="!loading">
            <li
                class="list-group-item list-group-item-action"
                v-for="lang in filteredLanguages"
                :key="lang.code"
                v-on:click="createLanguage(lang.code)"
            >
                <img
                    :src="'/img/flags/' + getFlagImage(lang.code)"
                    class="shadow rounded-circle mr-2"
                    width="25"
                />
                {{ lang.name }}
            </li>
        </ul>

        <spinner v-if="loading" />
    </div>
</template>

<style scoped>
.select-panel {
    overflow-y: auto;
    max-height: 500px;
}
</style>

<script>
import Api from '@/services/api';
import Spinner from '../components/Spinner.vue';
import * as flags from '@/assets/flags.json';

export default {
    name: 'AddLanguage',
    data() {
        return {
            loading: true,
            error: false,
            languages: {},
            query: ''
        };
    },
    computed: {
        filteredLanguages() {
            var userLanguages = this.$store.getters.UserLanguages;
            return Object.keys(this.languages)
                .map(k => {
                    return { code: k, name: this.languages[k] };
                })
                .filter(lang => {
                    for (let existingLanguage of userLanguages)
                        if (existingLanguage.code == lang.code) return false;

                    return (
                        lang.name
                            .toLowerCase()
                            .indexOf(this.query.toLowerCase()) != -1
                    );
                });
        }
    },
    components: {
        Spinner
    },
    async mounted() {
        this.languages = (await Api.Languages.getSupported()).data;
        this.loading = false;
    },
    methods: {
        getFlagImage(code) {
            if (flags.default.includes(code)) return code + '.svg';
            else return 'world.svg';
        },

        async createLanguage(code) {
            try {
                this.loading = true;
                await Api.Languages.new(code);
                if (this.$store.getters.Language == null)
                    await this.$store.dispatch('GetUserInfo');
                await this.$store.dispatch('GetUserLanguages');
                this.$router.push('/settings');
            } catch (e) {
                this.loading = false;
                this.error = true;
            }
        }
    }
};
</script>
