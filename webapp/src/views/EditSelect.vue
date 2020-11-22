<template>
    <div class="edit-select">
        <h1>Edit</h1>
        <hr />
        <p class="lead clearfix">
            <span class="d-inline-block pt-1"
                >Select lesson you want to edit</span
            >
            <button
                class="btn btn-success float-right"
                data-toggle="modal"
                data-target="#lessonNameModal"
            >
                New lesson
            </button>
        </p>
        <div v-if="!loading">
            <div class="list-group shadow">
                <router-link
                    class="list-group-item list-group-item-action"
                    v-for="lesson in lessons"
                    :key="lesson.name"
                    :to="{ name: 'Edit', params: { lessonId: lesson.id } }"
                >
                    {{ lesson.name }}
                </router-link>
            </div>
        </div>
        <Spinner v-if="loading" />

        <div
            class="text-muted text-center"
            v-if="lessons.length == 0 && !loading"
        >
            You currently don't have any lessons
        </div>

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

export default {
    name: 'EditSelect',
    data() {
        return {
            loading: true,
            lessons: [],
            lessonName: ''
        };
    },
    components: {
        Spinner
    },
    methods: {
        clearLessonInput() {
            this.lessonName = '';
        },

        async createLesson() {
            this.loading = true;

            let lang = this.$store.getters.Language;
            await Api.Lessons.create(this.lessonName, lang);
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
