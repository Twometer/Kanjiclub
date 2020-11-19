import axios from 'axios'

export default {

    Lessons: {
        get(lang) {
            return axios.get('lessons', { params: { lang: lang } })
        },
        create(name, lang) {
            return axios.post('lessons/new', { name: name, language: lang })
        }
    },

    Languages: {
        get() {
            return axios.get('languages');
        },
        getSupported() {
            return axios.get('languages/all')
        },
        new(code) {
            return axios.post('languages/new', { languageCode: code })
        }
    },

    Words: {
        getByLesson(lang, lessonId) {
            return axios.get('words', { params: { lang: lang, lesson: lessonId } })
        },
        getByStrength(lang, strength) {
            return axios.get('words', { params: { lang: lang, strength: strength } })
        },
        create(lessonId, data) {
            return axios.post('words/new', {
                lesson: lessonId,
                data: data
            })
        },
        edit(wordId, data) {
            return axios.put(`words/${wordId}`, { data: data })
        },
        delete(wordId) {
            return axios.delete(`words/${wordId}`)
        }
    }


}