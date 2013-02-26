/**
 * Class sudoku
 * Summary: A sudoku class that contains solving and editing capabilities.
 * @param	str		name	Name of sudoku obj created.
 * @param	int		size	Size of the sudoku puzzle to create.
 *
 *  size - Default 81
 *
 * NOTES:
 * Brute force algo vs EvilBoard = 112144 moves. 1move/1sec = 31hours
 *
 **/
function Sudoku(name, size, divID) {
	"use strict"; // Enforce strict

	/* Creates the boards */
	var board = [ ], i;
	for (i = 0; i < size; i = i + 1) { board.push(''); }

	/* Complete list of boards */
	this.gameBoard  = board.slice(0); //Exposed cells. (Puzzle to solve)
	this.possBoard  = board.slice(0); //Possible cell values.
	this.solveBoard = board.slice(0); //Solving values.
	this.emptyBoard = board.slice(0); //Used for resetting other boards.

	/* Bookmarks - Used to navigate when solving puzzle */
	this.solveBookmark = 0; //Used to step through solving process. 
	this.direction = 1;		//'1' represents "positive" direction
	this.solvePlace = 0;
	this.currentCell = null;

	/* Puzzle Settings */
	this.size = size || 81; //size of the sudoku puzzle
	this.name = name || 'mysudoku'; //Name of the sudoku class created by the page (@params)
	this.t_possibles = true; //Show possibles or not

	/* Helper Values */
	this.timer		= null;				// Timer used for solving the puzzle in intervals.
	this.interval	= 1;	// Interval for timers. (ms)(1000 = 1s)
	this.step		= 1;
	this.solverStr	= this.name + ".solver();";
	this.stepStr	= this.name + ".stepSolver();";
	this.moves = 0; //To count how long it takes to solve the problem.	

	/* Premade puzzles */
	this.testBoard = ['', 9, 2, '', '', 1, '', 8, '', '', '', '', '', '', '', 1, 7, '', '', '', 7, '', 3, '', 4, 6, 2, '', '', '', 3, '', '', 9, 1, '', '', 9, 6, 5, '', 1, 7, 4, '', '', 4, 1, '', '', 9, '', '', '', 1, 3, 6, '', 4, '', 7, '', '', '', 5, 2, '', '', '', '', '', '', '', 8, '', 2, '', '', 6, 9, ''];
	this.evilBoard = [5, '', 9, '', '', 6, '', 7, 8, 4, '', '', 2, '', '', '', '', 9, 7, '', '', '', '', '', '', '', 1, '', 6, '', '', '', 4, '', '', '', 9, '', '', '', '', '', '', '', 4, '', '', '', 9, '', '', '', 6, '', 1, '', '', '', '', '', '', '', 5, 6, '', '', '', '', 1, '', '', 8, 2, 5, '', 3, '', '', 1, '', 9];

	//this.displaySkelaton(divID);

	return true;
}


// * -------------------------------------------
// * Puzzle Creation
// * -------------------------------------------

/**
 * newPuzzle()
 * Summary: Resets the puzzle board and other values, then populates it with a new puzzle, and displays the new game.
 * Notes: This can result in non-solvable puzzles. Keep that in mind.
 * 
 * @param	int		lines	Number of "lines" or times to use the values 1-9 in the puzzle.
 * @param	str		divID 	The div ID to display the puzzle in.
 * @return	void
 **/
Sudoku.prototype.newPuzzle = function (lines, divID) {

	"use strict";
	/** Reset all boards **/
	this.gameBoard = this.emptyBoard.slice(0);
	this.possBoard = this.emptyBoard.slice(0);
	this.solveBoard = this.emptyBoard.slice(0);

	/** Reset all values **/
	this.solveBookmark = 0;
	this.moves = 0;

	/** Optional Resets (Maybe get rid of) **/
	this.direction = 1;
	this.solvePlace = 0;
	this.currentCell = null;
	/** --- **/

	/* Create the puzzle by prepopulating the cells */
	this.prepopulate(lines);

	/** Display the HTML **/
	this.refreshDisplay(divID);
};


/**
 * testPuzzle()
 * Summary: Sets the premade test puzzle in the board.
 **/
Sudoku.prototype.testPuzzle = function () {
	"use strict";
	this.gameBoard = this.testBoard.slice(0);
	this.refreshDisplay();
};

