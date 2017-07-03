<template>
    <div class="distruUser">
        <div class="distruUserForm">
            <header-title :iflag="false">分配用户</header-title>
            <p class="dis_common">角色名:{{distruUser.rolename}}</p>
            <p class="dis_common dis_user">用户名:</p>
            <el-transfer filterable v-model="hasUsers" :data="userdata" :titles="['未拥有者','已拥有者']"></el-transfer>
            <div class="button">
                <el-button @click="disclose">取消</el-button>
                <el-button type="primary" @click="submitDistru">确认</el-button>
            </div>
        </div>
    </div>
</template>
<script>
   import HeaderTitle from "./common/title"
    export default {
        props:["distruUser"],
        data(){
            return {
                userdata:[],
                hasUsers: []
            };
        },
        created(){
            this.getDistruUserInfo();
        },
        components:{
            HeaderTitle
        },
        methods:{
            disclose(){
                this.$emit("disclose")
            },
            errorMessage(message,type,time){
                time = time || 2000;
                this.$message({
                    message:message,
                    type:type,
                    duration:time
                })
            },
            //在初始化分配用户的时候，得到角色下面有多少用户，有那些是未有的，那些是已经有的
            getDistruUserInfo(){
                let self = this;
                let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                this.$axios.defaults.headers.common['token'] = token;
                const data = {
                        "action":"getAuthUserBind",
                        "roleid":self.distruUser.roleid//角色id,必填
                }
                this.$axios.post("/rest",data).then(res=>{
                    console.log(res);
                    var data = res.data;
                    if(data.code == 200){
                        // self.errorMessage("成功！","error");
                        var hasUserlist = data.data.hasUserList;
                        var noHasUserList = data.data.noHasUserList.concat(hasUserlist);
                        noHasUserList.forEach((item,index)=>{
                             var obj = {};
                             obj.key = item.id;
                             obj.label = item.username;
                             self.userdata.push(obj);
                        })
                        hasUserlist.forEach((item,index)=>{
                             self.hasUsers.push(item.id)
                        })
                    }else{
                        self.errorMessage(data.msg_zh,"error");
                    }
                }).catch(error=>{
                    self.errorMessage("请求错误了！","error");
                })
            },
            //分配完成之后，进行提交
            submitDistru(){
                  let self = this;
                  let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                  this.$axios.defaults.headers.common['token'] = token;
                  var userArray = [];
                  self.hasUsers.forEach((item,index)=>{
                       var obj = {};
                       obj.id = item;
                       userArray.push(obj);
                  })
                  const distruUserParms = {
                       "action": "bindAuthUser",
                        "roleid": self.distruUser.roleid, //权限id，必填
                        "userList":userArray
                  }
                  this.$axios.post("/rest",distruUserParms).then(res=>{
                        var data = res.data;
                        if(data.code == 200){
                            self.errorMessage(data.msg_zh,"success");
                            self.disclose();
                        }else{
                            self.errorMessage(data.msg_zh,"error");
                        }
                  }).catch(error=>{
                      self.errorMessage("请求出错了!","error");
                  })
            }
        }
    }
</script>
<style scoped>
    .distruUser{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.8);z-index:2000}
    .distruUserForm{width:600px;height:auto;background:#FFF;position:absolute;left:50%;top:15%;margin-left:-300px;padding:10px 0;border-radius:10px;}
    .el-transfer{padding-left:64px;}
    .dis_common{text-indent:4rem;}
    .dis_user{padding:10px 0;}
    .button{padding-left:64px;margin-top:20px;}
</style>