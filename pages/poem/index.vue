<template>
    <div class="article">
        <Header />
        <section class="main">
            <ul>
                <li class="item" v-for="(item, idx) in data" :key="idx">
                    <div class="item-head">
                        <div class="item-head-v"></div>
                        <div class="item-head-h"></div>
                        <div class="item-head-date">{{item.created_date | date}}</div>
                    </div>
                    <div class="item-content">
                        <article class="poem">
                            <h4 class="poem-title" v-if="item.title">{{item.title}}</h4>
                            <div v-html="item.document" class="poem-md"></div>
                        </article>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
import dayjs from "dayjs";
import { mapState } from 'vuex'
import Header from '@/components/header'
import axios from '~/plugins/axios';

export default {
    name: 'Poem',
    head: {
        title: 'Star`s Poems'
    },
    components:{
        Header,
    },
    filters:{
        date(d){
            return dayjs(d).format('YYYY/MM/DD')
        }
    },
    async asyncData({ store, route, payload }){
        let data
        if(payload){
            data = payload
        }else{
            data = await axios.get(`/api/poems/list`).then(res => res.data)
        }
        return { data }
    },
}
</script>

<style lang="scss" scoped>

.main {
    flex: auto;
    max-width: 80%;
    width: 800px;
    margin: 60px auto;
}
.item{
    position: relative;
    display: flex;
}
.item-head{
    @media screen and (max-width: 750px) {
        display: none;
    }
}
.item-head-v{
    position: relative;
    z-index: 1;
    height: 100%;
    min-height: 300px;
    width: 1px;
    background: #eee;

    &::after{
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        background: #eee;
        border-radius: 50%;
    }
}
.item-head-h{
    position: absolute;
    top: 50%;
    height: 1px;
    width: 100px;
    background:#eee;
}
.item-head-date{
    position: absolute;
    z-index: 2;
    font-size: 13px;
    color: #999;
    top: 50%;
    margin-left: 10px;
    transform: translateY(-150%);
}
.item-content{
    display: flex;
    align-items: center;
    flex: auto;
    margin: 0 150px;
    @media screen and (max-width: 750px) {
        margin: 0
    }
}
.poem{
    padding: 30px 0;
    text-align: center;
    flex: auto;
    font-size: 16px;
}
.poem-title{
}
</style>