Sudoku.prototype.recurseGenerate = function (currentNumber, direction) {
	"use strict";
	var count = 0, x, possibleMoves;
	// Puzzle is complete and valid - End
	if (!this.gameBoard.indexOf('')) {
		return true;
	}

	// Select current number
	currentNumber = currentNumber || 1;
	
	// Get array of possible cell moves.
	possibleMoves = this.getPossibleCells(currentNumber, 'val');

	// Count how many of this value is in the puzzle
	for (x = 0; x < 81; x = x + 1) {
		if (this.gameBoard == currentNumber) {
			count++;
		}
	}

	// Exhausted all moves for this number, move on.
	if (!possibleMoves && count === 9) {
		return this.recurseGenerate( currentNumber+1 );
	}

	// Select a possible move by random
	// randMove = Math.floor( Math.random()* 1)+1;
	
	// Place our current number into that random available cell.
	// this.gameBoard[randMove] = currentNumber;
	
	// Check for "dead cells" - if so, backpedal
	if (!this.checkDeadCells()) {

		return this.recurseGenerate( currentNumber-1, direction )
	}


	if (possible.indexOf(cell) >= 0) {

	}	
};

Sudoku.prototype.generatePuzzle = function (generations) {

	this.empty();
	//Recursive function that fills the board with values.
	var rand, timeout=0;
	var max = 1000;
	var boxBoolArr = [], valBoxArr = [];
	var possibleMoves = 0;
	var randCell = 0;

	for(var val=1; val<=6; val++){
		
		// Need each number 9 times, one for each box.
		for(var x=0; x<9; x++){
			
			// Array for this box only
			var possArr = this.getPossibleCells( val );
			var boolBoxArr = possArr.slice( (x*9), x*9+(9));
			var valBoxArr = [];
			
			for(var i=0;i<boolBoxArr.length;i++){
				if( boolBoxArr[i] === true ){
					valBoxArr.push(i + (x*9));
				}
			}
			
			
			
			do{
				// Pick a random cell from the number
				randNum = Math.floor(Math.random() * valBoxArr.length);
				randCell = valBoxArr[randNum];
				//console.log('Random Number: '+randNum);
				//console.log('Random Cell: '+randCell);
				timeout++;
				// If this loops, we have a conflict from a previous move with this same number.
				// 
			
			}while( !this.check(randCell, val) && (timeout < max) && (valBoxArr.length > 0) );

			this.gameBoard[randCell] = val;
			//console.log('Num: '+val+' - Box: '+x+' - Cell: '+randCell+' - '+boolBoxArr.join()+' - ' + valBoxArr.join() );
			//console.log(this.gameBoard[randCell]);
			
			if(timeout >= max){ console.log('GeneratePuzzleTimeout'); timeout=0;}
			if(valBoxArr.length === 0 ){console.log('No Possible Moves-'); }
			//console.log('-=-');
		};
	};// Puzzle is created.
		generations = generations || 1;

	if( !this.checkPuzzle() ){
		generations++;
		this.generatePuzzle(generations);
	}
	this.refreshDisplay();
	console.log('Puzlle Valid ---- #of Generations ' + generations);
};

/**
 * prepopulate()
 * Summary: Creates the puzzle by prepopulating an empty board with numbers in random cells.
 * @param 	int 	lines 	Number of times to inject the numbers 1-9 in the puzzle.
 * @return 	void
 **/
Sudoku.prototype.prepopulate = function ( lines ) {
	if(!lines){ lines = 1; }
	
	var x, val, cell;
	var timeout = 0;
	var max = 1000;
	var again = true;
	
	for(x = 0; x < lines; x++){ //# of lines loop...
		for(val = 1; val <= 9; val++){ //Populating loop...
			do{

				cell = this.getRandomEmptyCell();
				again = false;
				timeout++;

				// Failed - Value cannot be placed in this cell.
				if( !this.check(cell, val) ){ 
					again = true;
				}else{

					//Place the value in the gameboard
					this.gameBoard[cell] = val;
					
					if( !this.checkDeadCells() ){
						this.gameBoard[cell]='';
						again = true;
					}
				}

			}while ( timeout < max && again == true);
			
			if( timeout >= max ){ console.log('TIMEOUT'); }
			timeout = 0;	
		}
	}
};

