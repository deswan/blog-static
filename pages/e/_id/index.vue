<template>
    <div class="article">
        <Header />
        <section class="title">
            <h1 class="title-h1">{{data.title}}</h1>
            <p class="title-date">
                <span>{{data.modified_date}}</span>   
            </p>
        </section>
        <section class="body md" v-html="data.document">
        </section>
    </div>
</template>

<script>
import dayjs from "dayjs";
import { mapState } from 'vuex'
import Header from '@/components/header'
import SvgTime from '@/components/svgTime'
import axios from '~/plugins/axios';

export default {
    name: 'StarArticle',
    components:{
        Header,
        SvgTime
    },
    head(){
        return {
            title: this.data.title,
            titleTemplate: '%s | Star`s Blog'
        }
    },
    async asyncData({ store, route, payload }){
        let data
        if(payload){
            data = payload
        }else{
            data = await axios.get(`/api/blog/get`, {
                params: { id: route.params.id }
            }).then(res => res.data)
        }
        return { data }
    },
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
        justify-content: flex-end;
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
    width: 800px;
    margin: auto;
    text-align: left;
    font-size: 16px;
    padding-bottom: 100px;
}
</style>
