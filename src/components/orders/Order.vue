<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="ordersList" style="width: 100%" border>
        <!-- 索引列 -->
        <el-table-column type="index"> </el-table-column>
        <!--order_number  -->
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <!--order_price  -->
        <el-table-column prop="order_price" label="订单价格" width="100">
        </el-table-column>
        <!-- order_pay -->
        <el-table-column label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else-if="scope.row.order_pay === '1'"
              >支付宝</el-tag
            >
            <el-tag type="success" v-else-if="scope.row.order_pay === '2'"
              >微信</el-tag
            >
            <el-tag type="success" v-else-if="scope.row.order_pay === '3'"
              >银行卡</el-tag
            >
          </template>
        </el-table-column>
        <!--  is_send-->
        <el-table-column prop="is_send" label="是否发货" width="100">
        </el-table-column>
        <!-- create_time -->
        <el-table-column label="下单时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatTime }}
          </template>
        </el-table-column>
        <!-- setting -->
        <el-table-column label="操作" width="150">
          <template>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改地址"
              placement="top"
              :enterable="false"
              :open-delay="time"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showAddressDialog"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="查看物流"
              placement="top"
              :enterable="false"
              :open-delay="time"
            >
              <el-button
                type="success"
                size="mini"
                icon="el-icon-location"
                @click="showProgressDialog"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->

    <el-dialog title="提示" :visible.sync="addressDialogVisible" width="50%">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
        @close="addressDialogClosed"
      >
        <el-form-item label="省市区" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="citaData"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 查看物流对话框 -->
    <el-dialog title="提示" :visible.sync="proDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressDate"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citaData from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      ordersList: [],
      time: 500,
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        aaddress2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      citaData,
      progressDate: [],
      proDialogVisible: false
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 每页显示条数发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 当前页码发生改变
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getOrdersList()
    },
    showAddressDialog() {
      this.addressDialogVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressDialog() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.progressDate = res.data
      this.proDialogVisible = true
    }
   
  }
}
</script>

<style lang="less" scope>
.el-table td,
.el-table th {
  padding: 5px 0 i !important;
}
.el-cascader {
  width: 100%;
}
</style>
