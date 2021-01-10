<template>
    <div class="edit-select">
        <h1>Edit</h1>
        <hr />
        <div class="lead clearfix mb-3">
            <span class="d-inline-block pt-1"
                >Select a lesson you want to edit</span
            >
            <div class="d-inline-block float-right">
                <router-link class="btn btn-secondary mr-3" to="import"
                    >Import</router-link
                >
                <button
                    class="btn btn-success"
                    data-toggle="modal"
                    data-target="#lessonNameModal"
                >
                    New lesson
                </button>
            </div>
        </div>
        <div v-if="!loading">
            <search-box v-model="query" />
            <div class="list-group shadow mb-5">
                <router-link
                    class="list-group-item list-group-item-action"
                    v-for="lesson in filteredLessons"
                    :key="lesson.name"
                    :to="{ name: 'Edit', params: { lessonId: lesson.id } }"
                >
                    {{ lesson.name }}
                </router-link>
            </div>
        </div>
        <Spinner v-if="loading" />

        <empty-message
            :main="!loading"
            :empty="lessons.length == 0"
            :noResults="lessons.length != 0 && filteredLessons.length == 0"
            emptyText="You currently don't have any lessons"
            noResultsText="No search results"
        />

        <div
            class="modal fade"
            id="lessonNameModal"
            tabindex="-1"
            aria-labelledby="lessonNameModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="lessonNameModalLabel">
                            New lesson
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
                                id="lessonName"
                                class="form-control"
                                type="text"
                                placeholder="Name"
                                v-model="lessonName"
                                maxlength="30"
                            />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal"
                            v-on:click="clearLessonInput()"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-success"
                            data-dismiss="modal"
                            v-on:click="createLesson()"
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
import Spinner from '@/components/Spinner.vue';
import Api from '../services/api';
import SearchBox from '../components/SearchBox.vue';
import EmptyMessage from '../components/EmptyMessage.vue';

export default {
    name: 'EditSelect',
    data() {
        return {
            loading: true,
            lessons: [],
            lessonName: '',
            query: ''
        };
    },
    components: {
        Spinner,
        SearchBox,
        EmptyMessage
    },
    computed: {
        filteredLessons() {
            return this.lessons.filter(l => {
                return (
                    l.name.toLowerCase().indexOf(this.query.toLowerCase()) != -1
                );
            });
        }
    },
    methods: {
        clearLessonInput() {
            this.lessonName = '';
        },

        async createLesson() {
            if (this.lessonName.trim() == '') return;

            this.loading = true;

            let lang = this.$store.getters.Language;
            await Api.Lessons.create(this.lessonName.trim(), lang);
            await this.reload();

            this.loading = false;
            this.clearLessonInput();
        },

        async reload() {
            await this.$store.dispatch('GetLessons');
            this.lessons = this.$store.getters.Lessons;
            this.loading = false;
        }
    },
    async mounted() {
        await this.reload();
    }
};
</script>

<style scoped>
a {
    text-decoration: none !important;
    color: #222 !important;
}
</style>
