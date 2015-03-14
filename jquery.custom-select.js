/*
 * Custom Select - jQuery plugin for styling select elements
 * @author	@marcos0x (marcos0x@gmail.com)
 */

(function(global, $){

	global.customSelectId = 0;
	global.customSelectIndex = 300;

	$.fn.extend({
		customSelect: function(params) {

			var defaults = {
				caret: true
			};

			var settings = $.extend(true, defaults, params);

			return this.each(function(){

				var element = $(this);
				var id = 'customSelect_'+global.customSelectId;
				var value = $('option:selected', element).text();
				var classes = element.attr('class') !== undefined ? element.attr('class').replace(/custom-select/, '').replace(/form-control/, '') : '';

				element.removeAttr('class').wrap('<div class="custom-select '+classes+'" id="'+id+'"></div>');

				var options = '';
				$.each(element.find('option'),function(){
					if($(this).attr('name') == 'options-group'){
						options += '<li class="options-group">'+$(this).text()+'</li>';
					} else if($(this).attr('name') == 'sub-option'){
						options += '<li class="sub-option"><a href="#" data-value="'+$(this).val()+'">'+$(this).text()+'</a></li>';
					} else {
						options += '<li><a href="#" data-value="'+$(this).val()+'">'+$(this).text()+'</a></li>';
					}
				});

				var wrapper = $('#'+id);
				wrapper.css('z-index', global.customSelectIndex);
				wrapper.append('<div class="custom-select-main"></div>');
				wrapper.find('.custom-select-main').append('<a href="#" class="current"><span class="value">'+value+'</span> <span class="caret"></span></a>');
				wrapper.find('.custom-select-main').append('<div class="options" style="display:none"><ul>'+options+'</ul></div>');

				if(!settings.caret){
					$('a.current .caret', wrapper).remove();
				}

				$('a.current', wrapper).off('click').click(function(){
					$('.custom-select').not(wrapper).find('.options:visible').parents('.custom-select').find('a.current').click();
					$('.options', wrapper).slideToggle('fast');
					return false;
				});

				$('.options a', wrapper).off('click').click(function(){
					$('a.current span.value', wrapper).html($(this).html());
					$('option', element).removeAttr('selected');
			  		$('option[value="'+$(this).attr('data-value')+'"]', element).prop('selected', true);
					$('.options', wrapper).slideUp('fast');
					element.val($(this).attr('data-value')).trigger('change').trigger('select').blur();
					return false;
				});

				$('body').click(function(){
					$('.options', wrapper).slideUp('fast');
				});

				wrapper.click(function(event){
					event.stopPropagation();
				});

				element.hide();

				global.customSelectIndex--;
				global.customSelectId++;

			});
		}
	});
})(window, jQuery);
