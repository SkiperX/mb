

var view={
	
displayMessage: function(msg){
		var messageArea = document.getElementById('messageArea-' + controller.gameActive);
		messageArea.innerHTML = msg;
		$(messageArea).addClass('show');
		var a = controller.guesses;
		setTimeout(function () { if 	((!controller.gameOver) && a == controller.guesses) {$(messageArea).removeClass('show');}}, 3000); 	  
        
		
	},
	displayHit:function(location){		
		$('.js-robot').children('#' + location).addClass('hit');
		$('.js-robot').children('#' + location).removeClass('wait-shot');
	},
	displayMiss:function(location){
		$('.js-robot').children('#' + location).addClass('miss');
		$('.js-robot').children('#' + location).removeClass('wait-shot');
	}
};

var model = {
	boardSize:10,
	numShips: 10,
	shipLength: 3,
	shipsSunk:0,
	ShipsLive: 10,
	
	
	ships:[ {locations: ['0', '0', '0' ], hits: ['', '', ''], space: [], Length:4, heals: 4},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], space: [], Length:3,  heals: 3},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], space: [], Length:3,  heals: 3},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], space: [], Length:2,  heals: 2},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], space: [], Length:2,  heals: 2},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], space: [], Length:2,  heals: 2},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], space: [], Length:1,  heals: 1},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], space: [], Length:1,  heals: 1},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], space: [], Length:1,  heals: 1},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], space: [], Length:1,  heals: 1}],
			
	generateShipLocations: function(){
		var locations;
		for (var i = 0; i < this.numShips; i++){
			this.shipLength = this.ships[i].Length;
			do {
				locations = this.generateShip();
			}while(this.collision(locations));
			
			this.ships[i].space = unique(this.spaceGeneration(locations));
			this.ships[i].locations = locations;
		}
	},	
	generateShip: function(){
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		
		if (direction === 1){
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			
		}
		else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++){
			if (direction === 1){
				newShipLocations.push(row + '' + (col + i));
				
			}
			else{
				newShipLocations.push((row + i) +  '' + col);
			}
		}	
		return newShipLocations;
	},	
	collision: function(locations){
		console.log(locations);
		var a = false;
		for (var i=0; i < this.numShips; i++){
			var ship = model.ships[i];	
			console.log(ship.space);
			for (var j = 0; j < locations.length; j++){
				var s = (ship.space.indexOf(locations[j]) - 0)			
					console.log(s);
				if (((ship.space.indexOf(locations[j])) - 0) >=0){
					
					a = true;
					}
				
			}
		}
		
		console.log(a);return a;
	},
	spaceGeneration: function(locations){
		var space = [];		
		var space2 = [];
		for (var i = 0; i < locations.length; i++){
				loc = locations[i];				
				loc = +loc - 11;
				
				for (var q = 0; q < 3; q++){					
					
					var s1 = ([(loc + q)])
					var s2 =([(loc + q) + 10]);					
					var s3 =([(loc + q) + 20]);
						
						
					
					
					if ((s1 >= 0) && (s1 <=9)){
						s1 = '0' + s1;
					}
					
					if ((s2 >= 0) && (s2 <=9)){
						s2 = '0' + s2;
					}
					if ((s3 >= 0) && (s3 <=9)){
						s3 = '0' + s3;
					}
					
					space.push(s1);
					space.push(s2);
					space.push(s3);
					console.log(s1 + ' ,'+ s2 + ' ,'+ s3);
					
				};
				if ((+locations [i]+1)%10 == 0){
					for (var d = 0; d < space.length; d++){
						if ((+space[d]) % 10 == 0){
							space[d] = -99;
						}
					}
				}
				if ((+locations [i])%10 == 0){
					for (var d = 0; d < space.length; d++){
						if ((+space[d]+1) % 10 == 0){
							space[d] = -99;
						}
					}
				}
		}
		return unique(space);
	},
	
	fire: function(guess){
		for (var i=0; i < this.numShips; i++){
			var ship = this.ships[i];			
			var index = ship.locations.indexOf(guess);
			if (index >= 0){
				ship.hits[index] = 'hit';
				ship.heals = ship.heals - 1;
				view.displayHit(guess);
				view.displayMessage('Ранен! Еще жизней: '+ ship.heals );
				if (this.isSunk(ship)){
					model.shipsSunk++;
					model.ShipsLive = model.ShipsLive -1;
					view.displayMessage('Корабль потоплен!' );
					var messageArea = document.getElementById('numShips-user');
					messageArea.innerHTML = ('Корабли противника: ' + model.ShipsLive);					
					console.log(model.ships[i].space.length);
					for (var q = 0; q < model.ships[i].space.length; q++){
						var id = ship.space[q];
						
						
						$('#' + id).addClass('miss');
						console.log(id);
					}
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage('Пусто');
		return false		
	},
	isSunk: function(ship){
		for (var i=0; i < ship.Length; i++){
			if (ship.hits[i] !=='hit'){
				return false;
			}
		}
		return true;	
	}
	
};

var modelRobot = {
	boardSize:10,
	numShips: 10,
	shipLength: 3,
	shipsSunk:0,
	ShipsLive: 10,
	
	
	
	ships:[ {locations: ['0', '0', '0', '0' ], hits: ['', '', ''], hitLoc: [], space: [], Length:4, heals: 4},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], hitLoc: [], space: [], Length:3,  heals: 3},
			{locations: ['0', '0', '0' ], hits: ['', '', ''], hitLoc: [], space: [], Length:3,  heals: 3},
			{locations: ['0', '0'], hits: ['', '', ''], hitLoc: [], space: [], Length:2,  heals: 2},
			{locations: ['0', '0'], hits: ['', '', ''], hitLoc: [], space: [], Length:2,  heals: 2},
			{locations: ['0', '0'], hits: ['', '', ''], hitLoc: [], space: [], Length:2,  heals: 2},
			{locations: ['0'], hits: ['', '', ''], hitLoc: [], space: [], Length:1,  heals: 1},
			{locations: ['0'], hits: ['', '', ''], hitLoc: [], space: [], Length:1,  heals: 1},
			{locations: ['0'], hits: ['', '', ''], hitLoc: [], space: [], Length:1,  heals: 1},
			{locations: ['0'], hits: ['', '', ''], hitLoc: [], space: [], Length:1,  heals: 1}],
			
	generateShipLocations: function(){
		var locations;
		for (var i = 0; i < this.numShips; i++){
			this.shipLength = this.ships[i].Length;
			do {
				locations = this.generateShip();
			}while(this.collision(locations));
			
			this.ships[i].space = unique(this.spaceGeneration(locations));
			this.ships[i].locations = locations;
		}
	},	
	generateShip: function(){
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		
		if (direction === 1){
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			
		}
		else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++){
			if (direction === 1){
				newShipLocations.push(row + '' + (col + i));
				
			}
			else{
				newShipLocations.push((row + i) +  '' + col);
			}
		}	
		return newShipLocations;
	},	
	collision: function(locations){
		console.log(locations);
		var a = false;
		for (var i=0; i < this.numShips; i++){
			var ship = modelRobot.ships[i];	
			console.log(ship.space);
			for (var j = 0; j < locations.length; j++){
				var s = (ship.space.indexOf(locations[j]) - 0)			
					console.log(s);
				if (((ship.space.indexOf(locations[j])) - 0) >=0){
					
					a = true;
					}
				
			}
		}
		
		console.log(a);return a;
	},
	spaceGeneration: function(locations){
		var space = [];		
		var space2 = [];
		for (var i = 0; i < locations.length; i++){
				loc = locations[i];				
				loc = +loc - 11;
				
				for (var q = 0; q < 3; q++){					
					
					var s1 = ([(loc + q)])
					var s2 =([(loc + q) + 10]);					
					var s3 =([(loc + q) + 20]);
						
						
					
					
					if ((s1 >= 0) && (s1 <=9)){
						s1 = '0' + s1;
					}
					
					if ((s2 >= 0) && (s2 <=9)){
						s2 = '0' + s2;
					}
					if ((s3 >= 0) && (s3 <=9)){
						s3 = '0' + s3;
					}
					
					space.push(s1);
					space.push(s2);
					space.push(s3);
					console.log(s1 + ' ,'+ s2 + ' ,'+ s3);
					
				};
				if ((+locations [i]+1)%10 == 0){
					for (var d = 0; d < space.length; d++){
						if ((+space[d]) % 10 == 0){
							space[d] = -99;
						}
					}
				}
				if ((+locations [i])%10 == 0){
					for (var d = 0; d < space.length; d++){
						if ((+space[d]+1) % 10 == 0){
							space[d] = -99;
						}
					}
				}
		}
		return unique(space);
	},
	
	displayHit:function(location){		
		$('.js-user').children('#' + location).addClass('hit');
		$('.js-user').children('#' + location).removeClass('wait-shot');
	},
	displayMiss:function(location){
		$('.js-user').children('#' + location).addClass('miss');
		$('.js-user').children('#' + location).removeClass('wait-shot');
		
		
	},
	
	fire: function(guess){
		for (var i=0; i < this.numShips; i++){
			var ship = this.ships[i];			
			var index = ship.locations.indexOf(guess);
			if (index >= 0){
				ship.hits[index] = 'hit';
				ship.hitLoc.push('' + guess);
				ship.heals = ship.heals - 1;
				this.displayHit(guess);
				view.displayMessage('Ранен! Еще жизней: '+ ship.heals );
				if (this.isSunk(ship)){
					modelRobot.shipsSunk++;
					modelRobot.ShipsLive = modelRobot.ShipsLive -1;
					view.displayMessage('Корабль потоплен!'  );
					
					var messageArea = document.getElementById('numShips-robot');
					messageArea.innerHTML = ('Ваши корабли: ' + modelRobot.ShipsLive);
					
					console.log(modelRobot.ships[i].space.length);
					modelRobot.ships[i].hitLoc = [];
					for (var q = 0; q < modelRobot.ships[i].space.length; q++){
						var id = ship.space[q];
						
						
						$('.js-user').children('#' + id).addClass('miss');
						$('.js-user').children('#' + id).removeClass('wait-shot');
						console.log(id);
					}
				}
				return true;
			}
		}
		this.displayMiss(guess);
		view.displayMessage('Пусто');
		console.log(guess + ' пусто');
		return false		
	},
	isSunk: function(ship){
		for (var i=0; i < ship.Length; i++){
			if (ship.hits[i] !=='hit'){
				return false;
			}
		}
		return true;	
	}
	
};


