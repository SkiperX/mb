

var view={
	displayMessage: function(msg){
		var messageArea = document.getElementById('messageArea');
		messageArea.innerHTML = msg;
		$(messageArea).addClass('show');
		var a = controller.guesses;
		setTimeout(function () { if 	((!model.gameOver) && a == controller.guesses) {$(messageArea).removeClass('show');}}, 8000); 	  
        
		
	},
	displayHit:function(location){
		var cell = document.getElementById(location);
		cell.setAttribute('class', 'hit');
	},
	displayMiss:function(location){
		var cell = document.getElementById(location);
		cell.setAttribute('class', 'miss');
	}
};

var model = {
	boardSize:10,
	numShips: 10,
	shipLength: 3,
	shipsSunk:0,
	ShipsLive: 10,
	gameOver: false,
	
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
				loc = loc - 11;
				
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
					view.displayMessage('Корабль потоплен! Еще кораблей: '+ model.ShipsLive  );
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


var controller = {
	guesses: 0,
	processGuess: function(guess){
		var location = guess;
		this.guesses++;
		var hit = model.fire(location);
		if (hit && model.shipsSunk === model.numShips){
			model.gameOver = true;
			view.displayMessage('Все корабли потоплены за ' + this.guesses + ' выстрелов');
			
		}
	}
	
}

 $(document).ready(function() {
    $("td").click(function () {          
		if 	((!model.gameOver) && (($(this).attr("class") == undefined))){
			 console.log($(this).attr("class"));
     controller.processGuess($(this).attr("id"));
	
	 }
    });
});


   function unique(arr) {
  var obj = {};

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    obj[str] = true;
  }

  return Object.keys(obj); 
}

window.onload = model.generateShipLocations();
	
	
	








