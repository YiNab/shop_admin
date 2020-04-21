<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加权限 -->
    <el-button type="success" plain>添加权限</el-button>
    <!-- 显示权限数据的表格 开始 -->
    <template>
      <el-table :data="rightList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="层级" prop="level">
          <template slot-scope="scope">
            <span v-if="scope.row.level==='0'">一级</span>
            <span v-if="scope.row.level==='1'">二级</span>
            <span v-if="scope.row.level==='2'">三级</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 显示权限数据的表格 结束 -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightlist () {
      let res = await this.axios.get('rights/list')
      console.log('woshi', res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rightList = data
      }
    }
  },
  created () {
    this.getRightlist()
  }
}
</script>
