<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格内容 -->
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="mg_state" label="状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button plain type="primary" size="small" icon="el-icon-edit"></el-button>
        <el-button plain type="danger" size="small" icon="el-icon-delete"></el-button>
        <el-button plain type="success" size="small" icon="el-icon-check">角色分配</el-button>
      </el-table-column>
    </el-table>
    <!-- 分页布局 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      users: []
    }
  },
  methods: {
    // 获取用户数据
    getUserList () {
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize

        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then((res) => {
        if (res.data.meta.status === 200) {
          this.users = res.data.data.users
          this.total = res.data.data.total
        }
        // console.log(res.data)
      })
    },
    // 每页的显示的条数
    handleSizeChange (val) {
      console.log('每页显示的条数', val)
      this.currentPage = 1
      this.pageSize = val
      this.getUserList()
    },
    // 点击获取当前页
    handleCurrentChange (val) {
      console.log('当前页为', val)
      this.currentPage = val
      this.getUserList()
    },
    // 修改用户的状态
    changeState (user) {
      // 发送axios请求
      axios({
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
        method: 'put',
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success('状态修改成功')
        } else {
          this.$message.error('状态修改失败')
        }
      }).catch(err => {
        console.log('修改失败', err)
      })
    }
  },
  created () {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}

.el-input {
  width: 400px;
  margin-bottom: 10px;
}
</style>
