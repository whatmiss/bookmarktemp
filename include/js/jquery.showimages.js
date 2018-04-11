
/**
 * 作者：轻轻的烟雾 email:281099678ztg阿而发gmail.com

*/
;(function($){
	$.fn.extend({
		showImages : function(options){
			var $this = $(this);
			$this.css({cursor : 'pointer'})
			if( !options ) options = {};

			//绑定的是否图片本身
			if( !options.content ) var $content = $(this);
			else var $content = $(options.content);

			$content.find('img').css({display : 'none', cursor : 'pointer'}).attr({'title' : '点击查看图集'});
			//如果参数hideAllImage不为真，留一张图片
			if( !options.hideAllImage ) $content.find('img:first').css({display : 'block'});

			$this.bind('click', showImagesDo);
			$(window).bind('resize', showImagesDo);

			function showImagesDo(){
				var randN = 3828232,
				imageArr = [], imageIndex,
				n = 0, n2, imageListHtml = '',
				thisImageSrc = $(this).attr('src'), thisSrc;
				$content.find('img').each(function(){
					n2 = n + 1;
					thisSrc = $(this).attr('src');
					imageArr.push('<img src="' + thisSrc + '" /><div><p>'+$(this).attr('alt')+'</p></div>');
					imageListHtml += '<div class="show-image-'+randN+'-pic-list" id="show-image-'+randN+'-pic-list-'+n+'" data="'+n+'" title="第'+n2+'张">'+n2+'</div>';
					if( thisImageSrc == thisSrc ) imageIndex = n;
					n ++;
				});
				if( !imageArr.length ) return '';
				imageIndex = imageIndex ? imageIndex : '0';

				var html = '<div id="show-image-'+randN+'" style="position:absolute;z-index:4000;left:0;top:0;width:100%;height:'+document.body.scrollHeight+'px;text-align:center;">'+
								'<div style="position:absolute;z-index:4001;left:0;top:0;width:'+document.body.scrollWidth+'px;;height:'+document.body.scrollHeight+'px;height:100%;background:#111;_background:none;*background:#111;opacity:0.7;filter:alpha(opacity=70);text-align:center;"></div>'+
								'<div id="show-image-'+randN+'-box" style="position:absolute;z-index:4002;left:0;top:0;width:100%;height:100%;text-align:center;border:0px solid #111;overflow-y:auto;overflow-x:hidden;">'+
									'<div id="show-image-'+randN+'-pic-tip" style="position:relative;margin-top:1%;z-index:4003;">'+imageListHtml+'</div>'+
									'<div id="show-image-'+randN+'-pic" style="position:relative;margin:0 auto;margin-top:5%;vertical-align:top;">'+imageArr[imageIndex]+'</div>'+
									'<div id="show-image-'+randN+'-box-left-bg" style="position:absolute;left:110px;top:45%;width:150px;background:#aaa;_background:none;*background:#aaa;opacity:0.3;filter:alpha(opacity=30);color:#111;font-size:100px;font-family:\'宋体\';" ><</div>'+
									'<div id="show-image-'+randN+'-box-left" style="position:absolute;left:0px;top:0;width:50%;height:100%;background:#ccc;_background:none;*background:#ccc;line-height:100%;cursor:pointer;color:#555;opacity:0.0;filter:alpha(opacity=0.01);" title="上一张"></div>'+
									'<div id="show-image-'+randN+'-box-right-bg" style="position:absolute;right:110px;top:45%;width:150px;background:#aaa;_background:none;*background:#aaa;opacity:0.3;filter:alpha(opacity=30);color:#111;font-size:100px;font-family:\'宋体\';" >></div>'+
									'<div id="show-image-'+randN+'-box-right" style="position:absolute;right:0px;top:0;width:50%;height:100%;background:#ccc;_background:none;*background:#ccc;line-height:100%;cursor:pointer;color:#555;opacity:0.0;filter:alpha(opacity=0.01);" title="下一张"></div>'+
									'<div id="show-image-'+randN+'-close" style="position:absolute;z-index:4004;right:0;top:0;width:60px;height:60px;border-radius:0 0 0 60px;background:#111;opacity:0.9;filter:alpha(opacity=90);font-size:20px;font-family:\'宋体\';text-align:center;color:#fff;line-height:60px;cursor:pointer;">&nbsp;&nbsp;×</div>'+
								'</div>'+
								'<style>'+
								'#show-image-'+randN+' #show-image-'+randN+'-pic img{border:10px solid #ccc;margin:0;}'+
								'#show-image-'+randN+' #show-image-'+randN+'-pic div{text-align:left;*margin-top:-3px;}'+
								'#show-image-'+randN+' #show-image-'+randN+'-pic p{position:relative;width:600px;margin:0 0 0 -300px;padding:10px;left:50%;text-align:left;background:#ccc;}'+
								'.show-image-'+randN+'-pic-list{display:inline-table;*display:inline;cursor:pointer;width:20px;height:20px;margin:2px;background:#aaa;border-radius:10px;line-height:20px;font-size:11px;}'+
								'#show-image-'+randN+'-pic-list-'+imageIndex+'{background: #555;}'+
								'</style>'+
							'</div>';
				$('#show-image-'+randN).remove();
				$('body').append(html);

				var imageCount = imageArr.length;
				//上一张
				$('#show-image-'+randN+'-box-left').unbind('click mouseenter mouseleave').bind('click', function(){
					imageIndex --;
					if( imageIndex < 0 ) {
						imageIndex = 0;
						return '';
					}
					$('#show-image-'+randN+'-pic').html( imageArr[ imageIndex ] );
					$('.show-image-'+randN+'-pic-list').css({background : '#aaa'});
					$('#show-image-'+randN+'-pic-list-'+imageIndex).css({background : '#555'});
				}).bind('mouseenter', function(){
					$('#show-image-'+randN+'-box-left-bg').css({opacity : '0.8'});
				}).bind('mouseleave', function(){
					$('#show-image-'+randN+'-box-left-bg').css({opacity : '0.3'});
				});

				//下一张
				$('#show-image-'+randN+'-box-right').unbind('click mouseenter mouseleave').bind('click', function(){
					imageIndex ++;
					if( imageIndex > imageCount - 1 ) {
						imageIndex = imageCount - 1;
						return '';
					}
					$('#show-image-'+randN+'-pic').html( imageArr[ imageIndex ] );
					$('.show-image-'+randN+'-pic-list').css({background : '#aaa'});
					$('#show-image-'+randN+'-pic-list-'+imageIndex).css({background : '#555'});
				}).bind('mouseenter', function(){
					$('#show-image-'+randN+'-box-right-bg').css({opacity : '0.8'});
				}).bind('mouseleave', function(){
					$('#show-image-'+randN+'-box-right-bg').css({opacity : '0.3'});
				});

				//选择
				$('.show-image-'+randN+'-pic-list').unbind('click').bind('click', function(){
					imageIndex = $(this).attr('data');
					$('#show-image-'+randN+'-pic').html( imageArr[ imageIndex ] );
					$('.show-image-'+randN+'-pic-list').css({background : '#aaa'});
					$('#show-image-'+randN+'-pic-list-'+imageIndex).css({background : '#555'});
				});

				//关闭
				$('#show-image-'+randN+'-close').unbind('click mouseenter mouseleave').bind('click', function(){
					$('#show-image-'+randN).remove();
					imageArr.length = 0;
					imageListHtml = null;
				}).bind('mouseenter', function(){
					$(this).css({opacity : '1', color : 'red'});
				}).bind('mouseleave', function(){
					$(this).css({opacity : '0.9', color : '#fff'});
				});
			};
		}
	});
})(jQuery)
