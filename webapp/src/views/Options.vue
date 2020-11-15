<template>
    <div class="options">
        <h1>Options</h1>
        <hr />

        <div class="shadow p-3 bg-white mt-5 rounded">
            <div class="card-body">
                <h2>Username</h2>
                email address
            </div>
        </div>

        <h3 class="mt-5 clearfix">Practice<button class="btn btn-success float-right">Save</button></h3>
        <hr />
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="ignoreCasing">
            <label class="form-check-label" for="ignoreCasing">Ignore casing for native language</label>
        </div>
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="randomizeDir" checked>
            <label class="form-check-label" for="randomizeDir">Randomize translation direction</label>
        </div>
    </div>
</template>