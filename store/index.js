import api from '../util/api';

export default {
    state(){
        return {
            allArticles:{},
            article:{}
        }
    },
    mutations: {
        SET_ARTICLE(state, article){
            state.article = article;
        },
        SET_ALL_ARTICLES(state, allArticles){
            state.allArticles = allArticles;
        }
    },
    actions: {
        FETCH_ARTICLE({ commit }, { id }){
            return api.get(`/api/article`, {
                params: { id }
            }).then(res=>{
                commit('SET_ARTICLE', res.data);
            })
        },
        FETCH_ALL_ARTICLES({ commit }, { page }){
            return api.get(`/api/articles`, {
                params: { page }
            }).then(res=>{
                commit('SET_ALL_ARTICLES', res.data);
            })
        }
    },
}
