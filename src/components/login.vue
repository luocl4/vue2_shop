<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="vue_logo" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginfromref"
        :model="loginform"
        :rules="loginfromrules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginform.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginform.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginfrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginform: {
        username: "admin",
        password: "123456",
      },
      loginfromrules: {
        // 这是验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 这是验证密码是否合法
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetloginfrom() {
      // console.log(this);
      this.$refs.loginfromref.resetFields();
    },
    login() {
      this.$refs.loginfromref.validate(async (vaild) => {
        // console.log(vaild);
        // 对整个表单进行校验的方法，参数为一个回调函数。
        if (!vaild) return;
        // 只有data属性是有用的，所以要解构赋值把data拿出来
        // const result = await this.$http.post("login", this.loginform);
        const { data: result } = await this.$http.post("login", this.loginform);
        console.log(result);
        if (result.meta.status !== 200) return this.$message.error("登录失败");
        this.$message.success("登录成功");
        // 1.将登录成功之后的token，保存到客户端的sessionstorage中
        //  1.1项目之中除了登录之外的其他api接口，必须在登录之后才能访问
        //  1.2token只应当在当前网站打开期间生效，所以必须在token保存在sessionstorage中
        window.sessionStorage.setItem("token", result.data.token);
        // 2.通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push("/home"); //编程式导航
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
