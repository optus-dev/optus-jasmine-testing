(function (window, undefined) {

	var $ = window.jQuery;

	$.fn.dataAttributeSetter = function () {

		return this.each(function () {

			var $elem = $(this);

			// TODO Support more than clickd
			$elem.on("click", function () {

				var $target = $($elem.attr('data-target'));

				var attrName = $elem.attr('data-name');
				var attrVal = $elem.attr('data-value');

				$target.attr(attrName, attrVal);

			});

		});

	}

	$(document).ready(function() {
		$('.fn-dataAttributeSetter').dataAttributeSetter();
	});

}(window));