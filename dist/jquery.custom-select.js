/*
 * Custom Select - jQuery plugin for styling select elements
 * @author	@marcos0x (marcos0x@gmail.com)
 */
(function(global, $) {

	global.customSelectId = 0;
	global.customSelectIndex = 300;

	function CustomSelect(element, settings) {
		var _this = this;
		_this.element = element;
		_this.settings = settings;

		_this.init = function() {
			_this.settings = $.extend(true, {
				id: _this.element.data('custom-select-id') || false,
				caret: true
			}, _this.settings);

			if (_this.settings.id) {
				_this.customSelect = $('#'+_this.settings.id);
				_this.setOptions();
				return false;
			} else {
				global.customSelectId++;
				_this.settings.id = 'customSelect_'+global.customSelectId;

				var classes = _this.element.attr('class') !== undefined ? _this.element.attr('class').replace(/custom-select/, '').replace(/form-control/, '') : '';
				_this.element.removeAttr('class').wrap('<div class="custom-select '+classes+'" id="'+_this.settings.id+'"></div>');
				_this.element.attr('data-custom-select-id', _this.settings.id);
				_this.element.css({'position':'absolute','left':'-9999px'});

				_this.customSelect = $('#'+_this.settings.id);
				_this.customSelect.css('z-index', global.customSelectIndex);
				_this.customSelect.append('<div class="custom-select-main"><a href="#" class="current"><span class="value"></span> <span class="caret"></span></a><div class="options" style="display:none"><ul></ul></div></div>');
				_this.setOptions();

				if (!_this.settings.caret) {
					_this.customSelect.find('.current .caret').remove();
				}

				global.customSelectIndex--;

				return true;
			}
		};

		_this.setOptions = function() {
			var options = [];
			var objs = _this.element.find('option');

			for (var i = 0; i < objs.length; i++) {
				var obj = objs.eq(i);
				if (obj.attr('data-name') == 'options-group') {
					options.push('<li class="options-group">'+obj.text()+'</li>');
				} else if (obj.attr('data-name') == 'sub-option') {
					options.push('<li class="sub-option"><a href="#" data-value="'+obj.val()+'">'+obj.text()+'</a></li>');
				} else {
					options.push('<li><a href="#" data-value="'+obj.val()+'">'+obj.text()+'</a></li>');
				}
			}

			_this.customSelect.find('.options ul').html(options.join(''));
			_this.customSelect.find('.current .value').addClass('selected').html(_this.element.find('option:selected').text());

			_this.customSelect.find('.options a').off('click').click(function() {
				var obj = $(this);
				_this.customSelect.find('.current .value').addClass('selected').html(obj.html());
				_this.element.find('option').removeAttr('selected');
				_this.element.find('option[value="'+$(this).attr('data-value')+'"]').prop('selected', true);
				_this.customSelect.find('.options').slideUp('fast');
				_this.element.val($(this).attr('data-value')).trigger('change').trigger('select').blur();
				return false;
			});
		}

		_this.bind = function() {
			if (!_this.init()) {
				return;
			}

			$('body').click(function() {
				_this.customSelect.find('.options').slideUp('fast');
			});

			_this.customSelect.find('.current').off('click').click(function() {
				$('.custom-select').not('#'+_this.settings.id).find('.options:visible').slideToggle('fast');
				_this.customSelect.find('.options').slideToggle('fast');
				return false;
			});

			_this.customSelect.click(function(event) {
				event.stopPropagation();
			});
		}
	}

	$.fn.extend({
		customSelect: function(options) {
      var settings = options || {};
		
			return this.each(function() {
			  var customSelect = new CustomSelect($(this), settings);

        switch(settings) {
          default:
          case 'bind':
            customSelect.bind();
          break;
        }
			});
		}
	});

})(window, jQuery);
