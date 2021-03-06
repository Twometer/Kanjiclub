<template>
    <div class="note-select">
        <h1>Notes</h1>
        <hr />
        <div class="lead clearfix mb-3">
            <span class="d-inline-block pt-1">Edit or create notes</span>
            <div class="d-inline-block float-right">
                <button
                    class="btn btn-success"
                    data-toggle="modal"
                    data-target="#newNoteModal"
                >
                    New note
                </button>
            </div>
        </div>

        <!-- List of notes -->
        <div v-if="!loading">
            <search-box v-model="query" />
            <div class="list-group shadow mb-5">
                <router-link
                    class="list-group-item list-group-item-action"
                    v-for="note in filteredNotes"
                    :key="note.id"
                    :to="{ name: 'Note', params: { noteId: note.id } }"
                >
                    {{ note.title }}
                </router-link>
            </div>
        </div>

        <Spinner v-if="loading" />
        <empty-message
            :main="!loading"
            :empty="notes.length == 0"
            :noResults="notes.length != 0 && filteredNotes.length == 0"
            emptyText="You currently don't have any notes"
            noResultsText="No search results"
        />

        <!-- Dialog for creating new notes -->
        <div
            class="modal fade"
            id="newNoteModal"
            tabindex="-1"
            aria-labelledby="newNoteModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="newNoteModalLabel">
                            New note
                        </h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <input
                                id="noteName"
                                class="form-control"
                                type="text"
                                placeholder="Name"
                                v-model="noteName"
                                maxlength="30"
                            />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal"
                            v-on:click="clearNoteName()"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-success"
                            data-dismiss="modal"
                            v-on:click="createNote()"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '../services/api';
import EmptyMessage from '../components/EmptyMessage.vue';
import SearchBox from '../components/SearchBox.vue';
import Spinner from '../components/Spinner.vue';
export default {
    components: { EmptyMessage, Spinner, SearchBox },
    data() {
        return {
            loading: true,
            noteName: '',
            notes: [],
            query: ''
        };
    },
    computed: {
        filteredNotes() {
            return this.notes.filter(
                note =>
                    note.title
                        .toLowerCase()
                        .indexOf(this.query.toLowerCase()) != -1
            );
        }
    },
    methods: {
        clearNoteName() {
            this.noteName = '';
        },

        async reload() {
            this.loading = true;
            let language = this.$store.getters.Language;
            this.notes = (await Api.Notes.getByLanguage(language)).data;
            this.loading = false;
        },

        async createNote() {
            console.log('Creating note', this.noteName);
            let language = this.$store.getters.Language;
            await Api.Notes.create(this.noteName, language);
            await this.reload();
            this.clearNoteName();
        }
    },
    async mounted() {
        await this.reload();
    }
};
</script>
