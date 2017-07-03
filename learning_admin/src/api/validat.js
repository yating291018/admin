/*用户名验证*/
export function validatByname(str){
     const reg=/^[0-9|a-z|A-Z|\-|\_]{3,11}$/;
     return reg.test(str);
}

export function validatBypassword(str){
     const reg=/^[^\s*]{6,16}$/;
     return reg.test(str);
}

/*添加中文角色名称*/
export function validatByCName(str){
    const reg=/^[\u4E00-\u9FA5]{2,11}$/;
    return reg.test(str);
}

/*电子邮箱的验证*/
export function validatByEmail(str){
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return reg.test(str);
}

/*中文*/
export function validatByChine(str){
     var reg = /^[\u4E00-\u9FA5]+$/;
     return reg.test(str);
}

/*手机号验证*/
export function validatByTele(str){
    var reg=/^1[3|5|7|8|9]\d{9}$/;
    return reg.test(str);
}