<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区 -->
    <el-card>
      <!-- alrte信息 -->
      <el-row>
        <el-col>
          <el-alert
            title="添加商品信息"
            type="info"
            :closable="false"
            show-icon
            center
          >
          </el-alert>
        </el-col>
      </el-row>

      <!--  步骤条 -->
      <el-steps :active="stepActive - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab标签页 -->

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="stepActive"
          @tab-click="handleClick"
          tab-position="left"
          :before-leave="beforeTabLeave"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="catProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyCateList"
              :key="item.attr_id"
              :label="item.attr_name"
              prop="cateList"
            >
              <el-checkbox-group v-model="item.checkList">
                <el-checkbox
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                  :label="item1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyParList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.value"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <el-form-item prop="pics" label="主图">
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :headers="headersObj"
                list-type="picture-card"
                :limit="total"
                :on-preview="handlePictureCardPreview"
                :on-success="handSuccess"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-row style="margin-top:20px">
              <el-col
                ><el-button type="primary" @click="addGoods"
                  >添加商品</el-button
                >
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      stepActive: 0,
      // 添加商品的表单数据
      addForm: {
        goods_name: '',
        goods_price: null,
        goods_number: null,
        goods_weight: null,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 添加商品的表单验证对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
        pics: [{ required: true, message: '请上传商品图片', trigger: 'blur' }]
      },
      // 商品分类数据
      cateList: [],
      catProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数数据对象
      manyCateList: [],
      // 选中的动态参数
      checkList: [],
      // 静态属性
      onlyParList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      // 图片上传数量限制
      total: 5,
      // 图片上传 请求头配置对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getGoodsCat()
  },
  methods: {
    async getGoodsCat() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data
    },
    // 监听级联选择器数据发生改变
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tab栏切换事件
    async handleClick() {
      // 动态参数
      if (this.stepActive === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.trim() === '' ? [] : item.attr_vals.split(' ')
          item.checkList = []
        })
        // this._.cloneDeep(res.data)
        this.manyCateList = res.data
      }
      // 静态属性
      if (this.stepActive === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        res.data.forEach((item) => {
          item.value = ''
        })
        this.onlyParList = res.data
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error({ message: '请先选择商品分类', duration: 500 })
        return false
      }
    },
    // 图片预览的钩子
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.response.data.url
      this.dialogVisible = true
    },
    // 图片上传成功的函数
    handSuccess(fill) {
      const picObj = { pic: fill.data.tmp_path }
      this.addForm.pics.push(picObj)
    },
    // 图片的删除事件
    handleRemove(file) {
      console.log(file)
      const url = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex((item) => {
        return item.pic === url
      })
      this.addForm.pics.splice(i, 1)
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async (valid, object) => {
        if (!valid) {
          for (let i in object) {
            if (
              [
                'goods_name',
                'goods_cat',
                'goods_price',
                'goods_number',
                'goods_weight'
              ].includes(i)
            ) {
              this.stepActive = '0'
            } else if (i === 'pics') {
              this.stepActive = '3'
            }
          }
          return false
        }

        const form = _.cloneDeep(this.addForm)
        // 分类
        form.goods_cat = form.goods_cat.join(',')
        // 动态参数
        this.manyCateList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.checkList.join(' ')
          }
          form.attrs.push(newInfo)
        })
        // 静态参数
        this.onlyParList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.value
          }
          form.attrs.push(newInfo)
        })
        const { data: res } = await this.$http.post(`goods`, form)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-tabs {
  margin-top: 20px;
}
.el-cascader {
  width: 200px;
}
.el-checkbox {
  margin: 0 6px 0 0 !important;
}
</style>
