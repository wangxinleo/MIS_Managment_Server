/*!
 *  基于vue构建  
 *  copyright: wangxinleo wangxin.leo@outlook.com 
 *  time: 2020-6-13 13:39:43
 */
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-62c839cd"],{"610c":function(t,e,s){},"9ed6":function(t,e,s){"use strict";s.r(e);var o=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"login-container"},[s("div",{staticClass:"login-logo-bysj"}),s("el-row",[s("el-col",{attrs:{xs:24,sm:24,md:24,lg:8,xl:8}},[s("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{model:t.loginForm,rules:t.loginRules,"auto-complete":"off","label-position":"left"}},[s("div",{staticClass:"title"},[t._v(" 五株科技OA小组 ")]),s("div",{staticClass:"title-tips"},[t._v("欢迎来到"+t._s(t.title)+"！")]),s("el-form-item",{staticClass:"login-form-admin",staticStyle:{"margin-top":"49px"},attrs:{prop:"userName"}},[s("span",{staticClass:"svg-container svg-container-admin"},[s("byui-icon",{attrs:{icon:["fas","user"]}})],1),s("el-input",{directives:[{name:"focus",rawName:"v-focus"}],attrs:{"auto-complete":"off",placeholder:"请输入用户名",tabindex:"1",type:"text"},model:{value:t.loginForm.userName,callback:function(e){t.$set(t.loginForm,"userName","string"===typeof e?e.trim():e)},expression:"loginForm.userName"}})],1),s("el-form-item",{staticClass:"login-form-pass",attrs:{prop:"password"}},[s("span",{staticClass:"svg-container svg-container-pass"},[s("byui-icon",{attrs:{icon:["fas","lock"]}})],1),s("el-input",{key:t.passwordType,ref:"password",attrs:{type:t.passwordType,"auto-complete":"off",placeholder:"请输入密码",tabindex:"2"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleLogin(e)}},model:{value:t.loginForm.password,callback:function(e){t.$set(t.loginForm,"password","string"===typeof e?e.trim():e)},expression:"loginForm.password"}}),"password"===t.passwordType?s("span",{staticClass:"show-pwd",on:{click:t.showPwd}},[s("byui-icon",{attrs:{icon:["fas","eye-slash"]}})],1):s("span",{staticClass:"show-pwd",on:{click:t.showPwd}},[s("byui-icon",{attrs:{icon:["fas","eye"]}})],1)],1),s("el-button",{staticClass:"login-btn",attrs:{loading:t.loading,type:"primary"},on:{click:t.handleLogin}},[t._v("登录 ")])],1)],1)],1)],1)},i=[],n=(s("96cf"),s("1da1")),r=s("61f7"),a={name:"Login",directives:{focus:{inserted:function(t){t.querySelector("input").focus()}}},data:function(){var t=function(t,e,s){""==e?s(new Error("用户名不能为空")):s()},e=function(t,e,s){Object(r["isPassword"])(e)?s():s(new Error("密码不能少于6位"))};return{nodeEnv:"production",title:this.$baseTitle,loginForm:{userName:"",password:""},loginRules:{userName:[{required:!0,trigger:"blur",validator:t}],password:[{required:!0,trigger:"blur",validator:e}]},loading:!1,passwordType:"password",redirect:void 0}},watch:{$route:{handler:function(t){this.redirect=t.query&&t.query.redirect},immediate:!0}},created:function(){},mounted:function(){var t=this;setTimeout((function(){t.animateShow=!0}))},methods:{showPwd:function(){var t=this;"password"===this.passwordType?this.passwordType="":this.passwordType="password",this.$nextTick((function(){t.$refs.password.focus()}))},handleLogin:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t.$refs.loginForm.validate((function(e){if(!e)return!1;t.loading=!0,t.$store.dispatch("user/login",t.loginForm).then((function(){var e="/404"===t.redirect?"/":t.redirect;t.$router.push({path:e||"/"}).catch((function(){})),t.loading=!1})).catch((function(){t.loading=!1}))}));case 1:case"end":return e.stop()}}),e)})))()}}},c=a,l=(s("f1de"),s("2877")),u=Object(l["a"])(c,o,i,!1,null,"2ae1aa38",null);e["default"]=u.exports},f1de:function(t,e,s){"use strict";var o=s("610c"),i=s.n(o);i.a}}]);