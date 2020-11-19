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
    }


}