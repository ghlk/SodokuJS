/**
 * :: ---------------- ::
 * :: ~ SODOKU CLASS ~ ::
 * :: ---------------- ::
 */

/**
  * Class Sodoku(name, size) 
  **/
function Sodoku (name, size) {
	
	if(!size)
		{ size = 81; }
	
	if(!name){
		name = "mySodoku"; //Debug value
	}
	var board = [ ], i;
	for (i=0; i<size; i++){
		board.push('');
	}
	
	//Boards
	this.gameBoard = board.slice(0);  //Exposed cells. (Puzzle to solve)
	this.possBoard = board.slice(0);  //Possible values
	this.solveBoard = board.slice(0); //Solving values
	this.emptyBoard = board.slice(0); //Used for resetting other boards.
	
	//Bookmarks
	this.solveBookmark = 0; //Used to step through solving process. 
	this.direction = 1; //represents "positive" direction
	this.solvePlace = 0;	
	this.currentCell = null;
		
	//Values
	this.size = size; //size of the sodoku puzzle
	this.name = name; //Name of the Sodoku class created by the page (@params)
	
	//Helper Values
	this.timer; //Timer used for solving the puzzle in intervals.
	this.interval = 1000; //Interval for timers. (ms)(1000 = 1s)
	this.step = 1 ;
	this.solverStr = this.name+".solver();"; 
	this.stepStr   = this.name+".stepSolver();"; 
	this.moves = 0; //To count how long it takes to solve the problem.	
	this.testBoard = ['', 9, 2,'','', 1,'', 8,'','','','','','','', 1, 7,'','','', 7,'', 3,'', 4, 6, 2,'','','',
	 				   3,'','', 9, 1,'','', 9, 6, 5,'', 1, 7, 4,'','', 4, 1,'','', 9,'','','', 1, 3, 6,'', 4,'',
	 				   7,'','','', 5, 2,'','','','','','','', 8,'', 2,'','', 6, 9,''];
	this.evilBoard =[ 5,'', 9,'','', 6,'', 7 , 8, 4,'','', 2,'','','','', 9, 7,'','','','','','','', 1,'', 6,'','',
					 '', 4,'','','', 9,'','','','','','','', 4,'','','', 9,'','','', 6,'', 1,'','','','','','','', 
					  5, 6,'','','','', 1,'','', 8, 2, 5,'', 3,'','', 1,'', 9];
}

/* === Creating Methods === */
Sodoku.prototype.newPuzzle = function (lines, divID) {

	//Reset the boards & values
	this.gameBoard = this.emptyBoard.slice(0);
	this.possBoard = this.emptyBoard.slice(0);
	this.solveBoard = this.emptyBoard.slice(0);
	this.solveBookmark = 0; 
	this.moves = 0; 

	//--- Optional Resets (Maybe get rid of)
	this.direction = 1;
	this.solvePlace = 0;	
	this.currentCell = null;	
	///---

	this.prepopulate(lines);
	this.display(divID);
}
Sodoku.prototype.testPuzzle = function() {
	//this.gameBoard = this.testBoard.slice(0);
	this.gameBoard = this.evilBoard.slice(0);
	this.display();
}
Sodoku.prototype.createPuzzle = function () {
	
	//Apply a pattern.
	var pattern = this.emptyBoard.slice(0);
	var exposed = this.emptyBoard.slice(0);
	var values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	var value;
	var smallRow;
	
	//Select 28 Randomly selected cells to be "exposed" cells.
	var i;
	for(i=0;i<28;i++){
		do{
			x = Math.floor(Math.random() * 81) ;
		}while( exposed[x] === true );
		exposed[x] = true;
	}
	
	//Loop for each number. 1-9	
	for(i=0; i<9; i++){
		
		// ** VALUE ** 
		//Grab a random value to place in the puzzle.
		rand = Math.floor(Math.random() * values.length);
		value = values[rand];
		//Delete this value from the array.
		values.splice( rand, 1); 
		
		// :: Move #1: Unexposed cell. (1 cell) (random)
		do {
			randCell = Math.floor(Math.random() * 81) ;
		}while( pattern[randCell] === '' && exposed[randCell] === false && check(randCell, value) === true);
		//Place the value in the cell
		pattern[randCell] = value;

		// :: Move #2: Exposed cells. (2 cells) (reminaing small-rows in big-row that "randCell" is in.)
		//Grab the starting cell of the big-row that "randCell" is in, and start there.
		//aka: first cell in far-left box of "randCell".
		cell = this.getRowStart( this.getBoxStart(randCell) );
		
		var j;
		for(j=0; j<3; j++){
			if( checkRow(cell, value) ){
				x = this.getRowCells(cell);
				
			}
		}

	}
}

