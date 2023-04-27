window.live2d_settings = Array(); 
/*
    く__,.ヘヽ.　　　　/　,ー､ 〉
    　　　　　＼ ', !-─‐-i　/　/´        ver.    || |
    　　　 　 ／｀ｰ'　　　 L/／｀ヽ､             | | ||         Live2D 看板娘 AI Version 参数设置
    　　 　 /　 ／,　 /|　 ,　 ,　　　 ',     ||||| |||        Version 2.0.1 (Based on waifu-tips.js V1.0.7)
    　　　ｲ 　/ /-‐/　ｉ　L_ ﾊ ヽ!　 i      ||   | ||||       Update 2022-02 Modified By JimHan From the FGHRSH Version
    　　　 ﾚ ﾍ 7ｲ｀ﾄ　 ﾚ'ｧ-ﾄ､!ハ|　 |
    　　　　 !,/7 '0'　　 ´0iソ| 　 |
    　　　　 |.从"　　_　　 ,,,, / |./ 　 |                     网页添加 Live2D 看板娘
    　　　　 ﾚ'| i＞.､,,__　_,.イ / 　.i 　|                    https://www.fghrsh.net/post/123.html
    　　　　　 ﾚ'| | / k_７_/ﾚ'ヽ,　ﾊ.　|
    　　　　　　 | |/i 〈|/　 i　,.ﾍ |　i　|        Thanks
    　　　　　　.|/ /　ｉ： 　 ﾍ!　　＼　|          journey-ad / https://github.com/journey-ad/live2d_src
    　　　 　 　 kヽ>､ﾊ 　 _,.ﾍ､ 　 /､!             xiazeyu / https://github.com/xiazeyu/live2d-widget.js
    　　　　　　 !'〈//｀Ｔ´', ＼ ｀'7'ｰr'          Live2d Cubism SDK WebGL 2.1 Projrct & All model authors.
    　　　　　　 ﾚ'ヽL__|___i,___,ンﾚ|ノ
    　　　　　 　　　ﾄ-,/　|___./
    　　　　　 　　　'ｰ'　　!_,.:
    **************************************************************************************************************/
window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;
const { ipcRenderer,shell } = nodeRequire('electron'); //Electron 依赖调入

// 后端接口
live2d_settings.modelAPI             = '//waifuapi.zerolite.cn/live2d-api/';   // 自建 API 修改这里
live2d_settings.tipsMessage          = 'waifu-tips.json';            // 同目录下可省略路径
// live2d_settings.hitokotoAPI          = 'hitokoto.cn';                // 一言 API，可选 'lwl12.com', 'hitokoto.cn', 'jinrishici.com'(古诗词)
live2d_settings.eyeProtInfo          = true;                         //启用使用时长提醒
// Variables for time reminder
var setTime = 0; // Set reminder time (in minutes)
var isTimeSet = false; // Is the reminder enabled?
var date, TargetTime = 0; // Stop time
var timer;
var timercontext; // Schedule timing variable
var Quality = 2; // Rendering accuracy variable
var ShowMessageLocker = 0; // Dialogue bubble process lock

// Default model
live2d_settings.modelId = 19; // Default model ID, can be found in F12 console
live2d_settings.modelTexturesId = 1; // Default material ID, can be found in F12 console

// Toolbar settings
live2d_settings.showToolMenu = true; // Show toolbar, optional true (true), false (false)
live2d_settings.alwaysshowToolMenu = true; // Do not hide the toolbar *It is recommended to enable it when using the desktop version, optional true (true), false (false)
live2d_settings.canCloseLive2d = true; // Show "close" button for the character, optional true (true), false (false)
live2d_settings.canSwitchModel = true; // Show "switch model" button, optional true (true), false (false)
live2d_settings.canSwitchTextures = true; // Show "switch texture" button, optional true (true), false (false)
live2d_settings.canSwitchHitokoto = true; // Show "switch hitokoto" button, optional true (true), false (false)
live2d_settings.canTakeScreenshot = true; // Show "screenshot" button for the character, optional true (true), false (false)
live2d_settings.canTurnToHomePage = false; // Show "return to homepage" button, optional true (true), false (false)
live2d_settings.canTurnToAboutPage = true; // Show "jump to about page" button, optional true (true), false (false)
live2d_settings.canEyesCare = true; // Show "night mode" button, optional true (true), false (false)

