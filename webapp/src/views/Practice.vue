<template>
    <div class="practice">
        <div class="progress practice-holder m-auto shadow-sm">
            <div
                class="progress-bar w-75"
                role="progressbar"
                aria-valuenow="75"
                aria-valuemin="0"
                aria-valuemax="100"
            ></div>
        </div>

        <div
            class="d-flex h-100 align-items-center justify-content-center flex-column"
        >
            <div class="shadow-lg p-3 bg-white mt-5 rounded w-100 practice-holder">
                <div class="card-body">
                    <h2 class="lang-jp text-center">
                        やさい
                    </h2>

                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control my-5 mx-3"
                            placeholder="Translation"
                        />
                    </div>

                    <button class="btn btn-success d-block w-100">Check</button>
                    <button class="btn btn-secondary d-block w-100 mt-4">I don't know</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 992px) {
    .practice-holder {
        width: 75% !important;
    }
}
</style>