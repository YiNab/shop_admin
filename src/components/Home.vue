<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="logout">
        欢迎光临
        <a href="javascript:;" v-on:click="logout">退出</a>
      </div>
      <h1 class="title">电商后台管理系统</h1>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="1-1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <el-submenu v-for="menu in menuList" v-bind:key="menu.id" :index="menu.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item v-for="item in menu.children" :index="item.path" :key="item.id">
              <i class="el-icon-location"></i>
              <span slot="title">{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    logout () {
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除token
        localStorage.removeItem('token')
        this.$router.push('/login')
        // 退出成功
        this.$message({
          type: 'success',
          message: '退出成功'
        })
      }).catch(() => {
        this.$message.error('取消退出操作')
      })
    }
  },
  async created () {
    let res = await this.axios.get('menus')
    let {
      meta: { status },
      data
    } = res
    if (status === 200) {
      this.menuList = data
    }
    // console.log(res)
  }
}
</script>
<style lang="less" scope>
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    .logo {
      width: 180px;
      height: 60px;
      float: left;
      background-image: url('../assets/images/logo.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .logout {
      width: 180px;
      height: 60px;
      float: right;
      line-height: 60px;
      font-weight: 700;
      a {
        color: darkorange;
      }
    }
    .title {
      height: 60px;
      overflow: hidden;
      text-align: center;
      line-height: 60px;
      color: aliceblue;
      font-size: 30px;
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
