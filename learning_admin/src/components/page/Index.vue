<template>
    <div class="lenringbeeindex">
         <header-title :iflag="true">用户信息</header-title>
         <div class="userinfo">
            <p><label>用户名:</label><span>{{userinfoData.username}}</span></p>
            <p><label>邮&nbsp;&nbsp;&nbsp;箱:</label><span>{{userinfoData.email ? userinfoData.email:"暂无"}}</span></p>
            <p><label>手&nbsp;&nbsp;&nbsp;机:</label><span>{{userinfoData.phone}}</span></p>
            <p><label>角&nbsp;&nbsp;&nbsp;色:</label><span>{{userinfoData.rolecname}}</span></p>
            <el-button type="primary" size="small" @click="updateuserinfopass()">修改密码</el-button>
         </div>
         <transition name="move" mode="out-in">
            <update-password v-if="updatepassflag" @updatepass="updatepass" :userinfoData="userinfoData"></update-password>
         </transition>
    </div>
</template>

<script>
    import HeaderTitle from "./usermanage/common/title"
    import UpdatePassword from "./usermanage/updateuserinfo"
    export default {
        data(){
            return {
                userinfoData: {
                },
                updatepassflag:false
           }
        },
        components:{
            HeaderTitle,
            UpdatePassword
        },
        created(){
            this.getUserInfos();
        },
        methods:{
            updateuserinfopass() {
                this.updatepassflag=true;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            updatepass(){
                this.updatepassflag=false;
            },
            //得到用户的信息
            getUserInfos(){
                var userinfos = JSON.parse(localStorage.getItem("userInfos"));
                this.getCurrentUser(userinfos.id);
            },
            //得到所有的用户信息,返回要想的哪一个
            getCurrentUser(id){
                    let self = this;
                    let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                    this.$axios.defaults.headers.common['token'] = token;
                    const userinfo = {
                        "action":"getAuthUserList",
                        "username":"",//用户名，非必填
                        "pageNo":1//页码，不填默认为1
                    }
                    this.getAllUserInfos(userinfo,id).then(res=>{
                            self.userinfoData=res;
                    }).catch(error=>{
                        self.errMessage(error,"error");
                    })
            },
            getAllUserInfos(userinfo,id){
                let self = this;
                return new Promise((resolve,reject)=>{
                    self.$axios.post("/rest",userinfo).then(res=>{
                        var data = res.data;
                        if(data.code==200){
                            var list = data.data.list;
                            for(var i=0;i<list.length;i++){
                                if(list[i].id==id){
                                    resolve(list[i]);
                                    break;
                                }else{
                                    resolve();
                                }
                            }
                        }else{
                            self.errMessage(data.msg_zh,"error");
                            reject(new Error(data.msg_zh));
                        }
                    }).catch(error=>{
                        console.log(error)
                        self.errMessage("请求出错了！","error");
                    })
                });
            },
            errMessage(message,type,time){
                time = time || 2000;
                this.$message({
                    message:message,
                    type:type,
                    duration:time
                })
            }

        }
    }
</script>

<style scoped>
    .lenringbeeindex{
        padding:10px;
    }
    .userinfo{width:500px;padding-left:60px;}
    .userinfo p{height:30px;}
</style>