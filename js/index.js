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

	// 重复操作的封装
	var setTranslateX = function(){
		banner.style.transform = 'translateX('+(-width*curIndex)+'px)';
	};
	var setTransition = function(){
		banner.style.transition = 'all .3s';
	};
	var delTransition = function(){
		banner.style.transition = '';
	};

	// 初始化
	setTranslateX();
	navLi[navIndex].classList.add('current');

	// 设置自动轮播
	var timer = setInterval(function(){
		move(true);
	},2000);
	
	// 轮播一次的函数
	function move(bool){

		// bool为true时向右轮播
		if(bool) {
			curIndex++;
		} else {
			curIndex--;
		}
		setTranslateX();
		setTransition();
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

	// transition 结束瞬间切换首尾
	banner.addEventListener('webkitTransitionEnd',function(){
		if(curIndex>=(total-1)){
			curIndex = 1;
		} else if(curIndex<=0) {
			curIndex = total-2;
		} else {
			return;
		}
		delTransition();
		setTranslateX();
	});

	// 触摸事件
	var startX = 0;
	var moveX = 0;
	var isTouchMove = false;
 
	banner.addEventListener('touchstart',function(e){

		clearInterval(timer);
		delTransition();

		// 填补快速划动在首尾连接处的bug
		if (curIndex === (total -1)) {
			curIndex = 1;
			setTranslateX();
		} else if(curIndex === 0) {
			curIndex = 8;
			setTranslateX();
		}

		startX = e.touches[0].clientX;
		// 每次触摸开始初始化bool值
		isTouchMove = false;
	});

	banner.addEventListener('touchmove',function(e){
		isTouchMove = true;
		moveX = e.touches[0].clientX - startX;

		banner.style.transform = 'translateX('+(-width*curIndex+moveX)+'px)';

	});

	banner.addEventListener('touchend',function(){
		// 向右划，移动很小时不翻页
		if(isTouchMove && moveX>(width/3)){
			move(false);
		} else if(isTouchMove && moveX<(-width/3)) {
			// 向左划
			move(true);
		} else if(isTouchMove) {
			setTransition();
			setTranslateX();
		}
		
		timer = setInterval(function(){
			move(true);
		},2000);
		
	});	
	
}