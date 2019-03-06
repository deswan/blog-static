<template>
	<div class="index-page">
		<header class="header">
			<h1 class="header-text">Star`s <span class="header-text-last">Blog</span></h1>
		</header>
		<section class="main">
			<div class="year-list" v-for="yearData in items" :key="yearData.year">
				<div class="year" v-if="currentYear != yearData.year">- {{yearData.year}} -</div>
                <div class="article-item" v-for="article in yearData.items" :key="article.name">
                    <a :href="$router.resolve({name: 'e-id', params:{id: article.name}}).href">
                        <h2 class="article-title">{{article.title}}</h2>
                    </a>
                    <p class="article-date">
                        <img src="~assets/img/time.svg" class="article-date-logo" alt="">
                        <span class="article-date-text">{{article.modified_date}}</span>   
                    </p>
                </div>
			</div>
		</section>
		<footer class="footer">
			<div class="pagination" v-if="totalPage">
				<a href="javascript:;" class="pagination-last" :class="{disabled: page <= 1}" @click="lastPage">
					<img src="~assets/img/arrow-left.svg" alt="">
				</a>
				<div class="pagination-body">
					<a href="javascript:;" class="pagination-number" :class="{active: n == page}" v-for="n in totalPage" :key="n" @click="toPage(n)">{{n}}</a>
				</div>
				<a href="javascript:;" class="pagination-next" :class="{disabled: page >= totalPage}" @click="nextPage">
					<img src="~assets/img/arrow-right.svg" alt="">
				</a>
			</div>
		</footer>
	</div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "StarIndex",
  async fetch({ store, route }) {
    return store.dispatch("FETCH_ALL_ARTICLES", {
      page: route.query.page || 1
    });
  },
  watchQuery: ['page'],
  data() {
    return {
      page: 1,
      totalPage: 1,
      currentYear: dayjs().format('YYYY')
    };
	},
	beforeRouteUpdate(to, from, next){
		this.page = parseInt(to.query.page || 1);
		next();
	},
  created() {
    this.page = parseInt(this.$route.query.page || 1);
    this.totalPage = this.$store.state.allArticles.totalPage;
  },
  computed: {
    items() {
      let rawItems = this.$store.state.allArticles.items;
      let items = [];
      rawItems.forEach(e => {
        let year = dayjs(e.modified_date).year();
        if (!items.length || items[items.length - 1].year !== year) {
          items.push({ year, items: [e] });
        } else {
					items[items.length - 1].items.push(e);
        }
      });
      return items;
    }
  },
  methods: {
    lastPage() {
			if (this.page <= 1) return;
      location.href = this.$router.resolve({
        query: { page: this.page - 1 }
      }).href
    },
    nextPage() {
      if (this.page >= this.totalPage) return;
      location.href = this.$router.resolve({
        query: { page: this.page + 1 }
      }).href
    },
    toPage(page) {
      if (page == this.page || page > this.totalPage || page < 1) return;
      location.href = this.$router.resolve({
        query: { page }
      }).href
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
.header {
  flex: none;
  height: 80px;
  line-height: 80px;
  text-align: center;
  &-text {
    position: relative;
    font-size: 20px;
    display: inline-block;
    height: 100%;
    font-weight: normal;
    margin: 0;
  }
  &-text::after {
    position: absolute;
    content: "";
    width: 40px;
    background: url("~assets/img/star.png") center / 100% auto no-repeat;
    top: 0;
    left: 60px;
    height: 100%;
  }
  &-text-last {
    margin-left: 60px;
  }
}
.main {
    flex: auto;
    max-width: 90%;
    width: 700px;
    margin: 20px auto 0;
}
.year-list:not(:first-child){
	margin-top: 80px;
}
.year {
    user-select: none;
    margin: 10px auto;
    font-size: 20px;
    font-weight: bold;
    color: #ddd;
    line-height: 1;
}
.article-item {
	display: block;
	padding: 10px 0;
	margin: 40px 20px 0;

	&:first-of-type{
		margin-top: 0;
	}
	
	.article-title{
	    transition: color ease .2s;
		font-size: 24px;
		font-weight: normal;
		margin: 0;
    	color: #333;

        &:hover{
                color: #999;
        }
	}

	.article-date {
		text-align: center;
		margin-top: 10px;
    	color: #666;
	}
	.article-date-logo {
		height: 16px;
		margin-right: 5px;
		vertical-align: middle;
	}
	.article-date-text {
		vertical-align: middle;
	}
}
.pagination {
	display: flex;
	align-items: center;
	justify-content: center;
    margin-top: 60px;
    font-size: 20px;
    color: #4a4a4a;
    a:link {
        color: #4a4a4a;
    }
    .pagination-last,
    .pagination-next {
		font-size: 0;
		transition: all ease .5s;
		transform: translateX(0);
		&.disabled {
			transition: none;
			cursor: default;
			opacity: .4;
		}
	}
	.pagination-last img,
    .pagination-next img{
		width: 40px;
		opacity: .8;
    }
    .pagination-last {
		margin-right: 20px;
		&:not(.disabled):hover{
			transform: translateX(-5px);
		}
    }
    .pagination-next {
		margin-left: 20px;
		&:not(.disabled):hover{
			transform: translateX(5px);
		}
    }
    .pagination-body {
        display: inline-block;
    }
    .pagination-number {
		margin-right: 20px;
		display: inline-block;
		width: 35px;
		height: 35px;
		transition: all ease .5s;	
		line-height: 35px;
		border-radius: 5px;
		user-select: none;

		&:not(.active):hover{
			background-color: #f2f2f2;
		}
		
		&.active{
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