var controller = {
	guesses: 0,
	gameActive: 'user',
	gameOver: false,
	
	processGuess: function(guess){
		
		if(this.gameActive == 'robot'){
		
			var location = guess;
			this.guesses++;
			var hit = modelRobot.fire(location);
			if (hit && modelRobot.shipsSunk === modelRobot.numShips){
				this.gameOver = true;
				view.displayMessage('Вы проиграли..');
				var messageArea = document.getElementById('numShips-robot');
					messageArea.innerHTML = ('Все корабли потоплены');
					$('.user-wait').addClass('hide');
					setTimeout(function(){$('.reload-bt').removeClass('hide')}, 2000);
				
			};
			if(!hit){
				this.gameActive = 'user';
				setTimeout(function(){$('.user-wait').removeClass('hide')}, 500);
			}
			else{
				smart.shot();
			}
			
		
		}
		else{	
			var location = guess;
			this.guesses++;
			var hit = model.fire(location);
			
			if (hit && model.shipsSunk === model.numShips){
				this.gameOver = true;
				view.displayMessage('Вы победили!');
				var messageArea = document.getElementById('numShips-user');
					messageArea.innerHTML = ('Все корабли потоплены');
					$('.user-wait').addClass('hide');
				setTimeout(function(){$('.reload-bt').removeClass('hide')}, 2000);
				
			};
			
			if(!hit){
				this.gameActive = 'robot';
				smart.shot();
				$('.user-wait').addClass('hide');
			}
			
			
		
		}
		
	
	},
	displayMessage: function(msg){
		var messageArea = document.getElementById('messageArea-robot');
		messageArea.innerHTML = msg;
		$(messageArea).addClass('show');
		var a = controller.guesses;
		setTimeout(function () { if 	((!controller.gameOver) && a == controller.guesses) {$(messageArea).removeClass('show');}}, 3000); 	  
        
		
	},
	
	
};
var smart = {
	LocationView: function(){
		for ( i=0; i < modelRobot.numShips; i++){
			modelRobot.ships[i].space = unique(modelRobot.spaceGeneration(modelRobot.ships[i].locations));
			for (q=0; q < modelRobot.ships[i].locations.length; q++){
				$('.js-user').children('#' + modelRobot.ships[i].locations[q]).addClass('pre-hit');
				
			}	
			
		} 
		
		$('.js-user').children('td').addClass('wait-shot');
	
	 },
	 
	  valueGeneration: function(){
			
		var position = 0;
		var hit = 0;
		var hit2 = 0;
		var value =[];
				for ( t=0; t < modelRobot.numShips; t++){
					if (modelRobot.ships[t].hitLoc.length == 1){
						hit = idFix(modelRobot.ships[t].hitLoc[0]);		
						
						
						console.log('раз ' + hit);
						if (($('.js-user').children('#' + idFix(+hit+1)).attr("class") != undefined) && ($('.js-user').children('#' + idFix(+hit+1)).attr("class").indexOf('wait-shot') >=0)){
								value.push(idFix(+hit+1));
							};
						if (($('.js-user').children('#' + idFix(+hit-1)).attr("class") != undefined) && ($('.js-user').children('#' + idFix(+hit-1)).attr("class").indexOf('wait-shot') >=0)){
								value.push(idFix(hit-1));
							};
						if (($('.js-user').children('#' + idFix(+hit+10)).attr("class") != undefined) && ($('.js-user').children('#' + idFix(+hit+10)).attr("class").indexOf('wait-shot') >=0)){
								value.push(idFix(+hit+10));
							};
						if (($('.js-user').children('#' + idFix(+hit-10)).attr("class") != undefined) && ($('.js-user').children('#' + idFix(+hit-10)).attr("class").indexOf('wait-shot') >=0)){
								value.push(idFix(hit-10));
							};	
							
						return value;
					}
					if (modelRobot.ships[t].hitLoc.length == 2){
						hit = idFix(Array.min(modelRobot.ships[t].hitLoc));
						console.log(hit + ' хит');
						hit2 = idFix(Array.max(modelRobot.ships[t].hitLoc));
						
						console.log(hit2 + ' хит2');						
						console.log(value + ' валуе два');
						if (($('.js-user').children('#' + idFix(hit-(hit2 - hit))).attr("class") != undefined )&&($('.js-user').children('#' + idFix(hit-(hit2 - hit))).attr("class").indexOf('wait-shot') >=0)){
								value.push(idFix(hit-(hit2 - hit)));
							};
						if (($('.js-user').children('#' + idFix(+hit+((hit2 - hit)*2))).attr("class") != undefined)&&($('.js-user').children('#' + idFix(+hit+((hit2 - hit)*2))).attr("class").indexOf('wait-shot') >=0)){
								value.push(idFix(+hit+((hit2 - hit)*2)));
							};
						return value;						
					}
					if (modelRobot.ships[t].hitLoc.length == 3){
						hit = idFix(Array.min(modelRobot.ships[t].hitLoc));
						hit2 = idFix(Array.max(modelRobot.ships[t].hitLoc));
						var a = (hit2 - hit) / 2;
						
						
						
						if (($('.js-user').children('#' + idFix(hit - a)).attr("class") != undefined)&&($('.js-user').children('#' + idFix(hit - a)).attr("class").indexOf('wait-shot') >=0)){
								value.push(idFix(hit - a));
							};
						if (($('.js-user').children('#' + idFix(+hit + a * 3)).attr("class") != undefined)&&($('.js-user').children('#' + idFix(+hit + a * 3)).attr("class").indexOf('wait-shot') >=0)){
								value.push(idFix(+hit + a * 3));
							};						
						return value;
					}					
				};
				
				for ( i=0; i < 100; i++){
							i = idFix(i);					
							if ($('.js-user').children('#' + i).attr("class").indexOf('wait-shot') >=0){
								value.push(i);
							}
						};
				return value;
	},
	
	shot: function(){				
				var value = this.valueGeneration();
				console.log(value);
				position = value[Math.floor(Math.random() * value.length)];
				position = '' + position;
				if 	(!controller.gameOver){
			
				setTimeout(function () {controller.processGuess(position); }, 800);
				$('.js-user').children('#' + position).removeClass('wait-shot');
				}
	},
	
	gamer: function(){
		this.LocationView();
		
		
		
			setTimeout(function () { smart.shot();}, 1000);
		
	}
};
 Array.min = function( array ){
    return Math.min.apply( Math, array );
};
Array.max = function( array ){
    return Math.max.apply( Math, array );
};

 function idFix(i){
	if (('' + i).length === 1){
		i = '0' + i;						
	}	
	else{
		i = '' + i;
	}; 
	return i;
 }

   function unique(arr) {
  var obj = {};

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    obj[str] = true;
  }

  return Object.keys(obj); 
};

 $(document).ready(function() {
    $("td").click(function () {          
		if 	((controller.gameActive == 'user')&&(!controller.gameOver) && (($(this).attr("class") == undefined))){
			 console.log($(this).attr("class"));
     controller.processGuess($(this).attr("id"));
	
	 }
    });
});

