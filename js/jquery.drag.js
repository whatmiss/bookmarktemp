(function($){
/*************
	Author:轻轻的烟雾 QQ:281099678
	charset:utf-8
	Based on: jquery-1.7.1.min.js
	______________________________________________
	Example:

	$('#dragtest').drag({
		'clickid':'move-id',
		'constraint': '',
		'starteffect': function(e){
			$('#dragtest').fadeTo(300, 0.6);
		},
		'onmove':function(e){
			$('#msg').html(e[0] + '/' + e[1])
		},
		'endeffect':function(){
			$('#dragtest').fadeTo(300, 1);
		},
		'zindex':'1200',
		'cursor':'hand',
		'a':0.008,
		'area':[[50,6000],[10 ,5000]],
		'acceleration':1,
		changesize:true,  //是否可以改变大小
		fixedwh:true, //改变大小时，是否固定高宽
		changesizearea:[[200,contentW],[150,contentH]],//改变大小时，限定范围
		'callback':function(){
		}
	});
*************/
	$.fn.extend({
		drag: function(options){
			var $obj = $(this);
			var options = defaultSet(options);

			var i = 0;
			var x,y; //对象的坐标
			var left_value, top_value, x1, y1, v_x0, v_y0, values, area_check, onmove_check, onmove_check_area,callback_check,zIndexOld, height, width, change_size_area_check;

			area_check = $.isArray(options.area) ? 1 : 0;
			onmove_check = ( $.isFunction(options.onmove) && options.onmove ) ? 1 : 0;
			callback_check = $.isFunction(options.callback) ? 1 : 0;
			change_size_area_check = $.isArray(options.changesizearea) ? 1 : 0;
			//alert(onmove_check + '/' + $obj.attr('id'));
			var $mousedownobj;
			var $mousedownobjcache = $mousedownobj;
			var change_size_check = false;
			if( options.changesize == true ){
				var change_size_id = 'change-size-'+(Math.random()+'').substring(2,8);
				$obj.append('<div id="'+change_size_id+'" style="position:absolute;bottom:0;right:0;width:24px;height:14px;background:#aaa;opacity:0.5;filter:alpha(opacity=30);font-size:1px;cursor:nw-resize;"><div style="border-top:7px solid transparent;border-left:12px solid transparent;border-right:12px solid #888;border-bottom:7px solid #888;width:0;height:0;font-size:1px;"></div></div>');
				var $changesizeobj = $('#'+change_size_id);
				$changesizeobj.live('mousedown', function(){
					change_size_check = true;
				});
				$mousedownobj = options.clickid ? $('#'+options.clickid + ',#' + change_size_id) : $obj;
			}
			else {
				$mousedownobj =  options.clickid ? $('#'+options.clickid) : $obj;
			}

			var style_position = $obj.css('position');
			if( style_position != 'absolute' && style_position != 'relative' && style_position != 'fixed'){
				$obj.css('position', 'absolute')
			}

			if(options.cursor) $mousedownobj.css({'cursor':options.cursor});

			$mousedownobj.bind('mousedown', function(e){
				i = clearMove(i);
				//如果有zindex, 则设置
				zIndexOld = $obj.css('z-index');
				if(options.zindex){
					$obj.css({'z-index':options.zindex});
				}

				left_value = $obj.css('left') == 'auto' ?  $(window).width() - parseInt($obj.css('right')) -  parseInt($obj.css('width')) : parseInt($obj.css('left'));
				top_value = $obj.css('top') == 'auto' ?  $(window).height() - parseInt($obj.css('bottom')) -  parseInt($obj.css('height')) : parseInt($obj.css('top'));
				left_value = left_value ? left_value : 0;
				top_value = top_value ? top_value : 0;
				//$('#msg').html(left_value + '/' + top_value);
				left_value = left_value == 'auto' ? e.pageX : left_value;
				top_value = top_value == 'auto' ? e.pageY : top_value;

				x1 = e.pageX - left_value;
				y1 = e.pageY - top_value;

				//开始特效
				if( $.isFunction(options.starteffect) ){
					options.starteffect([x1,y1,left_value,top_value,e.pageX,e.pageY]);
				}
				else {
					eval( '$obj.css('+options.starteffect+')' );
				}

				//移动
				var w = $obj.width();
				var h = $obj.height();
				values = '0-0-0,0-0-0,0-0-0,0-0-0,';
				$(document).bind('mousemove', function(e){
					var x2 = e.pageX;
					var y2 = e.pageY;
					//判别移动方向，如无设置，则随意移动
					if( options.constraint == 'v' || options.constraint == 'vertical' ){
						x = left_value;
						y = y2 - y1;
					}
					else if( options.constraint == 'l' || options.constraint == 'level' ){
						x = x2 - x1;
						y = top_value;
					}else {
						x = x2 - x1;
						y = y2 - y1;
					}

					var d = new Date();
					var t = d.getTime();
					if( change_size_check == false ){
						if( area_check == 1 ){
							if( options.area[0][1] > x && x > options.area[0][0] && options.area[1][1] > y && y > options.area[1][0] ){
								$obj.css({left:x, top:y});
								onmove_check_area = 1;
							}
							else {
								onmove_check_area = 0;
							}
						}
						else {
							onmove_check_area = 1;
							$obj.css({left:x, top:y});
						}
					}
					else {
						width = x+w-left_value;
						height = y+h-top_value;
						if( options.fixedwh == true ){
							height = width*h/w;
						}
						if( change_size_area_check == 1 ){
							if( options.changesizearea[0][1] > width && width > options.changesizearea[0][0] && options.changesizearea[1][1] > height && height > options.changesizearea[1][0] ){
								$obj.css({width:width, height:height});
								onmove_check_area = 1;
							}
							else {
								onmove_check_area = 0;
							}
						}else {
							$obj.css({width:width, height:height});
						}
					}

					if(onmove_check === 1 && onmove_check_area === 1){
						options.onmove([x,y,x2-x1,y2-y1,width,height]);
					}
					values = values + x + '-' + y + '-' + t + ',';
					//$('#msg').html( x + '-' + y )
				});

			});

			//结束移动
			$obj.bind('mouseup', function(e){
				$(document).unbind('mousemove');
				change_size_check = false;
				$mousedownobj = $mousedownobjcache;

				//结束特效
				if( $.isFunction(options.endeffect) ){
					options.endeffect([parseInt($obj.css('left')),parseInt($obj.css('top')),$obj.width(),$obj.height()]);
				}
				else {
					eval( '$obj.css('+options.endeffect+')' );
				}
				$obj.css({'z-index':zIndexOld});

				//$('#msg').html( x + '-' + y )

				//计算初速度
				var value_array = [];
				var values_array = [];
				if( !values ) return false;
				value_array = values.split(',');
				var value_array_len = value_array.length  - 1;
				for(var n = 0; n < value_array_len; n ++){
					values_array[n] = value_array[n].split('-');
				}
				value_array_len --;
				var dif_num = 3; //判断速度最后的距离为5个数组
				dif_num = value_array_len > dif_num ? dif_num :value_array_len;
				//$('#msg').html( values_array[1].length  + '/' + values_array[value_array_len]+ '/' +  values_array[value_array_len][1]
				//	+ '</br>' + values_array[2].length  + '/' + values_array[value_array_len-dif_num]+ '/' +  values_array[value_array_len-dif_num][1]
				//);

				var x_dif = values_array[value_array_len][0] - values_array[value_array_len-dif_num][0];
				var y_dif = values_array[value_array_len][1] - values_array[value_array_len-dif_num][1];
				var t_dif = values_array[value_array_len][2] - values_array[value_array_len-dif_num][2];
				var v_x = x_dif * 2 / t_dif;
				var v_y = y_dif * 2 / t_dif;
				v_x = ( -0.5 < v_x && v_x < 0.5 ) ? 0 : v_x;
				v_y = ( -0.5 < v_y && v_y < 0.5 ) ? 0 : v_y;  //在-0.5与0.5之间时，值为0
				v_x = ( -1 < v_x && v_x < -0.5 ) ? -1 : v_x;
				v_y = ( -1 < v_y && v_y < -0.5 ) ? -1 : v_y;  //
				v_x = ( 0.5 < v_x && v_x < 1 ) ? 1 : v_x;
				v_y = ( 0.5 < v_y && v_y < 1 ) ? 1 : v_y;  //

				//获取加速度
				var a_x,a_y;
				a_x = a_y = options.a;
				a_x = ( v_x > 0 && a_x > 0 ) || ( v_x < 0 && a_x < 0 ) ? 0 - a_x : a_x;
				a_y = ( v_y > 0 && a_y > 0 ) || ( v_y < 0 && a_y < 0 ) ? 0 - a_y : a_y; //初速度与加速度反向

				//$('#msg').html(   a_x  + '/' + a_y  + '|' + v_x + '/' +  v_y);

				//if( !v_x   ) alert(1)
				//else alert(0)

				v_x = !v_x ? 0 : parseInt(v_x);
				v_y = !v_y ? 0 : parseInt(v_y);
				v_x0 = v_x;
				v_y0 = v_y;
				var time_value = 1;
				//$('#msg').html( a_x  + '/' + a_y + '</br>' + v_x0  + '/' + v_y0 + '</br>' + v_x  + '/' + v_y  + '</br>' + a_x * v_x  + '/' + a_y * v_y     );
				i = setInterval(function(){
					if(!options.acceleration){
						i = clearMove(i);
						if( callback_check == 1)options.callback();
					}
					else {

						x = x == NaN ? x1 : parseInt(x);
						y = y == NaN ? y1 : parseInt(y);
						if( v_x != 0 ) v_x += a_x * time_value;
						if( v_y != 0 ) v_y += a_y * time_value;
						x += v_x * time_value;
						y += v_y * time_value;

						//$('#msg').html( x  + '/' + y + '|' + v_x  + '/' +v_y   );

						//$('#msg').html( a_x  + '/' + a_y + '</br>' + v_x0  + '/' + v_y0 + '</br>' + v_x  + '/' + v_y  + '</br>' + a_x * v_x  + '/' + a_y * v_y     );
						//加速度与初速度需反号，否则速度越来越快
						if( v_y0 == 0 && a_x * v_x < 0  && a_y * v_y >= 0 ){
							//如果限制了区域参数
							if( area_check == 1 ){
								if( options.area[0][1] > x && x > options.area[0][0] ){
									$obj.css({left:x});
								}
							}
							else {
								$obj.css({left:x});
							}
						}
						else if( v_x0 == 0  &&  a_x * v_x >= 0  && a_y * v_y < 0 ){
							//如果限制了区域参数
							if( area_check == 1 ){
								if( options.area[1][1] > y && y > options.area[1][0] ){
									$obj.css({top:y});
								}
							}
							else {
								$obj.css({top:y});
							}
						}
						else if( v_x0 * v_x > 0 && v_y0 * v_y > 0  &&  a_x * v_x < 0  &&  a_y * v_y < 0){
							//如果限制了区域参数
							if( area_check == 1 ){
								if( options.area[0][1] > x && x > options.area[0][0] && options.area[1][1] > y && y > options.area[1][0] ){
									$obj.css({left:x, top:y});
								}
							}
							else {
								$obj.css({left:x, top:y});
							}
						}
						else {
							i = clearMove(i);
							if( callback_check == 1)options.callback();
						}
					}

				},time_value );
			});
		}
	});

	function defaultSet(options){
		//alert(options.starteffect);
		if(options == undefined ){
			var options = {};
		}
		if( options.starteffect === undefined || options.starteffect === '') options.starteffect = "{}";
		if( options.endeffect === undefined  || options.endeffect === '') options.endeffect = "{}";
		if( options.callback === undefined  || options.callback === '') options.callback = 0;
		if( options.acceleration === undefined ) options.acceleration = 1;
		if( options.a === undefined  || options.a === '') options.a = 0.003;

		//alert(options.callback);
		return options;
	}

	function clearMove(i){
		clearInterval( i );
		i = 0;

		return i;
	}
})(jQuery)