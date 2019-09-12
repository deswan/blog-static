import api from '../util/api';

export default {
    state() {
        return {
            allArticles: {},
            article: {},
            poems: []
        }
    },
    mutations: {
        SET_ARTICLE(state, article) {
            state.article = article;
        },
        SET_ALL_ARTICLES(state, allArticles) {
            state.allArticles = allArticles;
        },
        SET_ALL_POEMS(state, list) {
            state.poems = list;
        },
    },
    actions: {
        FETCH_ARTICLE({ commit }, { id }) {
            return api.get(`/api/blog/get`, {
                params: { id }
            }).then(res => {
                commit('SET_ARTICLE', res.data);
            })
        },
        FETCH_ALL_ARTICLES({ commit }, { page }) {
            return api.get(`/api/blog/list`, {
                params: { page }
            }).then(res => {
                commit('SET_ALL_ARTICLES', res.data);
            })
        },
        FETCH_ALL_POEMS({ commit }) {
            return api.get(`/api/poems/list`).then(res => {
                commit('SET_ALL_POEMS', res.data);
            })
        }
    },
}