/** === Get-Position Methods === 
 * All methods return a numeric value representing the value they are "getting".
 *
 * Possible Values: (Based on standard 81-cell Sodoku ONLY)
 *	Small & Big: 0-8
 * 	Rows & Columns: 0-2
 * 	Starts: Returns cell position. 0-80
 * 	Cells: Returns an array of cell positions. array(9) values:0-80
 *
 */
Sodoku.prototype.getBig = function (cell){
	return Math.floor(cell/9);
}
Sodoku.prototype.getBigRow = function (cell){
	return Math.floor( Math.floor(cell/9) / 3);
}
Sodoku.prototype.getBigColumn = function (cell){
	return ( Math.floor(cell/9) % 3 );
}
Sodoku.prototype.getSmall = function (cell){
	return cell % 9;
}
Sodoku.prototype.getSmallRow = function (cell){
	return Math.floor( ( cell % 9 ) / 3);
}
Sodoku.prototype.getSmallColumn = function (cell){
	return ( cell % 9 ) % 3;
}
Sodoku.prototype.getBoxStart = function (cell){
	return this.getBig(cell) * 9;
}
Sodoku.prototype.getRowStart = function (cell){
	return (( Math.floor(this.getBig(cell) / 3) * 3) * 9) + ( this.getSmallRow(cell) * 3 );
}
Sodoku.prototype.getColumnStart = function (cell){
	return ( this.getBig(cell) % 3) * 9 + ( this.getSmallColumn(cell) );
}
Sodoku.prototype.getRowCells = function (cell) {
	var start = this.getRowStart(cell);
	var arr = [ ];
	var end = start + 21;
	var step = 1;
	var i;
	for(i=start; i<end; i+=step){
		arr.push(i);
		if( this.getSmallColumn(i) === 2 ){
			step = 7;
		}
		else{
			step = 1;
		}
	}
	return arr;
}
Sodoku.prototype.getColumnCells = function (cell) {
	var start = this.getColumnStart(cell);
	var arr = [ ];
	var end = start + 61;
	var step = 1;
	var i;
	for(i=start; i<end; i+=step){
		arr.push(i);
		if( this.getSmallRow(i) === 2 ){
			step = 21;
		}
		else{
			step = 3;
		}
	}
	return arr;
}

/* Puzzle Manipulation Methods*/	
Sodoku.prototype.prepopulate = function (lines) {
	if(!lines){ lines = 1; }
	
	var x, val, cell;
	
	for(x = 0; x < lines; x++){ //# of lines loop...
		for(val = 1; val <= 9; val++){ //Populating loop...
			do {
				cell = this.getRandomEmptyCell( );
			}while ( !(this.check(cell, val)) );
			this.gameBoard[cell] = val;
		}
	}
}
Sodoku.prototype.getRandomEmptyCell = function () {
	var rand;
	do{
		rand = Math.floor( Math.random() * 81 );
	}while( this.gameBoard[rand] );
	return rand;
}

/** 
 * Checking Methods
 * All methods returns T/F on whether (val) can be placed in (cell).
 * If (val) is not provided, the method will return an array of T/F that represent what values are possible moves. 
 * if only "1" is valid, returns: [t, f, f, f, f, f, f, f, f];
 */
