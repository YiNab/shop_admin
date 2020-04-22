<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    <!-- 表格展示 开始-->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <!-- 这个一列渲染展开的内容 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 暂无权限的提示 -->
          <el-row v-if="scope.row.children.length === 0">暂无权限</el-row>
          <!-- {{scope.row}} -->
          <!-- {{scope.row.children}} -->
          <!-- 先遍历拿到一级权限 -->
          <el-row class="level1" v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span="4">
              <!-- 一级权限 -->
              <el-tag @close="deletRight(scope.row,level1.id)" closable>{{level1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag
                    @close="deletRight(scope.row,level2.id)"
                    closable
                    type="success"
                  >{{level2.authName}}</el-tag>
                </el-col>
                <!-- 二级权限 -->
                <el-col :span="20">
                  <el-tag
                    @close="deletRight(scope.row,level3.id)"
                    closable
                    class="level3"
                    type="danger"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            plain
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button
            plain
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteRole(scope.row)"
          ></el-button>
          <el-button
            plain
            type="success"
            size="small"
            icon="el-icon-check"
            @click="showAssignRight(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格展示 结束-->
    <!-- 分配权限弹出框 开始 -->
    <el-dialog title="分配权限" :visible.sync="assignDialogVisible" width="40%">
      <!-- 权限的树形结构 数组 队列 栈 tree -->
      <el-tree
        ref="tree"
        :data="rightList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹出框 结束 -->
    <!-- 添加对话框开始 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="addForm" :rules="rules" label-width="80px" ref="addForm" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加对话框结束 -->
    <!-- 修改对话框开始 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="editForm" :rules="rules" label-width="80px" ref="editForm" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框结束 -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 角色数据
      roleList: [],
      // 权限数据
      rightList: [],
      // 分配权限弹出框
      assignDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      // 添加角色框是否打开
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 表单的校验规则
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      // 修改对话框状态
      editDialogVisible: false,
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      }
    }
  },
  methods: {
    // 获取角色数据
    async getRolesList () {
      let res = await this.axios({
        method: 'get',
        url: 'roles'
      })
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.roleList = data
        // console.log('查询成功', res)
      }
    },
    // 获取列表数据
    async getRightList () {
      let res = await this.axios.get('rights/tree')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rightList = data
      }
    },
    // 删除权限数据
    async deletRight (role, rightId) {
      console.log(role, rightId)
      let res = await this.axios({
        method: 'delete',
        url: `roles/${role.id}/rights/${rightId}`
      })
      let { meta: { status }, data } = res
      if (status === 200) {
        role.children = data
        this.$message.success('删除成功')
      }
    },
    // 显示分配权限对话框
    showAssignRight (role) {
      this.roleId = role.id
      this.getRightList()
      this.assignDialogVisible = true
      this.$nextTick(() => {
        let temp = []
        role.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              // 把3级的id存起来
              temp.push(l3.id)
            })
          })
        })
        // 设置setCheckedKeys目前勾选的节点
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 分配权限
    async assignRight () {
      // 获取到所有选中的id值
      let checked = this.$refs.tree.getCheckedKeys()
      // 获取的所有半选中的id
      let halfChecked = this.$refs.tree.getHalfCheckedKeys()
      // console.log(checked, halfChecked)
      // ... 扩展运算符,展开一个数组或者对象
      let all = [...checked, ...halfChecked]
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: all.join()
      })
      let { meta: { status } } = res
      if (status === 200) {
        this.assignDialogVisible = false
        // 重新渲染
        this.getRolesList()
      }
    },
    // 添加角色弹出框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加角色
    addRole () {
      console.log("'hhh'")
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 发送ajax请求
        let res = await this.axios({
          method: 'post',
          url: `roles`,
          data: this.addForm
        })
        let { meta: { status } } = res
        console.log(res)
        if (status === 201) {
          this.$refs.addForm.resetFields()
          this.addDialogVisible = false
          this.getRolesList()
          this.$message.success('添加成功')
        }
      })
    },
    // 修改对话框
    showEditDialog ({ id, roleName, roleDesc }) {
      this.editDialogVisible = true
      this.editForm.id = id
      this.editForm.roleName = roleName
      this.editForm.roleDesc = roleDesc
    },
    editRole () {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.put(`roles/${this.editForm.id}`,
          this.editForm)
        if (res.meta.status === 200) {
          // 1. 重置表单
          this.$refs.editForm.resetFields()
          // 2. 隐藏模态框
          this.editDialogVisible = false
          // 3. 重新渲染
          this.getRolesList()
          // 4. 提示成功
          this.$message.success('修改成功')
        }
      })
    },
    // 删除角色
    async deleteRole (role) {
      try {
        await this.$confirm('你确定要删除这个角色吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios({
          method: 'delete',
          url: `roles/${role.id}`
        })
        if (res.meta.status === 200) {
          this.$message.success('删除成功')
          this.getRolesList()
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
    }
  },
  created () {
    this.getRolesList()
    this.getRightList()
  }
}
</script>
<style lang='less' scope>
.level2 {
  margin-bottom: 10px;
  .level3 {
    margin-right: 10px;
    margin-bottom: 5px;
  }
}
</style>