function start(){
	model.generateShipLocations();
	smart.LocationView();
	$('.js-user').children().removeClass('hit');
	$('.robot').removeClass('hide');
	$('.shipBox').addClass('hide');
	$('.user').addClass('right');
	$('.start-bt').addClass('hide');
	setTimeout(function(){$('.user-wait').removeClass('hide');}, 2000);
}
function startBtnHide(){
	$('.text-help').removeClass('hide');
		for (t=0; t< 10; t++){
			for(d = 0; d < modelRobot.ships[t].locations.length; d++){
				if (modelRobot.ships[t].locations[d] === '0'){
					return
				};
			}						
		};
		$('.text-help').addClass('hide');
		setTimeout(function() {$('.start-bt').removeClass('hide');}, 1000	);
		
}
	
	
	
// перетаскивание





var drop = {
	idFix: function(i){
		if (('' + i).length === 1){
			i = '0' + i;						
		}	
		else{
			i = '' + i;
		}; 
		return i;
		},
		
		




	locWritter: function(shipDl){
			table = document.getElementById('table').getBoundingClientRect();
			$('#table').children().children().children('td').removeClass('drop-hit');
			$('#table').children().children().children('td').removeClass('space');
		for (i=1; i<=10; i++){	

		
			ship = $('#ship' + i).children('div');	
			
			locWr = drop.locDetector(ship);
			
			console.log('лок вр ' + locWr);
			
			
				if (this.locCorrect(locWr)){
					
					for (e=0; e < locWr.length; e++){
						$('#table').children().children().children('#' + locWr[e]).addClass('drop-hit');
						modelRobot.ships[(i - 1)].locations[e] = locWr[e];
					};
					space = this.spaceGeneration(locWr);
					
					for (w=0; w < space.length; w++){
						$('#table').children().children().children('#' + space[w]).addClass('space');
					};
					
				}else{
					this.shipToBox('ship' + i);
					modelRobot.ships[(i - 1)].locations = ['0'];						
				}
			
		}
		$('.text-help').addClass('hide');
		startBtnHide();

		
	},
	shipToBox: function(ship){
		document.getElementById(ship).style.top = '0px';
						document.getElementById(ship).style.left = '0px';
						document.getElementById(ship).style.opacity = '1';
						document.getElementById(ship).style.transition = '0.2s, left 0.4s linear, top 0.4s linear';
	},
	locDetector: function(shipDet){
			table = document.getElementById('table').getBoundingClientRect();		
			locDt=[];
			for (e=0; e < shipDet.length; e++){			
				div = shipDet[e].getBoundingClientRect();			
				column = Math.floor(((div.left + div.width / 2) - table.left) / (table.width/10));
				line = Math.floor(((div.top + div.height / 2) - table.top) / (table.height/10));			
				locDt.push('' + line + column);	
				
			}console.log('лок дт ' + locDt);
			return locDt;
	},

	locCorrect: function(id){
	console.log(id);
				for (a=0; a < id.length; a++){
					if ((document.getElementById(id[a]) === null)  ){					
						console.log('1');
						return false	
								
					
					}
					if (($('#table').children().children().children('#' + id[a]).attr("class") !== undefined)  ){	
					console.log('2');
					console.log($('#' + id[a]).attr("class"));		
						if ($('#table').children().children().children('#' + id[a]).attr("class").length > 0){
						return false				
						}
					}
					
				}
				return true
	},
	spaceGeneration: function(locations){
			var space = [];		
			var space2 = [];
			for (var i = 0; i < locations.length; i++){
					locSp = locations[i];				
					locSp = +locSp - 11;
					
					for (var q = 0; q < 3; q++){					
						
						var s1 = ([(locSp + q)])
						var s2 =([(locSp + q) + 10]);					
						var s3 =([(locSp + q) + 20]);
							
							
						
						
						if ((s1 >= 0) && (s1 <=9)){
							s1 = '0' + s1;
						}
						
						if ((s2 >= 0) && (s2 <=9)){
							s2 = '0' + s2;
						}
						if ((s3 >= 0) && (s3 <=9)){
							s3 = '0' + s3;
						}
						
						space.push(s1);
						space.push(s2);
						space.push(s3);
						console.log(s1 + ' ,'+ s2 + ' ,'+ s3);
						
					};
					if ((+locations [i]+1)%10 == 0){
						for (var d = 0; d < space.length; d++){
							if ((+space[d]) % 10 == 0){
								space[d] = -99;
							}
						}
					}
					if ((+locations [i])%10 == 0){
						for (var d = 0; d < space.length; d++){
							if ((+space[d]+1) % 10 == 0){
								space[d] = -99;
							}
						}
					}
			}
			return unique(space);
		},



	noContextMenuOnShip: function(){
		var ship = document.getElementsByClassName('shipInBox');
		for (i=0 ; i < ship.length; i++){
			ship[i].oncontextmenu = (function(e){
		$(e.target).parent().toggleClass('rotate');
		$('.shipBox').removeClass('rotate');
		id = $(e.target).parent().attr('id');
		drop.shipToBox(id);	
		drop.hitDelOnDrag($('#' + id).children('div'));
		$('.start-bt').addClass('hide');
		
	   return false;
	});
		}
	},
	hitDelOnDrag: function(shipDel){
		
		locDd = this.locDetector(shipDel);
		console.log(locDd);
		for(i=0; i < locDd.length; i++){
			$('#table').children().children().children('#' + locDd[i]).removeClass('drop-hit');
			locDd[i] = '' + locDd[i];
			if($('#table').children().children().children('#' + locDd[i]).length == 0){
				return
			}
		};
		space = this.spaceGeneration(locDd);
		for(i=0; i < space.length; i++){
			$('#table').children().children().children('#' + space[i]).removeClass('space');
			
		};
		
	}
}

$(function() {
	
	$('.shipInBox').draggable({
	start: function(){
		elem = $(this).attr('id');
	document.getElementById(elem).style.opacity = '1';
	document.getElementById(elem).style.transition = '0s';
	$('.space').html('<div></div>');
		ship = $('#' + elem).children('div');	
		drop.hitDelOnDrag(ship);
		$('.start-bt').addClass('hide');
	},
	
	stop: function(){
	elem = $(this).attr('id');
	document.getElementById(elem).style.opacity = '0';
	
	drop.locWritter($(this));
		$('.space').html('');
	}
	});
	
});

window.onload = drop.noContextMenuOnShip;