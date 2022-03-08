<template>
  <div>
    <Header></Header>
    <el-form ref="registerForm" class="register-container" label-position="left" label-width="0px" :model="registerForm" :rules="rules">
      <div style="float: left; width: 100%">
        <el-button type="text" size="small" @click="toLogin" style="float: left;">< 登录</el-button>
      </div>
      <div>
        <h3 class="register-title">注册</h3>
      </div>
      <el-form-item prop="login_name">
        <el-input
          type="text"
          v-model="registerForm.login_name"
          auto-complete="off"
          placeholder="登录名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="nick_name">
        <el-input
          type="text"
          v-model="registerForm.nick_name"
          auto-complete="off"
          placeholder="昵称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="registerForm.password"
          auto-complete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="confirm_password">
        <el-input
          type="password"
          v-model="registerForm.confirm_password"
          auto-complete="off"
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          style="width: 100%;  border: none"
          @click="register()"
        >注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Header from "../components/Header";
import {loginNameCheck} from "../api/register/loginNameCheck";
import {register} from "../api/register/register";

export default {
  name: "Register",
  components: {
    Header
  },
  data() {
    const loginNameValidator =  (rule, value, callback) => {
      loginNameCheck(this.registerForm.login_name).then(res => {
        let isUsed = res.data.data;
        if (isUsed) {
          callback(new Error('登录名已使用'));
        } else {
          callback();
        }
      });
    };
    const confirmPasswordValidator = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        login_name: "",
        nick_name: "",
        password: "",
        confirm_password: "",
      },
      rules: {
        login_name: [
          {required: true, message: '请输入登录名', trigger: 'blur'},
          {min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur'},
          {validator: loginNameValidator, trigger: 'blur'}
        ],
        nick_name: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
          {min: 4, max: 10, message: '长度在 4 到 20 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请设置密码', trigger: 'blur'},
          {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}
        ],
        confirm_password: [
          {required: true, message: '请确认密码', trigger: 'blur'},
          {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'},
          {validator: confirmPasswordValidator, trigger: 'blur'}
        ]
      },
    };
  },
  methods: {
    register() {
      let _this = this;
      this.$refs["registerForm"].validate((valid) => {
        if (valid) {
          register(_this.registerForm)
        }
      });
    },
    toLogin() {
      this.$router.replace({path: '/login'});
    }
  }
};
</script>

<style scoped>
.register-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 10px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.register-title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
