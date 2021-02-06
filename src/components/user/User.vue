<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区 -->
    <el-card>
      <el-row>
        <!-- 搜索框 -->
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="5" style="margin-left:10px">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户表单 -->
      <el-table
        :data="usersList"
        style="width: 100%; margin-top:20px; mini-width:1366px"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="名字" width="120">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="150">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" style="mini-width:200px">
        </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 设置用户角色 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRoles(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框 -->

    <el-dialog
      title="添加用户"
      :visible.sync="AddDialogVisible"
      width="50%"
      @close="AddDialogClosed"
    >
      <!-- form表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="addForm.checkPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->

    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- form表单 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEiditInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置用户角色对话框 -->

    <el-dialog
      title="设置用户角色"
      :visible.sync="rolesDialogVisible"
      width="50%"
    >
      <el-form
        :rules="rolesFormRules"
        ref="rolesFormRef"
        label-width="150px"
        :model="rolesForm"
      >
        <el-form-item label="选择用户角色" prop="activeRole">
          <el-select v-model="rolesForm.activeRole">
            <el-option
              v-for="item in rolesForm.data"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 密码验证
    var validatePass = (addFormRules, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.addForm.checkPassword !== '') {
          this.$refs.addFormRef.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rules, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 邮箱验证
    var validateEmail = (rules, value, callback) => {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (value.trim() === '') {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      }
    }
    // 电话验证
    var validateMobile = (rules, value, callback) => {
      let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (value.trim() === '') {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 用户列表总条数
      total: 0,
      // 用户数据
      usersList: [],
      // 添加用户数据的对象
      addForm: {
        username: '',
        password: '',
        checkPassword: '',
        email: '',
        mobile: ''
      },
      // 添加用户验证对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }]
      },
      // 添加用户对话框显示与隐藏
      AddDialogVisible: false,
      // 编辑用户数据对象
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 编辑用户对话框显示与隐藏
      editDialogVisible: false,
      // 角色列表数据对象
      rolesForm: [],
      // 设置用户角色对话框显示与隐藏
      rolesDialogVisible: false,
      // 用户id
      userId: null,
      // 角色验证对象
      rolesFormRules: {
        activeRole: [
          {
            required: true,
            message: '请选择要分配的角色',
            trigger: ['blur', 'change'],
            type: 'number'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 添加用户
    addUser() {
      this.AddDialogVisible = true
    },
    // 提交新用户信息
    saveUserInfo() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('添加用户成功')
          this.getUserList()
          this.AddDialogVisible = false
        }
      })
    },
    // 添加用户的对话框关闭事件
    AddDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    async editUser(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 提交编辑用户信息
    saveEiditInfo(id) {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('修改用户信息成功')
          this.getUserList()
          this.editDialogVisible = false
        }
      })
      /*  */
    },
    // 编辑用户的对话框关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 删除用户信息
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除改用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + id)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.getUserList()
      }
    },
    // 设置用户角色
    async setRoles(id) {
      this.userId = id
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      console.log(this.usersList)
      this.rolesForm = res
      this.rolesDialogVisible = true
    },
    // 提交角色分配信息
    saveRole() {
      console.log(this.rolesForm.activeRole)
      console.log(this.userId)
      this.$refs.rolesFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put('users/523/')
          console.log(res)
          // if (res.meta.status !== 200) {
          //   return this.$message.error(res.meta.msg)
          // }
          // this.$message.success(res.meta.msg)
          // this.getUserList()
          // this.rolesDialogVisible = false
        }
      })
    }
  }
}
</script>

<style></style>
