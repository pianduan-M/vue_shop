<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 警告提示 -->
      <el-row>
        <el-col>
          <el-alert
            title="注意:只允许为第三级分类设置相关参数"
            type="warning"
            show-icon
            :closable="false"
          >
          </el-alert>
        </el-col>
      </el-row>

      <!-- 选择商品分类 -->
      <el-row class="cate_margin">
        <el-col :span="19">
          <span class="margin_right">选择商品分类:</span>
          <el-cascader
            v-model="cateListKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            style="width: 200px"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 栏 -->
      <el-tabs v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-row>
            <el-col>
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="showAddDialog"
                >添加参数</el-button
              >
            </el-col>
          </el-row>
          <!-- 动态参数表格  -->
          <el-table :data="manyCateList" style="width: 100%" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>

                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引行 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParam(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态参数" name="only">
          <!-- 配置管理按钮 -->
          <el-row>
            <el-col>
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="showAddDialog"
                >配置管理</el-button
              >
            </el-col>
          </el-row>
          <!-- 静态参数表格  -->
          <el-table :data="onlyCateList" style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>

                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引行 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParam(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 修改参数列表对话框 -->
    <el-dialog
      :title="activeName === 'many' ? '修改动态参数' : '修改静态参数'"
      :visible.sync="editParDialogVisible"
      width="30%"
      @close="editParDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="activeName === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加参数列表对话框 -->
    <el-dialog
      :title="activeName === 'many' ? '修改动态参数' : '修改静态参数'"
      :visible.sync="addParDialogVisible"
      width="30%"
      @close="addParDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="activeName === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name" ref="addInputRef"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据
      cateList: [],
      // 商品分类配置对象
      cateProps: {
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        value: 'cat_id'
      },
      // 选中项绑定值
      cateListKeys: [],
      // tab栏选中
      activeName: 'many',
      // 动态参数
      manyCateList: [],
      onlyCateList: [],
      // 防抖函数标识
      timer: null,
      // 控制修对话框的显示与隐藏
      editParDialogVisible: false,
      // 修改参数表单数据对象
      editForm: {},
      // 修改参数表单验证对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      // 控制修对话框的显示与隐藏
      addParDialogVisible: false,
      // 修改参数表单数据对象
      addForm: {},
      // 修改参数表单验证对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data
    },
    // 级联选择器 函数
    handleChange() {
      this.getCategoriesList()
    },
    // tab栏 函数
    tabHandleClick() {
      if (this.cateListKeys.length !== 3) {
        return this.$message.error('请先选择商品分类')
      }
      this.getCategoriesList()
    },
    // 获取参数列表
    async getCategoriesList() {
      if (this.cateListKeys.length !== 3) {
        this.cateListKeys = []
        this.manyCateList = []
        this.onlyCateList = []
        return false
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把 attr_vals 转换成数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.split(' ')
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyCateList = res.data
      } else {
        this.onlyCateList = res.data
      }
    },
    // 显示添加参数input框
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 添加参数的input框数据改变时触发
    handleInputConfirm(row) {
      let inputValue = row.inputValue.trim()
      if (inputValue) {
        row.attr_vals.push(inputValue)
        this.setCategories(row)
        row.inputVisible = false
        row.inputValue = ''
      }
    },
    // 更新attr_vals 业务函数
    setCategories(row) {
      const res = this.debounce(async function(row) {
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' ')
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('更新成功')
      }, 500)(row)
    },
    // 节流函数
    debounce(fn, wait = 300) {
      const that = this
      return function(args) {
        clearTimeout(that.timer)
        that.timer = setTimeout(() => {
          fn.call(that, args)
        }, wait)
      }
    },
    // 修改参数业务函数
    async editParams(row) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        { attr_sel: this.activeName }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 判断分类类型
      if (this.activeName === 'many') {
        this.editForm = res.data
      } else {
        this.editForm = res.data
      }
      this.editParDialogVisible = true
    },
    // 删除参数业务函数
    async deleteParam(row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除参数, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${row.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除成功')
      this.getCategoriesList()
    },
    // 提交参数业务函数
    saveParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getCategoriesList()
          this.editParDialogVisible = false
        }
      })
    },
    // 监听修改参数列表对话框的关闭事件
    editParDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    showAddDialog() {
      this.addParDialogVisible = true
      this.$nextTick((_) => {
        console.log(this.$refs.addInputRef.$refs.input.focus())
      })
    },
    saveAddParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }
          )
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getCategoriesList()
          this.addParDialogVisible = false
        }
      })
    },
    // 监听添加对话框的关闭事件
    addParDialogClose() {
      this.$refs.addFormRef.resetFields()
    }
  },
  computed: {
    // 分类id
    cateId() {
      if (this.cateListKeys.length === 3) {
        return this.cateListKeys[2]
      }
      return null
    },
    isBtnDisabled() {
      if (this.cateListKeys.length === 3) {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.cate_margin {
  margin: 20px 0 40px 0;
}
.margin_right {
  margin-right: 20px;
}
.input-new-tag {
  width: 87px;
}
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin-right: 6px;
}
</style>
