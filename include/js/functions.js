;(function(){

	window.wjt = {
        /***
        * 获取box里面所有的表单的值，返回一个对象
        */
        getValues : function(selecter){
            var content = {};
            var key;
            $(selecter).find('input').each(function(){
                key = $(this).attr('data-field');
                if( !key ){
                    key = this.id
                }
                content[ key ] = this.value;
                key = null;
            });
            $(selecter).find('select').each(function(){
                key = $(this).attr('data-field');
                if( !key ){
                    key = this.id
                }
                content[ key ] = $(this).val();
                key = null;
            });
            $(selecter).find('textarea').each(function(){
                key = $(this).attr('data-field');
                if( !key ){
                    key = this.id
                }
                content[ key ] = $(this).val();
                key = null;
            });
            return content;
        },

        /***
        * 设置box里面表单的默认值
        * @ param boxSelecter box的选择器，是ID或者class等
        * @ param data 要初始化的数据，对象格式，key与box里面的input的data-field属性或者id一样时赋值
        */
        setValues : function(boxSelecter, data){
            var key;
            $(boxSelecter).find('input').each(function(){
                key = $(this).attr('data-field');
                key = key || $(this).attr('id');

                if( typeof data[key] != 'undefined' ){
                    $(this).val( data[key] );
                }
            });
            $(boxSelecter).find('select').each(function(){
                key = $(this).attr('data-field');
                key = key || $(this).attr('id');

                if( typeof data[key] != 'undefined' ){
                    $(this).val( data[key] );
                }
            });
            $(boxSelecter).find('textarea').each(function(){
                key = $(this).attr('data-field');
                key = key || $(this).attr('id');

                if( typeof data[key] != 'undefined' ){
                    $(this).val( data[key] );
                }
            });
        },

        /***
        * 清除box里面的input、textarea的默认值
        */
        clearValues : function(selecter){
            $(selecter).find('input').each(function(){
                var type = $(this).attr('type');
                if( type != 'radio' && type != 'checkbox'){
                    $(this).val('');
                }else{
                    $(this).attr('checked', false);
                }
            });
            $(selecter).find('select').val('');
            $(selecter).find('textarea').val('');
        },

        /***
        * 检测box内所有的input输入框是否合法
        */
        checkValues : function(selecter, isAlert, tipHideTime){
            var re = true;
            isAlert = typeof isAlert == 'undefined' ? true : isAlert;
            $(selecter).find('input').each(function(){
                if( $(this).val() == '' && ( $(this).attr('data-required') == 'true' || $(this).attr('data-required') == '1' ) ){
                    if( isAlert ){
                        var tip = $(this).attr('data-tip');
                        console.log(tip)
                        if( tip ){
                            wjt.showTip(tip, true, 3000);
                        }
                    }
                    var $this = $(this);
                    $this.focus();
                    $(this).css({'background': 'red'}).bind('keydown click', function(){
                        $(this).css({'background': '#fff'});
                    });
                    re = false;
                    return false;
                }
            });
            if( re == false ){
                return false;
            }
            $(selecter).find('select').each(function(){
                if( $(this).val() == '' && ( $(this).attr('data-required') == 'true' || $(this).attr('data-required') == '1' ) ){
                    if( isAlert ){
                        var tip = $(this).attr('data-tip');
                        if( tip ){
                            wjt.showTip(tip, true, 3000);
                        }
                    }
                    var $this = $(this);
                    $this.focus();
                    $(this).css({'background': 'red'}).bind('keydown click', function(){
                        $(this).css({'background': '#fff'});
                    });
                    re = false;
                    return false;
                }
            });

            if( re == false ){
                return false;
            }
            $(selecter).find('textarea').each(function(){
                if( $(this).val() == '' && ( $(this).attr('data-required') == 'true' || $(this).attr('data-required') == '1' ) ){
                    if( isAlert ){
                        var tip = $(this).attr('data-tip');
                        if( tip ){
                            wjt.showTip(tip, true, 3000);
                        }
                    }
                    var $this = $(this);
                    $this.focus();
                    $(this).css({'background': 'red'}).bind('keydown click', function(){
                        $(this).css({'background': '#fff'});
                    });
                    re = false;
                    return false;
                }
            });
            if( re == false ){
                return false;
            }
            return true;
        },

        /***
        * str to json
        */
        strToJson : function(str){
            return typeof (str) == 'string' ? eval('('+ str +')') : str;
        },

        /***
        * js获取GET参数
        */
        GET : (function (){
            var arr = location.search.substr(1).split('&');
            var _get = [], valArr = [];
            for(var key in arr){
                valArr = arr[key].split('=');
                _get[ valArr[0] ] = valArr[1];
            }
            return _get;
        })(),

        /***
        * 开始加载的提示
        */
        loadStart : function(status){
            if( !$('#show-loading-status').size() ){
                $('body').append('<div id="show-loading-status" style="position:fixed;*position:absolute;z-index:9999999;left:50%;top:50%;display:none;"><img style="position:absolute;margin-left:-18px;margin-top:-20px;width:18px;max-width:18px;" src="/include/images/system/loading.gif" ></div>');
            }
            if(status){
                $('#show-loading-status').css({'left':0,'top':0,'right':0,'bottom':0,'background':'rgba(1,1,1,.5)'});
                $('#show-loading-status img').css({'left':'50%','top':'50%'});
            }
            $('#show-loading-status').show();
        },

        /***
        * 结束加载提示
        */
        loadEnd : function(){
            $('#show-loading-status').css({'left':'50%','top':'50%','right':'auto','bottom':'auto','background':'none'}).hide();
            $('#show-loading-status img').css({'left':'0','top':'0'});
        },

        /***
        * 分享提示显示
        */
        shareTip : function (text){
            if( ! $('#show-share-box').size() ){
                var html = '';
                html += '<div id="show-share-box" class="" onclick="$(this).hide();" style="background: rgba(0, 0, 0, 0.8) none repeat scroll 0% 0%; left: 0px; top: 0px; right: 0px; bottom: 0px; position: fixed; text-align: right; z-index: 9999999; display: block;">';
                html += '<p class="share-pic"><img style="width:120px;" src="/include/images/system/share_icon.png"></p>';
                html += '<p class="des" align="center" id="show-share-title" style="font-size: 20px; color: rgb(255, 255, 255);"></p>';
                html += '</div>';
                $("body").append(html);
            }
            else{
                $('#show-share-box').show();
            }
            $("#show-share-title").html(text);
        },

        /***
        * 弹出提示信息
        * param tipMsg string 提示信息内容
        * param autoClose bloor 是否点击弹出层自动关闭
        * param hideTime int 自动关闭的时间
        */
        showTip : function(tipMsg, autoClose, hideTime){
            autoClose = autoClose == undefined ? 1 : autoClose;
            hideTime = hideTime || 0;
            var html = ''
            html += '<div id="show-tip-msg-box" style="position:fixed;z-index:9998;width:100%;height:100%;left:0;top:0;background:rgba(1,1,1,.7);">';
            html += '<div style="position:fixed;z-index:9999;left:4%;padding:10px 2%;width:88%;top:20%;max-height:300px;text-align:center; overflow-y:auto;background:#fff;border-radius:5px;"><div style="color:#111;">' + tipMsg + '</div>';
            if( autoClose ) html += '<div style="text-align:center;"><a href="javascript:;" onclick="$(\'#show-tip-msg-box\').remove();" style="display:block;width:80px;color:#111;background:#aaa;padding:3px 5px;margin: 5px auto;border-radius:5px;">确认</a></div>';
            html += '</div>';
            html += '</div>';


            $('body').append(html);
            if( hideTime ){
                setTimeout(function(){
                    $('#show-tip-msg-box').remove();
                }, hideTime);
            }
        },

        /***
        * 音乐播放小挂件
        * param audioUrl  string 音乐地址
        * param audioCss  object 音乐播放挂件的样式（一般是位置）
        * return musicObject 音乐对象
        */
        widgetMusic : function(audioUrl, audioCss){
            var css = '';
            if( audioCss ){
                for(var k in audioCss){
                    css += k + ':' + audioCss[k] + ';'
                }
            }
            var index = ( Math.random() + '' ).substr(2);
            var html = [
                '<style type="text/css">',
                ' .voice'+ index +'{ position: absolute; right: 1rem; top: 1rem; z-index: 99; } .voice'+ index +' .voice'+ index +'-icon{ display: block; width: 34px; height: 34px; background: url(/include/images/system/activity/mid_play_strat.png) no-repeat; background-size: 34px 34px; } .voice'+ index +' .on'+ index +'{ background: url(/include/images/system/activity/mid_play_stop.png) no-repeat; background-size: 34px 34px; } .voice'+ index +' .voice'+ index +'-icon-ani{ -webkit-animation: spin 1s .2s infinite linear; } @-webkit-keyframes spin{ 0% { -webkit-transform: rotate(0deg); -moz-transform: rotate(0deg); transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); -moz-transform: rotate(360deg); transform: rotate(360deg); } }',
                ' .voice'+ index +'{' + css + '}',
                '</style>',
                '<div class="voice'+ index +'">',
                    '<span class="voice'+ index +'-icon voice'+ index +'-icon-ani" id="voice'+ index +'" data-play="1"></span>',
                    '<audio id="audio'+ index +'" controls="controls" loop="loop" autoplay="autoplay" style="position:absolute;left:-999px;top:-999px;">',
                        '<source src="' + audioUrl + '">',
                    '</audio>',
               '</div>',
            ].join('');

            $('body').append(html);

            //控制音乐
            var musicObject = document.getElementById('audio'+ index);
            $('#voice'+ index).click(function(){
                var _this = $(this);
                if ( _this.attr('data-play') == 1 ) {
                    musicObject.pause();
                    _this.attr('data-play', 0);
                    $('#voice'+ index).removeClass('voice'+ index +'-icon-ani').addClass('on' + index);
                } else {
                    musicObject.play();
                    _this.attr('data-play', 1);
                    $('#voice'+ index).removeClass('on' + index).addClass('voice'+ index +'-icon-ani');
                }
            });

            return musicObject;
        },

        /***
        * 把时间由数字格式化为字符串
        */
        formatTime : function(time){
            var output = '';
            var arr = [
                [86400 , '天'],
                [3600 , '小时'],
                [60 , '分'],
                [1 , '秒'],
            ];
            for(var key in arr  ) {
                if (time >= arr[key][0]) output += Math.floor(time/arr[key][0]) + arr[key][1];
                time %= arr[key][0];
            }
            return output;
        },

        /***
        * 统计分享
        */
        shareCount : function(shareType){
            var content = {
                'shareCode' : dataForWeixin.shareCode,
                'relationId' : dataForWeixin.relationId,
                'relationType' : dataForWeixin.relationType,
                'shareType' : shareType
            };
             // for(var key in content) alert(key + ':' + content[key]);
            $.post('?m=LogCount&a=shareCountDo', content, function(d){
                 // alert(d); $('body').html(d);
				$('#show-share-box').hide();
            });
        },

        /***
        * 统计访问记录
        */
        visitorCount : function(url, clientId, userId, serverPath){
            if( !url ) return;
            if( !serverPath ) serverPath = '';
            var content = {
                'clientId' : clientId,
                'userId' : userId,
                'relationType' : dataForWeixin.relationType,
                'relationId' : dataForWeixin.relationId,
                'thisUrl' : url + (wjt.GET['shareCode'] ? '&shareCode=' + wjt.GET['shareCode']  : ''),
                'referrer' : document.referrer,
            };
            // for(var key in content) alert(key + ':' + content[key]);
            $.post(serverPath + '?m=LogCount&a=visitorCountDo', content, function(d){
                // alert(d);
            });
        },
        /***
        * 微信上传图片接口
        * @param mo    string   上传的模块（如article、album等）
        * @param func  function 回调函数，传入上传结果参数
        * @param func2 function/boolean 回调函数，在微信上传成功后，向服务器发起上传保存文件之前执行（可以做一些提示信息显示一般）/true则显示load状态
        * @param data  object   上传待的参数，目前支持clientId(有时需要前端传入clientid)
        */
        weixinUploadeImage: function(mo, func, func2, data){
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    // console.log(localIds)
                    wx.uploadImage({
                        localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                            var serverId = res.serverId; // 返回图片的服务器端ID
                            // console.log('serverId:' + serverId)
                            var content = ( typeof data == 'object' ) ? data : {};
                            content['serverId'] = serverId;

                            //d = 'test data'
                            if ( typeof func2 === 'function' ){
                                func2();
                            }else if( func2 === true ){
                                wjt.loadStart();
                            }
                            $.post('?m=Uploade&a=weixinImage&mo=' + mo, content, function(d){
                                if ( typeof func === 'function' ){
                                    func(d);
                                }
                                if( func2 === true ){
                                    wjt.loadEnd();
                                }
                            })
                        }
                    });
                }
            });
        },
        /***
        * 快速动态设置分享标题和描述
        */
        previewImage: function(selecter){
            var prefix = selecter.substr(0, 1);
            if( prefix != '#' && prefix != '.' ){
                selecter = '#' + selecter;
            }

            var urls = [];
            $(selecter + ' img').each(function(){
                urls.push($(this).attr('src'));
            });

            $(selecter + ' img').click(function(){
                wx.previewImage({
                    current : $(this).attr('src'),
                    urls : urls,
                });
            });

        },
        /***
        * 快速动态设置分享标题和描述
        */
        setShareInfo: function(obj){
            window.dataForWeixin.title = obj.title || window.dataForWeixin.title;
            window.dataForWeixin.desc = obj.desc || window.dataForWeixin.desc;
            window.wjt.weixinSdkInit();
        },
        /***
        * 初始化微信JSsdk的一些功能
        */
        weixinSdkInit: function(){
            wx.ready(function () {
                // 分享到朋友
                wx.onMenuShareAppMessage({
                    title: dataForWeixin.title,
                    link: dataForWeixin.link,
                    desc: dataForWeixin.desc,
                    imgUrl: dataForWeixin.MsgImg || dataForWeixin.imgUrl,
                    trigger: function (res) { },
                    success: function (res) {
                        wjt.shareCount('1');
                        //如果有回调方法，则执行
                        if( typeof( dataForWeixin.success ) == 'function' ){
                            dataForWeixin.success();
                        }
                    },
                    cancel: function (res) {  },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });

                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: dataForWeixin.title,
                    link: dataForWeixin.link,
                    imgUrl: dataForWeixin.MsgImg || dataForWeixin.imgUrl,
                    trigger: function (res) { },
                    success: function (res) {
                        wjt.shareCount('2');
                        //如果有回调方法，则执行
                        if( typeof( dataForWeixin.success ) == 'function' ){
                            dataForWeixin.success();
                        }
                    },
                    cancel: function (res) { },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                // 分享到QQ
                wx.onMenuShareQQ({
                    title: dataForWeixin.title,
                    link: dataForWeixin.link,
                    imgUrl: dataForWeixin.MsgImg || dataForWeixin.imgUrl,
                    trigger: function (res) {  },
                    success: function (res) {
                        wjt.shareCount('3');
                        //如果有回调方法，则执行
                        if( typeof( dataForWeixin.success ) == 'function' ){
                            dataForWeixin.success();
                        }
                    },
                    cancel: function (res) {},
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                //隐藏掉一部分菜单
                wx.hideMenuItems({
                    menuList: ['menuItem:readMode', 'menuItem:share:brand'] // 要隐藏的菜单项，所有menu项见附录3
                });
            });
        },
        /***
        * 隐藏分享等功能
        */
        hideOptionMenu: function(){
            wx.ready(function(){
                wx.hideOptionMenu();
            });
            $(document).on('touchstart', function(){
                wx.hideOptionMenu();
            });
        },
        /***
        * 显示分享等功能
        */
        showOptionMenu: function(){
            wx.ready(function(){
                wx.showAllNonBaseMenuItem();
            });
        },
        /***
        * jsApiList
        */
        wxJsApiList : ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','translateVoice','startRecord','stopRecord','onRecordEnd','playVoice','pauseVoice','stopVoice','uploadVoice','downloadVoice','chooseImage','previewImage','uploadImage','downloadImage','getNetworkType','openLocation','getLocation','hideOptionMenu','showOptionMenu','closeWindow','scanQRCode','chooseWXPay','openProductSpecificView','addCard','chooseCard','openCard', 'getLocalImgData'],
    };

    //微信转发时获取内容
    ;(function(){
        //微信分享设置参数
        window.dataForWeixin = {
            appId : "wx86c5e43fa0c9bd3e",
            imgUrl : "http://nwx.weijingtong.net/include/images/logo.jpg",
            link : "http://mp.weixin.qq.com/s?__biz=MzA3NDMyMTYyOA==&mid=200036470&idx=1&sn=9bdb75ce715f07a49d40b938ddd0d002#rd",
            title : "欢迎关注微景通",
            desc : "关注微景通，获取更多旅游资源和信息……",
            shareCode : "",          //分享出去的分享码，用来统计点回
            relationType : "0",      //用来统计是哪个手机页面，与系统的share_type对应
            relationId : "0",        //分享出去的具体的详情页面的产品ID
            success : function(){},  //分享成功后的回调方法
        };

        //兼容老版本函数
        window.weixinShare = window.wjt.weixinSdkInit;

    })();

    Date.prototype.toNumber = function(s){
        var f = s.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        return (new Date(
                parseInt(d[0], 10) || null,
                (parseInt(d[1], 10) || 1) - 1,
                parseInt(d[2], 10) || null,
                parseInt(t[0], 10) || null,
                parseInt(t[1], 10) || null,
                parseInt(t[2], 10) || null
                )).getTime() / 1000;
    }

})();