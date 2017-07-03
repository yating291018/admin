<template>
    <div class="distrulimit">
            <div class="distrulimitForm">
                    <header-title :iflag="false">分配权限</header-title>
                    <p class="dis_common">角色名:{{distruLimit.rolename}}</p>
                    <p class="dis_common limit">权限:</p>
                    <div class="dis_tree">
                        <el-tree
                            :data="limitdata"
                            :props="defaultProps"
                            show-checkbox
                            node-key="id"
                            ref="tree"
                            :default-expand-all="false"
                            >
                        </el-tree>
                    </div>
                    <div class="button">
                        <el-button @click="dislimitclose">取消</el-button>
                        <el-button type="primary" @click="submitDistrulimit">确认</el-button>
                        <el-button type="primary" @click="selectTree">选中</el-button>
                    </div>
            </div>
    </div>
</template>
<script>
    let id = 1000;
    import HeaderTitle from "./common/title"
    export default {
         props:["distruLimit"],
         data() {
                return {
                    limitdata: [],
                    defaultProps: {
                        children: 'children',
                        label: 'menuname'
                    },
                    menulists:[],
                    oplists:[],
                    defaultSelect:[]
                }
        },
        components:{
            HeaderTitle
        },
        created(){
            this.initDistruLimit();
        },
        methods: {
            append(store, data) {
                store.append({ id: id++, label: 'testtest', children: [] }, data);
            },

            remove(store, data) {
                store.remove(data);
            },

            dislimitclose(){
                this.$emit("dislimit")
            },
            renderContent(h, { node, data, store }) {
                return (
                    <span>
                        <span>
                          <span>{node.label}</span>
                        </span>
                        <span style="float: right; margin-right: 20px">
                            <el-button size="mini" on-click={ () => this.append(store, data) }>Append</el-button>
                            <el-button size="mini" on-click={ () => this.remove(store, data) }>Delete</el-button>
                        </span>
                    </span>);
            },
            //初始化分配权限的数据
            initDistruLimit(){
                 let self = this;
                 let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                 this.$axios.defaults.headers.common['token'] = token;
                 const distrulimitParams = {
                        "action":"getAuthRoleOperBind",
                        "roleid":self.distruLimit.roleid  //角色id，必填
                 }
                 //初始化选中的
                 var selectArray=[];
                 this.$axios.post("/rest",distrulimitParams).then(res=>{
                     let data = res.data;
                     if(data.code == 200){
                         var limits = data.data.menuList;
                         limits.forEach((item,index)=>{
                             var obj = {};
                             obj.id = item.menuid;
                             obj.menuname = item.menuname;
                             if(item.isUse==1){
                                 selectArray.push({id:item.menuid,menuname:item.menuname});
                             }
                             if(item.sonMenuList.length>0){
                                var children = []
                                item.sonMenuList.forEach((items,index)=>{
                                   var childobj = {};
                                   childobj.level="menu"
                                   childobj.parentid = item.menuid;
                                   childobj.id =items.menuid;
                                   childobj.menuname = items.menuname;
                                   if(items.isUse==1){
                                       selectArray.push({id:items.menuid,menuname:items.menuname});
                                   }
                                   var operaArray = [];
                                   if(items.operationList.length>0){
                                        items.operationList.forEach((opitem,index)=>{
                                                var opera = {};
                                                opera.level="oplist";
                                                opera.parentid =items.menuid;
                                                opera.id = parseInt(opitem.opid);
                                                opera.menuname = opitem.opname;
                                                if(opitem.isUse==1){
                                                    selectArray.push({id:opitem.opid,menuname:opitem.opname});
                                                }
                                                operaArray.push(opera);
                                        })
                                   }
                                   childobj.children = operaArray;
                                   children.push(childobj);
                                })
                                obj.children=children;
                             }
                             self.limitdata.push(obj);
                         })
                         self.defaultSelect = selectArray;
                         self.selectTree()
                     }else{
                         self.errMessage(data.msg_zh,"error");
                     }
                 }).catch(error=>{
                     console.log(error)
                     self.errMessage("请求出错了!","error");
                 })
            },
            errMessage(message,type,time){
                time = time || 2000;
                this.$message({
                    message:message,
                    type:type,
                    duration:time
                })
            },
            //分配权限提交
            submitDistrulimit(){
                let self = this;
                let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                this.$axios.defaults.headers.common['token'] = token;
                var checkedNodes = this.$refs.tree.getCheckedNodes();
                var menuIdList = [];
                var opIdList = [];
                checkedNodes.forEach((item,index)=>{
                     if(item.level=="menu"){
                        menuIdList.push({id:item.id})
                     }else if(item.level == "oplist"){
                         opIdList.push({id:item.id})
                     }
                })
                if(menuIdList.length==0 && opIdList.length==0){
                    return this.errMessage("请选择要分配的权限!","error");
                }
                const limitParams = {
                    "action": "bindAuthRoleOperation",
                    "roleid": this.distruLimit.roleid,//角色id
                    "menuIdList": menuIdList,//授予的菜单id
                    "opIdList":opIdList
                }
                this.$axios.post("/rest",limitParams).then(res=>{
                    var data = res.data;
                    if(data.code == 200){
                        self.errMessage("权限分配成功!","success");
                        self.dislimitclose();
                    }else{
                        self.errMessage(data.msg_zh,"error");
                    }
                }).catch(error=>{
                    console.log(error);
                    self.errMessage("请求出错了!","error")
                })
            },
            //默认勾选
            selectTree() {
                 this.$refs.tree.setCheckedNodes([{id:2,menuname:"角色管理"}]);
            }
        },
        mounted(){
            
        }
}
</script>
<style scoped>
    .distrulimit{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.8);z-index:2000}
    .distrulimitForm{width:600px;height:auto;background:#FFF;position:absolute;left:50%;top:20%;margin-left:-300px;padding:10px 0;border-radius:10px;}
    .dis_common{text-indent:4rem;}
    .limit{padding:10px 0;}
    .dis_tree{width:400px;max-height:200px;margin-left:70px;overflow:auto;margin-top:10px;height:auto;}
    .button{padding-left:64px;margin-top:20px;padding-bottom:10px;}
</style>