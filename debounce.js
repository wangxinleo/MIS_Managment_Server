function debounce (func, wait, immediate) {
	let timer
	return function () {
		const that  = this
		const args = arguments
		if(timer) clearTimeout(timer)
		if(immediate){
			let callNow = !timer;
			timer = setTimeout(function () {
				timer = null
			},wait)
			if(callNow) func.apply(that, args)
		}else {
			timer = setTimeout(function () {
				func.apply(that,args)
			},wait)
		}

	}
}

const a = debounce(res => {
	console.log(res);
}, 2000, true);

setTimeout(function (){
	a(3)
},1000)
setTimeout(function (){
	a(2)
},1000)
setTimeout(function (){
	a(1)
},1000)
setTimeout(function (){
	a(0)
},1000)

// debounce(res => {
// 	console.log(res);
// }, 2000, true)(3);
//
// debounce(res => {
// 	console.log(res);
// }, 3000, true)(3);
