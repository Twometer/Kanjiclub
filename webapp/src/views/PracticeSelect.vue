<template>
    <div class="practice-select">
        <h1>Practice</h1>
        <hr />
        <div class="lead clearfix mb-3">
            <span class="d-inline-block pt-1">Select lessons you want to practice</span>
            <div class="d-inline-block float-right">
                <button class="btn btn-secondary mr-3" v-on:click="toggleAll">{{ allSelected ? 'Deselect all' : 'Select all' }}</button>
                <button class="btn btn-success go" v-on:click="createPractice" :class="{ disabled: !anySelected }" :disabled="!anySelected">Go!</button>
            </div>
        </div>
        <div v-if="!loading">
            <ul class="list-group shadow">
                <li class="list-group-item list-group-item-action" v-for="lesson in lessons" :key="lesson.name" :class="{ active: selected.includes(lesson.id) }" v-on:click="toggleLesson(lesson.id)"> {{ lesson.name }} </li>
            </ul>
        </div>
        <Spinner v-if="loading" />
    </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue';

export default {
    name: 'PracticeSelect',
    data() {
        return {
            loading: true,
            lessons: [],
            selected: []
        };
    },
    computed: {
        allSelected() {
            return this.lessons.length > 0 && this.selected.length == this.lessons.length;
        },
        anySelected() {
            return this.selected.length;
        }
    },
    components: {
        Spinner,
    },
    async mounted () {
        await this.$store.dispatch('GetLessons');
        this.lessons = this.$store.getters.Lessons;
        this.loading = false;
    },
    methods: {
        toggleLesson(lessonId) {
            if (this.selected.includes(lessonId))
                this.selected = this.selected.filter(l => l != lessonId);
            else
                this.selected.push(lessonId);
        },
        toggleAll() {
            if (this.allSelected)
                this.selected = [];
            else 
                this.selected = this.lessons.map(l => l.id);
        },
        async createPractice() {
            if (this.selected.length == 0)
                return;

            await this.$store.dispatch('NewPractice', { target: 'lesson', lessons: this.selected })
            this.$router.push('/practice');
        }
    }
};
</script>


<style scoped>
button.go {
    padding: 6px 20px;
}
</style>