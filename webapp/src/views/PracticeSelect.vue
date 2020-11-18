<template>
    <div class="practice-select">
        <h1>Practice</h1>
        <hr />
        <div class="lead clearfix mb-3">
            <span class="d-inline-block pt-1">Select lessons you want to practice</span>
            <div class="d-inline-block float-right">
                <button class="btn btn-secondary mr-3">Select all</button>
                <router-link to="/practice">
                    <button class="btn btn-success go">Go!</button>
                </router-link>
            </div>
        </div>
        <div v-if="!loading">
            <ul class="list-group shadow">
                <li class="list-group-item list-group-item-action" v-for="lesson in lessons" :key="lesson.name"> {{ lesson.name }} </li>
            </ul>
        </div>
        <Spinner v-if="loading" />
    </div>
</template>

<script>
import Api from '@/services/api'
import Spinner from '@/components/Spinner.vue';

export default {
    name: 'PracticeSelect',
    data() {
        return {
            loading: true,
            lessons: []
        };
    },
    components: {
        Spinner,
    },
    async mounted () {
        let lang = this.$store.getters.Language;
        this.lessons = (await Api.Lessons.get(lang)).data;
        this.loading = false;
    }
};
</script>


<style scoped>
button.go {
    padding: 6px 20px;
}
</style>