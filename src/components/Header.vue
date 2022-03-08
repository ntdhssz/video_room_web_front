<template>
  <el-row>
    <el-header>
      <el-menu
        class="el-menu-demo"
        :default-active='nav_selected'
        router
        mode="horizontal"
        text-color="#000"
        active-text-color="#000"
      >
        <el-menu-item
          v-for="(item, i) in menu_list"
          :key="i"
          :index="item.index"
        >
          {{ item.title }}
        </el-menu-item>
        <el-menu-item
          v-if="this.$route.path.toString().search(/\/room\/[0-9][0-9]*/i) !== -1"
          :key="6"
          :index="this.$route.path"
        >
          观影室
        </el-menu-item>
        <el-button
          v-if="this.is_login"
          type="primary"
          style="float: right; margin: 10px"
          @click="toCreateRoom"
        >
          创建房间
        </el-button>
        <el-menu-item
          v-if="this.is_login"
          style="float: right"
          key="/room/history"
          index="/room/history"
        >
          观影记录
        </el-menu-item>
        <el-menu-item
          v-if="this.is_login"
          style="float: right"
          key="/room/my"
          index="/room/my"
        >
          我的
        </el-menu-item>
        <div
          v-if="this.is_login"
          style="float: right; margin-top: 5px; margin-right: 20px;"
        >
          <el-dropdown
            @command="user_menu"
          >
            <div>
              <el-avatar
                size="medium"
                :src="this.$store.state.avatar"
              >
              </el-avatar>
            </div>
            <span style="color: #000; font-weight: bold">{{ this.$store.state.nick_name }}</span>
            <el-dropdown-menu v-slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div style="float: right" v-if="!this.is_login">
          <router-link to="/login">
            <el-button
              type="primary"
              style="width: 70px; padding: 10px; margin-top: 10px">
              登录
            </el-button>
          </router-link>
          <router-link to="/register">
            <el-button
              style="width: 70px; padding: 10px; margin: 10px">
              注册
            </el-button>
          </router-link>
        </div>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-row>
</template>

<script>
import {logout} from "../api/login/logout";

export default {
  inject: ['reload'],
  name: "Header",
  data() {
    return {
      is_login: false,
      nav_selected: '1',
      menu_list: [
        {index: "/index", title: "首页"},
        {index: "/index?type=1", title: "电影"},
        {index: "/index?type=2", title: "动画"},
        {index: "/chat", title: "聊天室"},
      ]
    }
  },
  mounted: function () {
    let _this = this;
    this.$nextTick(function () {
      if (this.$store.state.token !== null && this.$store.state.token !== '') {
        this.is_login = true;
      }
      if (this.$route.path === '/index') {
        if (typeof this.$route.query.type === 'undefined') {
          _this.nav_selected = this.$route.path;
        } else if (this.$route.query.type === '1'){
          _this.nav_selected = '/index?type=1';
        } else {
          _this.nav_selected = '/index?type=2';
        }
      } else {
        _this.nav_selected = this.$route.path;
      }
    })
  },
  methods: {
    user_menu(command) {
      let _this = this;
      switch (command) {
        case 'logout':
          logout().then(res => {
            _this.$store.commit("REMOVE_INFO");
            _this.$router.go(0);
          }).catch(failResponse => {
            _this.$store.commit("REMOVE_INFO");
            _this.$router.go(0);
          });
          break;
      }
    },
    toCreateRoom() {
      if (this.$route.path !== '/room/create') {
        this.$router.replace({path: '/room/create'});
      }
    }
  }
}
</script>
