<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <img src="../assets/images/avatar.jpg" />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button class="reset" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(valid => {
        console.log('结果是', valid)
        if (valid) {
          // 校验成功
          axios({
            url: 'http://localhost:8888/api/private/v1/login',
            method: 'post',
            data: this.form
          }).then(res => {
            console.log(res.data)
            if (res.data.meta.status === 200) {
              this.$message({
                message: '恭喜你,登录成功',
                type: 'success'
              })
              // 存储token
              localStorage.setItem('token', res.data.data.token)
              // 跳转到Home组件中
              this.$router.push('/home')
              console.log(this.$router)
            } else {
              console.log('登录失败')
              this.$message.error('登录失败')
            }
          })
        } else {
          // 校验失败
          return false
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
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
