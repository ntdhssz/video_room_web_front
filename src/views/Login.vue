<template>
  <body id="login-page">
  <Header></Header>
  <el-form class="login-container" label-position="left" label-width="0px">
    <h3 class="login_title">登录</h3>
    <el-form-item>
      <el-input
        type="text"
        v-model="login_form.login_name"
        auto-complete="off"
        placeholder="账号"
        @keydown.enter.native="login()"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-input
        type="password"
        v-model="login_form.password"
        auto-complete="off"
        placeholder="密码"
        @keydown.enter.native="login()"
      ></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button
        type="primary"
        style="width: 100%;  border: none"
        @click="login()"
      >登录
      </el-button
      >
    </el-form-item>
  </el-form>
  </body>
</template>

<script>
import {authLogin} from "../api/authLogin";
import Header from "./Header";

export default {
  name: "Login",
  components: {
    Header
  },
  data() {
    return {
      login_form: {
        login_name: "",
        password: "",
      },
      responseResult: [],
    };
  },
  mounted: function () {
    this.$nextTick(function () {
      authLogin().then(res => {
        if (res.data.code === 200) {
          this.$router.replace({path: '/index'})
        }
      }).catch(failResponse => {

      })
    })
  },
  methods: {
    login() {
      let _this = this;
      let form = this.login_form
      this.$axios.post('/api/login', form, {
        headers: {
          'agent': 'pc'
        }
      }).then(res => {
        let data = res.data.data
        _this.$store.commit('SET_TOKEN', data.token)
        _this.$store.commit('SET_ID', data.id)
        _this.$store.commit('SET_NICK_NAME', data.nick_name)
        _this.$store.commit('SET_AVATAR', data.avatar)
        let redirect = _this.$route.query.redirect
        if (typeof redirect === 'undefined') {
          _this.$router.replace({path: '/index'})
        } else {
          _this.$router.replace(redirect.toString())
        }
      }).catch(error_message => {
        _this.$store.commit('REMOVE_INFO')
        _this.$message.error(error_message)
      })
    }
  },
};
</script>

<style scoped>
#login-page {
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

body {
  margin: 0;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
