<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain>添加角色</el-button>
    <!-- 表格展示 开始-->
    <el-table :data="roleList" style="width: 100%">
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
          <el-button plain type="primary" size="small" icon="el-icon-edit"></el-button>
          <el-button plain type="danger" size="small" icon="el-icon-delete"></el-button>
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
      roleId: ''
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
        console.log('查询成功', res)
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