// Model switching mode
live2d_settings.modelStorage = true; // Record ID (restore after refresh), optional true (true), false (false)
live2d_settings.modelRandMode = 'switch'; // Model switching, optional 'rand' (random), 'switch' (order)
live2d_settings.modelTexturesRandMode = 'rand'; // Material switching, optional 'rand' (random), 'switch' (order)

// Prompt message options
live2d_settings.showHitokoto = true; // Show hitokoto
live2d_settings.showF12Status = true; // Show loading status
live2d_settings.showF12Message = true; // Show character message
live2d_settings.showF12OpenMsg = true; // Show console open prompt
live2d_settings.showWelcomeMessage = true; // Show welcome message when entering the page

// Waifu Style Settings
live2d_settings.waifuSize = '300x360';    // Size of the waifu, e.g. '280x250', '600x535'
live2d_settings.waifuTipsSize = '263x72'; // Size of the tooltip, e.g. '250x70', '570x150'
live2d_settings.waifuFontSize = '17px';   // Font size of the tooltip, e.g. '12px', '30px'
live2d_settings.waifuToolFont = '20px';   // Font size of the toolbar, e.g. '14px', '36px'
live2d_settings.waifuToolLine = '30px';   // Line height of the toolbar, e.g. '20px', '36px'
live2d_settings.waifuToolTop = '-60px';   // Top margin of the toolbar, e.g. '0px', '-60px'
live2d_settings.waifuMinWidth = 'disable';// Hide the waifu if the page width is less than the specified value, e.g. 'disable' (disabled), '768px'
live2d_settings.waifuEdgeSide = 'left:0'; // The direction where the waifu sticks to, e.g. 'left:0' (left-aligned 0px), 'right:30' (right-aligned 30px)
live2d_settings.waifuDraggable = 'unlimited'; // Draggable style, e.g. 'disable' (disabled), 'axis-x' (only horizontally draggable), 'unlimited' (freely draggable)
live2d_settings.waifuDraggableRevert = true; // Revert to the original position after releasing the mouse, either true (yes) or false (no)

// Other miscellaneous settings
live2d_settings.l2dVersion = '2.6.0';             // Current version
live2d_settings.l2dVerDate = '2023-03-15';        // Version update date
live2d_settings.homePageUrl = 'https://www.zerolite.cn/'; // Homepage URL (deprecated)
live2d_settings.aboutPageUrl = 'https://www.zerolite.cn/';// About page URL
live2d_settings.screenshotCaptureName = 'kanban.png';    // File name of the waifu screenshot, e.g. 'live2d.png'


/****************************************************************************************************/

if(localStorage.getItem("showToolbar") == 'false') {live2d_settings.showToolMenu = false;}
if(localStorage.getItem("noHideToolbar") == 'false') {live2d_settings.alwaysshowToolMenu = false;}
if(localStorage.getItem("showMinimum") == 'false') {live2d_settings.canCloseLive2d = false;}
if(localStorage.getItem("showModelSwitch") == 'false') {live2d_settings.canSwitchModel = false;}
if(localStorage.getItem("showTextureSwitch") == 'false') {live2d_settings.canSwitchTextures = false;}
if(localStorage.getItem("showHitokotoSwitch") == 'false') {live2d_settings.canSwitchHitokoto = false;}
if(localStorage.getItem("showScreenShot") == 'false') {live2d_settings.canTakeScreenshot = false;}
if(localStorage.getItem("showNightmode") == 'false') {live2d_settings.canEyesCare = false;}

if(localStorage.getItem("modelRandSwitch") == 'true') {live2d_settings.modelRandMode = 'rand';}
if(localStorage.getItem("textureRandSwitch") == 'false') {live2d_settings.modelTexturesRandMode = 'switch';}
if(localStorage.getItem("showHitokoto") == 'false') {live2d_settings.showHitokoto = false;}
if(localStorage.getItem("showWelcome") == 'false') {live2d_settings.showWelcomeMessage = false;}

if (localStorage.getItem("customAPI")) {live2d_settings.modelAPI=localStorage.getItem("customAPI");}

// 控制台输出

String.prototype.render = function(context) {
	'use strict';
    var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

    return this.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) { return word.replace('\\', ''); }
        
        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;
        
        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) 
			{return '';}
        }
        return currentObject;
    });
};

var re = /x/;
console.log(re);

function empty(obj) {'use strict';return typeof obj==="undefined"||obj===null||obj===""?true:false;}
function getRandText(text) {'use strict';return Array.isArray(text) ? text[Math.floor(Math.random() * text.length + 1)-1] : text;}


