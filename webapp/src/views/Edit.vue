<template>
    <div class="edit">
        <h1>
            {{ lessonName }}
            <div class="float-right">
                <button class="btn btn-dark btn-sm mr-2">Rename</button>
                <button class="btn btn-danger btn-sm">Delete</button>
            </div>
            <div class="clearfix"></div>
        </h1>
        <hr />

        <spinner v-if="loading" />

        <div class="editor" v-if="!loading">

            <div class="editor-table mb-3 shadow">
                <table class="table table-sm table-hover">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">Foreign</th>
                            <th scope="col">Synonyms</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Native</th>
                            <th scope="col">Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="word in words" :key="word.id" :class="{ 'table-active': word.id == currentWord.id }" v-on:click="selectWord(word)">
                            <td class="lang-jp">{{ word.data.foreign }}</td>
                            <td class="lang-jp">{{ word.data.synonym }}</td>
                            <td class="lang-jp">{{ word.data.gender }}</td>
                            <td class="lang-jp">{{ word.data.native }}</td>
                            <td class="lang-jp">{{ word.data.comment }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="btn-bar mb-3 text-center">
                <button class="btn btn-success mx-2" v-on:click="addOrUpdate">{{ isEditing ? 'Update' : 'Add' }}</button>
                <button class="btn btn-warning mx-2" v-if="isEditing" v-on:click="deselect()">Cancel edit</button>
                <button class="btn btn-danger mx-2" :class="{ disabled: !isEditing }" :disabled="!isEditing" v-on:click="remove()">Remove</button>
            </div>

            <div class="input-group mb-3">
                <input type="text" class="form-control lang-jp" placeholder="Foreign" v-model="currentWord.data.foreign" />
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control lang-jp" placeholder="Synonyms" v-model="currentWord.data.synonym"/>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control lang-jp" placeholder="Gender" v-model="currentWord.data.gender"/>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control lang-jp" placeholder="Native" v-model="currentWord.data.native"/>
            </div>
            <div class="input-group mb-3">
                <textarea class="form-control lang-jp" placeholder="Comment" rows="4" v-model="currentWord.data.comment">
                </textarea>
            </div>

        </div>
    </div>
</template>

<script>
import Spinner from '../components/Spinner.vue';
import Api from '../services/api'

function makeEmptyWord() {
    return { id: null, data: { foreign: null, synonym: null, gender: null, native: null, comment: null } };
}

function cloneWord(word) {
    let clonedData = {};
    Object.assign(clonedData, word.data);
    
    return { id: word.id, data: clonedData };
}

export default {
  components: { Spinner },
    data() {
        return {
            loading: true,
            words: [],
            currentWord: makeEmptyWord(),
            currentWordItem: null
        }
    },
    computed: {
        lessonId() {
            return this.$route.params.lessonId;
        },
        lessonName() {
            let lessonId = this.$route.params.lessonId;
            let lessons = this.$store.getters.Lessons;
            for (let lesson of lessons)
                if (lesson.id == lessonId)
                    return lesson.name;
            return "Unknown lesson";
        },
        isEditing() {
            return this.currentWord.id !== null;
        }
    },
    async mounted() {
        let lang = this.$store.getters.Language;
        let lessonId = this.$route.params.lessonId;

        this.words = (await Api.Words.getByLesson(lang, lessonId)).data;
        this.loading = false;
    },
    methods: {
        selectWord(word) {
            this.currentWord = cloneWord(word);
            this.currentWordItem = word;
        },
        deselect() {
            this.currentWord = makeEmptyWord();
        },
        async addOrUpdate() {
            if (this.currentWord.data.foreign.trim().length == 0 || this.currentWord.data.native.trim().length == 0)
                return;

            if (this.isEditing) {
                await Api.Words.edit(this.currentWord.id, this.currentWord.data);
                this.currentWordItem.data = this.currentWord.data;
            } else {
                let lessonId = this.$route.params.lessonId;
                this.currentWord.id = (await Api.Words.create(lessonId, this.currentWord.data)).data.id;
                this.words.push(this.currentWord);
            }
            this.deselect();
        },
        async remove() {
            if (this.isEditing) {
                await Api.Words.delete(this.currentWord.id);
                this.words = this.words.filter(w => w.id != this.currentWord.id);
                this.deselect();
            }
        }
    }
}
</script>

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

tr {
    cursor: pointer;
}
</style>