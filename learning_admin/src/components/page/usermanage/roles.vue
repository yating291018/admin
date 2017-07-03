<template>
    <div class="role">
        <header-title :iflag="true">权限管理-角色</header-title>
        <div class="lookinfo">
            <el-form :inline="true" :model="lookRole" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="lookRole.usera" placeholder="请输入角色名称查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="lookuserinfo(lookRole.usera)">查询</el-button>
                </el-form-item>
                <el-form-item  style="float:right">
                    <el-button type="primary" @click="addRole">添加角色</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border style="width:96%;margin:0 auto;"  @sort-change="sortData">
                <el-table-column  label="序号" align="center" sortable="true">
                    <template scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.index }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="角色名称" align="center">
                    <template scope="scope">
                        <div slot="reference" class="name-wrapper">
                           {{ scope.row.rolename }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  label="中文名称" align="center">
                    <template scope="scope">
                        <div slot="reference" class="name-wrapper">
                            {{ scope.row.cname }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" >
                    <template scope="scope">
                        <el-button size="small" type="primary" @click="updaterole(scope.row)" :roleid="scope.row.roleid">修改</el-button><!---->
                        <el-button size="small" type="danger"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button size="small" type="primary"  @click="distruuserfn(scope.$index,scope.row)">分配用户</el-button> 
                        <el-button size="small" type="primary"  @click="distrulimit(scope.$index,scope.row)">分配权限</el-button>
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
                <add-role v-if="addRoleflag" @close="close" @reloadRole="reloadRoles"></add-role>
                <update-role v-if="updateRoleflag" @updateClose="updateClose" 
                :updateroleid="updateroleid" :updaterolename="updaterolename" :updateCName="updateCName" :pageNo="currentPage4"
                @updateRoleinfo="updateRoleinfo">
                </update-role>
                <distru-user v-if="distruuserflag" @disclose="disclose" :distruUser="distruUser"></distru-user>
                <distru-limit v-if="distruLimit" @dislimit="dislimit" :distruLimit="distruUser"></distru-limit>
            </transition>
    </div>
</template>
<script>
    import HeaderTitle from "./common/title"
    import AddRole from "./addRole"
    import UpdateRole from "./updateRole"
    import DistruUser from "./distruUser"
    import DistruLimit from "./distrulimit"
    export default {
        data(){
            return {
                tableData: [
                    
                ],
                lookRole:{
                    usera:''
                },
                currentPage4:1,
                addRoleflag:false,
                updateRoleflag:false,
                distruuserflag:false,
                distruLimit:false,
                pageTotal:0,//一共多少页
                total:0,//一共多少条数
                updateroleid:"",//要把选中的角色的roleid传入修改角色页面
                updaterolename:"",
                updateCName:"",
                index:0,
                distruUser:""//分配用户数据
            }
                
       },
       components:{
            HeaderTitle,
            AddRole,
            UpdateRole,
            DistruUser,
            DistruLimit
       },
       created(){
            this.getRoleInfos(1);
       },
       methods: {
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                let self = this;
                let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                this.$axios.defaults.headers.common['token'] = token;
                const deleteParams={
                    "action":"delAuthRole",
                    "roleid":row.roleid //角色id
                }
                const h = this.$createElement;
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
                            self.$axios.post("/rest",deleteParams).then(res=>{
                                let data=res.data;
                                if(data.code==200){
                                    self.getRoleInfos(self.currentPage4);
                                    self.errMessge("删除成功!","success");
                                }else{
                                    self.errMessge(data.msg_zh,"error");
                                }
                            }).catch(error=>{
                                console.log(error);
                                self.errMessge("请求出错了!","error")
                            })
                            done();
                        } else {
                            done();
                        }
                    }
                }).then(action => {
                
                });
                
                // this.tableData.splice(index,1);
            },
            //查询角色信息,输入关键字查询
            lookuserinfo(roleinfo) {
                this.getRoleInfos(this.currentPage4,roleinfo);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            //当改变页数的时候触发，会呈现对应页数的数据
            handleCurrentChange(val) {
                this.getRoleInfos(val);
            },
            addRole(){
                this.addRoleflag=true;
            },
            close(){
                this.addRoleflag=false;
            },
            updaterole(roleinfo){
                this.updateRoleflag=true;
                 this.updateroleid=roleinfo.roleid;
                 this.updaterolename=roleinfo.rolename;
                 this.updateCName=roleinfo.cname;
            },
            updateClose(){
                this.updateRoleflag=false;
            },
            distruuserfn(index , data){
                this.distruuserflag=true;
                this.distruUser = data;
            },
            disclose(){
                this.distruuserflag=false;
            },
            distrulimit(index,data){
                this.distruLimit=true;
                this.distruUser = data;
            },
            dislimit(){
                this.distruLimit=false;
            },
            //在初始化角色列表的时候，得到所有角色的信息
            getRoleInfos(pageNo,rolename){
                let self = this;
                rolename=rolename || "";
                this.currentPage4=pageNo;
                const data={
                    "action":"getAuthRoleList",
                    "rolename":rolename,//角色名称，非必填
                    "pageNo":pageNo//页码,不填默认为1
                }
                let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                this.$axios.defaults.headers.common['token'] = token;
                this.$axios.post("/rest",data).then(res=>{
                    let self=this;
                    let data=res.data;
                    console.log(data)
                    if(data.code==200){
                        let lists=data.data.list;
                        const pageTotal=data.data.pageTotal;
                        self.total=data.data.total;
                        let roleArray=[];
                        lists.forEach((item,index)=>{
                             let obj={};
                             obj.index=index+1;
                             obj.cname=item.cname;
                             obj.rolename=item.rolename;
                             obj.roleid=item.roleid;
                             obj.operations=item.operations;
                             roleArray.push(obj);
                        })
                        self.tableData=roleArray;
                    }else if(data.code==401){
                        this.errMessge(data.msg_zh);
                        this.$router.push("/login");
                    }else{
                        this.errMessge(data.msg_zh);
                    }
                }).catch(error=>{
                    console.log(error);
                    this.errMessge("请求出错了！")
                })
            },
            //在增加成功之后，重新刷新role页面，展示添加成功的角色
            reloadRoles(){
                this.getRoleInfos(1);
            },
            //在修改角色信息成功之后，会重新刷新role页面，展示修改成功的信息
            updateRoleinfo(pageNo){
                this.getRoleInfos(pageNo);
            },
            //错误信息函数
            errMessge(message,type){
                type=type || "warning";
                this.$message({
                    message:message,
                    type:type
                })
            },
            //排序按照序号排序
            sortData(){
                this.tableData.reverse();
            }
       }
    }
</script>
<style scoped>
    .lookinfo{padding:0 1.6rem;}
    .block{margin-top:20px;padding-right:1.2rem;float:right;}
</style>