/*****************************独立通知提醒框(包含进程锁)***********************************/
function showMessageLocked(text,timeout,flag) {
	'use strict';
    if (flag || sessionStorage.getItem('waifu-text') === '' || sessionStorage.getItem('waifu-text') === null){
        if (Array.isArray(text)) {text = text[Math.floor(Math.random() * text.length + 1)-1];}
        if (live2d_settings.showF12Message) {console.log('[Message]', text.replace(/<[^<>]+>/g,''));}
        
        if (flag) {sessionStorage.setItem('waifu-text', text);}
        
        $('.waifu-tips').stop();
        $('.waifu-tips').html(text).fadeTo(200, 1);
        ShowMessageLocker = 1; //对话内容加锁
        if (timeout != undefined) {hideMessage(timeout);}
    }
} 
function hideMessageLocked(timeout) {
	'use strict';
    $('.waifu-tips').stop().css('opacity',1);
    if (timeout === undefined) {timeout = 5000;}
    window.setTimeout(function() {sessionStorage.removeItem('waifu-text');}, timeout);
    window.setTimeout(function() {ShowMessageLocker = 0;}, timeout);
    $('.waifu-tips').delay(timeout).fadeTo(200, 0);
}

/*************************************自带的核心消息显示函数*************************************/

function showMessage(text, timeout, flag) {
	'use strict';
    if(ShowMessageLocker == 0){ //若锁定则不运行消息显示
        if (flag || sessionStorage.getItem('waifu-text') === '' || sessionStorage.getItem('waifu-text') === null){
            if (Array.isArray(text)) {text = text[Math.floor(Math.random() * text.length + 1)-1];}
            if (live2d_settings.showF12Message) {console.log('[Message]', text.replace(/<[^<>]+>/g,''));}
            
            if (flag) {sessionStorage.setItem('waifu-text', text);}
            
            $('.waifu-tips').stop();
            $('.waifu-tips').html(text).fadeTo(200, 1);
            if (timeout === undefined) {timeout = 5000;}
            hideMessage(timeout);
        }
    }
}

function hideMessage(timeout) {
	'use strict';
    $('.waifu-tips').stop().css('opacity',1);
    if (timeout === undefined) {timeout = 5000;}
    window.setTimeout(function() {sessionStorage.removeItem('waifu-text');}, timeout);
    $('.waifu-tips').delay(timeout).fadeTo(200, 0);
}

/*************************************模型初始化提醒*************************************/

