<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 收缩框 -->
    <el-input placeholder="请输入关键字" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="addUseraDialog">用户添加</el-button>
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
        <template slot-scope="scope">
          <el-button
            plain
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="editDialogUser(scope.row)"
          ></el-button>
          <el-button
            plain
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="delUser(scope.row.id)"
          ></el-button>
          <el-button plain type="success" size="small" icon="el-icon-check">角色分配</el-button>
        </template>
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
    <!-- 弹出添加对话框 -->
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <el-form ref="editForm" :model="editForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      users: [],
      // 控制添加用户的对话框的显示
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改对话框
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 表单的校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确格式的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取用户数据
    getUserList () {
      this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize

        }
      }).then((res) => {
        console.log(res)
        if (res.meta.status === 200) {
          this.users = res.data.users
          this.total = res.data.total
        }
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
      this.axios({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: 'put'
      }).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('状态修改成功')
        } else {
          this.$message.error('状态修改失败')
        }
      }).catch(err => {
        console.log('修改失败', err)
      })
    },
    // 搜索功能
    search () {
      this.currentPage = 1
      this.getUserList()
    },
    // 显示添加的对话框
    addUseraDialog () {
      this.addDialogVisible = true
    },
    // 用户添加
    addUser () {
      this.$refs.addForm.validate(valid => {
        if (!valid) return false
        // 成功
        this.axios({
          url: `users`,
          method: 'post',
          data: this.addForm
        }).then(res => {
          console.log(res)
          if (res.meta.status === 201) {
            this.$message.success('添加成功')
            // 重新渲染最后一页
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            // 重新渲染
            this.getUserList()
            // 隐藏模块框
            this.addDialogVisible = false
            // 清空表单
            this.$refs.addForm.resetFields()
          }
        }).catch((err) => {
          console.log('添加失败', err)
          this.$message.error('添加失败')
        })
      })
    },
    // 显示修改的对话框
    editDialogUser (user) {
      this.editDialogVisible = true
      // 让数据回显
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    // 修改用户
    editUser () {
      this.$refs.editForm.validate(valid => {
        if (!valid) return false
        this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        }).then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            this.getUserList()
            this.$message.success('编辑 成功')
            this.$refs.editForm.resetFields()
            this.editDialogVisible = false
          }
        })
      })
    },
    // 删除用户
    delUser (id) {
      this.$confirm('你确定要删除这个用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.axios({
          method: 'delete',
          url: `users/${id}`
        })
      }).then(res => {
        if (res.meta.status === 200) {
          if (this.users.length === 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getUserList()
          this.$message.success('删除成功')
        }
      }).catch(() => {
        this.$message.error('你取消了删除操作')
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
