<template>
    <h3>
      <i :class="lrmove" @click="leftmove" class="lrmove" v-if="iflag"></i>
      <slot></slot>
    </h3>
</template>
<script>
    export default {
        props:["iflag"],
        data(){
            return {
                index:0,
                lrmove:"el-icon-d-arrow-left"
            }
        },
        methods:{
            //主题部分向左移动的效果
            leftmove(){
                 var left=0,sidebarleft=0;
                 var lrmove=""
                 if(this.index%2==0){
                     left=25;
                     sidebarleft=-15;
                     lrmove="el-icon-d-arrow-right"
                 }else{
                     left=180;
                     sidebarleft=0;
                     lrmove="el-icon-d-arrow-left"
                 }
                 let self = this;
                 $(".sidebar").animate({left:sidebarleft},200);
                 $(".content").animate({left:left},500,function(){
                        self.lrmove = lrmove;
                 });
                 this.index++;
            }
        }
    
    }
</script>
<style scoped>
    h3{text-indent:.8rem;margin-top:0px;margin-bottom:20px;}
</style>