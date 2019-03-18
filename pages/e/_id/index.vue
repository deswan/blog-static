<template>
    <div class="article">
        <Header />
        <section class="title">
            <h1 class="title-h1">{{article.title}}</h1>
            <p class="title-date">
                <SvgTime />
                <span style="vertical-align:middle">{{article.modified_date}}</span>   
            </p>
        </section>
        <section class="body md" v-html="article.document">
        </section>
    </div>
</template>

<script>
import dayjs from "dayjs";
import { mapState } from 'vuex'
import Header from '@/components/header'
import SvgTime from '@/components/svgTime'

export default {
    name: 'StarArticle',
    components:{
        Header,
        SvgTime
    },
    async fetch({ store, route, payload }){
        if(payload){
            return store.commit('SET_ARTICLE', payload)
        }else{
            return store.dispatch('FETCH_ARTICLE', {id: route.params.id})
        }
    },
    computed: mapState(['article'])
}
</script>

<style lang="scss" scoped>
.article{
    max-width: 90%;
    margin: auto;
}
.header{
    text-align: center;
    .header-img{
        margin-top: 22px;
        width: 40px;
    }
}
.title{
    font-size: 18px;
    max-width: 100%;
    width: 600px;
    margin: 60px auto 0;
    .title-h1{
        font-weight: normal;
        margin: 0;
    }
    .title-date{
        font-size: 16px;
        text-align: center;
        margin-top: 10px;
        color: #666;
    }
}
.body{
    max-width: 100%;
    width: 650px;
    margin: auto;
    padding: 120px 0;
    text-align: left;
    font-size: 18px;
}
</style>
