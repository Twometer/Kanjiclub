<template>
    <div class="edit">
        <h1>Edit</h1>
        <hr />

        <div class="editor-table mb-3 shadow">
            <table class="table table-sm table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Foreign</th>
                        <th scope="col">Synonyms</th>
                        <th scope="col">Gender</th>
                        <th scope="col">Native</th>
                        <th scope="col">Comment</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="index in 50" :key="index">
                        <th scope="row">{{ index }}</th>
                        <td class="lang-jp">野菜</td>
                        <td class="lang-jp">やさい</td>
                        <td></td>
                        <td>vegetable</td>
                        <td class="lang-jp"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="btn-bar mb-3 text-center">
            <button class="btn btn-success mr-2">Add</button>
            <button class="btn btn-danger ml-2">Remove</button>
        </div>

        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Foreign" />
        </div>
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Synonyms" />
        </div>
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Gender" />
        </div>
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Native" />
        </div>
        <div class="input-group mb-3">
            <textarea class="form-control" placeholder="Comment" rows="4">
            </textarea>
        </div>
    </div>
</template>

<style scoped>
.editor-table {
    overflow-y: auto;
    height: 350px;
    width: 100%;
}
@media (max-height: 830px) {
    .editor-table {
        height: 250px;
    }
}

@media (max-height: 730px) {
    .editor-table {
        height: 200px;
    }
}
</style>