/// <reference path="./../typings/knockout/knockout.d.ts" />

ko.bindingHandlers.playbackchart = {

	init: function (element, valueAccessor) {

		var value = valueAccessor();

		var progress = ko.unwrap(value);

		$(element).circleProgress({
			value: progress,
			size: 80,
			animation:false
			//fill: { color: 'rgb(6,134,195)' },
			//emptyFill: {color:'rgb(229,229,229)'}
		});
	},
	update: function (element, valueAccessor) {
		// This will be called once when the binding is first applied to an element,
		// and again whenever any observables/computeds that are accessed change
		// Update the DOM element based on the supplied values here.

		var value = valueAccessor();

		// Next, whether or not the supplied model property is observable, get its current value
		var progress = ko.unwrap(value);
		progress = progress.toFixed(4);

		if (isNaN(progress))
			progress = 0;
		//progress = Math.round(progress * 100) / 100;


		var curVal = $(element).circleProgress('value');

		if (curVal !== progress) {
			$(element).circleProgress('value', progress)
		}


	}
}