
var banner = document.querySelector('#banner');
var bannerNav = document.querySelector('.banner_index');

// 在banner ul的末尾克隆一份第一个li
var liClone = banner.firstElementChild.cloneNode(true);
banner.appendChild(liClone);
var bannerWidth = liClone.offsetWidth;
// banner 轮播
var curBanIndex = 0;
var curNavLiIndex = 0;

var bannerTimer = null;
bannerTimer = setInterval(bannerMove,3000);

var bannerNavLi = bannerNav.children;
bannerNav.firstElementChild.classList.add('current');

for(var i=0;i<bannerNavLi.length;i++) {
	bannerNavLi[i].index = i;
	bannerNavLi[i].onclick = function(){
		clearInterval(bannerTimer);
		bannerNavLi[curNavLiIndex].classList.remove('current');
		curNavLiIndex = this.index;
		this.classList.add('current');
		// 首尾和谐过渡
		curBanIndex = this.index;
		move(banner,{"left": -curBanIndex*bannerWidth});

		bannerTimer = setInterval(bannerMove,3000);
	}
}
// banner 滚动函数	
function bannerMove(){
	// banner的当前left值： curBanPos = curBanIndex * bannerWidth
	curBanIndex++;

	if(curBanIndex === (bannerNavLi.length+1)) {
		curBanIndex = 1;
		banner.style.left = '0px';
	}
	move(banner,{"left": -curBanIndex*bannerWidth});


	// banner nav
	curNavLiIndex++;
	if(curNavLiIndex === 8) {
		curNavLiIndex = 0;
	}
	for(var i=0;i<bannerNavLi.length;i++){
		if(i !== curNavLiIndex){
			bannerNavLi[i].classList.remove('current');
		} else {
			bannerNavLi[i].classList.add('current');
		}
	}
}

// 运动函数，从一个位置移动到指定位置
/*
	json {k:value,k2:value2}
	三类属性：长度(不带单位)，透明度(百分制)，z-index 
	注意值全部为数值
*/
function move(ele,json,fn){
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		var flag = true;

		for(var k in json){
			if(k === "opacity"){
				var initial = getStyle(ele,k);
				initial = parseInt(initial*100);

				var step = (json[k] - initial)/20;
				step = step > 0 ? Math.ceil(step) : Math.floor(step);
				initial += step;
				ele.style.opacity = initial/100;
				ele.style.filter = "alpha(opacity:"+initial+")"; 
				if(initial !== json[k]) {
					flag = false;
				}
			} else if(k === "z-index") {
				ele.style["z-index"] = json[k];
			} else {
				var initial = parseInt(getStyle(ele,k)) || 0;

				var step = (json[k] - initial)/10;
				step = step > 0 ? Math.ceil(step) : Math.floor(step);
				initial += step;
				ele.style[k] = initial + "px";
				if(initial !== json[k]) {
					flag = false;
				}
			}
		}
		if(flag === true) {
			clearInterval(ele.timer);
			if(fn){
				fn();
			}
		}
	},20);
}

// 获取元素样式兼容写法
function getStyle(ele,attr) {
	if(window.getComputedStyle) {
		return window.getComputedStyle(ele,null)[attr];
	}
	return ele.currentStyle[attr];
}