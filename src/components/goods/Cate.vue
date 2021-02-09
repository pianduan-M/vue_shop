<template>
  <div class="cate">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 分类表单 -->
      <tree-table
        :data="cateList"
        show-heade
        show-index
        :columns="columns"
        :expand-type="false"
        index-text="#"
        :selection-type="false"
        border
        :show-row-hover="false"
        cell-class-name="tree_table"
      >
        <!-- cat_deleted -->
        <template slot-scope="scope" slot="isok">
          <i
            class="el-icon-success"
            v-if="!scope.cat_deleted"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>

        <!-- cat_level -->
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0"
            >一级</el-tag
          >
          <el-tag type="success" size="mini" v-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level === 2"
            >三级</el-tag
          >
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
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

    <!-- 分类编辑对话框 -->
    <el-dialog
      title="修改分类名称"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savaEditCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分类添加对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>

        <!-- 级联选择器 -->
        <el-form-item label="父级分类">
          <el-cascader
            v-model="cateListKeys"
            :options="cateOptions"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children'
            }"
            @change="handleChange"
            style="width:100%"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savaAddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 商品分类数据对象
      cateList: [],
      // treeTable 配置对象
      columns: [
        {
          label: '商品名称',
          prop: 'cat_name'
        },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      // 分类修改数据对象
      editForm: {},
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 控制分类修改对话框的显示与隐藏
      editDialogVisible: false,
      // 分类添加表单数据
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 控制添加分类对话框的显示与隐藏
      addDialogVisible: false,
      // 级联选择选中分类ID数组
      cateListKeys: [],
      // 分类数据数组
      cateOptions: []
    }
  },
  created() {
    this.getgoodsCate()
  },
  methods: {
    async getgoodsCate() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 显示分类修改对话框
    async showEditDialog(row) {
      const { data: res } = await this.$http.get(`categories/${row.cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 编辑提交分类
    async savaEditCate() {
      const { data: res } = await this.$http.put(
        `categories/${this.editForm.cat_id}`,
        {
          cat_name: this.editForm.cat_name
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('修改成功')
      this.getgoodsCate()
      this.editDialogVisible = false
    },
    // 监听分类编辑对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 删除分类
    async deleteCate(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除成功')
    },
    // 每页显示条数发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getgoodsCate()
    },
    // 当前页码值发生改变
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getgoodsCate()
    },
    // 显示添加分类对话框
    async showAddCate() {
      const { data: res } = await this.$http.get(`categories`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateOptions = res.data
      this.addDialogVisible = true
    },
    savaAddCate() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'categories',
            this.addForm
          )
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('添加分类成功')
          this.getgoodsCate()
          this.addDialogVisible = false
        }
      })
    },
    // 监听级联选择器 发生改变
    handleChange() {
      if (this.cateListKeys.length > 0) {
        this.addForm.cat_id = this.cateListKeys[this.cateListKeys.length - 1]
        this.addForm.cat_level = this.cateListKeys.length - 1
      } else {
        this.addForm.cat_id = 0
        this.addForm.cat_level = 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  font-size: 14px;
  margin-top: 20px;
}
</style>
