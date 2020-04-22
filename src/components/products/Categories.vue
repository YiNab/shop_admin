<template>
  <div class="categories">
    <el-button type="success">添加分类</el-button>
    <el-table
      v-loading="loading"
      :data="categoryList"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      width="100%"
    >
      <!-- childKey: 指定子元素集合的属性名，默认值是children -->
      <!-- tree-key: 每个节点的唯一标识 默认值  id   cat_id -->
      <!-- parent-key： 指定当前节点的父节点， 如果不指定，没法收起来 -->
      <!-- level-key: 指定节点的层级 -->
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indentSize="20"
      ></el-table-tree-column>
      <el-table-column label="是否删除" prop="cat_deleted">
        <template slot-scope="scope">{{scope.row.cat_deleted?'是':'否'}}</template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: true,
      categoryList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    async getCategoryList () {
      this.loading = true
      // let res = await this.axios.get('categories', {
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { result, total } } = res
      if (status === 200) {
        this.categoryList = result
        this.total = total
        this.loading = false
      }
      console.log(this.categoryList)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCategoryList()
    }

  },
  created () {
    this.getCategoryList()
  }
}
</script>
