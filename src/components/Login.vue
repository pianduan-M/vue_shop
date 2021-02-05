<template>
  <div class="login_container">
    <div class="login_box">
      <h1 class="logo">
        <img src="../assets/logo.png" alt="" />
      </h1>
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0" class="login_form">
        <!-- 用户名称 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码框 -->
        <el-form-item prop="password" @keyup.enter.native="login">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 登入按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户信息对象
      loginForm: {
        username: '',
        password: null
      },
      // 用户信息验证对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 重置按钮业务函数
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登入按钮业务函数
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 登入失败
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 登入成功
        this.$message.success(res.meta.msg)
        //  保存token值
        window.sessionStorage.setItem('token', res.data.token)
        // 页面跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 450px;
    height: 300px;
    background: white;
    position: relative;
    .logo {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      background: white;
      box-sizing: border-box;
      padding: 10px;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
      img {
        width: 100%;
        background: rgb(238, 238, 238);
        border-radius: 50%;
      }
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
