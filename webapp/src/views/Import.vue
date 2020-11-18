<template>
    <div class="import">
        <h1>Import</h1>
        <hr />
        <p class="lead">
            Select files to import from other data formats or vocabulary
            training software
        </p>

        <div class="alert alert-secondary">
            <strong class="mb-3">Supported formats</strong>
            <ul class="mb-1">
                <li>Plain text (*.txt)</li>
                <li>Comma separated (*.csv)</li>
                <li>Vocup (*.vhf)</li>
                <li>ebVocab (*.vocab)</li>
            </ul>
        </div>
        
        <div class="input-group mb-3 mt-4">
            <div class="custom-file">
                <input
                    type="file"
                    class="custom-file-input"
                    id="importFileInput"
                    multiple
                />
                <label class="custom-file-label" for="importFileInput">
                    Choose files
                </label>
            </div>
        </div>
    </div>
</template>