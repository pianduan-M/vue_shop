<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区 -->
    <el-card>
      <el-row>
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮 -->
        <el-col :span="5">
          <el-button type="primary" class="margin_left" @click="addGoods"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <!-- 商品表格 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>

        <el-table-column prop="goods_price" label="商品价格(元)" width="120">
        </el-table-column>

        <el-table-column prop="goods_weight" label="商品重量(kg)" width="120">
        </el-table-column>
        <el-table-column prop="add_time" label="创建事件" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | formatTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取商品数据对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品数据列表
      goodsList: [],
      // 商品总条数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 当前页数改变的回调函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 每页显示条数改变的回调函数
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getGoodsList()
    },
    // 编辑商品
    async editGoods(goods_id) {
      const { data: res } = await this.$http.get('goods/' + goods_id)
    },
    // 删除商品
    async deleteGoods(goods_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除已取消！')
      }

      const { data: res } = await this.$http.delete('goods/' + goods_id)

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('已删除商品！')
      this.getGoodsList()
    },
    // 跳转添加商品页面
    addGoods() {
      this.$router.push('/add')
    }
  }
}
</script>

<style lang="less" scoped>
.margin_left {
  margin-left: 20px;
}
.el-table {
  min-width: 1366px;
  margin-top: 20px;
}
</style>
