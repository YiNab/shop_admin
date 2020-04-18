<template>
  <div class="user">
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="mg_state" label="状态" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button plain type="primary" size="small" icon="el-icon-edit"></el-button>
        <el-button plain type="danger" size="small" icon="el-icon-delete"></el-button>
        <el-button plain type="success" size="small" icon="el-icon-check">角色分配</el-button>
      </el-table-column>
    </el-table>
    <!-- 分页布局 -->
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
  created () {
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
      console.log(res.data)
    })
  }
}
</script>
