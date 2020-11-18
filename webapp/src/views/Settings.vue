<template>
    <div class="settings">
        <h1>Settings</h1>
        <hr />

        <h3 class="mt-5 clearfix">
            Languages
            <router-link to="/language">
                <button class="btn btn-success float-right">Add</button>
            </router-link>
        </h3>
        <hr />

        <div class="alert alert-danger" v-if="error">
            Could not switch language. Please try again later.
        </div>

        <ul class="list-group shadow clearfix" v-if="!loading">
            <li class="list-group-item" v-for="language in languages" :key="language.code" :class="{ active: language.code == currentLanguage}">
                {{ language.name }}

                <!-- Visual-only button for current language -->
                <button class="btn btn-secondary btn-sm float-right disabled" disabled v-if="language.code == currentLanguage">
                    Current
                </button>

                <button class="btn btn-secondary btn-sm float-right" v-if="language.code != currentLanguage" v-on:click="switchLanguage(language.code)">
                    Switch
                </button>
            </li>
        </ul>
        <Spinner v-if="loading"/>

        <h3 class="mt-5 clearfix">
            Practice<button class="btn btn-success float-right">Apply</button>
        </h3>
        <hr />
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="includeSynonyms" v-bind:checked="settings.includeSynonyms"/>
            <label class="form-check-label" for="includeSynonyms">Include synonyms in test</label>
        </div>
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="randomizeDir" v-bind:checked="settings.randomizeDir"/>
            <label class="form-check-label" for="randomizeDir">Randomize translation direction</label>
        </div>
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="ignoreCase" v-bind:checked="settings.ignoreCase" />
            <label class="form-check-label" for="ignoreCase">Ignore case in native language</label>
        </div>

        <h3 class="mt-5">About</h3>
        <hr />
        <p>{{ $root.AppInfo.name }} version {{ $root.AppInfo.version }}</p>
        <p class="text-muted">made by <a href="https://github.com/Twometer/Kanjiclub">Twometer</a></p>
        <p class="text-muted">Icons by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> flaticon.com</a></p>
    </div>
</template>

<script>
import axios from 'axios'
import Spinner from '@/components/Spinner.vue'

export default {
    name: 'Settings',
    data() {
        return {
            loading: true,
            languages: [],
            error: false
        };
    },
    components: {
        Spinner
    },
    computed: {
        settings: function () {
            return this.$store.getters.User.settings;
        },
        currentLanguage: function() {
            return this.$store.getters.Language;
        }
    },
    async mounted() {
        await this.$store.dispatch('GetUserLanguages');
        this.languages = this.$store.getters.UserLanguages;
        this.loading = false;
    },
    methods: {
        async switchLanguage(code) {
            this.loading = true;
            console.log("Switching to", code);
            try {
                await axios.put('accounts/settings', {currentLanguage: code});
            } catch {
                this.error = true;
                this.loading = false;
                return;
            }
            await this.$store.dispatch('GetUserInfo');
            await this.$store.dispatch('GetUserLanguages');
            this.$router.push('/');
        }
    }
};
</script>

<style scoped>

</style>