<template>
    <div class="practice">
        <div class="alert alert-secondary" v-if="!hasPractice">
            There is currently no active practice
        </div>
        <div class="progress practice-holder m-auto shadow-sm" v-if="hasPractice">
            <div
                class="progress-bar bg-success"
                role="progressbar"
                :aria-valuenow="progress"
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{ width: progress + '%' }"
            ></div>
        </div>

        <div
            class="d-flex h-100 align-items-center justify-content-center flex-column"
            v-if="hasPractice"
        >
            <div
                class="shadow-lg p-3 bg-white mt-5 rounded w-100 practice-holder"
            >
                <div class="card-body">
                    <h2 class="lang-jp text-center">{{ currentWord.foreign }}</h2>

                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control my-5 mx-3"
                            placeholder="Translation"
                        />
                    </div>

                    <button class="btn btn-success d-block w-100">Check</button>
                    <button class="btn btn-secondary d-block w-100 mt-4">
                        I don't know
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Practice',
    data() {
        return {
            progress: 0,
            currentWord: {},
            hasPractice: true
        };
    },
    computed: {},
    async mounted() {
        let practice = this.$store.getters.CurrentPractice;
        if (practice == null) {
            this.hasPractice = false;
            return;
        }
        
        this.currentWord = practice[0];
    },
    methods: {},
};
</script>

<style scoped>
@media (min-width: 992px) {
    .practice-holder {
        width: 75% !important;
    }
}
.progress {
    height: 12px;
    border-radius: 6px;
    background: #e5e5e5;
}
.progress-bar {
    transition-duration: .3s;
}
</style>