<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px">
      <img src="../assets/images/avatar.jpg">
      <el-form-item label="用户名">
        <el-input v-model="form.usesrname"></el-input>
      </el-form-item>
       <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">登录</el-button>
        <el-button class="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.login {
 width: 100%;
 height: 100%;
 background-color: #2d434c;
 overflow: hidden;
 .el-form {
   width: 400px;
   background-color: #fff;
   padding: 75px 40px 15px 40px;
   margin: 200px auto;
   border-radius: 20px;
   position: relative;
   img {
     position: absolute;
     top: -70px;
     left: 50%;
     transform: translateX(-50%);
     border-radius: 50%;
     border: 10px solid #fff;
   }
 }
 .reset {
   margin-left: 120px;
 }
}
</style>
