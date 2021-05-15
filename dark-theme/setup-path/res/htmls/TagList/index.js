(function(a,b){function c(a){return Object.prototype.toString.call(a)==="[object Function]"}function i(a){if(!d[a])throw new Error("Module "+a+" is not defined.");var b=d[a];return b.inited===!1&&j(a),b.ret}function j(a){var e={},f=d[a];if(c(d[a].factory)){var g=d[a].factory.apply(b,[i,e,b]);f.ret=g===b?e:g}else f.ret=d[a].factory;f.inited=!0}function k(a,b,f){if(d[a])throw new Error("Module "+a+" has been defined already.");c(b)&&(f=b),d[a]={factory:f,inited:!1},a===e&&j(a)}if(a.define)return;var d={},e=null,f=document.getElementsByTagName("script");for(var g=0,h=f.length;g<h&&!e;g++)e=f[g].getAttribute("data-main");if(!e)throw new Error("No data-main attribute in script tag.");a.define=k})(window);define("common/core/debug/console",function(){var a=["log","debug","info","warn","error","assert","clear","dir","dirxml","trace","group","groupEnd","time","timeEnd","timeStamp","profile","profileEnd","count","exception","table"],b=!!(window&&window.console&&window.console.log),c={},d=function(){},e,f;if(b&&window.DEBUG)return window.console;f=a.length;for(e=0;e<f;e++)c[a[e]]=d;return c});define("Client/view/TagList",function(a){var b=a("common/lib/jquery"),c=a("common/lib/underscore"),d=a("common/lib/backbone"),e=a("common/core/debug/console"),f=a("Client/io/CEF"),g=a("Client/io/TagListApi"),h=c.tmpl("listItem"),i=d.View.extend({tagName:"ul",className:"tl-container",events:{"mousedown .tl-item a":"onMouseDown","click .tl-item a":"onClick"},initialize:function(){var a=this,d=document;d.body.appendChild(a.el),a.lastMouseDownTagId=null,b(d).bind("mouseup",a.onDocMouseUp.bind(a)),c.each(g,function(b,c){f.provide(c,b.bind(a))}),f.ready(d)},setContent:function(a){var d=this,e=[],f;c.each(a,function(a){if(!a||!a.id||!a.name)return;e.push(h(a))}),f=b(d.el).html(e.join("")).find(".tl-item"),c.each(a,function(a){if(!a||!a.id||!a.name)return;var b="[data-tag-id="+a.id+"]";f.filter(b).find("span").text(a.name).attr("title",a.name)})},onMouseDown:function(a){var c=this,d=a.target;c.lastMouseDownTagId=b(d).parent().attr("data-tag-id")},onDocMouseUp:function(){var a=this,c=a.lastMouseDownTagId,d=".tl-item[data-tag-id="+c+"]",e=b(d,a.el).get(0);e&&b(e).removeClass("tl-down"),a.lastMouseDownTagId=null},onClick:function(a){var c=this,d=b(a.target).parent().attr("data-tag-id"),e;if(!d)return;e=f.YNote.DeleteTag(d),e&&b(a.target).parents("li:first").remove()}});return i});define("common/lib/jquery",function(){var a=window.jQuery;return window.DEBUG||(a=a.noConflict(!0)),a});define("common/lib/underscore",function(a){var b=window._,c=a("common/lib/jquery");return b.tmpl=function(a,d){var e=document.getElementById(a+"Tmpl"),f="";return e?(f=e.innerHTML,d!==!1&&(f=c.trim(f))):window.DEBUG&&window.console.error("Cannot find template element",a),b.template(f)},window.DEBUG||(b=b.noConflict()),b});define("common/lib/backbone",function(){var a=window.Backbone;return window.DEBUG||(a=Backbone.noConflict()),a});define("Client/io/CEF",function(a,b){var c=a("common/lib/backbone"),d=a("common/lib/underscore"),e=a("common/core/debug/console"),f=function(a){return a=a.toString(),a.replace(/%/g,function(){return"%%"})},g=d.extend({},c.Events,{apis:{},ready:function(){this.YNote.Ready(this.execApi.bind(this),document)},provide:function(a,b){this.apis[a]=b},execApi:function(a,b){var c=Date.now(),d=this.apis[a],g=null;if(!d){this.YNote.Log(this.YNote.LOG_FATAL,f("CEF.Ynote has no api: "+a));return}DEBUG&&(e.profile("api."+a),e.time("api."+a));try{g=d.apply(null,b)}catch(h){throw DEBUG&&e.error(h.stack),this.YNote.Log(this.YNote.LOG_FATAL,f(h.toString()+h.stack.toString())),h}DEBUG&&(e.timeEnd("api."+a),e.profileEnd("api."+a)),this.YNote.Log(this.YNote.LOG_INFO,f("api."+a+" time cost:"+(Date.now()-c)+"ms"));if(g)try{g=JSON.stringify(g)}catch(i){}return g},asyncCallYNote:function(a,b,c){var d="on"+a;this.unbind(d),typeof b=="function"&&(c=b,b=[]),this.YNote[a].apply(this.YNote,b);var e=function(){c.apply(null,arguments),this.unbind(d,e)};this.bind(d,e,this)},YNote:window.YNote});return window.DEBUG&&(g.YNote=g.YNote||{},d.defaults(g.YNote,a("Client/io/CEFApiInterface")),window.CEF=g),g});define("Client/io/CEFApiInterface",function(a,b){var c=a("common/core/debug/console"),d={Ready:function(a,b){window.CEFCallback=a,c.log("YNote.Ready",b)},DeleteTag:function(a){return c.log("YNote.DeleteTagItem: "+a),!0},Log:function(a,b){c.log("debug",a,b)},LOG_DEBUG:3,LOG_INFO:2,LOG_WARN:1,LOG_FATAL:0};return d});define("Client/io/TagListApi",function(a,b){var c=a("common/core/str/base64"),d=a("common/lib/underscore"),e=a("common/lib/jquery"),f=a("Client/io/CEF"),g={setContent:function(a){var b=this,c;try{c=window.JSON.parse(a)}catch(d){c=null}if(!c||!c.length)return;b.setContent.call(b,c)}};return g});define("common/core/str/base64",function(a,b){return{encode:function(a){return window.btoa(window.unescape(encodeURIComponent(a)))},decode:function(a){return decodeURIComponent(window.escape(window.atob(a)))}}});define("init/client",function(a){var b=a("common/core/debug/console"),c=a("Client/view/TagList"),d;d=new c,window.DEBUG&&(window.taglistObj=d)});