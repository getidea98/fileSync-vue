<template>
    <div class="login_container">
        <div class="login_box">
            <!--头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!--表单区域-->
            <div>
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef">
                    <!-- 用户名-->
                    <el-form-item prop="account">
                        <el-input prefix-icon="iconfont icon-bussiness-man"
                                  v-model="loginForm.account"></el-input>
                    </el-form-item>
                    <!--密码-->
                    <el-form-item prop="password">
                        <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password"
                                  type="password"></el-input>
                    </el-form-item>
                    <!--按钮-->
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLogForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'login',
        data() {
            return {
                loginForm: {
                    account: '49109682',
                    password: '1234567890',
                    platform: 'web'
                },
                rules: {
                    account: [
                        {required: true, message: '登录不能为空', trigger: 'blur'},
                        {min: 3, max: 10, message: '账号长度为3-10', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {min: 6, max: 15, message: '密码长度为6-15', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            resetLogForm: function () {
                this.$refs.loginFormRef.resetFields();
            },
            login: function () {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$axios.post("/login", this.loginForm);
                    if (res.status == 2) { //代表密码正确
                        window.sessionStorage.setItem("token", res.token);
                        this.$message.success('登陆成功');
                        await this.$router.push("/profile");
                    } else {
                        this.$message.error('登陆失败');
                    }
                });
            }
        }
    }

</script>
<style scoped lang="less">
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        height: 300px;
        width: 450px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

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

    .btns {
        display: flex;
        justify-content: flex-end;
    }

    .login_form {
        position: absolute;
        padding: 0 20px;
        box-sizing: border-box;
        bottom: 0;
        width: 100%;
    }
</style>