/**
 * getRandomEmptyCell()
 * Summary: Returns the location of a random empty cell. Used for puzzle creation.
 * @return 	int 	rand 	Random empty cell number.
 **/
Sudoku.prototype.getRandomEmptyCell = function ( small ) {
	var rand;
	if(small || small !== null){
		do{
			rand = Math.floor( Math.random() * 9 );
			rand += small*9;
		}while( this.gameBoard[rand] );
		return rand;
	}

	do{
		rand = Math.floor( Math.random() * 81 );
	}while( this.gameBoard[rand] );
	return rand;
};

Sudoku.prototype.checkDeadCells = function ( ) {
	var cell, possibles;
	
	for(cell=0; cell<81; cell++){

		if(!this.gameBoard[cell] && !this.solveBoard[cell]) {
			
			if( this.getPossibles(cell).length == 0 ){
				return false;
			}
		}
	}
	return true;
};


// * -------------------------------------------
// * Checking Methods
// * -------------------------------------------



/**
 * check()
 * Summary: Checks box, row, and column, and returns array for booleans for what are possible moves.
 *	If 'val' is provided, will return boolen whether that value is a valid move for the cell in question.
 *
 * @param 	int 	cell 	Numeric value 
 * @param 	int 	val (optional)	Value you wish to see if you can place.
 * @return 	bool 	true
 * @return 	bool 	false
 * @return 	arr 	arr 	Array of boolean values representing what values are possible moves.
 **/
Sudoku.prototype.check = function (cell, val) {
	
	/** BOX CHECK **/
	var box = this.checkBox(cell, val);
	
	/** ROW CHECK **/
	var row = this.checkRow(cell, val);
	
	/** COLUMN CHECK **/
	var column = this.checkColumn(cell, val);
	
	/** EMPTY CHECK **/
	var empty = true;

	// if( this.gameBoard[cell] || this.solveBoard[cell]){
	// 	return false;
	// }

	if( cell === 0 ){ 
		// console.log('cell_'+cell+' val_'+val);
		// console.log(box);
		// console.log(row);
		// console.log(column);
	 }
	
	/** If NO value passed, return array-of-booleans value-1 is placed in arr[0] **/
	if(!val){
		var arr = [ ];
		for(var i=0; i<9; i++){
			if( !box[i] || !row[i] || !column[i] ){
				arr[i] = false;
			}
			else{
				arr[i] = true;
			}
		}
		return arr;
	}
	/** Value passed - Return whether it passes all 3 checks **/
	if( box && row && column ){
		return true;
	}else{
		return false;
	}
};

/**
 * checkBox()
 * Summary: Checks to see what values are possible moves when regarding the encompassing box.
 *	If val is provided, we return whether or not that value is a valid move.
 *
 * @param 	int 	cell	
 * @param 	int 	val
 * @return 	bool 	true
 * @return 	bool 	false
 * @return 	arr 	arr 	Array of booleans representing what values are possible moves.
 **/
Sudoku.prototype.checkBox = function (cell, val){
	
	/* Represents moves 1-9*/
	var arr = [ true, true, true, true, true, true, true, true, true ];

	/* Iterate through the entire box, starting with it's starting square. */
	var start = this.getBoxStart(cell);

	//Create array of valid moves for this box
	for(var i=start; i < (start+9); i++){
		
		// Look for cell with value
		if( this.gameBoard[i] ){
			// We've found a value, let's mark that value as not usable for the box.
			arr[ ( this.gameBoard[i]-1 ) ] = false;
		}else if( this.solveBoard[i]  ){
			arr[ ( this.solveBoard[i]-1) ] = false;
		}
	}
	if(val){
		return arr[val-1];
	}else{
		return arr;
	}
};

/**
 * checkRow()
 * Summary: Checks to see what are possible moves for a specific cell and k
 *
 * @param 	int 	cell 
 * @param 	int 	val
 * @return 	bool 	true
 * @return 	bool 	false
 * @return 	arr 	arr
 **/
Sudoku.prototype.checkRow = function (cell, val){
	
	var i, x, boolArr, cells;
	cells = this.getRowCells(cell);
	arr = [ true, true, true, true, true, true, true, true, true ]; 

	for(i=0; i<9; i++){
		x = cells[i];
		
		if( this.gameBoard[x] ){
			arr[ (this.gameBoard[x] - 1) ] = false;
		}else if( this.solveBoard[x]  ){
			arr[ (this.solveBoard[x] - 1) ] = false;
		}
	}
	if(val){
		return arr[val-1];
	}
	else{
		return arr;
	}
};

