<template>
    <div class="user">
        <header-title :iflag="true">权限管理-用户</header-title>
        <div class="lookinfo">
            <el-form :inline="true" :model="lookuserinfo" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="lookuserinfo.usera" placeholder="请输入用户名称查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="lookUserinfo">查询</el-button>
                </el-form-item>
                <el-form-item  style="float:right">
                    <el-button type="primary" @click="addUser">添加用户</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table  :data="tableData"  border   style="width:96%;margin:0 auto;" fit>
                   <el-table-column label="序号" align="center" width="70">
                        <template scope="scope">
                            <div slot="reference" class="name-wrapper">
                            {{ scope.row.index }}
                            </div>
                        </template>
                   </el-table-column>
                   <el-table-column label="用户名" align="center">
                        <template scope="scope">
                            <div slot="reference" class="name-wrapper">
                            {{ scope.row.username }}
                            </div>
                        </template>
                   </el-table-column>
                   <el-table-column label="角色" align="center">
                        <template scope="scope">
                            <div slot="reference" class="name-wrapper">
                            {{ scope.row.rolename }}
                            </div>
                        </template>
                   </el-table-column>
                   <el-table-column label="邮箱" align="center">
                        <template scope="scope">
                            <div slot="reference" class="name-wrapper">
                            {{ scope.row.email }}
                            </div>
                        </template>
                   </el-table-column>
                   <el-table-column label="创建时间" align="center" width="180">
                        <template scope="scope">
                            <div slot="reference" class="name-wrapper">
                            {{ scope.row.addtime | addtimeFormat}}
                            </div>
                        </template>
                   </el-table-column>
                   <el-table-column label="最后登陆时间" align="center" width="180">
                        <template scope="scope">
                            <div slot="reference" class="name-wrapper">
                            {{ scope.row.logintime | addtimeFormat}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" width="90">
                        <template scope="scope">
                            <div slot="reference" class="name-wrapper">
                            {{ scope.row.useable | ablestate}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="false">
                        <template scope="scope">
                            <div slot="reference" class="name-wrapper">
                                 {{ scope.row.phone}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="false">
                        <template scope="scope">
                            <div slot="reference" class="name-wrapper">
                                 {{ scope.row.id}}
                            </div>
                        </template>
                    </el-table-column>
                   <el-table-column prop="operat" label="操作" width="240" align="center">
                      <template scope="scope">
                        <el-button size="small" type="primary" @click="updateUserinfo(scope.$index,scope.row)">修改</el-button>
                        <el-button size="small" type="primary" @click="resetuserpass(scope.$index,scope.row)">重置密码</el-button>
                        <el-button size="small" type="danger" @click="deleteUser(scope.$index,scope.row)">删除</el-button>
                      </template>
                   </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage4"
            :page-sizes="[10]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
        <transition name="move" mode="out-in">
            <add-user v-if="addUserflag" @closeAddUser="closeAddUser" @getUserinfos="getUserinfos"></add-user>
            <update-user v-if="updateUserflag" @updateUserClose="updateUserClose" :userinfodesc="userinfodesc" :currentPage4="currentPage4" @updategetInfo="updategetInfo"></update-user>
            <reset-pass v-if="resetpassflag" @resetclose="resetclose" :resetuserpassid="resetuserpassid"></reset-pass>
        </transition>
    </div>
</template>
<script>
    import HeaderTitle from "./common/title"
    import { format } from "../../../api/utils.js"
    import { sortByreverseTime } from "../../../api/userutils.js"
    import AddUser from "./addUser"
    import UpdateUser from "./updateUser"
    import ResetPass from "./resetPass"
    export default {
      data(){
            return {
                tableData: [
                    {
                        index:0,
                        username:"kkkk",
                        rolename:"教师",
                        email:"1617506054@qq.com",
                        addtime:"2017-15-10",
                        logintime:"2017-10-10",
                        useable:"1",
                        roleid:1,
                        id:0
                    }
                ],
                currentPage4:1,
                lookuserinfo:{
                    usera:''
                },
                addUserflag:false,
                updateUserflag:false,
                userinfodesc:"",//用户信息详情
                total:0,
                resetpassflag:false,
                resetuserpassid:""
          }
      },
      components:{
            HeaderTitle,
            AddUser,
            UpdateUser,
            ResetPass
      },
      created(){
           this.getUserinfoList(); 
      },
      methods:{
        //显示增加用户
        addUser(){
            this.addUserflag=true;
        },
        //隐藏增加用户界面
        closeAddUser(){
            this.addUserflag=false;
        },
        //在用户列表初始化时
        getUserinfoList(username,pageNo){
            let self = this;
            username = username || "";
            pageNo = pageNo || 1;
            this.currentPage4 = pageNo;
            let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
            this.$axios.defaults.headers.common['token'] = token;
            const userinfo={
                "action":"getAuthUserList",
                "username":username,//用户名，非必填
                "pageNo":pageNo//页码，不填默认为1
            }
            this.$axios.post("/rest",userinfo).then(res=>{
                let data=res.data;
                if(data.code==200){
                    let userinfos=data.data.list;
                    self.total = data.data.total;
                    let userArray=[];
                    //按创建时间倒叙
                    sortByreverseTime(userinfos);
                    userinfos.forEach((item,index)=>{
                         let obj = {};
                         obj.index = index+1;
                         obj.username = item.username;
                         obj.rolename = item.rolename;
                         obj.email = item.email;
                         obj.addtime = item.addtime;
                         obj.logintime = item.logintime;
                         obj.useable = item.useable;
                         obj.roleid = item.roleid;
                         obj.phone = item.phone;
                         obj.id = item.id;
                         userArray.push(obj);
                    })
                    self.tableData=userArray;
                }else{
                    self.errMessage(data.msg_zh,"error");  
                }
            }).catch(error=>{
                console.log(error);
                self.errMessage("请求出错了!","error");
            })
        },
        errMessage(message,type,time){
            time = time || 3000;
            this.$message({
                message:message,
                type:type,
                duration:time
            })
        },
        handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
        },
         //当改变页数的时候触发，会呈现对应页数的数据
        handleCurrentChange(val) {
            this.getUserinfoList("",val);
        },
        //删除用户信息
        deleteUser(index,data){
             const h = this.$createElement;
             let self = this;
             let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
             this.$axios.defaults.headers.common['token'] = token;
             this.$msgbox({
                title: '消息',
                message: h('p', null, [
                    h('span', null, '确定要删除吗？ ')
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                          const deleteUser = {
                                "action":"delAuthUser",
                                "id":data.id//用户id 必填
                          }
                          self.$axios.post("/rest",deleteUser).then(res=>{
                              var data = res.data;
                              if(data.code==200){
                                 self.errMessage("删除成功","success");
                                 self.tableData.splice(index,1);
                                 self.getUserinfoList("",self.currentPage4);
                              }else{
                                 self.errMessage(data.msg_zh,"error");
                              }
                              done();
                          }).catch(error=>{
                              console.log(error)
                              self.errMessage("请求出错!","error");
                          })
                    } else {
                        done();
                    }
                }
            }).then(action => {
               
            });
        },
        //查询用户信息
        lookUserinfo() {
            this.getUserinfoList(this.lookuserinfo.usera);
        },
        //修改用户信息的方法
        updateUserinfo(index,data){
            this.updateUserflag=true;
            this.userinfodesc=data;
        },
        //隐藏修改用户的页面
        updateUserClose(){
            this.updateUserflag=false;
        },
        //在增加用户信息成功之后，调用此方法，让增加的信息在列表中显示
        getUserinfos(){
            this.getUserinfoList();
        },
        //跟新后刷新页面
        updategetInfo(pageNo){
            this.getUserinfoList("",pageNo);
        },
        //隐藏重置密码页面
        resetclose(){
            this.resetpassflag=false;
        },
        //重置用户密码
        resetuserpass(index,data){
            this.resetpassflag=true;
            this.resetuserpassid = data.id;
        }
      },
      filters:{
          addtimeFormat(value){
              if(!value){
                  return "未登录！";
              }
              var date = new Date(value);
              return  format(date);
          },
          ablestate( value ){
              return value ?  "可用" : "不可用";
          }
      }
    }
</script>
<style scoped>
    .lookinfo{padding:0 1.6rem;}
    .block{margin-top:20px;padding-right:1.2rem;float:right;}
</style>