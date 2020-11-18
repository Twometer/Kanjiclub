import axios from 'axios'

export default {

    Lessons: {
        get(lang) {
            return axios.get('lessons', { params: { lang: lang } })
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