/**
 * checkColumn()
 * Summary: Checks to see what values are possible moves for the cell is valid.
 * 	If a value is provided, return whether or not it is valid for that cell.
 * 
 * @param 	int 	cell 	Numeric representation of the cell.
 * @param 	int 	val 	(optional) The value to check.
 * @return 	arr 	arr 	Array of booleans representing what values are valid.
 * @return 	bool 	True 	If value is passed and it's a valid possible move for the cell
 * @return 	bool 	False 	If the value passed and it's an invalid move for the cell.
 **/
Sudoku.prototype.checkColumn = function (cell, val){
	
	var x, arr, cells;
	cells = this.getColumnCells(cell);
	arr = [ true, true, true, true, true, true, true, true, true ]; 

	for(var i=0; i<9; i++){
		x = cells[i];
		if( this.gameBoard[x] ){
			arr[ (this.gameBoard[x] - 1) ] = false;
		}else if( this.solveBoard[x]  ){
			arr[ (this.solveBoard[x] - 1) ] = false;
		}
	}
	if(val){
		return arr[val-1];
	}
	else{
		return arr;
	}
};

Sudoku.prototype.checkPuzzle = function(alertFlag){

	var x, y;
	for(x=0;x<81;x++){
		
		if(this.gameBoard[x]){
			//console.log('check cell:'+x+' value:'+this.gameBoard[x]);
			y = this.gameBoard[x];
			this.gameBoard[x] = '';
			if( !this.check(x, y) ){
				//console.log('THIS PUZZLE FAILED');
				this.gameBoard[x] = y;
				if(alertFlag===true){ alert('Puzzle FAILED'); }
				
				return false;
			}
			this.gameBoard[x] = y;
		}
	}
	if(alertFlag===true){alert('Puzzle SUCCESS');}
	return true;
};

// * -------------------------------------------
// * Displaying & HTML
// * -------------------------------------------




Sudoku.prototype.displaySkelaton = function (div) {
	document.getElementById('game').innerHTML = this.getHTMLSkelaton();
	//document.getElementById('game').innerHTML = 'pushit on me ';//this.getHTML(this.t_possibles, true);
	//document.getElementById('controls').innerHTML  = '';
};

/**
 * getHTMLSkelaton()
 * Summary: Returns the HTML skelaton for the sudoku game.
 * @return 	str 	str 
 **/
Sudoku.prototype.getHTMLSkelaton = function(){
	var str;
	var i;
	
	//16: 4x4 Box:2x2
	//36: 6x6 Box:2x3
	//81: 9x9 Box:3x3

	str  = '<div id="sudoku">';
	
	for(i=0; i<this.size; i++){
		
		if(this.getSmall(i) == 0){ 
			str += '<div id="big-'+this.getBig(i)+'" class="big">'; //#big - start
		}
		
		str += '<div id="small-'+i+'" class="small">';//#small - start

		for(var j=1;j<=9;j++){
			str += '<div id="tiny-'+j+'" class="tiny">'+j+'</div>';	
		}
		

		str += '</div>';// #small-end	
		
		if(this.getSmall(i) == 8){
			str += '</div>'; // #big-end
		}
	}
	str += '</div>'; //#sudoku -end
	return str;
};


/**
 * getHTML()
 **/
Sudoku.prototype.getHTML = function(showPossibles, showSolution) {

	if( showPossibles !== true) { showPossibles = false; }
	if( showSolution !== true) { showSolution = false; }
	
	if( showPossibles === true ){ this.calcPossibles(); }
	
	var str = '';
	var cell, k, possStr;
	
	str += '<div id="sudoku">'; //#sudoku - Start
	
	for(cell=0; cell<this.size; cell++){
		
		//# BIG START
		if(this.getSmall(cell) == 0){ str += '<div id="big-'+this.getBig(cell)+'" class="big">'; }
		
		//# SMALL START
		str += '<div id="small-'+cell+'" class="small">';//#small - start
		
		//Always show the gameBoard values. (gameBoard == 0 statement for this.showCells() method)
		if( this.gameBoard[cell] !== '' || this.gameBoard[cell] === 0){
			str += '<span class="game-value">'+this.gameBoard[cell]+'</span>';
		}
	 	else if( this.solveBoard[cell] && showSolution ){
			str += '<span class="entered-value">'+this.solveBoard[cell]+'</span>';
		}
		else if( this.possBoard[cell] ){
			for(k=0; k<9; k++){
				if(this.possBoard[cell][k] == true){
					possStr = '<span class="valid-possible">'+(k+1)+'</span>';
				}
				else{
					possStr = '<span class="invalid-possible">'+(k+1)+'</span>';
				}
				if( showPossibles ){
					str += '<div class="tiny">'+possStr+'</div>';	
				}else{
					str += '<div class="tiny hidden">'+possStr+'</div>';	
				}
				
			}
		}
		str += '</div>'; //#small - end
		
		if(this.getSmall(cell) == 8){
			str += '</div>'; //#big -end
		}
	}
	str += '</div'; //#sudoku - end
	return str;
};


