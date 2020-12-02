<template>
    <div class="practice">
        <div class="alert alert-secondary" v-if="!hasPractice">
            There is currently no active practice
        </div>
        <div
            class="progress practice-holder m-auto shadow-sm"
            v-if="hasPractice"
        >
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
                <div class="card-body d-flex flex-column" v-if="complete">
                    <h2 class="text-success">Practice complete!</h2>

                    <table>
                        <tr>
                            <td class="text-muted">Correct words</td>
                            <td>{{ correctWords }}</td>
                        </tr>
                        <tr>
                            <td class="text-muted">Wrong words</td>
                            <td>{{ wrongWords }}</td>
                        </tr>
                    </table>

                    <Button
                        class="btn-success d-block w-100 mt-auto"
                        text="Exit"
                        v-on:click="exit"
                    />
                </div>
                <div
                    class="card-body d-flex flex-column"
                    v-if="showsResults && !complete"
                >
                    <h2
                        :class="{
                            'text-danger': isWrong,
                            'text-success': !isWrong,
                        }"
                    >
                        {{ isWrong ? 'Wrong' : 'Correct' }}
                    </h2>
                    <table>
                        <tr v-if="currentInput">
                            <td class="text-muted pb-2">Answer</td>
                            <td class="pb-2">{{ currentInput }}</td>
                        </tr>
                        <tr v-if="currentWord.data.foreign">
                            <td class="text-muted">Foreign</td>
                            <td>{{ currentWord.data.foreign }}</td>
                        </tr>
                        <tr v-if="currentWord.data.synonym">
                            <td class="text-muted">Synonyms</td>
                            <td>{{ currentWord.data.synonym }}</td>
                        </tr>
                        <tr v-if="currentWord.data.gender">
                            <td class="text-muted">Gender</td>
                            <td>{{ currentWord.data.gender }}</td>
                        </tr>
                        <tr v-if="currentWord.data.native">
                            <td class="text-muted">Native</td>
                            <td>{{ currentWord.data.native }}</td>
                        </tr>
                        <tr v-if="currentWord.data.comment">
                            <td class="text-muted">Comment</td>
                            <td>{{ currentWord.data.comment }}</td>
                        </tr>
                    </table>

                    <Button
                        class="btn-secondary d-block w-100 mt-auto"
                        text="This was correct"
                        v-on:click="forceCorrect"
                    />
                    <Button
                        class="btn-success d-block w-100 mt-2"
                        text="Next"
                        v-on:click="next"
                    />
                </div>

                <div class="card-body" v-if="!showsResults && !complete">
                    <h2 class="lang-jp text-center">{{ currentPrompt }}</h2>

                    <div class="input-group">
                        <input
                            type="text"
                            id="vocabInput"
                            class="form-control my-5 lang-jp mx-lg-5"
                            placeholder="Translation"
                            v-model="currentInput"
                            autocomplete="off"
                        />
                    </div>

                    <Button
                        class="btn-secondary d-block w-100 mt-auto"
                        text="I don't know"
                        v-on:click="dontKnow"
                        :disabled="showsResults"
                    />
                    <Button
                        class="btn-success d-block w-100 mt-2"
                        text="Check"
                        v-on:click="check"
                        :disabled="showsResults"
                    />
                </div>
                <span class="text-muted" v-if="!complete">
                    Lesson: {{ lesson }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import Button from '@/components/Button.vue';
import axios from 'axios';

const soundCorrect = new Audio(require('../assets/correct.mp3'));
const soundWrong = new Audio(require('../assets/wrong.mp3'));

const NATIVE = 0;
const FOREIGN = 1;

/**
 * Notes on implementing the practice frontend
 * ==================================
 * - The frontend is responsible for randomizing translation direction
 *   and reporting back how often the user failed a particular word.
 * - The frontend may ask a word a few times:
 *   1. If the user inputs a translation wrongly, the word will be
 *      asked again at the end of a lesson, for a max of 3 times.
 *   2. If the user wants to be asked synoyms, a random synonym
 *      may be used as the foreign prompt. Foreign input always
 *      accepts all synonyms as well.
 *   3. If the user wants to have randomized translation direction,
 *      a word may appear multiple times, in different directions.
 *       If this setting is active, a lower number of total words per
 *      practice may be used. TODO: check if this is neccessary
 *   4. Maybe we should let the user decide on how large they want
 *      each indiviudal lesson to be.
 */

export default {
    name: 'Practice',
    data() {
        return {
            currentIndex: 0,
            currentPrompt: '',
            currentPractice: null,
            currentSolution: '',
            currentInput: '',
            currentWord: null,
            isWrong: false,
            showsResults: true,
            expects: NATIVE,
            complete: false,
        };
    },
    components: {
        Button,
    },
    computed: {
        hasPractice() {
            return this.currentPractice != null;
        },
        progress() {
            return (this.currentIndex / this.currentPractice.length) * 100;
        },
        lesson() {
            let lessons = this.$store.getters.Lessons;
            for (let lesson of lessons)
                if (lesson.id == this.currentWord.lesson) return lesson.name;

            return null;
        },
        correctWords() {
            return this.currentPractice.filter((w) => !w.ref && w.attempts == 0)
                .length;
        },
        wrongWords() {
            return this.currentPractice.filter((w) => !w.ref && w.attempts > 0)
                .length;
        },
    },
    mounted() {
        this.currentPractice = this.$store.getters.CurrentPractice;
        this.next();
        document.onkeyup = function (e) {
            if (e.keyCode == 13) this.checkOrNext();
        }.bind(this);
    },
    methods: {
        splitPossibilities(solution) {
            if (solution == null) return [];

            if (solution.includes(';') || solution.includes('/')) {
                return solution.split(/[;/]+/);
            } else {
                return [solution];
            }
        },
        cleanInput(input) {
            return input
                .replace(/[.?!,_\-'":´`;]/g, '') // Drop punctuation
                .split(/[\s]+/) // Split to words
                .map((w) => w.trim()) // Trim
                .filter((w) => w.length > 0) // Remove empty words
                .join(' '); // Join back together
        },
        fuzzyMatches(input, solution) {
            let cleanIn = this.cleanInput(input);

            // It's correct, if it matches
            // 1. literally or
            let cleanRef = this.cleanInput(solution);
            
            // 2. matches everything without the optionals or
            let cleanRefNoOpt = cleanRef.replace(/ *\([^)]*\) */g, '')

            // 3. matches everything without the parentheses
            let cleanRefNoParen = cleanRef.replace(/[()]*/g, '')

            return cleanIn == cleanRef || cleanIn == cleanRefNoParen || cleanIn == cleanRefNoOpt;
        },
        isCorrect(input) {
            let solution = null;
            if (this.expects == NATIVE) solution = this.currentWord.data.native;
            else solution = this.currentWord.data.foreign;

            input = input.trim();
            solution = solution.trim();

            if (this.$store.getters.User.settings.ignoreCase) {
                input = input.toLowerCase();
                solution = solution.toLowerCase();
            }

            if (input == solution) return true;

            let possibilities = this.splitPossibilities(solution);

            if (this.expects == FOREIGN) {
                possibilities = possibilities.concat(
                    this.splitPossibilities(this.currentWord.data.synonym)
                );
            }

            return possibilities.some((s) => this.fuzzyMatches(input, s));
        },
        forceCorrect() {
            this.isWrong = false;
            this.currentWord.attempts = 0;
            soundCorrect.play();
            this.currentPractice = this.currentPractice.filter(w => w.ref == null || w.ref !== this.currentIndex - 1);
            this.next();
        },
        checkOrNext() {
            if (this.complete) this.exit();
            else if (this.showsResults) this.next();
            else this.check();
        },
        check() {
            let input = this.currentInput.trim();
            let correct = this.isCorrect(input);
            this.handleResult(correct);
        },
        dontKnow() {
            this.handleResult(false);
        },
        exit() {
            this.$router.push('/practice/select');
        },
        async handleCompletion() {
            await axios.post(
                `practice/${this.$store.getters.Language}/complete`,
                {
                    results: this.currentPractice
                        .filter((w) => w.ref == undefined)
                        .map((w) => {
                            return { wordId: w.id, attempts: w.attempts };
                        }),
                }
            );
            this.$store.commit('setPractice', null);
        },
        handleResult(correct) {
            if (this.currentWord.attempts == undefined)
                this.currentWord.attempts = 0;

            if (correct) {
                this.isWrong = false;
                soundCorrect.play();
            } else {
                this.isWrong = true;
                soundWrong.play();
                this.currentWord.attempts++;
                if (this.currentWord.attempts < 3) {
                    this.currentPractice.push({ ref: this.currentIndex - 1 });
                }
            }
            this.showResults();
        },
        showResults() {
            this.showsResults = true;
        },
        next() {
            let settings = this.$store.getters.User.settings;

            let word = this.currentPractice[this.currentIndex];
            this.currentIndex++;

            if (word == null) {
                this.complete = true;
                this.handleCompletion();
                return;
            }

            while (word.ref != null) word = this.currentPractice[word.ref];

            let translateToForeign = settings.randomizeDir
                ? Math.random() > 0.5
                : true;
            let useSynonym =
                translateToForeign &&
                word.data.synonym &&
                settings.includeSynonyms &&
                Math.random() > 0.5;

            if (useSynonym) {
                this.currentPrompt = word.data.synonym;
                this.expects = NATIVE;
            } else if (translateToForeign) {
                this.currentPrompt = word.data.foreign;
                this.expects = NATIVE;
            } else {
                this.currentPrompt = word.data.native;
                this.expects = FOREIGN;
            }
            this.currentInput = '';
            this.currentWord = word;
            this.showsResults = false;

            Vue.nextTick().then(() => {
                document.getElementById('vocabInput').focus();
            });
        },
    },
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
    transition-duration: 0.3s;
}

.card-body {
    height: 305px;
}
table {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 18px;
}
</style>
