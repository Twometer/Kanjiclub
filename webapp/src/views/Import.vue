<template>
    <div class="import">
        <h1>Import</h1>
        <hr />
        <p class="lead">
            Select files to import from other data formats or vocabulary
            training software
        </p>

        <div class="alert alert-secondary">
            <div class="d-flex w-100 justify-content-between">
                <strong>Supported formats</strong>
                <a
                    class="text-primary"
                    href="https://twometer.github.io/Kanjiclub/adding-vocabulary/#2-custom-text-data"
                    target="_blank"
                    rel="noopener"
                    >Need help?</a
                >
            </div>
            <ul class="mb-1">
                <li>Plain text with template (*.txt)</li>
                <!-- <li>Comma separated (*.csv)</li> -->
                <li>Vocup (*.vhf)</li>
                <li>ebVocab (*.vocab)</li>
            </ul>
        </div>

        <div class="alert alert-success" role="alert" v-if="success">
            Files successfully imported
        </div>

        <div class="alert alert-warning" role="alert" v-if="error">
            You have to select some files first
        </div>

        <form class="d-flex mb-3 mt-4" @submit.prevent="upload">
            <div class="input-group flex-grow-1 shadow">
                <div class="custom-file">
                    <input
                        type="file"
                        class="custom-file-input"
                        id="importFileInput"
                        multiple
                        :disabled="loading"
                        @change="previewFiles"
                    />
                    <label class="custom-file-label" for="importFileInput">
                        Choose files
                    </label>
                </div>
            </div>
            <button
                class="btn btn-success ml-3"
                type="submit"
                :disabled="loading"
                :class="{ disabled: loading }"
            >
                <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    v-if="loading"
                ></span>
                <span v-if="!loading">Import</span>
            </button>
        </form>

        <div class="list-group shadow mb-5">
            <div
                class="list-group-item d-flex justify-content-between align-items-center"
                v-for="file in files"
                :key="file.name"
            >
                {{ file.name }}
                <span class="badge badge-primary badge-pill">
                    {{ stateToString(file.state) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '../services/api';

const UploadState = {
    NotUploaded: 0,
    Uploading: 1,
    Completed: 2,
    AlreadyExists: 3,
    InvalidFormat: 4,
    UnknownError: 5
};

const StateStrings = [
    'Not uploaded',
    'Uploading...',
    'Completed',
    'Lesson exists',
    'Unknown format',
    'Failed'
];

function readFile(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default {
    name: 'Import',
    data() {
        return {
            files: [],
            loading: false,
            error: false,
            success: false
        };
    },
    methods: {
        previewFiles(event) {
            this.files = [];

            for (let file of event.target.files) {
                this.files.push({
                    name: file.name,
                    state: UploadState.NotUploaded,
                    obj: file
                });
            }
        },
        stateToString(state) {
            return StateStrings[state];
        },
        async upload() {
            if (this.files.length == 0) {
                this.error = true;
                return;
            }
            this.error = false;
            this.loading = true;

            let isFail = false;

            for (let file of this.files) {
                file.state = UploadState.Uploading;
                try {
                    await this.uploadFile(file.obj);
                    file.state = UploadState.Completed;
                } catch (e) {
                    switch (e.response.status) {
                        case 403:
                            file.state = UploadState.AlreadyExists;
                            break;
                        case 422:
                            file.state = UploadState.InvalidFormat;
                            break;
                        default:
                            file.state = UploadState.UnknownError;
                    }
                    isFail = true;
                }
            }

            this.loading = false;

            if (!isFail) {
                this.files = [];
                this.success = true;
            }
        },
        async uploadFile(file) {
            let data = await readFile(file);
            let lang = this.$store.getters.Language;
            await Api.Lessons.import(file.name, lang, data);
        }
    }
};
</script>
