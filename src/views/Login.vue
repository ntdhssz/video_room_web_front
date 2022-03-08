<template>
  <div>
    <Header></Header>
    <el-form class="login-container" label-position="left" label-width="0px">
      <div style="float: left; width: 100%">
        <el-button type="text" size="small" @click="toRegister" style="float: right;">注册 ></el-button>
      </div>
      <div>
        <h3 class="login-title">登录</h3>
      </div>
      <el-form-item>
        <el-input
          type="text"
          v-model="loginForm.login_name"
          auto-complete="off"
          placeholder="账号"
          @keydown.enter.native="login()"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          v-model="loginForm.password"
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
  </div>
</template>

<script>
import Header from "../components/Header";
import {authLogin} from "../api/login/authLogin";

export default {
  name: "Login",
  components: {
    Header
  },
  data() {
    return {
      loginForm: {
        login_name: "",
        password: "",
      },
      responseResult: [],
    };
  },
  mounted: function () {
    this.$nextTick(function () {
      let token = localStorage.getItem('token');
      if (token !== null && token !== '' && typeof token !== "undefined") {
        authLogin().then(res => {
          if (res.data.code === 200) {
            this.$router.replace({path: '/index'});
          }
        }).catch(failResponse => {

        });
      }
    });
  },
  methods: {
    login() {
      let _this = this;
      let form = this.loginForm;
      this.$axios.post('/api/login', form, {
        headers: {
          'agent': 'pc'
        }
      }).then(res => {
        let data = res.data.data;
        _this.$store.commit('SET_TOKEN', data.token);
        _this.$store.commit('SET_ID', data.id);
        _this.$store.commit('SET_NICK_NAME', data.nick_name);
        _this.$store.commit('SET_AVATAR', data.avatar);
        let redirect = _this.$route.query.redirect;
        if (typeof redirect === 'undefined') {
          _this.$router.replace({path: '/index'});
        } else {
          _this.$router.replace(redirect.toString());
        }
      }).catch(error_message => {
        _this.$store.commit('REMOVE_INFO');
        _this.$message.error(error_message);
      });
    },
    toRegister() {
      this.$router.replace({path: '/register'});
    }
  },
};
</script>

<style scoped>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 10px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login-title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
