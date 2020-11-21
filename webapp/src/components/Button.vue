<template>
    <button class="btn" :class="{ disabled: disabled }" :disabled="disabled" v-on:click="$emit('click')">
        <span v-if="!loading">{{ text }}</span>
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        disabled: Boolean,
        text: String,
        loading: Boolean
    },
};
</script>