Sodoku.prototype.check = function (cell, val) {

	var box, row, column;
	
	//BOX CHECK
	box = this.checkBox(cell, val);
	
	//ROW CHECK
	row = this.checkRow(cell, val);
	
	//COLUMN CHECK
	column = this.checkColumn(cell, val);
	
	//Val NOT passed. Returning a bool-array of all possible values as being true. (val1 -> arr[0])
	if(!val){
		var arr = [ ];
		var i;
		for(i=0; i<9; i++){
			if( !box[i] || !row[i] || !column[i]){
				arr[i] = false;
			}
			else{
				arr[i] = true;
			}
		}
		return arr;
	}
	//Val passed. Returning whether you can place that value.
	if( box && row && column ){
		return true;
	}
	else
	{
		return false;
	}
}
Sodoku.prototype.checkBox = function (cell, val){
	
	var arr = [ true, true, true, true, true, true, true, true, true ];
	var start = this.getBoxStart(cell);
	var x;
	for(x=start; x < (start+9); x++){
			
		//If no value passed - return an Array of possible values for cell provided.
		if(!val){
			if( this.gameBoard[x] ){
				arr[ ( this.gameBoard[x]-1 ) ] = false;
			}
			else if( this.solveBoard[x]  ){
				arr[ ( this.solveBoard[x]-1) ] = false;
			}
		}
		else{
			if( this.gameBoard[x] === val){
				return false;
			}
		}
	}
	if(!val){
		return arr;
	}
	else{
		return true;
	}
}
Sodoku.prototype.checkRow = function (cell, val){
	
	var i, x, boolArr, cells;
	cells = this.getRowCells(cell);
	boolArr = [ true, true, true, true, true, true, true, true, true ]; 

	for(i=0; i<9; i++){
		x = cells[i];
		//No "val" param - Return array of boolean to represent possible values.
		if(!val){
			if( this.gameBoard[x] ){
				boolArr[ (this.gameBoard[x] - 1) ] = false;
			}
			else if( this.solveBoard[x]  ){
				boolArr[ (this.solveBoard[x] - 1) ] = false;
			}
		}
		//Looking for particular "value"
		else{
			if( this.gameBoard[x] === val){
				return false;
			}
		}
	}//--End loop
	if(!val){
		return boolArr;
	}
	else{
		return true;
	}
}
Sodoku.prototype.checkColumn = function (cell, val){
	
	var i, x, boolArr, cells;
	cells = this.getColumnCells(cell);
	boolArr = [ true, true, true, true, true, true, true, true, true ]; 

	for(i=0; i<9; i++){
		x = cells[i];
		//No "val" param - Return array of boolean to represent possible values.
		if(!val){
			if( this.gameBoard[x] ){
				boolArr[ (this.gameBoard[x] - 1) ] = false;
			}
			else if( this.solveBoard[x]  ){
				boolArr[ (this.solveBoard[x] - 1) ] = false;
			}
		}
		//Looking for particular "value"
		else{
			if( this.gameBoard[x] === val){
				return false;
			}
		}
	}//--End loop
	if(!val){
		return boolArr;
	}
	else{
		return true;
	}
}

