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
                    Active
                </button>

                <button class="btn btn-primary btn-sm float-right" v-if="language.code != currentLanguage" v-on:click="switchLanguage(language.code)">
                    Switch
                </button>
            </li>
        </ul>
        <Spinner v-if="loading"/>

        <h3 class="mt-5">
            Practice
            <div class="float-right" v-if="settingsChanged">
                <button class="btn btn-secondary" v-on:click="discardSettings">Cancel</button>
                <button class="btn btn-primary ml-3" v-on:click="applySettings">Apply</button>
            </div>
        </h3>
        <hr />
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="includeSynonyms" v-model="settings.includeSynonyms"/>
            <label class="form-check-label" for="includeSynonyms">Include synonyms in test</label>
        </div>
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="randomizeDir" v-model="settings.randomizeDir"/>
            <label class="form-check-label" for="randomizeDir">Randomize translation direction</label>
        </div>
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="ignoreCase" v-model="settings.ignoreCase" />
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

function clone(o) {
    let cloned = {};
    Object.assign(cloned, o);
    return cloned;
}

export default {
    name: 'Settings',
    data() {
        return {
            loading: true,
            languages: [],
            error: false,
            settings: clone(this.$store.getters.User.settings)
        };
    },
    components: {
        Spinner
    },
    computed: {
        settingsChanged: function() {
            let userSettings = this.$store.getters.User.settings;
            for (let key in userSettings)
                if (userSettings[key] != this.settings[key])
                    return true;
            return false;
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
        },
        async applySettings() {
            await axios.put('accounts/settings', this.settings);
            await this.$store.dispatch('GetUserInfo');
        },
        discardSettings() {
            this.settings = clone(this.$store.getters.User.settings);
        }
    }
};
</script>

<style scoped>
.btn-sm {
    width: 54px;
}
</style>