<template>
    <div class="search">
        <h1>Search</h1>
        <hr />
        <p class="lead">Find specific words in your vocabulary</p>
        <div class="form-row">
            <div class="col-auto flex-grow-1">
                <search-box :disabled="loading" v-model="query" />
            </div>
            <div class="col-auto">
                <Button
                    type="submit"
                    class="btn-primary"
                    v-on:click="runSearch"
                    :disabled="loading || !maySearch"
                    text="Search"
                />
            </div>
        </div>
        <spinner v-if="loading" />
        <empty-message
            :main="!loading && searchStarted"
            :noResults="results.length == 0"
            noResultsText="No results"
        />
        <word-list v-if="!loading" :words="results" />
    </div>
</template>

<script>
import Button from '../components/Button.vue';
import EmptyMessage from '../components/EmptyMessage.vue';
import SearchBox from '../components/SearchBox.vue';
import Spinner from '../components/Spinner.vue';
import WordList from '../components/WordList.vue';
import Api from '../services/api';

export default {
    data() {
        return {
            loading: false,
            searchStarted: false,
            results: [],
            query: ''
        };
    },
    components: { SearchBox, Spinner, EmptyMessage, WordList, Button },
    name: 'Search',
    computed: {
        maySearch() {
            return this.query.trim().length > 1;
        }
    },
    mounted() {
        document.onkeyup = function(e) {
            if (e.keyCode == 13 && this.maySearch) this.runSearch();
        }.bind(this);
    },
    methods: {
        async runSearch() {
            this.searchStarted = true;
            this.loading = true;
            let language = this.$store.getters.Language;
            let response = await Api.Words.search(language, this.query);
            this.results = response.data;
            this.loading = false;
        }
    }
};
</script>
