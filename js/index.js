window.onload = function(){
	bannerMove();
}

// 使用 CSS3 transition属性做轮播图
function bannerMove(){
	var banner = document.querySelector('#banner');
	var bannerNav = document.querySelector('.banner_index');
	var width = document.body.offsetWidth;
	var navLi = bannerNav.children;

	// 在banner的原有li的基础上，首尾各添加一个
	var firstLi = banner.firstElementChild;
	var lastLi = banner.lastElementChild;
	var firstClone = firstLi.cloneNode(true);
	var lastClone = lastLi.cloneNode(true);
	banner.appendChild(firstClone);
	banner.insertBefore(lastClone,firstLi);

	// 现在banner下li的总数
	var total = banner.children.length;
	// 
	var curIndex = 1;
	var navIndex = curIndex -1;

	banner.style.transform = 'translateX('+(-width*curIndex)+'px)';
	navLi[navIndex].classList.add('current');

	var timer = setInterval(function(){
		move(true);
	},2000);
	
	function move(bool){
		// bool为true时向右轮播
		if(bool) {
			curIndex++;
		} else {
			curIndex--;
		}
		banner.style.transform = 'translateX('+(-width*curIndex)+'px)';
		banner.style.transition = 'all .5s';

		// banner nav
		navIndex = curIndex -1;
		for(var i=0;i<navLi.length;i++){
			navLi[i].className = '';
		}
		if(curIndex>=(total-1)){
			navIndex = 0;
		} else if(curIndex<=0) {
			navIndex = navLi.length-1;
		}
		navLi[navIndex].classList.add('current');
	}

	banner.addEventListener('webkitTransitionEnd',function(){
		if(curIndex>=(total-1)){
			curIndex = 1;
			banner.style.transition = '';
			banner.style.transform = 'translateX('+(-width*curIndex)+'px)';
		} else if(curIndex<=0) {
			curIndex = total-2;
			banner.style.transition = '';
			banner.style.transform = 'translateX('+(-width*curIndex)+'px)';
		}
	});

	// 触摸事件
	var startX = 0;
	var moveX = 0;
	banner.addEventListener('touchstart',function(e){

		clearInterval(timer);
		banner.style.transition = '';

		startX = e.touches[0].clientX;
	});
	banner.addEventListener('touchmove',function(e){
		moveX = e.touches[0].clientX - startX;

		banner.style.transform = 'translateX('+(-width*curIndex+moveX)+'px)';
	});
	banner.addEventListener('touchend',function(){
		// 向右划
		if(moveX>0){
			move(false);
		} else if(moveX<0) {
			// 向左划
			move(true);
		}
		
		timer = setInterval(function(){
			move(true);
		},2000);
	});

}