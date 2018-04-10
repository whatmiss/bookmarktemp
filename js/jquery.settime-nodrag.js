/*************
		Author:轻轻的烟雾 QQ:281099678
		charset:ANSI
		Based on: jquery-1.7.1.min.js
		______________________________________________
		Example:

		$('#time').setTime({
			drag:true,  //是否可以拖动
			h:[5,20],   //小时限制范围
			i:[5,50],   //分
			s:[5,45],   //秒

		});

*************/


(function($){
	// class ID,避免与原html的class name 冲突
	var class_num = id_num = (Math.random()*1000000 + 1000000).toString().substr(0,6);
	//settimeout
	var set_time_out = 0;

	document.writeln('<style>'+
						'.set-time-'+class_num+'{border:5px solid #aaa;background:#ddd;z-index:2000;overflow:hidden;max-width:520px;_width:530px;border-radius:5px;}' +
						'.set-time-'+class_num+' .set-time-'+class_num+'-title{padding:5px;background:#aaa;overflow:hidden;*zoom:1;}' +
						'.set-time-'+class_num+' .set-time-'+class_num+'-title div{float:left;}' +
						'.set-time-'+class_num+' .set-time-'+class_num+'-title .set-time-'+class_num+'-close{text-align:right;float:right;}' +
						'.set-time-'+class_num+' .set-time-'+class_num+'-title .set-time-'+class_num+'-close span a{color:#111;}' +
						'.set-time-'+class_num+' .set-time-'+class_num+'-title .set-time-'+class_num+'-close span a:hover{background:#555;color:#fff;text-align:right;}' +
						'.set-time-'+class_num+' .set-time-'+class_num+'-content div{float:left;margin:5px;display:inline;}' +
						'.set-time-'+class_num+' .set-time-'+class_num+'-content .set-time-'+class_num+'-content-h{width:510px;}' +
						'.set-time-'+class_num+' .set-time-'+class_num+'-content .set-time-'+class_num+'-content-i{width:250px;}' +
						'.set-time-'+class_num+' .set-time-'+class_num+'-content .set-time-'+class_num+'-content-s{width:250px;}' +
						'.set-time-'+class_num+' td{border:1px solid #ccc;padding:2px;text-align:center;cursor:pointer;font-size:12px;} ' +
						'.set-time-'+class_num+' td.unuse{color:#ccc;cursor:wait;} ' +
						'.set-time-'+class_num+' td.use:hover{color:#eee;background:#999;} ' +
						'.set-time-'+class_num+' th{padding:2px;background:#ccc;border:1px solid #ccc;}' +
						'.set-time-'+class_num+' .now{background:#eee;color:red;}' +
						'.set-time-'+class_num+' .default{background:#bbb;color:#555;}' +
						'.set-time-'+class_num+' .selected{background:#555;color:#eee;}' +
						'.set-time-'+class_num+' .set-time-'+class_num+'-now{border:0px solid #111;text-align:left;padding:5px;clear:both;width:400px;}' +
					'</style>');

	$.fn.extend({
		setTime : function(options){
			var self = $(this);
			options = options ? options : {};
			var h_min = options.h ? options.h[0] : 0;
			var h_max = options.h ? options.h[1] : 23;
			var i_min = options.i ? options.i[0] : 0;
			var i_max = options.i ? options.i[1] : 59;
			var s_min = options.s ? options.s[0] : 0;
			var s_max = options.s ? options.s[1] : 59;

			self.attr('readonly','true').bind('click', function(e){
				var id_num = (Math.random()*1000000 + 1000000 + (new Date).getMilliseconds()).toString().substr(0,7);
				var now_h = (new Date).getHours();
				var default_time = ( default_time = self.val() ) ? default_time.split(':') : [-1,-1,-1];
				var default_h = default_time[0];
				var default_i = default_time[1];
				var default_s = default_time[2];

				//小时选择框
				var td_class, now_class, default_class;
				var html_h = '<table id="set-time-'+id_num+'-h"><tr><th colspan="12">时</th>';
				for(var n = 0, num = 0, num_s = 0; n < 2; n ++){
					html_h += '<tr>';
					for(var n2 = 0; n2 < 12; n2 ++, num ++){
						td_class = ( h_min <= num && num <= h_max ) ? 'use' : 'unuse';
						default_class = (default_h == num) ? 'default':'';
						now_class = (now_h == num) ? 'now':'';
						num_s = num < 10 ? 0 + num.toString(): num;
						html_h += '<td class="'+td_class+' '+default_class+' '+now_class +'">'+num_s+'</td>';
					}
					html_h += '</tr>';
				}
				html_h += '</table>';

				//分钟选择框
				var html_i = '<table id="set-time-'+id_num+'-i"><tr><th colspan="10">分</th>';
				for(var n = 0, num = 0, num_s = 0; n < 6; n ++){
					html_i += '<tr>';
					for(var n2 = 0; n2 < 10; n2 ++, num ++){
						td_class = ( i_min <= num && num <= i_max ) ? 'use' : 'unuse';
						default_class = (default_i == num) ? 'default':'';
						num_s = num < 10 ? 0 + num.toString(): num;
						html_i += '<td class="'+td_class+' '+default_class+'">'+num_s+'</td>';
					}
					html_i += '</tr>';
				}
				html_i += '</table>';

				//秒钟选择框
				var html_s = '<table id="set-time-'+id_num+'-s"><tr><th colspan="10">秒</th>';
				for(var n = 0, num = 0, num_s = 0; n < 6; n ++){
					html_s += '<tr>';
					for(var n2 = 0; n2 < 10; n2 ++, num ++){
						td_class = ( s_min <= num && num <= s_max ) ? 'use' : 'unuse';
						default_class = (default_s == num) ? 'default':'';
						num_s = num < 10 ? 0 + num.toString(): num;
						html_s += '<td class="'+td_class+' '+default_class+'">'+num_s+'</td>';
					}
					html_s += '</tr>';
				}
				html_s += '</table>';

				var html = '<div id="set-time-'+id_num+'" class="set-time-'+class_num+'" style="position:absolute;display:none;">' +
				'<div class="set-time-'+class_num+'-title" id="set-time-title-'+id_num+'"><div><b>选择时间</b></div><div class="set-time-'+class_num+'-close"><span><a href="javascript:" title="关闭" id="set-time-'+id_num+'-close">&nbsp;×&nbsp;</a></span></div></div>' +
				'<div class="set-time-'+class_num+'-content"><div class="set-time-'+class_num+'-content-h">'+html_h+'</div><div class="set-time-'+class_num+'-content-i">'+html_i+'</div><div class="set-time-'+class_num+'-content-s">'+html_s+'</div></div>' +
				'<div class="set-time-'+class_num+'-now" id="set-time-'+id_num+'-now">now</div>'
				'</div>';

				$('.set-time-'+class_num).remove();
				$('body').append( html );
				//alert( html )

				var thisHtmlObj = $('#set-time-'+id_num);
				thisHtmlObj.css({display:'block', left:e.pageX-20, top:e.pageY+10});
				showTimeNow($('#set-time-'+id_num+'-now'));

				//关闭
				$('#set-time-'+id_num+'-close').live('click', function(){
					clearData(thisHtmlObj,self)
				});
				$('.set-time-'+class_num+'').live('mouseenter', function(){
					$(this).live('mouseleave', function(){
						clearData(thisHtmlObj,self)
					});
				});

				//默认选择当前小时
				thisHtmlObj.data('set-time-h', default_h != '-1' ? default_h : now_h );

				//选择时间
				$('#set-time-'+id_num+'-h td.use').live('click', function(){
					thisHtmlObj.data('set-time-h', $(this).html() );
					$('#set-time-'+id_num+'-h td').removeClass('selected');
					$(this).addClass('selected');
					self.focus();
					checkTime(thisHtmlObj,self);
				})
				$('#set-time-'+id_num+'-i td.use').live('click', function(){
					thisHtmlObj.data('set-time-i', $(this).html() );
					$('#set-time-'+id_num+'-i td').removeClass('selected');
					$(this).addClass('selected');
					self.focus();
					checkTime(thisHtmlObj,self);
				})
				$('#set-time-'+id_num+'-s td.use').live('click', function(){
					thisHtmlObj.data('set-time-s', $(this).html() );
					$('#set-time-'+id_num+'-s td').removeClass('selected');
					$(this).addClass('selected');
					self.focus();
					checkTime(thisHtmlObj,self);
				})

			});


		}
	});

	function checkTime(thisHtmlObj, obj){
		if( thisHtmlObj.data('set-time-h') && thisHtmlObj.data('set-time-i') && thisHtmlObj.data('set-time-s') ){
			obj.val( thisHtmlObj.data('set-time-h') +':'+ thisHtmlObj.data('set-time-i') +':'+ thisHtmlObj.data('set-time-s') );
			clearData(thisHtmlObj, obj);
		}
	}

	function clearData(thisHtmlObj, obj){
		clearTimeout( set_time_out );
		obj.data('set-time-h',null);
		obj.data('set-time-i',null);
		obj.data('set-time-s',null);
		obj.blur();

		//$('.set-time-'+class_num+'').remove();
		thisHtmlObj.remove();
	}

	function showTimeNow(obj){
		var d = new Date();
		var h = d.getHours();
		var i = d.getMinutes();
		var s = d.getSeconds();
		obj.html( h + ':' + i +':'+ s )
		set_time_out = setTimeout(function(){
			showTimeNow(obj)
		}, 1000 );
	}
})(jQuery)