/**
 * togglePossibles()
 * Summary: Toggles whether to show possible moves in the puzzle or not.
 * @param 	bool 	override 
 **/
Sudoku.prototype.togglePossibles = function(override){
	console.log('toggle'+this.t_possibles);
	if(override === true || override === false){
		this.t_possibles = override;
	}else{
		this.t_possibles = !this.t_possibles;
	}
	this.refreshDisplay();
};


/**
 * refreshDisplay()
 * Summary: Calls the getHTML method to display values based on class values.
 * 
 * @param 	str 	divID 	Id of the div
 * @return 	void
 *
 **/
Sudoku.prototype.refreshDisplay = function(divID){
	//if(!divID){divID='game';}
	//document.getElementById(divID).innerHTML = mysudoku.getHTML(this.t_possibles, true);
	
	var i;
	var cellID;

	for(i=0;i<81;i++){
		if( this.solveBoard[i] ){
			cellID = 'small-'+i;
			document.getElementById(cellID).innerHTML = this.solveBoard[i];
			document.getElementById(cellID).className += " entered-value";
		}

		if( this.gameBoard[i] ){
			cellID = 'small-'+i;
			document.getElementById(cellID).innerHTML = this.solveBoard[i];
			document.getElementById(cellID).className += " game-value";
		}
	};


};


/**
 * empty()
 * Summary: Empties the board and refreshes the display.
 *
 **/
Sudoku.prototype.empty = function () {
	this.gameBoard = this.emptyBoard.slice(0);
	this.solveBoard = this.emptyBoard.slice(0);
	this.refreshDisplay();
};

/**
 * clear()
 * Summary: Empties the board and refreshes the display.
 *
 **/
Sudoku.prototype.clear = function () {
	this.solveBoard = this.emptyBoard.slice(0);
	this.refreshDisplay();
};

/**
 * getPossibles()
 * @param 	int 	cell 	The cell we are checking possibiles for.
 * @param 	str 	type 	Type of array we want back. Boolean of values.
 * @return 	arr 	boolArr Array of boolean values to represent possible values for cell.
 * @return 	arr 	valArr 	Array of values that are possible values for cell.
 */
