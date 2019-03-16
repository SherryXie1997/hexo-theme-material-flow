
let homePath = 'https://www.96486d9b.cn/';

function showHitokoto() {
    $.getJSON('https://v1.hitokoto.cn/', function (result) {
        showMessage(result.hitokoto, 5000);
    });
}

function showMessage(text, timeout) {
    if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1) - 1];
    $('.waifu-tips').stop();
    $('.waifu-tips').html(text).fadeTo(200, 1);
    if (timeout === null) timeout = 5000;
    hideMessage(timeout);
}

function hideMessage(timeout) {
    $('.waifu-tips').stop().css('opacity', 1);
    if (timeout === null) timeout = 5000;
    $('.waifu-tips').delay(timeout).fadeTo(200, 0);
}


let live2dBind = () => {

    String.prototype.render = function (context) {
        let tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
        return this.replace(tokenReg, function (word, slash1, token, slash2) {
            if (slash1 || slash2) {
                return word.replace('\\', '');
            }
            let variables = token.replace(/\s/g, '').split('.');
            let currentObject = context;
            let i, length, variable;
            for (i = 0, length = variables.length; i < length; ++i) {
                variable = variables[i];
                currentObject = currentObject[variable];
                if (currentObject === undefined || currentObject === null) return '';
            }
            return currentObject;
        });
    };

    let re = /x/;
    console.log(re);
    re.toString = function () {
        showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 5000);
        return '';
    };

    $(document).on('copy', function () {
        showMessage('你都复制了些什么呀，转载要记得加上出处哦~', 5000);
    });


    $('.waifu-tool .fa-window-close').click(function () {
        showMessage('我们还能再见面的吧…', 1500);
        window.setTimeout(function () { $('.waifu').hide(); }, 1500);
    });

    $('.waifu-tool .fa-music').click(function () {
        apFixed.toggle();
    });

    $('.waifu-tool .fa-comment').click(function () {
        showHitokoto();
    });

    // $('.waifu-tool .fa-image').click(function () {
    //     if ($('.l_bg').is(":visible")) {
    //         $('.l_bg').hide();
    //         $('#evanyou').show();
    //     }
    //     else {
    //         $('#evanyou').hide();
    //         $('.l_bg').show();
    //         showMessage('可能需要滚动才能刷新哦，如果一直灰灰的则说明网路不佳！', 5000);
    //     }
    // });

    // $('.waifu-tool .fa-eraser').click(function () {
    //     $("#bing").remove();
    //     $("#evanyou").remove();
    //     apFixed.destroy();
    //     $("#aplayer-fixed").remove();
    //     showMessage('我们还能再见面的吧…', 2000);
    //     window.setTimeout(function () { $('.waifu').hide(); }, 2000);
    // });

    $.ajax({
        cache: true,
        url: "/live2d/message.json",
        dataType: "json",
        success: function (result) {
            $.each(result.mouseover, function (index, tips) {
                $(document).on("mouseover", tips.selector, function () {
                    let text = tips.text;
                    if (Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
                    text = text.render({ text: $(this).text() });
                    showMessage(text, 1000);
                });
            });
            $.each(result.click, function (index, tips) {
                $(document).on("click", tips.selector, function () {
                    let text = tips.text;
                    if (Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
                    text = text.render({ text: $(this).text() });
                    showMessage(text, 1000);
                });
            });
        }
    });
}

let live2dWelcome = () => {
    let text;
    if (document.referrer !== '') {
        let referrer = document.createElement('a');
        referrer.href = document.referrer;
        text = '嗨！来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友！';
        let domain = referrer.hostname.split('.')[1];
        if (domain == 'baidu') {
            text = '嗨！ 来自 百度搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        } else if (domain == 'so') {
            text = '嗨！ 来自 360搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        } else if (domain == 'google') {
            text = '嗨！ 来自 谷歌搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }
    } else {
        if (window.location.href == `${homePath}`) {
            let now = (new Date()).getHours();
            if (now > 23 || now <= 5) {
                text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？';
            } else if (now > 5 && now <= 7) {
                text = '早上好！一日之计在于晨，美好的一天就要开始了！';
            } else if (now > 7 && now <= 11) {
                text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
            } else if (now > 11 && now <= 14) {
                text = '中午了，工作了一个上午，现在是午餐时间！';
            } else if (now > 14 && now <= 17) {
                text = '午后很容易犯困呢，今天的运动目标完成了吗？';
            } else if (now > 17 && now <= 19) {
                text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~~';
            } else if (now > 19 && now <= 21) {
                text = '晚上好，今天过得怎么样？';
            } else if (now > 21 && now <= 23) {
                text = '已经这么晚了呀，早点休息吧，晚安~~';
            } else {
                text = '嗨~ 快来逗我玩吧！';
            }
        } else {
            text = '欢迎来到 <span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }
    }
    showMessage(text, 4000);
};


function showConsoleTips(content) {
    var style_green = "font-family:'微软雅黑';font-size:1em;background-color:#34a853;color:#fff;padding:4px;";
    var style_green_light = "font-family:'微软雅黑';font-size:1em;background-color:#42d268;color:#fff;padding:4px;";
    console.log("%cLive2d%c模型" + content + "完成", style_green, style_green_light);
}

var queue = new createjs.LoadQueue();
queue.installPlugin(createjs.Sound);
queue.on("complete", handleComplete, this);
queue.loadManifest([
    { id: "t_1", src: "/live2d/model/uiharu/uiharu.1024/texture_00.png" },
    { id: "t_2", src: "/live2d/model/uiharu/uiharu.1024/texture_01.png" },
    { id: "m_1", src: "/live2d/model/uiharu/motions/tap/motion1.mtn" },
    { id: "m_2", src: "/live2d/model/uiharu/motions/tap/motion2.mtn" },
    { id: "m_3", src: "/live2d/model/uiharu/motions/tap/motion3.mtn" },
    { id: "m_4", src: "/live2d/model/uiharu/motions/tap/motion4.mtn" },
    { id: "m_5", src: "/live2d/model/uiharu/motions/tap/motion5.mtn" },
    { id: "m_6", src: "/live2d/model/uiharu/motions/tap/motion6.mtn" },
    { id: "m_7", src: "/live2d/model/uiharu/motions/tap/motion7.mtn" },
    { id: "e_1", src: "/live2d/model/uiharu/expressions/f01.exp.json" },
    { id: "e_2", src: "/live2d/model/uiharu/expressions/f02.exp.json" },
    { id: "e_3", src: "/live2d/model/uiharu/expressions/f03.exp.json" },
    { id: "e_4", src: "/live2d/model/uiharu/expressions/f04.exp.json" },
    { id: "e_5", src: "/live2d/model/uiharu/expressions/f05.exp.json" },
    { id: "e_6", src: "/live2d/model/uiharu/expressions/f06.exp.json" },
    { id: "e_7", src: "/live2d/model/uiharu/expressions/f07.exp.json" },
    { id: "e_8", src: "/live2d/model/uiharu/expressions/f08.exp.json" },
    { id: "f_1", src: "/live2d/model/uiharu/physics.json" },
    { id: "f_2", src: "/live2d/model/uiharu/uiharu.moc" },
    { id: "f_3", src: "/live2d/model/uiharu/uiharu.model.json" }
]);

function handleComplete() {
    $(".waifu-tool span").hide();
    loadlive2d("live2d", "/live2d/model/uiharu/uiharu.model.json", showConsoleTips("加载"));
    $("#live2d").animate({ opacity: '1' }, 2000);
    window.setTimeout(function () {
        live2dBind();
        live2dWelcome();
        $(".waifu-tool span").show();
    }, 2000);
}