/* Displaying */
Sodoku.prototype.getHTMLSkelaton = function(){
	var str;
	var i;
	
	//16: 4x4 Box:2x2
	//36: 6x6 Box:2x3
	//81: 9x9 Box:3x3

	str  = '<div id="sodoku">';
	
	for(i=0; i<this.size; i++){
		
		if(this.getSmall(i) == 0){ 
			str += '<div id="big-'+this.getBig(i)+'" class="big">'; //#big - start
		}
		
		str += '<div id="small-'+cell+'" class="small"></div>'; //#small
		
		if(this.getSmall(i) == 8){
			str += '</div>'; //#big -end
		}
	}
	str += '</div>'; //#sodoku -end
	return str;
}
Sodoku.prototype.getHTML = function(showPossibles, showSolution) {
	
	if( showPossibles != true) {
		showPossibles = false;
	}
	if( showSolution != true) {
		showSolution = false;
	}
	var str = '';
	var cell, k, possStr;
	
	str += '<div id="sodoku">'; //#sodoku - Start
	
	for(cell=0; cell<this.size; cell++){
		
		//# BIG START
		//console.log( this.getSmall(cell) );
		if(this.getSmall(cell) == 0){ str += '<div id="big-'+this.getBig(cell)+'" class="big">'; }
		
		//# SMALL START
		str += '<div id="small-'+cell+'" class="small">';//'</div>'; //#small - start
		
		//Always show the gameBoard values. (gameBoard == 0 statement for this.showCells() method)
		if( this.gameBoard[cell] !== '' || this.gameBoard[cell] === 0){
			str += this.gameBoard[cell];
		}
	 	else if( this.solveBoard[cell] && showSolution ){
			str += '<span style="color:red">'+this.solveBoard[cell]+'</span>';
		}
		else if( showPossibles && this.possBoard[cell] ){
			for(k=0; k<9; k++){
				if(this.possBoard[cell][k] == true){
					possStr = '<span class="valid-possible">'+(k+1)+'</span>';
				}
				else{
					possStr = '<span class="invalid-possible">'+(k+1)+'</span>';
				}
				str += '<div class="tiny">'+possStr+'</div>';
			}
		}
		str += '</div>'; //#small - end
		
		if(this.getSmall(cell) == 8){
			str += '</div>'; //#big -end
		}
	}
	str += '</div'; //#sodoku - end
	return str;
}

Sodoku.prototype.display = function (divID) {
	if (!divID){ 
		divID = 'game';
	}
	document.getElementById(divID).innerHTML = mySodoku.getHTML(false, "");	
}
Sodoku.prototype.showPossibles = function(divID) {
	
	if (!divID){
		divID = 'game';
	}
	this.calcPossibles();
	document.getElementById(divID).innerHTML = mySodoku.getHTML(true, false);	
}
Sodoku.prototype.showSolution = function(divID) {
	if (!divID){ 
		divID = 'game';
	}
	document.getElementById(divID).innerHTML = mySodoku.getHTML(true, true);	
}
Sodoku.prototype.empty = function () {
	this.gameBoard = this.emptyBoard.slice(0);
	this.display();
}

/* Possible Moves */
/**
 *
 *
 */
Sodoku.prototype.getPossibles = function (cell, type) {
	
	var boolArr = this.check(cell);
	var valArr = [ ];
	var z;
	for(z=0;z<9;z++){
		if(boolArr[z]){
			valArr.push(z+1);
		}
	}
	if(type == "bool"){
		return boolArr;
	}
	if(type == "val"){
		return valArr;
	}
}
Sodoku.prototype.calcPossibles = function() {
	var cell;
	for(cell=0; cell<81; cell++){
		if( !this.gameBoard[cell] && !this.solveBoard[cell] ) {
			this.possBoard[cell] = this.check(cell);
		}
	}
}




/**
 * -------------------------------------------
 * Sodoku.solveCell(cell)
 * -------------------------------------------
 * Purpose:
 * 	To solve a single cell only. 
 *
 * Params:
 * Returns:
 *	true  - increment solver.
 *  false - decrement solver.
 *  null  - continue solver. (Go in same direction you just were)
 *
 * Parents: 
 *	solver();
 *
 * Children:
 *	getPossibles(cell, "val");
 */
Sodoku.prototype.solveCell = function(cell){
	
	var possVals, i;

	//Exposed Cell - Can't Edit.
	if(this.gameBoard[cell] !== ''){
		return null;
	}
	
	//Grab possible values for "cell"
	possVals = this.getPossibles(cell, "val");
	
	//No Possibles OR we've tried all possibles
	if( possVals.length < 1 || (this.solveBoard[cell] >= possVals[(possVals.length-1)]) ){
		this.solveBoard[cell] = '';
		return false;
	}
	//Cell Not Solved
	else if(!this.solveBoard[cell]){
		this.solveBoard[cell] = possVals[0];
		return true;
	}
	//Solved: Needs value larger than current value
	else{
		for(i=0; i<possVals.length; i++){
			if(possVals[i] > this.solveBoard[cell]){
				this.solveBoard[cell] = possVals[i];
				return true;
			}
		}
	}
}

