<template>
    <div class="row mt-5 pl-2 pr-2">
        <div class="col-md">
            <div class="shadow-lg p-3 bg-success text-white rounded word-stats" v-on:click="$emit('select', 'strong')">
                <div class="card-body">
                    <h2>{{ strong }}</h2>
                    Strong words
                </div>
            </div>
        </div>

        <div class="col-md">
            <div class="shadow-lg p-3 bg-warning text-white rounded word-stats" v-on:click="$emit('select', 'medium')">
                <div class="card-body">
                    <h2>{{ medium }}</h2>
                    Medium words
                </div>
            </div>
        </div>

        <div class="col-md">
            <div class="shadow-lg p-3 bg-danger text-white rounded word-stats" v-on:click="$emit('select', 'weak')">
                <div class="card-body">
                    <h2>{{ weak }}</h2>
                    Weak words
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .word-stats {
        cursor: pointer;
        transition-duration: .3s;
    }
    .word-stats:hover {
        transform: scale(1.025) translateY(-5px);
        transition-duration: .3s;
    }
</style>

<script>
export default {
    name: 'WordStats',
    props: {
        weak: Number,
        medium: Number,
        strong: Number,
    },
};
</script>