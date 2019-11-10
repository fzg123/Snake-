var mainData = {
    snakeWidth: 10,
    snakeHeight: 10,
    container: document.getElementsByClassName('container')[0],
    containerWidth : null,
};
mainData.maxX = mainData.container.offsetWidth / mainData.snakeWidth;
mainData.maxY = mainData.container.offsetHeight / mainData.snakeHeight;
var food;
var snake;
SnakeItem.prototype.show = function () {
    this.item.style.top = this.y * mainData.snakeHeight + "px";
    this.item.style.left = this.x * mainData.snakeWidth + "px";

}
SnakeItem.prototype.setnextSnake = function (item) {
    this.nextSnake = item;
    item.prevSnake = this;
}
SnakeItem.prototype.setprevSnake = function (item) {
    this.prevSnake = item;
    item.nextSnake = this;
}
SnakeItem.prototype.itemMove = function () {
    this.x = this.prevSnake.x;
    this.y = this.prevSnake.y;
    this.show();
}
SnakeItem.prototype.setPostion = function (x, y) {
    this.x = x;
    this.y = y;
    this.show();
}
SnakeItem.prototype.snakeMove = function () {
    if (this.nextSnake !== null) {
        this.nextSnake.snakeMove();
    }
    this.itemMove();
}
function SnakeItem(x, y) {
    this.x = x;
    this.y = y;
    this.nextSnake = null;
    this.prevSnake = null;
    this.item = document.createElement('div');
    this.item.classList.add('item');
    mainData.container.appendChild(this.item);
    this.show();
}
Snake.prototype.dsq = function () {
    clearInterval(this.timer);
    var self = this;
    this.timer = setInterval(function () {
        var sHP = self.setNextPostion();
		sHP = self.isPierce(sHP.x, sHP.y);		// 穿墙
        self.move(sHP.x, sHP.y);
    }, 200);
}
Snake.prototype.setNextPostion = function () {
    var obj = {
        x: this.head.x,
        y: this.head.y,
    };
    // console.log(this.head.x, this.head.y);
    if (this.direction == 'right') {
        obj.x = this.head.x + 1;
        this.legalDirection = ['down', 'up', 'right'];
    } else if (this.direction == 'left') {
        obj.x = this.head.x - 1;
        this.legalDirection = ['down', 'up', 'left'];
    } else if (this.direction == 'up') {
        obj.y = this.head.y - 1;
        this.legalDirection = ['right', 'left', 'up'];
    } else if (this.direction == 'down') {
        obj.y = this.head.y + 1;
        this.legalDirection = ['right', 'left', 'down'];
    }
    return obj;
}
Snake.prototype.move = function (x, y) {
    
    if(!this.legalMove(x, y)){		// 下一步是否合法
        console.log("游戏结束");
        clearInterval(this.timer);
        window.onkeydown = null;
        return;
    }
	
    this.isEat(x, y);   		// 判断吃
    this.head.nextSnake.snakeMove();	// 后面的蛇身体的移动

    this.head.setPostion(x, y);
}
Snake.prototype.isLegal = function (str) {
    for (var i = 0; i < this.legalDirection.length; i++) {
        if (this.legalDirection[i] == str) {
            return true;
        }
    }
    return false;
}
Snake.prototype.isPierce = function(x, y){
	var obj = {
		x,
		y
	}
	if(x < 0){
		obj.x = mainData.maxX - 1;
	}else if(x > mainData.maxX - 1){
		obj.x = 0;
	}else if(y < 0){
		obj.y = mainData.maxY - 1;
	}else if(y > mainData.maxY - 1){
		
		obj.y = 0;
	}else{
		
	}
	return obj; 
	
}
Snake.prototype.isEat = function(x, y){
    var newX = Math.floor( Math.random() * mainData.maxX );
    var newY = Math.floor(Math.random() * mainData.maxY ); 
    console.log();
    if(x == food.x && y == food.y){
        this.eat();
        food.setPostion(newX, newY);
    }
}
Snake.prototype.eat = function(){
    this.length ++;
    var item = new SnakeItem();
    item.setprevSnake(this.foot);
    this.foot = item;
}
Snake.prototype.legalMove = function(x, y){
    var t = this.head.nextSnake;
    // if(x < 0 || x > mainData.maxX - 1 || y < 0 || y > mainData.maxY - 1 ){
    	
    // 	return false;
    // }
    while(t = t.nextSnake){
        if(t.x == x && t.y == y){
            return false;
        }
    }
    return true;
}
Snake.prototype.setSnakeHead = function(x, y){
	this.head.setPostion(x, y);
}
function Snake(length) {
    this.length = length;
    var iucrSnake = null;
    this.timer = null;
    this.direction = "right";
    this.legalDirection = ['down', 'up', 'right'];
	this.head = null;
    for (var i = 0; i < this.length; i++) {
        var snake = new SnakeItem(i, 0);
        if (iucrSnake) {
            snake.setnextSnake(iucrSnake);
        }
        iucrSnake = snake;
        if (i == length - 1) {
            this.head = snake;
            snake.item.classList.add('head');
        }else if(i == 0){
            this.foot = snake;
        }
    }
    this.dsq();

}

Food.prototype.setPostion = function(x, y){
    this.x = x;
    this.y = y;
    this.show();
}
Food.prototype.show = function(){
    this.host.style.left = this.x * mainData.snakeWidth + 'px';
    this.host.style.top = this.y * mainData.snakeHeight + 'px';
}
function Food(){
    this.x = Math.floor(Math.random() * mainData.maxX );
    this.y = Math.floor(Math.random() * mainData.maxY );
    this.host = document.createElement('div');
    this.host.classList.add('food');
    mainData.container.appendChild(this.host);
    this.show();
}
window.onkeydown = function (e) {
    var isLegal = null;
    var direction = null;
    if (e.keyCode == 37) {
        isLegal = snake.isLegal('left');
        direction = 'left';
    } else if (e.keyCode == 39) {
        isLegal = snake.isLegal('right');
        direction = 'right';
        
    } else if (e.keyCode == 38) {
        isLegal = snake.isLegal('up');
        direction = 'up';
    } else if (e.keyCode == 40) {
        isLegal = snake.isLegal('down');
        direction = 'down';
    }
    if(!isLegal){
        return;
    }
    if(snake.direction == direction){
		
        var sHP = snake.setNextPostion();		// 获取下一步
		sHP = snake.isPierce(sHP.x, sHP.y);		// 穿墙
        snake.move(sHP.x, sHP.y);
    }
    snake.direction = direction;

}
function init(){
    food = new Food();
    snake = new Snake(10);
}

init();


// var t = new SnakeItem(0, 0);
// var a = new SnakeItem(1, 0);
// var c = new SnakeItem(2, 0);

// a.setprevSnake(c);
// a.setnextSnake(t);