function initModel(waifuPath, type) {
    /* 控制台初始化消息 */
	'use strict';
    eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36));};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e];}];e=function(){return'\\w+';};c=1;}while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('8.d(" ");8.d("\\U,.\\y\\5.\\1\\1\\1\\1/\\1,\\u\\2 \\H\\n\\1\\1\\1\\1\\1\\b \', !-\\r\\j-i\\1/\\1/\\g\\n\\1\\1\\1 \\1 \\a\\4\\f\'\\1\\1\\1 L/\\a\\4\\5\\2\\n\\1\\1 \\1 /\\1 \\a,\\1 /|\\1 ,\\1 ,\\1\\1\\1 \',\\n\\1\\1\\1\\q \\1/ /-\\j/\\1\\h\\E \\9 \\5!\\1 i\\n\\1\\1\\1 \\3 \\6 7\\q\\4\\c\\1 \\3\'\\s-\\c\\2!\\t|\\1 |\\n\\1\\1\\1\\1 !,/7 \'0\'\\1\\1 \\X\\w| \\1 |\\1\\1\\1\\n\\1\\1\\1\\1 |.\\x\\"\\1\\l\\1\\1 ,,,, / |./ \\1 |\\n\\1\\1\\1\\1 \\3\'| i\\z.\\2,,A\\l,.\\B / \\1.i \\1|\\n\\1\\1\\1\\1\\1 \\3\'| | / C\\D/\\3\'\\5,\\1\\9.\\1|\\n\\1\\1\\1\\1\\1\\1 | |/i \\m|/\\1 i\\1,.\\6 |\\F\\1|\\n\\1\\1\\1\\1\\1\\1.|/ /\\1\\h\\G \\1 \\6!\\1\\1\\b\\1|\\n\\1\\1\\1 \\1 \\1 k\\5>\\2\\9 \\1 o,.\\6\\2 \\1 /\\2!\\n\\1\\1\\1\\1\\1\\1 !\'\\m//\\4\\I\\g\', \\b \\4\'7\'\\J\'\\n\\1\\1\\1\\1\\1\\1 \\3\'\\K|M,p,\\O\\3|\\P\\n\\1\\1\\1\\1\\1 \\1\\1\\1\\c-,/\\1|p./\\n\\1\\1\\1\\1\\1 \\1\\1\\1\'\\f\'\\1\\1!o,.:\\Q \\R\\S\\T v"+e.V+" / W "+e.N);8.d(" ");',60,60,'|u3000|uff64|uff9a|uff40|u30fd|uff8d||console|uff8a|uff0f|uff3c|uff84|log|live2d_settings|uff70|u00b4|uff49||u2010||u3000_|u3008||_|___|uff72|u2500|uff67|u30cf|u30fc||u30bd|u4ece|u30d8|uff1e|__|u30a4|k_|uff17_|u3000L_|u3000i|uff1a|u3009|uff34|uff70r|u30fdL__||___i|l2dVerDate|u30f3|u30ce|nLive2D AI |u770b|u677f|u5a18|u304f__|l2dVersion|Designed By FGHRSH, Modified By JimHan|u00b40i'.split('|'),0,{}));
    
    /* 判断 JQuery */
    if (typeof($.ajax) !== 'function') typeof(jQuery.ajax) === 'function' ? window.$ = jQuery : console.log('[Error] JQuery,js未定义');
    
    /* 加载看板娘样式 */
    live2d_settings.waifuSize = live2d_settings.waifuSize.split('x');
    live2d_settings.waifuTipsSize = live2d_settings.waifuTipsSize.split('x');
    live2d_settings.waifuEdgeSide = live2d_settings.waifuEdgeSide.split(':');
    
    $("#live2d").attr("width",live2d_settings.waifuSize[0]*Quality);
    $("#live2d").attr("height",live2d_settings.waifuSize[1]*Quality); 
    $(".waifu-tips").width(live2d_settings.waifuTipsSize[0]);
    $(".waifu-tips").height(live2d_settings.waifuTipsSize[1]);
    $(".waifu-tips").css("top",live2d_settings.waifuToolTop);
    $(".waifu-tips").css("font-size",live2d_settings.waifuFontSize);
    $(".waifu-tool").css("font-size",live2d_settings.waifuToolFont);
    $(".waifu-tool span").css("line-height",live2d_settings.waifuToolLine);
    if (live2d_settings.waifuEdgeSide[0] === 'left') $(".waifu").css("left",live2d_settings.waifuEdgeSide[1]+'px');
    else if (live2d_settings.waifuEdgeSide[0] === 'right') $(".waifu").css("right",live2d_settings.waifuEdgeSide[1]+'px');
    
    window.waifuResize = function() { $(window).width() <= Number(live2d_settings.waifuMinWidth.replace('px','')) ? $(".waifu").hide() : $(".waifu").show(); };
    if (live2d_settings.waifuMinWidth !== 'disable') { waifuResize(); $(window).resize(function() {waifuResize();}); }
    
    try {
        if (live2d_settings.waifuDraggable === 'axis-x') $(".waifu").draggable({ axis: "x", revert: live2d_settings.waifuDraggableRevert });
        else if (live2d_settings.waifuDraggable === 'unlimited') {$(".waifu").css("transition", 'all .4s ease-in-out'); $(".waifu").draggable({ revert: live2d_settings.waifuDraggableRevert });}
        else $(".waifu").css("transition", 'all .4s ease-in-out');
    } catch(err) { console.log('[Error] JQuery UI is not defined.'); }
    
    live2d_settings.homePageUrl = live2d_settings.homePageUrl === 'auto' ? window.location.protocol+'//'+window.location.hostname+'/' : live2d_settings.homePageUrl;
    if (window.location.protocol === 'file:' && live2d_settings.modelAPI.substr(0,2) === '//') live2d_settings.modelAPI = 'http:'+live2d_settings.modelAPI;
    
    $('.waifu-tool .fui-home').click(function (){
        //window.location = 'https://www.zerolite.cn/';
        window.location = live2d_settings.homePageUrl;
    });
    
    $('.waifu-tool .fui-info-circle').click(function (){
        //window.open('https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02');
        window.open(live2d_settings.aboutPageUrl);
    });
    
    if (typeof(waifuPath) === "object") loadTipsMessage(waifuPath); else {
        $.ajax({
            cache: true,
            url: waifuPath === '' ? live2d_settings.tipsMessage : (waifuPath.substr(waifuPath.length-15)==='waifu-tips.json'?waifuPath:waifuPath+'waifu-tips.json'),
            dataType: "json",
            success: function (result){ loadTipsMessage(result); }
        });
    }
    /*************************************start 模块开关实现*************************************/   
    if (!live2d_settings.showToolMenu) $('.waifu-tool').hide();
    if (!live2d_settings.canCloseLive2d) $('.waifu-tool .fui-cross').hide();
    if (!live2d_settings.canSwitchModel) $('.waifu-tool .fui-eye').hide();
    if (!live2d_settings.canSwitchTextures) $('.waifu-tool .fui-user').hide();
    if (!live2d_settings.canSwitchHitokoto) $('.waifu-tool .fui-chat').hide();
    if (!live2d_settings.canTakeScreenshot) $('.waifu-tool .fui-photo').hide();
    if (!live2d_settings.canTurnToHomePage) $('.waifu-tool .fui-home').hide();
    if (!live2d_settings.canTurnToAboutPage) $('.waifu-tool .fui-info-circle').hide();
    if (!live2d_settings.canEyesCare) $('.waifu-tool .fui-moon').hide();
	if (!live2d_settings.eyeProtInfo) $('.waifu-tool .fui-eyeProtInfo').hide(); //日程提醒


    if (waifuPath === undefined) waifuPath = '';
    var modelId = localStorage.getItem('modelId');
    var modelTexturesId = localStorage.getItem('modelTexturesId');
    
    if (!live2d_settings.modelStorage || modelId === null) {
        var modelId = live2d_settings.modelId;
        var modelTexturesId = live2d_settings.modelTexturesId;
    } loadModel(modelId, modelTexturesId);
}

