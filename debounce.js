function debounce (func, wait, immediate) {
	let timer;

	return function () {
		let that = this;
		let args = arguments;

		if (timer) clearTimeout(timer);
		if (immediate) {
			var callNow = !timer;
			timer = setTimeout(() => {
				timer = null;
			}, wait);
			if (callNow) func.apply(that, args);
		} else {
			timer = setTimeout(function () {
				func.apply(that, args);
			}, wait);
		}
	};
}

debounce(res => {
	console.log(res);
}, 5000, false)(3);

debounce(res => {
	console.log(res);
}, 5000, true)(3);

debounce(res => {
	console.log(res);
}, 5000, true)(3);