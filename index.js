class Promise {
	callbacks = [];
	state = 'pending';
	value = null;
	constructor(fn) {
		fn(this.resolve.bind(this));
	}
	then (onFulfilled) {
		if (this.state === 'pending') {
			this.callbacks.push(onFulfilled);
		} else {
			onFulfilled(this.value);
		}
		return this;
	}
	resolve (value) {
		this.state = 'fulfilled';
		this.value = value;
		this.callbacks.forEach(fn => fn(value));
	}
}

let p = new Promise(resolve => {
	setTimeout(() => {
		console.log('done');
		resolve('5秒');
	}, 1000);
}).then(tip => {
	console.log(tip);
});