/*************************************模型加载*************************************/

function loadModel(modelId, modelTexturesId=0) {
    if(localStorage.getItem('localModelLoad') == 'true')
    {
        loadlive2d('live2d', localStorage.getItem('localModelPath'), (live2d_settings.showF12Status ? console.log('[Status]','live2d',localStorage.getItem('localModelPath'),'本地模型加载完成'):null));
    }
    else
    {
        if (live2d_settings.modelStorage) { // ! 本地模式判断块
            localStorage.setItem('modelId', modelId);
            localStorage.setItem('modelTexturesId', modelTexturesId);
        } else {
            sessionStorage.setItem('modelId', modelId);
            sessionStorage.setItem('modelTexturesId', modelTexturesId);
        } loadlive2d('live2d', live2d_settings.modelAPI+'get/?id='+modelId+'-'+modelTexturesId, (live2d_settings.showF12Status ? console.log('[Status]','live2d','模型',modelId+'-'+modelTexturesId,'加载完成'):null));
    }
    //输出图片
}

/*************************************提示消息模块*************************************/

function loadTipsMessage(result) {
    window.waifu_tips = result;
    
    $.each(result.mouseover, function (index, tips){
        $(document).on("mouseover", tips.selector, function (){
            var text = getRandText(tips.text);
            text = text.render({text: $(this).text()});
            showMessage(text, 3000);
        });
    });

    $.each(result.click, function (index, tips){
        $(document).on("click", tips.selector, function (){
            var text = getRandText(tips.text);
            text = text.render({text: $(this).text()});
            showMessage(text, 3000, true);
        });
    });

    $.each(result.seasons, function (index, tips){
        var now = new Date();
        var after = tips.date.split('-')[0];
        var before = tips.date.split('-')[1] || after;
        
        if((after.split('/')[0] <= now.getMonth()+1 && now.getMonth()+1 <= before.split('/')[0]) && 
            (after.split('/')[1] <= now.getDate() && now.getDate() <= before.split('/')[1])){
            var text = getRandText(tips.text);
            text = text.render({year: now.getFullYear()});
            showMessage(text, 6000, true);
        }
    });
    
    if (live2d_settings.showF12OpenMsg) {
        re.toString = function() {
            showMessage(getRandText(result.waifu.console_open_msg), 5000, true);
            return '';
        };
    }
    
    /*************************************截图模块*************************************/
    
    $('.waifu-tool .fui-photo').click(function(){
        showMessage(getRandText(result.waifu.screenshot_message), 5000, true);
        window.Live2D.captureName = live2d_settings.screenshotCaptureName;
        window.Live2D.captureFrame = true;
    });
    
    /*************************************最小化模块*************************************/

    $('.waifu-tool .fui-cross').click(function(){
        sessionStorage.setItem('waifu-display', 'none');
        showMessage(getRandText(result.waifu.hidden_message), 1300, true);
        window.setTimeout(function() {ipcRenderer.send('Mainpage','Hide');}, 1300); // 延时
        //window.setTimeout(function() {$('.waifu').hide();}, 1300);
		//window.setTimeout(function() {document.getElementById('PTBox').style.display = 'block';}, 1300);
        window.setTimeout(function() {ipcRenderer.send('PTBox','Open');}, 1300);
    });

    /*************************欢迎消息加载**********（删除了主页判断代码）*****************/   
    
    window.showWelcomeMessage = function(result) {
        var text;
        if (/*window.location.href === live2d_settings.homePageUrl*/true) {
            var now = (new Date()).getHours();
            if (now > 23 || now <= 5) {text = getRandText(result.waifu.hour_tips['t23-5']);}
            else if (now > 5 && now <= 7) {text = getRandText(result.waifu.hour_tips['t5-7']);}
            else if (now > 7 && now <= 11) {text = getRandText(result.waifu.hour_tips['t7-11']);}
            else if (now > 11 && now <= 14) {text = getRandText(result.waifu.hour_tips['t11-14']);}
            else if (now > 14 && now <= 17) {text = getRandText(result.waifu.hour_tips['t14-17']);}
            else if (now > 17 && now <= 19) {text = getRandText(result.waifu.hour_tips['t17-19']);}
            else if (now > 19 && now <= 21) {text = getRandText(result.waifu.hour_tips['t19-21']);}
            else if (now > 21 && now <= 23) {text = getRandText(result.waifu.hour_tips['t21-23']);}
            else {text = getRandText(result.waifu.hour_tips.default);}
        } else {
            var referrer_message = result.waifu.referrer_message;
            if (document.referrer !== '') {
                var referrer = document.createElement('a');
                referrer.href = document.referrer;
                var domain = referrer.hostname.split('.')[1];
                if (window.location.hostname === referrer.hostname)
                    text = referrer_message.localhost[0] + document.title.split(referrer_message.localhost[2])[0] + referrer_message.localhost[1];
                else if (domain === 'baidu')
                    text = referrer_message.baidu[0] + referrer.search.split('&wd=')[1].split('&')[0] + referrer_message.baidu[1];
                else if (domain === 'so')
                    text = referrer_message.so[0] + referrer.search.split('&q=')[1].split('&')[0] + referrer_message.so[1];
                else if (domain === 'google')
                    text = referrer_message.google[0] + document.title.split(referrer_message.google[2])[0] + referrer_message.google[1];
                else {
                    $.each(result.waifu.referrer_hostname, function(i,val) {if (i===referrer.hostname) referrer.hostname = getRandText(val)});
                    text = referrer_message.default[0] + referrer.hostname + referrer_message.default[1];
                }
            } else text = referrer_message.none[0] + document.title.split(referrer_message.none[2])[0] + referrer_message.none[1];
        }
        showMessage(text, 6000);
    }; if (live2d_settings.showWelcomeMessage) showWelcomeMessage(result);
    
    var waifu_tips = result.waifu;
    
    function loadOtherModel() {
        var modelId = modelStorageGetItem('modelId');
        var modelRandMode = live2d_settings.modelRandMode;
        
        $.ajax({
            cache: modelRandMode === 'switch' ? true : false,
            url: live2d_settings.modelAPI+modelRandMode+'/?id='+modelId,
            dataType: "json",
            success: function(result) {
                loadModel(result.model['id']);
                var message = result.model['message'];
                $.each(waifu_tips.model_message, function(i,val) {if (i===result.model['id']) message = getRandText(val)});
                showMessage(message, 3000, true);
            }
        });
    }
    
    function loadRandTextures() {
        var modelId = modelStorageGetItem('modelId');
        var modelTexturesId = modelStorageGetItem('modelTexturesId');
        var modelTexturesRandMode = live2d_settings.modelTexturesRandMode;
        
        $.ajax({
            cache: modelTexturesRandMode === 'switch' ? true : false,
            url: live2d_settings.modelAPI+modelTexturesRandMode+'_textures/?id='+modelId+'-'+modelTexturesId,
            dataType: "json",
            success: function(result) {
                if (result.textures['id'] === 1 && (modelTexturesId === 1 || modelTexturesId === 0))
                    showMessage(waifu_tips.load_rand_textures[0], 3000, true);
                else showMessage(waifu_tips.load_rand_textures[1], 3000, true);
                loadModel(modelId, result.textures['id']);
            }
        });
    }
    
    function modelStorageGetItem(key) { return live2d_settings.modelStorage ? localStorage.getItem(key) : sessionStorage.getItem(key); }
    
    /*********************** 检测用户活动状态，并在空闲时显示一言 **************************/
    
    if (live2d_settings.showHitokoto) {
        window.getActed = false; window.hitokotoTimer = 0; window.hitokotoInterval = false;
        $(document).mousemove(function(e){getActed = true;}).keydown(function(){getActed = true;});
        setInterval(function(){ if (!getActed) ifActed(); else elseActed(); }, 1000);
    }
    
    function ifActed() {
        if (!hitokotoInterval) {
            hitokotoInterval = true;
            hitokotoTimer = window.setInterval(showHitokotoActed, 10000);
        }
    }
    
    function elseActed() {
        getActed = hitokotoInterval = false;
        window.clearInterval(hitokotoTimer);
    }

    function showHitokotoActed() {
        if ($(document)[0].visibilityState === 'visible') showHitokoto();
    }
    
    function showHitokoto() {
        switch(live2d_settings.hitokotoAPI) {
            case 'lwl12.com':
                $.getJSON('https://api.lwl12.com/hitokoto/v1?encode=realjson',function(result){
                    if (!empty(result.source)) {
                        var text = waifu_tips.hitokoto_api_message['lwl12.com'][0];
                        if (!empty(result.author)) text += waifu_tips.hitokoto_api_message['lwl12.com'][1];
                        text = text.render({source: result.source, creator: result.author});
                        window.setTimeout(function() {showMessage(text+waifu_tips.hitokoto_api_message['lwl12.com'][2], 3000, true);}, 5000);
                    } showMessage(result.text, 5000, true);
                });break;
            case 'fghrsh.net':
                $.getJSON('https://api.fghrsh.net/hitokoto/rand/?encode=jsc&uid=3335',function(result){
                    if (!empty(result.source)) {
                        var text = waifu_tips.hitokoto_api_message['fghrsh.net'][0];
                        text = text.render({source: result.source, date: result.date});
                        window.setTimeout(function() {showMessage(text, 3000, true);}, 5000);
                        showMessage(result.hitokoto, 5000, true);
                    }
                });break;
            case 'jinrishici.com':
                $.ajax({
                    url: 'https://v2.jinrishici.com/one.json',
                    xhrFields: {withCredentials: true},
                    success: function (result, status) {
                        if (!empty(result.data.origin.title)) {
                            var text = waifu_tips.hitokoto_api_message['jinrishici.com'][0];
                            text = text.render({title: result.data.origin.title, dynasty: result.data.origin.dynasty, author:result.data.origin.author});
                            window.setTimeout(function() {showMessage(text, 3000, true);}, 5000);
                        } showMessage(result.data.content, 5000, true);
                    }
                });break;
    	    default:
    	        $.getJSON('https://v1.hitokoto.cn',function(result){
            	    if (!empty(result.from)) {
						var uuid1 = result.uuid;
						var url0 = 'https://hitokoto.cn/api/restful/v1/like?sentence_uuid='+uuid1;
                        var text = waifu_tips.hitokoto_api_message['hitokoto.cn'][0];
						$.getJSON(url0,function(rate){
					    $.each(rate, function (i, items) {
						
                  text = text.render({source: result.from, creator: result.creator, rate: rate["data"][0]["total"]});}); });
                        window.setTimeout(function() {showMessage(text, 3000, true);}, 5000);
            	    }
				
				
                showMessage(result.hitokoto, 5000, true);
                });
    	}
    }

    /*************************************亮度遮罩*************************************/
    
    var brightness;
    //显示遮罩
    function cover(brightness) {
        if (typeof (div) === 'undefined') {
            div = document.createElement('div');
            div.setAttribute('style', 'position:fixed;top:0;left:0;outline:5000px solid;z-index:99999;');
            document.body.appendChild(div);
        } else {
            div.style.display = '';
        }
        div.style.outlineColor = 'rgba(0,0,0,' + brightness + ')';
    }

    //事件监听
    window.addEventListener('keydown', function (e) {
        if (e.altKey && e.keyCode === 88) { //Alt+X:关闭
            cover(brightness = 0);
            showMessage('感觉一切都亮起来了呢！', 3000, true);
        }
        if (e.altKey && e.keyCode === 38) { //Alt+↑:增加亮度
            if (brightness - 0.05 > 0.05) cover(brightness -= 0.05);
        }
        if (e.altKey && e.keyCode === 40) { //Alt+↓:降低亮度
            if (brightness + 0.05 < 0.95) cover(brightness += 0.05);
        }
    }, false);
    
    $('.waifu-tool .fui-eye').click(function (){loadOtherModel()}); // 暗黑模式调起
    
    $('.waifu-tool .fui-user').click(function (){loadRandTextures()}); // 模型更换调起
    
    $('.waifu-tool .fui-chat').click(function (){showHitokoto()}); // 一言显示调起

    $('.waifu-tool .fui-Set').click(function() {ipcRenderer.send('Settings','Open');}); // 设置调起

/* Night mode */
$('.waifu-tool .fui-moon').click(function() {
    cover(0.3);
    showMessage('Night mode enabled! Press alt+↑ to increase brightness, alt+↓ to decrease brightness, alt+x to disable night mode.', 5000, true);
  });
  
    /*日程提醒模块点击*/
    if(live2d_settings.eyeProtInfo){
        $('.waifu-tool .fui-eyeProtInfo').click(function(){
          document.getElementById('NLPInfinite').style.display = 'block';
          $('#timeset').focus();
          if(isTimeSet === true && setTime != "" && setTime > 0){
            document.getElementById('TimeDisplay').innerHTML = "Remaining time until the scheduled end: "+(setTime-(new Date()-date)/60000).toFixed(1)+" minutes";
          } else {
            document.getElementById('TimeDisplay').innerHTML = "No scheduled time";
          }
        });
      }
      
	
    /*************************日程提醒函数*************************/
	function Schedulefunc() {
        timer = setInterval(function() {
          showMessage(`Your scheduled event "${timercontext}" reminder time ${setTime} has arrived!`, 5000, true);
          let myNotification = new Notification("日程提醒", {
            title: 'Reminder', 
            subtitle: 'Kanban-Desktop', 
            body: 'Your scheduled event time has arrived. Click this message to stop ringing.',
            silent: false, 
            icon: './assets/notifi.jpg', 
            timeoutType: 'never', 
          });
          var rand = Math.floor(Math.random() * 6);
          var audio = new Audio(`./Alert Alarms/alert${rand}.mp3`); 
          audio.play();
          myNotification.onclick = () => {
            audio.pause();
          };
          date = new Date();
        }, setTime * 60000);
      }
      

	//工具栏默认隐藏
	document.getElementById('NLP2').style.display = 'none';
	//waifu-Tools按钮不隐藏
	document.getElementById('WAIFUTOOL ICON').style.display = 'block';
	document.getElementById('WAIFUTOOL ICON').style.bottom = '0px';
	
    /***********************************最小化气泡****************************************/
	
    $('.PTBox').click(function(){
				document.getElementById('NLP0').style.display = 'block';
				document.getElementById('PTBox').style.display = 'none';
                document.getElementById('SmallCover').style.display = 'none';
	});
	
    /***********************************日程提醒 设定****************************************/
	
    $('.timesetButton').click(function(){
		setTime = document.getElementById('timeset').value; //获取日程时间
        timercontext = document.getElementById('contextset').value; //获取日程内容
		isTimeSet = true;
		if(setTime != "" && setTime > 0 && setTime <= 3000)
		{ date = new Date();
		var hours = date.getHours();          //小时 ,返回 Date 对象的小时 (0 ~ 23)
		var minutes = date.getMinutes()+parseInt(setTime);
		for(let i =1;i!=500;i++)
			{if(minutes>=60)
				{
					minutes-=60;
					hours++;
				}
			if(hours>=24)
				{hours-=24;}
			}
		document.getElementById('TimeDisplay').innerHTML = "日程将在 "+hours.toString().padStart(2, '0')+":"+minutes.toString().padStart(2, '0')+" 时提醒";
		Schedulefunc();
		}
		else {document.getElementById('TimeDisplay').innerHTML = "请输入有效的时间，单位分钟";}
	});
	
    /***********************************日程提醒 重置****************************************/
	
    $('.timeresetButton').click(function(){
		isTimeSet = false;
		setTime = 0;
		timer = window.clearInterval(timer);
		document.getElementById('TimeDisplay').innerHTML = "没有安排的日程";
	});
}
