<template>
    <div class="row mt-5 pl-2 pr-2">
        <div class="col-md">
            <div class="shadow-lg p-3 bg-success text-white rounded">
                <div class="card-body">
                    <h2>{{ strong }}</h2>
                    Strong words
                </div>
            </div>
        </div>

        <div class="col-md">
            <div class="shadow-lg p-3 bg-warning text-white rounded">
                <div class="card-body">
                    <h2>{{ medium }}</h2>
                    Medium words
                </div>
            </div>
        </div>

        <div class="col-md">
            <div class="shadow-lg p-3 bg-danger text-white rounded">
                <div class="card-body">
                    <h2>{{ weak }}</h2>
                    Weak words
                </div>
            </div>
        </div>
    </div>
</template>

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