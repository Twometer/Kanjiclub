<template>
    <div class="settings">
        <h1>Settings</h1>
        <hr />

        <h3 class="mt-5 clearfix">
            Languages
            <router-link to="/language">
                <button class="btn btn-success float-right">Add</button>
            </router-link>
        </h3>
        <hr />
        <ul class="list-group shadow clearfix">
            <li class="list-group-item active">
                Japanese
                <button class="btn btn-secondary btn-sm float-right disabled" disabled>
                    Current
                </button>
            </li>
            <li class="list-group-item">
                English
                <button class="btn btn-secondary btn-sm float-right">
                    Switch
                </button>
            </li>
            <li class="list-group-item">
                Polish
                <button class="btn btn-secondary btn-sm float-right">
                    Switch
                </button>
            </li>
        </ul>

        <h3 class="mt-5 clearfix">
            Practice<button class="btn btn-success float-right">Apply</button>
        </h3>
        <hr />
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="includeSynonyms" />
            <label class="form-check-label" for="includeSynonyms">Include synonyms in test</label>
        </div>
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="randomizeDir" />
            <label class="form-check-label" for="randomizeDir">Randomize translation direction</label>
        </div>
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="ignoreCase" />
            <label class="form-check-label" for="ignoreCase">Ignore case in native language</label>
        </div>

        <h3 class="mt-5">About</h3>
        <hr />
        <p>Kanjiclub version 0.1.0</p>
        <p class="text-muted">made by <a href="https://github.com/Twometer/Kanjiclub">Twometer</a></p>
        <p class="text-muted">Icons by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> flaticon.com</a></p>
    </div>
</template>

<style scoped>

</style>