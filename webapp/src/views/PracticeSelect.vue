<template>
    <div class="practice-select">
        <h1>Practice</h1>
        <hr />
        <div class="alert alert-danger" v-if="error">
            <strong>Error: </strong>Could not create practice from empty
            lesson(s)
        </div>
        <div class="lead clearfix mb-3">
            <span class="d-inline-block pt-1"
                >Select lessons you want to practice</span
            >
            <div class="d-inline-block float-right">
                <Button
                    class="btn-secondary mr-3"
                    v-on:click="toggleAll"
                    :text="allSelected ? 'Deselect all' : 'Select all'"
                    :disabled="lessons.length == 0"
                />
                <Button
                    class="btn-success go"
                    v-on:click="createPractice"
                    :disabled="!anySelected"
                    text="Go!"
                />
            </div>
        </div>
        <div v-if="!loading">
            <search-box v-model="query" />
            <ul class="list-group shadow">
                <li
                    class="list-group-item list-group-item-action"
                    v-for="lesson in filteredLessons"
                    :key="lesson.name"
                    :class="{ active: selected.includes(lesson.id) }"
                    v-on:click="toggleLesson(lesson.id)"
                >
                    {{ lesson.name }}
                </li>
            </ul>
        </div>
        <Spinner v-if="loading" />
        <empty-message
            :main="!loading"
            :empty="lessons.length == 0"
            :noResults="lessons.length != 0 && filteredLessons.length == 0"
            emptyText="You currently don't have any lessons"
            noResultsText="No search results"
        />
    </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue';
import Button from '@/components/Button.vue';
import SearchBox from '../components/SearchBox.vue';
import EmptyMessage from '../components/EmptyMessage.vue';

export default {
    name: 'PracticeSelect',
    data() {
        return {
            loading: true,
            lessons: [],
            selected: [],
            error: false,
            query: '',
        };
    },
    computed: {
        allSelected() {
            return (
                this.lessons.length > 0 &&
                this.selected.length == this.lessons.length
            );
        },
        anySelected() {
            return this.selected.length;
        },
        filteredLessons() {
            return this.lessons.filter((l) => {
                return (
                    l.name.toLowerCase().indexOf(this.query.toLowerCase()) != -1
                );
            });
        },
    },
    components: {
        Spinner,
        Button,
        SearchBox,
        EmptyMessage
    },
    async mounted() {
        await this.$store.dispatch('GetLessons');
        this.lessons = this.$store.getters.Lessons;
        this.selected = this.$store.getters.SelectedPractices;
        this.loading = false;

        document.onkeyup = function (e) {
            if (e.keyCode == 13) this.createPractice();
        }.bind(this);
    },
    methods: {
        saveSelection() {
            this.$store.commit('setPracticeSelection', this.selected);
        },
        toggleLesson(lessonId) {
            this.error = false;
            if (this.selected.includes(lessonId))
                this.selected = this.selected.filter((l) => l != lessonId);
            else this.selected.push(lessonId);
            this.saveSelection();
        },
        toggleAll() {
            this.error = false;
            if (this.allSelected) this.selected = [];
            else this.selected = this.lessons.map((l) => l.id);
            this.saveSelection();
        },
        async createPractice() {
            this.error = false;
            if (this.selected.length == 0) return;

            try {
                await this.$store.dispatch('NewPractice', {
                    target: 'lesson',
                    lessons: this.selected,
                });
                this.$router.push('/practice');
            } catch (e) {
                if (e.response.status == 404) {
                    this.error = true;
                }
            }
        },
    },
};
</script>

<style scoped>
button.go {
    padding: 6px 20px;
}
</style>
