<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <h1 class="logo"><img src="../assets/logo.png" alt="网站logo" /> <span>电商后台管理系统</span></h1>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 左侧菜单栏 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_btn" @click="toggleMenu">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#eee"
          active-text-color="#409bff"
          unique-opened
          router
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
              @click="saveNavState('/' + item2.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ item2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu></el-aside
      >

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 菜单列表
      menuList: [],
      // 控制菜单折叠展开
      isCollapse: false,
      // 字体图标
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 当前展开二级菜单的路径
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error('获取菜单列表失败')
      }
      this.menuList = res.data
    },
    // toggleMenu Width
    toggleMenu() {
      this.isCollapse = !this.isCollapse
    },
    // 保存当前点击二级菜单路径
    saveNavState(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    // 退出登入
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  height: 60px;
  color: #eee;
  background-color: rgb(55, 61, 65);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    img {
      height: 90%;
      border-radius: 50%;
      background: #eee;
      margin-right: 10px;
    }
  }
}

.el-aside {
  background-color: rgb(51, 55, 68);
  .el-menu {
    border: none;
  }
  .toggle_btn {
    line-height: 30px;
    color: #eee;
    background-color: rgb(36, 39, 49);
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
    user-select: none;
  }
  .iconfont {
    margin-right: 5px;
  }
}

.el-main {
  background-color: rgb(234, 237, 241);
}
</style>
