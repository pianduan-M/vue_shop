<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表表单 -->
      <el-table
        :data="rolesList"
        style="width: 100%"
        border
        stripe
        class="roles_table"
      >
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i) in scope.row.children"
              :key="item1.id"
              :class="['middle', 'border_bottom', i === 0 ? 'border_top' : '']"
            >
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i
                  class="el-icon-caret-right
"
                ></i
              ></el-col>
              <el-col :span="18">
                <!-- 二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['middle', i2 === 0 ? '' : 'border_top']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i
                      class="el-icon-caret-right
"
                    ></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      type="warning"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 序列行 -->
        <el-table-column type="index"> </el-table-column>

        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-eidt"
              size="mini"
              @click="editRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRole(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 表单数据 -->
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色权限对话框 -->
    <el-dialog
      title="修改权限"
      :visible.sync="setRightdialogVisible"
      width="50%"
      @close="setRightClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="roleRight"
        show-checkbox
        :props="rightDefaultProps"
        node-key="id"
        default-expand-all
        ref="treeRef"
        :default-checked-keys="defkeys"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 编辑角色对话框显示与隐藏
      editDialogVisible: false,
      // 编辑角色数据对象
      editRoleForm: {},
      //  编辑角色表单验证对象
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      // 修改权限对话框显示隐藏
      setRightdialogVisible: false,
      //角色权限列表
      roleRight: [],
      // 权限列表配置对象
      rightDefaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认勾选数组
      defkeys: [],
      // 当前选中角色id
      roleId: null
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
    },
    // 删除角色指定权限
    async removeRightById(role, rightId) {
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    // 编辑角色信息
    async editRole(role) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${role.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editRoleForm = res.data
    },
    // 提交编辑信息
    saveEditRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `roles/${this.editRoleForm.roleId}`,
            this.editRoleForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('修改角色信息成功')
          this.getRolesList()
          this.editDialogVisible = false
        }
      })
    },
    // 编辑角色对话关闭事件
    editDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 删除角色
    async deleteRole(role) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除改角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除成功')
      this.getRolesList()
    },
    // 设置角色权限
    async setRole(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleRight = res.data
      this.getLeafKeys(role, this.defkeys)
      this.setRightdialogVisible = true
    },
    // 获取角色下所有三级权限的ID值，并保存
    getLeafKeys(node, arr) {
      // 当前node没有children节点 把id push进数组 否则递归调用深一层
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    async saveSetRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('分配角色权限成功!')
      this.getRolesList()
      this.setRightdialogVisible = false
    },
    // 设置角色权限对话框关闭事件
    setRightClosed() {
      this.defkeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.roles_table {
  margin-top: 20px;
}
.middle {
  display: flex;
  align-items: center;
}
.border_top {
  border-top: 1px solid #eee;
}
.border_bottom {
  border-bottom: 1px solid #eee;
}
</style>
