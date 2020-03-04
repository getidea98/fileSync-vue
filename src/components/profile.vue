<template>
    <el-container>
        <el-header></el-header>
        <el-container>
            <el-aside width="500px">
                <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/"
                           :before-upload="beforeAvatarUpload" multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-aside>
            <el-main>
                <el-table :data="files" ref="fileTable">
                    <el-table-column fixed prop="fileName" label="文件名" width="150"></el-table-column>
                    <el-table-column prop="fileSize" label="文件大小" width="80"></el-table-column>
                    <el-table-column prop="gmtCreate" label="创建日期" width="180"></el-table-column>
                    <el-table-column prop="platform" label="平台" width="80" style="text-align: center"></el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                            <el-button @click="down(scope.row)" type="text" size="small">下载</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "profile",
        data() {
            return {
                files: [],
                visible: false,
            }
        },
        created() {
            this.getFilesList();

        },
        methods: {
            getFilesList: async function () {
                const token = window.sessionStorage.getItem("token");
                if (!token) return this.$router.push("/");
                const {data: res} = await this.$axios.post('/profile');
                this.formatDate(res); //对时间戳格式化
                this.formatSize(res);
            },
            del: async function (file) {
                const {data: status} = await this.$axios.post('/profile/del/' + file.id);
                if (status.status == 2) {
                    this.$message.success("文件删除成功");
                    return this.getFilesList();
                } else {
                    this.$message.error("文件删除失败")
                }
            },
            beforeAvatarUpload: async function (file) {
                let formData = new FormData();
                formData.append('file', file);
                console.log("上传" + file.name);
                const {data: res} = await this.$axios.post('/upLoadFile', formData);
                if (res.status == 2) {
                    this.$message.success(res.info);
                } else {
                    alert(res.info);
                }
                this.getFilesList();
            },
            formatDate: function (res) {
                this.files = res.data;
                for (let i = 0; i < this.files.length; i++) {
                    const date = new Date(this.files[i].gmtCreate);
                    const Y = date.getFullYear() + '-';
                    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                    const D = date.getDate() + ' ';
                    const h = date.getHours() + ':';
                    const m = date.getMinutes() + ':';
                    const s = date.getSeconds();
                    this.files[i].gmtCreate = Y + M + D + h + m + s;
                }
            },
            formatSize: function (res) {
                this.files = res.data;
                for (let i = 0; i < res.data.length; i++) {
                    let size = "";
                    let limit = res.data[i].fileSize;
                    if (limit < 0.1 * 1024) {
                        //如果小于0.1KB转化成B
                        size = limit.toFixed(2) + "B";
                    } else if (limit < 0.1 * 1024 * 1024) {
                        //如果小于0.1MB转化成KB
                        size = (limit / 1024).toFixed(2) + "KB";
                    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
                        //如果小于0.1GB转化成MB
                        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
                    } else {
                        //其他转化成GB
                        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
                    }
                    let sizestr = size + "";
                    let len = sizestr.indexOf("\.");
                    let dec = sizestr.substr(len + 1, 2);
                    if (dec == "00") {
                        //当小数点后为00时 去掉小数部分
                        sizestr = sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
                    }
                    this.files[i].fileSize = sizestr;
                }
            },
            down: function (file) {
                this.$axios({
                    url: '/downloadFile/'+file.id,
                    method: 'get',
                    responseType: 'blob'
                }).then(res => {
                        const blob = res.data;
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onload = (e) => {
                            const a = document.createElement('a');
                            a.download = file.fileName;
                            a.href = e.target.result;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }
                    });
            }
        }
    }
</script>

<style scoped>
    .upload-demo {
        margin-top: 120px;
        margin-left: 130px;
    }
</style>