/**
 * -------------------------------------------
 * Sodoku.solver( )
 * -------------------------------------------
 * Purpose:
 *	Controller method to solve the sodoku with an incremental brute-force algorithm
 *  Made so the thought process of the solving algorithms could be followed by the user.
 *
 * Parents:
 *	startSolver()
 *
 * Children:
 * 	showsolution()
 *	highlightCell(cell)
 *	solveCell(cell)
 */
Sodoku.prototype.solver = function(){

	this.moves += 1;
	var cell, x;
	if(this.currentCell === null)
		{this.currentCell = 0;}
	
	cell = this.currentCell;
	this.showSolution();
	
	if(cell > 80){
		this.stopTimer();
		document.getElementById('numofmoves').value = this.moves;
		
		return false;
	}
	else{
		this.highlightCell(cell);
		x = this.solveCell(cell);
		this.calcPossibles();
		
		if(x === null){
			this.currentCell += this.direction;
		}
		else if(x === true){
			this.currentCell++;
			this.direction = 1;
		}
		else if(x === false){
			this.currentCell--;
			this.direction = -1;
		}
	}
}

Sodoku.prototype.fillSinglePossibles = function (cell){
	var possVals;
	//Skip gameBoard pieces
	if(!this.gameBoard[i]){
		possVals = this.getPossibles(cell, "val");
		if(possVals.length === 1){
			this.solveBoard[cell] = possVals[0];
		}
	}
	else{
		cell++;
	}
}
Sodoku.prototype.smartSolver = function() {

	var i, finished;
	finished = true;
	
	var x = 0;
	//Step through possibles
	for(i=0; i<81; i++){
		
		if(!this.gameBoard[i]){
			
			possVals = this.getPossibles(i, "val");
			
			if( possVals.length === 1 ){
				this.solveBoard[i] = possVals[0];
				x++;
			}
			else if( possVals.length > 1){
				finished = false;
			}
		}
	}
	this.moves += x;
	
	if(!finished){
		this.smartSolver();
	}
	//Update Possibles
	this.calcPossibles();
	this.showSolution();
	document.getElementById('numofmoves').value = this.moves;
	
	//Return
	return true;
}
/**
 * -------------------------------------------
 * Sodoku.stepSolver(step)
 * -------------------------------------------
 * Purpose: 
 * 	To show the incremental progress of our recursive solving method.
 * 	Function is called by "startStepSolver" which is a setInterval of 1000ms.
 * Calls:
 *	solve(start,'pos', end, bwall);
 *	stopTimer();
 */
Sodoku.prototype.stepSolver = function () {

	var start, end, bwall;

	//Begin where we left off.
	start = this.solveBookmark;
	
	//End when we've done "step" amount of moves.
	end = start + this.step;
	
	//ie: bwall = 4 - (5-4) = 3;
	bwall = start - (end-start); 

	//Update view
	this.showSolution();
	
	//Don't let the end go past the end of the puzzle.
	if( end > 80 ) { end = 80; }
	
	//If we're done.
	if( start > 80){
		this.stopTimer();
		return false;
	}
	else{
		this.solveBookmark = this.solve(start, 'pos', end, bwall);
	}
}

/**
 * -------------------------------------------
 * Sodoku.solve(cell, direction, wall, backWall)
 * -------------------------------------------
 * 
 * Summary: 
 *  A recursive method that can call itself any number of times.
 * 
 * Parents:
 *	stepSolver();
 *
 * Children:
 *	showSolution();
 *	getPossibles(cell,"val");
 * 	calcPossibles();
 *	solve(cell, direction, wall, backWall); -- Recursive Calls
 *
 * Params:
 * 	cell: req - (0-80) - Represents the current cell # that has to be processed.
 * 	dir: req - (1 or -1) - Represents which direction the solver is currently going in. (1=pos) (-1=neg)
 *	wall: opt - (0-80) - Value is used by the method "stepSolver" to place a arbitrary wall for the recursion to close on.
 * 	backWall: opt - (0-80) - Used by the method "stepSolver" to place a arbitrary wall behind the current cell.
 * 		~ If no value provided: Backstepping recursion will be included into forwardstepping...
 */