Sudoku.prototype.getPossibles = function (cell, type) {
	
	// Possibles arr (boolean)
	var boolArr = this.check(cell);
	
	var valArr = [ ];
	for(var z=0;z<9;z++){
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
	return valArr;
};


/**
 * calcPossibles
 * Summary: 
 **/
Sudoku.prototype.calcPossibles = function () {
	var cell;
	for(cell=0; cell<81; cell++){
		if( !this.gameBoard[cell] && !this.solveBoard[cell] ) {
			this.possBoard[cell] = this.check(cell);
		}
	}
};

Sudoku.prototype.getPossibleCells = function ( value, type){

	//Go through ALL the cells, and return an array of which I can use.
	var cell;
	var boolArr = [];
	for(cell=0;cell<81;cell++){
		//Mark this cell as usable
		boolArr[cell] = this.check(cell, value);
	}
	var valArr = [ ];
	for(var z=0;z<boolArr.length;z++){
		if(boolArr[z]){
			valArr.push(z+1);
		}
	}
	if( type === 'val' ){
		return valArr;
	}else{
		return boolArr;
	}
}

// * -------------------------------------------
// * Solving
// * -------------------------------------------


/**
 * sudoku.solveCell(cell)
 * Summary: To solve a single cell only. 
 *
 * @param 	int 	cell
 * @return 	boll 	true 	Increment solver.
 * @return 	bool 	false 	Decrement solver.
 * @return 	bool 	null 	Continue solver. (, in same direction as you were)
 *
 * Parents: 
 *	solver();
 *
 **/
Sudoku.prototype.solveCell = function(cell){
	
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

	//There is a No Possibles somewhere else on the board
	if( !this.checkDeadCells() ){
		
		//Check to see if this cell is the cause of problem
		temp = this.solveBoard[cell];
		this.solveBoard[cell]='';
		
		if( this.checkDeadCells() ){
			//This cell is the problem, just increment its value.
			for(i=0; i<possVals.length; i++){
				if(possVals[i] > temp){
					this.solveBoard[cell] = possVals[i];
					this.moves += 1;	
					return true;
				}
			}
		}

		//Cell is not the problem - keep backpedeling
		return false;
	}

	//Cell Not Solved
	else if(!this.solveBoard[cell]){
		this.solveBoard[cell] = possVals[0];
		this.moves += 1;	
		return true;
	}
	//Solved: Needs value larger than current value
	else{
		for(i=0; i<possVals.length; i++){
			if(possVals[i] > this.solveBoard[cell]){
				this.solveBoard[cell] = possVals[i];
				this.moves += 1;	
				return true;
			}
		}
	}
};

/**
 * -------------------------------------------
 * sudoku.solver( )
 * -------------------------------------------
 * Purpose:
 *	Controller method to solve the sudoku with an incremental brute-force algorithm
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
Sudoku.prototype.solver = function(){

	var cell, x;
	if(this.currentCell === null){this.currentCell = 0;}
	cell = this.currentCell;
	this.refreshDisplay();
	
	if(cell > 80 ){
		this.stopTimer();
		document.getElementById('numofmoves').value = this.moves;
		return false;
	}
	else{
		this.highlightCell(cell);
		x = this.solveCell(cell);
		this.calcPossibles();
		
		// GameBoard - Cant play this cell
		if(x === null){
			this.currentCell += this.direction;
		}
		else if(x === true){
			this.currentCell++;
			this.direction = 1;
			//this.moves += 1;
		}
		else if(x === false){
			this.currentCell--;
			this.direction = -1;
			//this.moves += 1;
		}
	}
	document.getElementById('numofmoves').value = this.moves;

};

Sudoku.prototype.fillSinglePossiblesRecurse = function (cell){
	
	if(!cell){cell=0;}
	//Exit clause
	//If... we have solved puzzle
	//If... no more 'single possible value' cells.
	if (cell>=81){return true;}
	
	this.fillSinglePossibles();
	return (this.fillSinglePossiblesRecurse(cell++));
	
};


/**
 * filleSinglePossibles()
 * Summary:
 * 
 **/
Sudoku.prototype.fillSinglePossibles = function() {

	var i, finished;
	finished = true;
	
	var x = 0;
	
	//Step through possibles
	for(i=0; i<81; i++){
		
		//If not game-pice----
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
	
	//if(!finished){
	//	this.smartSolver();
	//}
	//Update Possibles
	//this.calcPossibles();
	//this.showSolution();
	document.getElementById('numofmoves').value = this.moves;
	this.refreshDisplay();
	//Return
	return true;
};


/**
 * -------------------------------------------
 * sudoku.stepSolver(step)
 * -------------------------------------------
 * Purpose: 
 * 	To show the incremental progress of our recursive solving method.
 * 	Function is called by "startStepSolver" which is a setInterval of 1000ms.
 * Calls:
 *	solve(start,'pos', end, bwall);
 *	stopTimer();
 */
Sudoku.prototype.stepSolver = function () {

	this.startTime = new Date().getTime();

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
		now = new Date().getTime();
		document.getElementById('txt-timer').value = (now-this.startTime)/1000;

		return false;
	}
	else{
		this.solveBookmark = this.solve(start, 'pos', end, bwall);
	}
	document.getElementById('numofmoves').value = this.moves;
	return true;
};

/**
 * -------------------------------------------
 * sudoku.solve(cell, direction, wall, backWall)
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
Sudoku.prototype.solve = function(cell, direction, wall, bwall) {

	// Increment 'move counter'
	document.getElementById('numofmoves').value = this.moves;

	// Default value for cell if value not present
	if(!cell && cell !== 0){
		cell = 0;
		this.temptime = new Date().getTime();
	}

	// Break Recursion - When solver goes "out-of-bounds"
	if( cell < 0 || cell > 80 || cell > wall || ( cell <= bwall && !this.gameBoard[cell]) ){
		this.refreshDisplay();
		var now = new Date().getTime();
		document.getElementById('txt-timer').value = (now-this.temptime)/1000;
		return true;
	}

	// Check for 'dead cells' - a unsolved cell with no possible moves.
	if( !this.checkDeadCells() ){
		
		//Check to see if this cell is the cause of problem
		temp = this.solveBoard[cell];
		this.solveBoard[cell]='';
		
		if( this.checkDeadCells() ){
			//This cell is the problem, just increment its value.
			var possVals = this.getPossibles(cell, "val");

			for(i=0; i<possVals.length; i++){
				if(possVals[i] > temp){
					this.solveBoard[cell] = possVals[i];
					this.moves += 1;	
	
					return this.solve((cell+1), 'pos', wall, bwall);
				}
			}
		}

		//Cell is not the problem - keep backpedeling
		return this.solve((cell-1), 'neg', wall, bwall);
	}


	var possVals;
	var i;
	
	// Go 'forward' by default
	direction = direction || 'pos';
	
	// Cell not part of puzzle - Player can edit 
	if(!this.gameBoard[cell]) {
		
		// Get numerical array of possible values.
		possVals = this.getPossibles(cell, "val");

		// Cell Not Solved - First solution attempt.
		if(!this.solveBoard[cell]){
						
			// No possible values
			if(possVals.length < 1){
				this.solveBoard[cell] = ''; //Clear cell since we are backstepping.
				return this.solve( (cell-1), 'neg', wall, bwall);
			}
			//Possible Values (try the lowest value)
			else{
				this.solveBoard[cell] = possVals[0];
				this.moves += 1;		
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
						this.moves += 1;	
							
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
};








// * -------------------------------------------
// * Position Methods
// * -------------------------------------------


/** 
 * All methods return a numeric value representing the value they are "getting".
 *
 * BIG:
 * 	returns 0 - (sqrt(size)-1)
 * SMALL:
 *	returns 0 - (sqrt(size)-1)
 * START:
 * 	returns 0 - (size-1)
 * CELLS:
 *	returns arr( 0 - size )
**/

/**
 * getBig()
 * @param 	int 	cell 	Numeric position of cell.
 * @return 	int 	Numeric position 
 **/ 
Sudoku.prototype.getBig = function (cell){
	return Math.floor(cell/9);
};


/**
 * getBigRow()
 * @param 	int 	cell 	Numeric position of cell.
 **/
Sudoku.prototype.getBigRow = function (cell){
	return Math.floor( Math.floor(cell/9) / 3);
};


/**
 * getBigColumn()
 * @param 	int 	cell 	Numeric position of cell.
 * @return 	int 	Big Column that the cell belongs to.
 **/
Sudoku.prototype.getBigColumn = function (cell){
	return ( Math.floor(cell/9) % 3 );
};


/**
 * getSmall()
 * @param 	int 	cell 	Numeric position of cell
 * @return 	int 	Numeric position of the cell's small 
 */
Sudoku.prototype.getSmall = function (cell){
	return cell % 9;
};


/**
 * getSmallRow()
 * Summary: What row the cell accompanies in the 'big' box.
 * @param 	int 	cell 	Numerical position of the cell in question
 * @return 	int 	pos 	
 **/
Sudoku.prototype.getSmallRow = function (cell){
	return Math.floor( ( cell % 9 ) / 3);
};


/**
 * getSmallColumn()
 * Summary:
 * @param 	int 	cell
 **/
Sudoku.prototype.getSmallColumn = function (cell){
	return ( cell % 9 ) % 3;
};


/**
 * getBoxStart()
 * Summary: Returns the cell number of the beginning of the box that the cell lives.
 * @param 	int 	cell 	Numerical value of the cell in question.
 **/
Sudoku.prototype.getBoxStart = function (cell){
	return this.getBig(cell) * 9;
};


/**
 * getRowStart()
 * Summary: Returns the position of the cell that is at the beginning of the row cell param is in.
 * @param 	int 	cell
 * @return 	int 	start 	Numerical value of cell at beginning of row.
 **/
Sudoku.prototype.getRowStart = function (cell){
	return (( Math.floor(this.getBig(cell) / 3) * 3) * 9) + ( this.getSmallRow(cell) * 3 );
};


/**
 * getColumnStart()
 * Summary: Returns the position of the beginning cell of the column the cell 
 * @param 	int 	cell
 * @return 	int 	cell 	The numerical value of the cell that is at the beginning of the column that the cell param belongs to.
 **/
Sudoku.prototype.getColumnStart = function (cell){
	return ( this.getBig(cell) % 3) * 9 + ( this.getSmallColumn(cell) );
};

/**
 * getRowCells()
 * Summary:
 * @param 	int 	cell
 * @return 	int 	cell 
 **/
Sudoku.prototype.getRowCells = function (cell) {
	var start = this.getRowStart(cell);
	var arr = [ ];
	var end = start + 20 + 1;
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
};


/**
 * getColumnCells()
 * Summary:
 * @param 	int 	cell
 * @return 	 int 	cell
 **/
Sudoku.prototype.getColumnCells = function (cell) {
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
};



/***************
 * UI-Controls *
 ***************/

/**
 * showCells()
 * Summary:
 **/
Sudoku.prototype.showCells = function () {
	for(var i=0;i<81;i++){
		this.gameBoard[i] = i;
	}
	this.refreshDisplay();
};


/**
 * startSolver()
 * Summary:
 **/
Sudoku.prototype.startSolver = function () {
	
	
	// Timer is active - deactivate it
	if( this.timer ){
		this.timer = window.clearInterval(this.timer);
		var now = new Date().getTime();
		document.getElementById('txt-timer').value = (now-this.startTime)/1000;

	}else{
		// Start the interval
		this.timer = self.setInterval(this.solverStr, this.interval);
		// Grab time from the 
		this.startTime = new Date().getTime() - document.getElementById('txt-timer').value * 1000;
	}
	
};


/**
 * startStepSolver()
 * Summary: Sets step and interval for 'setInterval' and sets timer.
 *
 **/
Sudoku.prototype.startStepSolver = function () {
	
	this.step = parseInt(document.getElementById('stepValue').value);
	this.interval  = document.getElementById('interval').value;
	this.timer = self.setInterval(this.stepStr, this.interval);
};


/**
 * stopTimer()
 * Summary: Clears the interval and pops up an alert to shop the timer has stopped.
 * @return 	void
 **/
Sudoku.prototype.stopTimer = function () {
	this.timer = window.clearInterval(this.timer);
	var now = new Date().getTime();
	document.getElementById('txt-timer').value = (now-this.startTime)/1000;

	alert("Solver stopped.")
};

/**
 * highlightCell()
 * Summary:
 **/
Sudoku.prototype.highlightCell = function (cell) {
	var last = this.currentCell + ( this.direction * -1);
	if(last >= 0 && last < 81){
		this.unHighlightCell(last);
	}
	var cellStr = "small-"+cell;	
	document.getElementById(cellStr).className += " highlight";
	this.currentCell = cell;
};


/**
 * unHighlightCell()
 * Summary:
 * @param 	int 	cell 	Numerical position of the cell to highlight.
 *
 **/
Sudoku.prototype.unHighlightCell = function (cell){
	var cellStr = "small-"+cell;
	document.getElementById(cellStr).className = document.getElementById(cellStr).className.replace(/\bhighlight\b/,'');
};


/**
 * highlightCells
 * Summary: Highlights a number of cells regarding the position. Highlights row, column, and box of the cell.
 * @param 	int 	cell 	Numeric position of the cell in the puzzle.
 **/
Sudoku.prototype.highlightCells = function(cell){
	//boxArr = this.getBoxCells(cell);
	rowArr = this.getRowCells(cell);
	colArr = this.getColumnCells(cell);
	for (var i = colArr.length - 1; i >= 0; i--) {
		//document.getElementById('small-'+cell));
		cellStr = 'small-'+colArr[i];
		document.getElementById(cellStr).className += " lowlight";
	};
	// for (var i = rowArr.length - 1; i >= 0; i--) {
	// 	//document.getElementById('small-'+cell));
	// 	cellStr = 'small-'+rowArr[i];
	// 	document.getElementById(cellStr).className += " lowlight";

	// };
};


/**
 * unhighlightCells() NOT USED
 **/
Sudoku.prototype.unhighlightCells = function(cell){
};


