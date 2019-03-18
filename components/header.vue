<template>
    <header class="header">
        <a href="/">
            <h1 class="header-text">Star`s
                <span class="header-text-last">Blog</span>
            </h1>
        </a>
    </header>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
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
</style>
