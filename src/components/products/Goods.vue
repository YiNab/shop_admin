<template>
  <div class="good">
    <el-button type="success">添加商品</el-button>
    <el-table :data="goodList" width="100%">
      <el-table-column label="商品列表" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">{{scope.row.add_time|dataFilter}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      goodList: [],
      query: '',
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    async getGoodList () {
      let res = await this.axios({
        method: 'get',
        url: 'goods',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { data: { goods, total }, meta: { status } } = res
      if (status === 200) {
        this.goodList = goods
        this.total = total
      }
      console.log(res)
    }
  },
  created () {
    this.getGoodList()
  }
}
</script>
