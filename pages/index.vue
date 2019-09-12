<template>
  <div class="index-page">
    <Header />
    <section class="main">
      <div class="article-item" v-for="article in items" :key="article.name">
        <a :href="$router.resolve({name: 'e-id', params:{id: article.name}}).href">
          <h2 class="article-title">{{article.title}}</h2>
        </a>
        <p class="article-date">
          <!-- <SvgTime /> -->
          <span class="article-date-text">{{article.modified_date}}</span>
        </p>
      </div>
    </section>
    <footer class="footer">
      <div class="pagination" v-if="totalPage > 1">
        <a
          href="javascript:;"
          class="pagination-last"
          :class="{disabled: page <= 1}"
          @click="lastPage"
        >
          <img src="~assets/img/arrow-left.svg" alt>
        </a>
        <div class="pagination-body">
          <a
            href="javascript:;"
            v-for="n in totalPage"
            class="pagination-number"
            :class="{active: n == page}"
            :key="n"
            @click="toPage(n)"
          >{{n}}</a>
        </div>
        <a
          href="javascript:;"
          class="pagination-next"
          :class="{disabled: page >= totalPage}"
          @click="nextPage"
        >
          <img src="~assets/img/arrow-right.svg" alt>
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { mapState } from 'vuex'
import Header from '@/components/header'
import SvgTime from '@/components/svgTime'
export default {
  name: "StarIndex",
  components:{
    Header,
    SvgTime
  },
  async fetch({ store, route, payload }) {
    if(payload){
      return store.commit('SET_ALL_ARTICLES', payload)
    }else{
      return store.dispatch("FETCH_ALL_ARTICLES", {
        page: route.params.page || 1
      });
    }
  },
  data() {
    return {
      currentYear: dayjs().format("YYYY")
    };
  },
  computed: mapState({
    page: state => state.allArticles.page,
    totalPage: state => state.allArticles.totalPage,
    items: state => state.allArticles.items,
  }),
  methods: {
    lastPage() {
      if (this.page <= 1) return;
      location.href = this.$router.resolve({
        name: "page",
        params: { page: this.page - 1 }
      }).href;
    },
    nextPage() {
      if (this.page >= this.totalPage) return;
      location.href = this.$router.resolve({
        name: "page",
        params: { page: this.page + 1 }
      }).href;
    },
    toPage(page) {
      if (page == this.page || page > this.totalPage || page < 1) return;
      location.href = this.$router.resolve({
        name: "page",
        params: { page }
      }).href;
    }
  }
};
</script>

<style lang="scss" scoped>
.index-page {
  display: flex;
  flex-flow: column nowrap;
  min-height: 100vh;
}
.main {
  flex: auto;
  max-width: 80%;
  width: 600px;
  margin: 60px auto 0;
}

.article-item {
  display: block;
  margin-top: 60px;

  &:first-child {
    margin-top: 0;
  }

  .article-title {
    transition: color ease 0.2s;
    font-size: 24px;
    font-weight: normal;
    margin: 0;
    color: #333;

    &:hover {
      color: #666;
    }
  }

  .article-date {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-top: 5px;
    color: #666;
  }
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
  font-size: 20px;
  color: #4a4a4a;
  a:link {
    color: #4a4a4a;
  }
  .pagination-last,
  .pagination-next {
    font-size: 0;
    transition: all ease 0.5s;
    transform: translateX(0);
    opacity: 0.9;

    &.disabled {
      transition: none;
      cursor: default;
      opacity: 0.4;
    }
  }
  .pagination-last img,
  .pagination-next img {
    width: 40px;
    opacity: 0.8;
  }
  .pagination-last {
    margin-right: 20px;
    &:not(.disabled):hover {
      transform: translateX(-5px);
    }
  }
  .pagination-next {
    margin-left: 20px;
    &:not(.disabled):hover {
      transform: translateX(5px);
    }
  }
  .pagination-body {
    display: inline-block;
  }
  .pagination-number {
    text-align: center;
    margin-right: 20px;
    display: inline-block;
    width: 35px;
    height: 35px;
    transition: all ease 0.5s;
    line-height: 35px;
    border-radius: 5px;
    user-select: none;

    &:not(.active):hover {
      background-color: #f2f2f2;
    }

    &.active {
      cursor: default;
      font-weight: bold;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
.footer {
  flex: none;
  overflow: hidden;
  padding-bottom: 50px;
}
.inform {
  position: relative;
  margin: 30px 0 30px;
  .views {
    font-size: 18px;
    color: #999;
  }
}
</style>
