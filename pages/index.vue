<template>
  <div class="index-page">
    <Header />
    <section class="main">
      <div class="article-item" v-for="article in data.items" :key="article.name">
        <a
          :href="$router.resolve({name: 'e-id', params:{id: article.name}}).href"
          class="article-link"
        >
          <h2 class="article-title">{{article.title}}</h2>
          <p class="article-date">
            <!-- <SvgTime /> -->
            <span class="article-date-text">{{article.modified_date}}</span>
          </p>
        </a>
      </div>
    </section>
    <footer class="footer">
      <div class="pagination" v-if="data.totalPage > 1">
        <a
          href="javascript:;"
          class="pagination-last"
          :class="{disabled: data.page <= 1}"
          @click="lastPage"
        >
          <img src="~assets/img/arrow-left.svg" alt />
        </a>
        <div class="pagination-body">
          <a
            href="javascript:;"
            v-for="n in data.totalPage"
            class="pagination-number"
            :class="{active: n == data.page}"
            :key="n"
            @click="toPage(n)"
          >{{n}}</a>
        </div>
        <a
          href="javascript:;"
          class="pagination-next"
          :class="{disabled: data.page >= data.totalPage}"
          @click="nextPage"
        >
          <img src="~assets/img/arrow-right.svg" alt />
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { mapState } from "vuex";
import Header from "@/components/header";
import SvgTime from "@/components/svgTime";
import api from '@/util/api';

export default {
  name: "StarIndex",
  components: {
    Header,
    SvgTime
  },
  async asyncData({ store, route, payload }) {
    let data;
    if (payload) {
      data = payload;
    } else {
      data = await api.get(`/api/blog/list`, { params: { page: route.params.page || 1 } })
        .then(res => res.data);
    }
    return { data }
  },
  data() {
    return {
      currentYear: dayjs().format("YYYY"),
      data: {
        page: 1,
        totalPage: 0,
        items: []
      }
    };
  },
  methods: {
    lastPage() {
      if (this.data.page <= 1) return;
      location.href = this.$router.resolve({
        name: "page",
        params: { page: this.data.page - 1 }
      }).href;
    },
    nextPage() {
      if (this.data.page >= this.data.totalPage) return;
      location.href = this.$router.resolve({
        name: "page",
        params: { page: this.data.page + 1 }
      }).href;
    },
    toPage(page) {
      if (page == this.data.page || page > this.data.totalPage || page < 1) return;
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
  max-width: 90%;
  width: 600px;
  margin: 60px auto 0;
}

.article-item {
  display: block;
  margin-top: 40px;

  &:first-child {
    margin-top: 0;
  }

  .article-title {
    transition: color ease 0.2s;
    font-size: 24px;
    font-weight: normal;
    margin: 0;
    color: #333;
  }

  .article-date {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-top: 5px;
    color: #666;
  }
}

.article-link {
  display: block;
  padding: 25px 0px;

  &:hover {
    .article-title {
      color: #999;
    }
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
