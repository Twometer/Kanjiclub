<template>
    <div class="edit-select">
        <h1>Edit</h1>
        <hr />
        <p class="lead clearfix">
            <span class="d-inline-block pt-1">Select lesson you want to edit</span>
            <button class="btn btn-success float-right">New lesson</button>
        </p>
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
    name: 'EditSelect',
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
a {
    text-decoration: none !important;
    color: #222 !important;
}
</style>