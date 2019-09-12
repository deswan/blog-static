<template>
    <div class="article">
        <Header />
        <section class="title">
            <h1 class="title-h1">{{article.title}}</h1>
            <p class="title-date">
                <SvgTime class="title-date-logo" />
                <span>{{article.modified_date}}</span>   
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
.header{
    text-align: center;
    .header-img{
        margin-top: 22px;
        width: 40px;
    }
}
.title{
    max-width: 100%;
    width: 600px;
    margin: 100px auto 120px;
    .title-h1{
        font-size: 32px;
        text-align: center;
        font-weight: normal;
        margin: 0;
    }
    .title-date{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        margin-top: 10px;
        color: #666;
    }
    .title-date-logo{
        margin-right: 5px;
    }
}
.body{
    max-width: 90%;
    width: 750px;
    margin: auto;
    text-align: left;
    font-size: 18px;
    padding-bottom: 100px;
}
</style>
