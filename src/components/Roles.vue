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
          <el-button plain type="success" size="small" icon="el-icon-check">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格展示 结束-->
  </div>
</template>
<script>
export default {
  data () {
    return {
      roleList: []
    }
  },
  methods: {
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
    }
  },
  created () {
    this.getRolesList()
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
