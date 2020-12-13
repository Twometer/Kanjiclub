<template>
    <div class="empty-message text-muted text-center" v-if="main">
        <div v-if="empty">
            {{ emptyText }}
        </div>
        <div v-if="noResults">
            {{ noResultsText }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'EmptyMessage',
    props: {
        main: Boolean,
        empty: Boolean,
        noResults: Boolean,
        emptyText: String,
        noResultsText: String
    }
};
</script>
