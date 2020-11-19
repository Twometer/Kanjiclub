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
            <ul class="list-group shadow">
                <li
                    class="list-group-item list-group-item-action"
                    v-for="lesson in lessons"
                    :key="lesson.name"
                >
                    {{ lesson.name }}
                </li>
            </ul>
        </div>
        <Spinner v-if="loading" />

        <div
            class="modal fade"
            id="lessonNameModal"
            tabindex="-1"
            aria-labelledby="lessonNameModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered">
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
import Api from '@/services/api';
import Spinner from '@/components/Spinner.vue';

export default {
    name: 'EditSelect',
    data() {
        return {
            loading: true,
            lessons: [],
            lessonName: '',
        };
    },
    components: {
        Spinner,
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
            let lang = this.$store.getters.Language;
            this.lessons = (await Api.Lessons.get(lang)).data;
            this.loading = false;
        },
    },
    async mounted() {
        await this.reload();
    },
};
</script>

<style scoped>
a {
    text-decoration: none !important;
    color: #222 !important;
}
</style>