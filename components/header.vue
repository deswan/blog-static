<template>
    <header class="header">
      <nav class="header-content">
        <a href="/" style="display: flex; align-items:center">
            <img src="~assets/img/star.png" alt="" class="header-logo">
            <h1 class="header-text">Star`s blog</h1>
        </a>
        <ul class="header-nav">
          <li class="header-nav-item">
            <a href="/poem" style="position: relative;">
              Poems
            </a>
          </li>
        </ul>
      </nav>
    </header>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.header {
  flex: none;
  height: 60px;
  line-height: 60px;
  border-bottom: solid 1px #eee;

  &-content {
    display: flex;
    align-items: center;
    margin: 0 auto;
    max-width: 80%;
    width: 600px;
  }

  &-text {
    position: relative;
    font-size: 20px;
    display: inline-block;
    height: 100%;
    font-weight: normal;
    margin: 0;
    margin-left: 10px;
  }

  &-logo {
    width: 35px;
    margin-right: 5px;
  }

  &-nav{
    font-size: 20px;
    margin: 0;
    padding: 0;
    margin-left: 100px;
  }

  &-nav-item{
    list-style: none;
  }
}
</style>
