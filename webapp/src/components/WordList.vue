<template>
    <div class="word-list">
        <div class="list-group mb-5 shadow" v-if="words.length > 0">
            <div class="list-group-item" v-for="word in words" :key="word.id">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="vocab-font">
                        {{ word.data.foreign }}
                        {{
                            word.data.synonym != null
                                ? `(${word.data.synonym})`
                                : ''
                        }}
                    </h5>
                    <span class="lesson-name">{{
                        resolveLessonId(word.lesson)
                    }}</span>
                </div>
                {{ word.data.native }}
            </div>
        </div>
        <div v-if="words.length == 0">
            <div class="text-muted text-center">
                {{ emptyText }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WordList',
    props: {
        emptyText: String,
        words: Array
    },
    methods: {
        resolveLessonId(lessonId) {
            let lessons = this.$store.getters.Lessons;
            for (let lesson of lessons)
                if (lesson.id == lessonId) return lesson.name;
            return '';
        }
    }
};
</script>

<style scoped>
.lesson-name {
    color: gray;
}
</style>
