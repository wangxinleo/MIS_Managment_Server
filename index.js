class myPromise {
	callbacks = [];
	state = 'pending';
	value = null;
	constructor(fn) {
		fn(this.resolve.bind(this));
	}
	then (onFulfilled) {
		return new myPromise(resolve => {
			this.handle({
				onFulfilled: onFulfilled || null,
				resolve: resolve
			});
		});
	}
	handle (callback) {
		if (this.state === 'pending') {
			this.callbacks.push(callback);
			return;
		}

		if (!callback.onFulfilled) {
			callback.resolve(this.value);
			return;
		}

		let ret = callback.onFulfilled(this.value);
		console.log(ret);
		callback.resolve(ret);
	}
	resolve (value) {
		this.state = 'fulfilled';
		this.value = value;
		this.callbacks.forEach(callback => this.handle(callback));


	}
}

let p = new myPromise(resolve => {
	setTimeout(() => {
		console.log('file');
		resolve('1');
	});
}).then((res) => {
	console.log(res);
	return res;
});