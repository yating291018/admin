<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar :itemlist="menuList"></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        data(){
            return {
                menuList:[
                     {
                        icon: 'el-icon-setting',
                        index: "index",
                        title: '首页'
                     }
                ]
            }
        },
        components:{
            vHead, vSidebar
        },
        created(){
            this.initMenu();
        },
        methods:{
            //初始化菜单,根据用户的权限,展示相应的菜单
           initMenu(){
                // var menuLists=this.$route.query.menuList;
                var menuLists=JSON.parse(localStorage.getItem("menulist"));
                if(menuLists.length>0){
                     let self=this;
                     menuLists.forEach((item,index)=>{
                            let obj={};
                            obj.icon="el-icon-menu";
                            obj.subs=[];
                            obj.title=item.menuname;
                            if(item.sonMenuList.length<=0){
                                obj.index="roles"
                            }else{
                                obj.index=index+1+"";
                                for(var i=0;i<item.sonMenuList.length;i++){
                                    let sonitem=item.sonMenuList[i];
                                    var sonobj={};
                                    sonobj.index=sonitem.url;
                                    sonobj.title=sonitem.menuname;
                                    obj.subs.push(sonobj);
                                }
                            }
                            self.menuList.push(obj);
                    })
                }
         }
      }
    }
</script>