Sodoku.prototype.solve = function(cell, direction, wall, bwall) {

	//Increment 'move counter'
	this.moves += 1;
	
	//Setting start if value not present
	if(!cell && cell !== 0){
		cell = 0;
	}

	//If goes out-of-bounds
	if( cell < 0 || cell > 80 || cell > wall || ( cell <= bwall && !this.gameBoard[cell]) ){
		this.showSolution();
		document.getElementById('numofmoves').value = this.moves;
		return cell;
	}

	var possVals;
	var i;
	
	//Default direction
	if(!direction){ direction = "pos"; }

	
	//Unexposed Cell - Player can edit square
	if(!this.gameBoard[cell]) {
		
		//Get numerical array of possible values.
		possVals = this.getPossibles(cell, "val");

		//Cell Not Solved - First solution attempt.
		if(!this.solveBoard[cell]){
						
			//No possible values
			if(possVals.length < 1){
				this.solveBoard[cell] = ''; //Clear cell since we are backstepping.
				return this.solve( (cell-1), 'neg', wall, bwall);
			}
			//Possible Values (try the lowest value)
			else{
				this.solveBoard[cell] = possVals[0];	
				this.calcPossibles(); //Change made, refresh possible values.
				return this.solve( (cell+1), 'pos', wall, bwall);
			}
		}
		//Cell Solved - But not correct. ( Backstepping )
		else{
			
			//If no-poss values OR value on SolveBoard >= last/greatest possible value
			if( (possVals.length < 1) || (this.solveBoard[cell] >= possVals[(possVals.length-1)]) ){
				this.solveBoard[cell] = '';
				return this.solve( (cell-1), 'neg', wall, bwall);
			}
			else{
				//Step through possible values
				for(i=0; i<possVals.length; i++){
					//Only try a value if it's larger than the current "solved" value.
					if(possVals[i] > this.solveBoard[cell]){
						this.solveBoard[cell] = possVals[i];						
						return this.solve( (cell+1), 'pos', wall, bwall);
					}
				}
			}
		}
	}
	//Exposed Cell - Can't edit. Skip.
	else{
		if(direction == 'pos'){
			return this.solve( (cell+1), 'pos', wall, bwall);
		}
		else if(direction == 'neg'){
			return this.solve( (cell-1), 'neg', wall, bwall);
		}
	}
}

/***************
 * UI-Controls *
 ***************/
Sodoku.prototype.showCells = function () {
	var i;
	for(i=0;i<81;i++){
		this.gameBoard[i] = i;
	}
	this.display();
}
Sodoku.prototype.startSolver = function () {
	
	this.step = parseInt(document.getElementById('stepValue').value);
	this.interval  = document.getElementById('interval').value;
	
	this.timer = self.setInterval(this.solverStr, this.interval);
}
Sodoku.prototype.startStepSolver = function () {
	this.step = parseInt(document.getElementById('stepValue').value);
	this.interval  = document.getElementById('interval').value;

	this.timer = self.setInterval(this.stepStr, this.interval);
}
Sodoku.prototype.stopTimer = function () {
	this.timer = window.clearInterval(this.timer);
	alert("Solver stopped.")
}
Sodoku.prototype.highlightCell = function (cell) {
	var last = this.currentCell + ( this.direction * -1);
	if(last >= 0 && last < 81){
		this.unHighlightCell(last);
	}
	var cellStr = "small-"+cell;	
	document.getElementById(cellStr).className += " highlight";
	this.currentCell = cell;
}
Sodoku.prototype.unHighlightCell = function (cell){
	var cellStr = "small-"+cell;
	document.getElementById(cellStr).className = document.getElementById(cellStr).className.replace(/\bhighlight\b/,'');
}

