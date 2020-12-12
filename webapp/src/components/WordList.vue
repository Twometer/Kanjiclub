<template>
    <div class="word-list">
        <div class="list-group mb-5 shadow" v-if="words.length > 0">
            <div class="list-group-item" v-for="word in words" :key="word.id">
                <h5 class="lang-jp">
                    {{ word.data.foreign }}
                    {{
                        word.data.synonym != null
                            ? `(${word.data.synonym})`
                            : ''
                    }}
                </h5>
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
        words: Array,
    },
};
</script>
