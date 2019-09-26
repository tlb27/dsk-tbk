<template>
  <div class="search-content">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'OrderLayout',
  data() {
    return {
      tabs: {
        items: [
          {
            key: '1',
            title: '拼多多'
          },
          {
            key: '2',
            title: '淘宝客'
          }
        ],
        active: () => {
          switch (this.$route.path) {
            case '/list/order/pdd':
              return '1'
            case '/list/order/tbk':
              return '2'
            default:
              return '1'
          }
        },
        callback: (key) => {
          switch (key) {
            case '1':
              this.$router.push('/list/order/pdd')
              break
            case '2':
              this.$router.push('/list/order/tbk')
              break
            default:
              this.$router.push('/workplace')
          }
        }
      },
      search: true
    }
  },
  computed: {

  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .search-head{
    background-color: #fff;
    margin: -25px -24px -24px;
    .search-input{
      text-align: center;
      margin-bottom: 16px;
    }
  }
  .search-content{
    margin-top: 48px;
  }
</style>
