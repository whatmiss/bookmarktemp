
/*************
	2013.01.14
	Author:轻轻的烟雾 QQ:281099678
	charset:utf-8
	Based on: jquery-1.7.1.min.js
	______________________________________________
	Example:

	js:
	$('#test-alert').click(function(){
		$.confirm(function(){
			alert(1);
		}, '你确定要进行此操作?','提示', 1);
	});

	html:
	<div id="test-alert" data="test-alert1" style="height:50px;vertical-align:bottom;border:1px solid #111;">ddd</div>
*************/


jQuery.confirm = function(fun, msg, title, isBoxMove){
	title = title ? title : '提示信息';
	msg = msg ? msg : '你确定要进行此操作？';
 	var html = '<div id="are-you-sure-box" style="position:absolute;left:0;top:0;width:100%;height:'+document.body.scrollHeight+'px;z-index:9998;">'+
	 				'<div style="position:absolute;left:0;top:0;width:100%;height:'+document.body.scrollHeight+'px;background:#111;opacity:0.5;filter:alpha(opacity=50);">'+'</div>'+
	 				'<div id="are-you-sure-content" style="position:absolute;left:45%;top:300px;width:300px;height:180px;z-index:9999;">'+
						'<div style="position:absolute;background:#aaa;left:0;top:0;width:100%;height:100%;opacity:0.5;filter:alpha(opacity=50);"></div>'+
	 					'<div id="are-you-sure-title" style="position:absolute;left:0;top:0;margin:5px;padding:5px;width:280px;height:40px;background:#fff;"><h3 style="padding:5px;height:30px;background:#eee;font-size:14px;text-align:left;">'+title+'</h3></div>'+
	 					'<div style="position:absolute;left:0;top:0;margin:5px;padding:5px;width:280px;height:120px;background:#fff;top:40px;">'+
		 					'<div style="height:80px;background:#fff;overflow:auto;">'+msg+'</div>'+
							'<button id="do-no" class="do-click" style="left:10px;border-radius:5px;">取消</button>'+
							'<button id="do-yes" class="do-click" style="right:10px;border-radius:5px;">确定</button>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<style>'+
				'#are-you-sure-box .do-click{position:absolute;padding:5px;width:80px;height:25px;line-height:10px;vertical-align:middle;font-size:12px;font-family:"宋体";bottom:10px;text-align:center;border:1px solid #555;background:#ccc;color:#444;}'+
				'</style>'
				;
	$('#are-you-sure-box').remove();
	$('body').append(html);
	isBoxMove ? $('#are-you-sure-content').drag({clickid : 'are-you-sure-title', cursor : 'move', 'area':[[0, $(window).width()-300], [0, $(window).height()-180]]}) : '';
	$('#do-yes').click(function(){
		if( typeof fun === 'function' ) fun();
		$('#are-you-sure-box').remove();
	});
	$('#do-no').click(function(){
		$('#are-you-sure-box').remove();
	});
}
