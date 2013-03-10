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

	/* Algorithm Settings */
	this.addOn_deadCells = true;
	this.addOn_lastMoveTwins = true;

	/* Helper Values */
	this.timer		= null;	// Timer used for solving the puzzle in intervals.
	this.interval	= 1;	// Interval for timers. (ms)(1000 = 1s)
	this.step		= 1;
	this.solverStr	= this.name + ".solver();";
	this.genStr	= this.name + ".generateController();";
	this.moves = 0; // Counts when we move our focus from one cell to another.
	this.pencils = 0; // Counts times we place a value in a cell

	/* Premade puzzles */
	this.easyBoard = ['', 9, 2, '', '', 1, '', 8, '', '', '', '', '', '', '', 1, 7, '', '', '', 7, '', 3, '', 4, 6, 2, '', '', '', 3, '', '', 9, 1, '', '', 9, 6, 5, '', 1, 7, 4, '', '', 4, 1, '', '', 9, '', '', '', 1, 3, 6, '', 4, '', 7, '', '', '', 5, 2, '', '', '', '', '', '', '', 8, '', 2, '', '', 6, 9, ''];
	this.evilBoard = [5, '', 9, '', '', 6, '', 7, 8, 4, '', '', 2, '', '', '', '', 9, 7, '', '', '', '', '', '', '', 1, '', 6, '', '', '', 4, '', '', '', 9, '', '', '', '', '', '', '', 4, '', '', '', 9, '', '', '', 6, '', 1, '', '', '', '', '', '', '', 5, 6, '', '', '', '', 1, '', '', 8, 2, 5, '', 3, '', '', 1, '', 9];

	this.displaySkelaton(divID);
	this.refreshControls();
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
 * @param	str		divID	The div ID to display the puzzle in.
 * @return	void
 **/
Sudoku.prototype.newPuzzle = function (lines, divID) {

	/** Reset all boards **/
	this.gameBoard = this.emptyBoard.slice(0);
	this.possBoard = this.emptyBoard.slice(0);
	this.solveBoard = this.emptyBoard.slice(0);

	/** Reset all values **/
	this.solveBookmark = 0;
	this.moves = 0;
	this.pencils = 0;

	/** Optional Resets (Maybe get rid of) **/
	this.direction = 1;
	this.solvePlace = 0;
	this.currentCell = null;
	/** --- **/

	/** Display the HTML **/
	this.refreshDisplay(divID);
};

/**
 * testPuzzle()
 * Summary: Sets the selected test puzzle.
 **/
Sudoku.prototype.testPuzzle = function (num) {
	
	this.empty();
	num = num || 1;
	this.pencils = 0;
	this.moves = 0;

	if( num == 1 ){
		this.gameBoard = this.easyBoard.slice(0);	
	}else if( num == 2 ){
		this.gameBoard = this.evilBoard.slice(0);	
	}
	this.refreshDisplay();
};

Sudoku.prototype.recurseGenerate = function (currentNumber, direction, moves, flag) {

	if ( !currentNumber ){ this.empty(); }

	// Set defaults
	currentNumber = currentNumber || 1;
	direction = direction || 1;
	moves = moves || [];
	flag = flag || 1;
	var count = 0, x, possibleMoves, cell;
	

	// Break Recursion - Puzzle done.
	if ( currentNumber > 2 || flag > 10 ) {
		console.log(' --- END --- ' );
		this.refreshDisplay();
		return true;
	}


	// Check for Dead cells - Will trigger backpedaling
	if( !this.checkDeadCells() ){
		return 
	}


	// Get array of possible cell moves.
	var possibleMoves = this.getPossibleCells(currentNumber, 'val');


	// Count how many of this value is in the puzzle
	for (x = 0; x < 81; x += 1) {
		if (this.gameBoard[x] === currentNumber) { count += 1; }
	};
	
	
	// Completed currentNumber - increment value
	if ( count === 9) {
		console.log(possibleMoves.length);
		console.log( ' Current Number Completed ' );
		return this.recurseGenerate(currentNumber + 1, 1, moves, flag+1);
	}

	// do{
	// 	// Select a possible move by random
	// 	randMove = Math.floor (Math.random () * possibleMoves.length - 1); // 0-length

	// 	// Place our current number into that random available cell.
	// 	this.gameBoard[possibleMoves[randMove]] = currentNumber;
		
	// 	// This move just created some dead-cells, so let's remove this cell-option and lets try another.
	// 	if( !this.checkDeadCells() ){
	// 		// Remove that cell from our possible list
	// 		possibleMoves[randMove].splice(randMove,1);
	// 	}

	// }while( !this.checkDeadCells() && possiblesMoves.length > 0 );

	


	// We're backpedaling 
	if( direction === -1 ){
		console.log('backpedaling');
		//- we need to choose the last value placed and remove it
		var lastmove = moves[moves.length-1];
		this.gameBoard[lastmove] = '';

		// Remove this cell from possible cells to use. 
		var index = possibleMoves.indexOf(lastmove);
		possibleMoves.splice(index, 1);
	}

	var randMove = Math.floor (Math.random() * (possibleMoves.length - 1)); // 0-length
	cell = cell || possibleMoves[randMove];
	console.log( 'No: ' + currentNumber + ' cell: ' + cell + ' numMoves: ' + possibleMoves.length + ' rand: ' + randMove);
		
	// We have a move we can make
	if( possibleMoves.length > 0 ){
		console.log(possibleMoves.join());
		this.gameBoard[cell] = currentNumber;
		moves.push(cell);
		return this.recurseGenerate( currentNumber, 1, moves, flag+1 );
	
	}else{
		// No moves left - Clear cell
		this.gameBoard[cell] = '';
		moves.pop();
		return this.recurseGenerate( currentNumber, -1, moves, flag+1 )
	}



};

Sudoku.prototype.generateCell = function (cell) {

	var possVals, i;
	this.moves += 1;
	
	// Grab possible values for current cell
	possVals = this.getPossibles(cell, "val");
	
	// No Possibles OR we've tried all possibles
	if( possVals.length < 1 ){
		//this.gameBoard[cell] = '';
		return false; // Backpedal
	}

	if( this.gameBoard[cell] >= possVals[possVals.length-1]){
		//this.gameBoard[cell] = '';
		return false; // Backpedal
	}

	// There is a No Possibles somewhere else on the board
	if( this.addOn_deadCells && !this.checkDeadCells() && !this.gameBoard[cell]){
		return false; // Backpedal
	}

	// Last Move Twins on Board - Mistake made by cell behind most likely
	if( this.addOn_lastMoveTwins  && !this.checkLastMoveTwins() && !this.gameBoard[cell]){
		return false; // Backpedal
	}
	
	// Possibles moves - lets try lowest value one
	for (i = 0; i < possVals.length; i += 1 ){
		if (possVals[i] > this.gameBoard[cell] || !this.gameBoard[cell]) {
			this.gameBoard[cell] = possVals[i];
			this.pencils += 1;	
			return true;
		}
	}


	// rand = Math.floor( Math.random() * possVals.length );
	// if (possVals[rand] > this.gameBoard[cell] || !this.gameBoard[cell]) {
	// 	this.gameBoard[cell] = possVals[rand];
	// 	this.pencils += 1;	
	// 	return true;
	// }else{
	// 	this.gameBoard[cell] = '';
	// 	return false;

	// }

};

Sudoku.prototype.generateController = function (){

	// Make a randomized board we use as a guide and solve puzzle that way.
	if( !this.randomBoard ){
		var tempArr = [];
		var i;
		for(i=0;i<81;i+=1){
			tempArr.push(i);
		}
		this.randomBoard = this.randomizeArray(tempArr);
	}

	var cell, result;
	if( !this.generateArr ){
		this.generateArr = [];
		this.direction = 1;
		this.startStopwatch();
	}

	if( this.direction === -1 ){
		// We're backpedaling, so we use last cell on queue.
		//this.currentCell = this.generateArr[this.generateArr.length-1];
		this.currentCell = this.randomBoard[cell];
	}else{
		this.currentCell = this.getRandomEmptyCell();

	}
	cell = this.currentCell;
	
	// Null means we have no more empty cells to play with.
	if( cell === null ){
		this.stopTimer();
		this.refreshMovesStatus();
		this.currentCell = null;
		return false;
	
	}else{
		
		result = this.generateCell(cell);
		
		this.refreshDisplay(cell);
		
		this.unhighlightCells();
		
		if( this.direction === -1 ){
			this.lowlightCell(cell);	
		}else{
			this.generateArr.push(cell);
			this.highlightCell(cell);	
		}
		
			
		
		// We placed a value in a cell - we can continue on.
		if(result === true){
			// We placed a new cell.
			this.direction = 1;
			console.log('Adding move : ' + this.generateArr.length);
		}
		else if(result === false){
			// backpedal
			this.gameBoard[cell] = '';
			this.generateArr.pop();
			this.direction = -1;
			console.log('backpedal : ' + this.generateArr.length);
		}
	}
	this.refreshMovesStatus();
};


/**
 * getRandomEmptyCell()
 * Summary: Returns the location of a random empty cell. Used for puzzle creation.
 * @return 	int 	rand 	Random empty cell number.
 **/
Sudoku.prototype.getRandomEmptyCell = function ( big ) {
	var rand;
	var emptyArr = [];

	for(var i=0; i<this.gameBoard.length; i+=1 ){
		if(!this.gameBoard[i]){
			emptyArr.push(i);
		}
	}

	// No empty cells left
	if( emptyArr.length < 1 ){
		return null;
	}

	// Get a random empty cell for a box only.
	if(big){
		do{
			rand = Math.floor( Math.random() * 9 ); //
			rand += small*9;
		}while( this.gameBoard[rand] );
		return rand;
	}

	// Pick a random cell 
	do{
		rand = Math.floor( Math.random() * emptyArr.length );
	}while( this.gameBoard[rand] );

	return rand;
};

Sudoku.prototype.checkDeadCells = function () {
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

Sudoku.prototype.checkLastMoveTwins = function () {
	return true;
	// Grab groups.
	// Box 1 - 9
	// Column 1 - 9
	// Row 1 - 9
	
	var i, j, val, possibles, cell, cells;
	var tempTwinsArr = [];

	// iterate through our 9 boxes
	for(i=0;i<9;i+=1){

		cells = this.getBoxCells( i * 9);
		
		console.log(cells.join());
		// Iterate through the cells in the current box
		for(j = 0; j < cells.length; j += 1){

			cell = cells[j];

			// Make sure cell we're inspecting isn't a gamePiece
			if( !this.gameBoard[cell]){
			
				// Gather the possibles moves for this current cell
				possibles = this.getPossibles(cell);
				
				// If it has only one move left, it's a single. Mark that value.
				if( possibles.length === 1 ){

					val = possibles[0];
					if( tempTwinsArr[val] === 'greg' ){
						// This has already been marked - we have TWINS
						console.log(' WE HAVE TWINS - ' + cell );
						return false;
					}else{
						console.log('logging single - ' + cell );
						tempTwinsArr[val] = 'greg';
					}
					
				}	
			}
		}
		tempTwinsArr = []; // Clear the twins array for each box.
		
	}
	this.refreshDisplay();
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

/**
 * checkPuzzle
 * Summary: Checks the entire puzzle to make sure it is valid. Useful when testing completed puzzles and generation.
 * @param  {bool} alertFlag Debug value used to show an alert if it fails.
 * @return {bool}           Whether or not the value failed the check.
 */
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
	document.getElementById(div).innerHTML = this.getHTMLSkelaton();
};

/**
 * getHTMLSkelaton()
 * Summary: Returns the HTML skelaton for the sudoku game.
 * @return 	str 	str 
 **/
Sudoku.prototype.getHTMLSkelaton = function(){
	var str, i, j;

	// Sudoku container - Start
	str = '<div id="sudoku">';
	
	for (i = 0; i < this.size; i += 1){
		
		// Big/Box - Start
		if (this.getSmall(i) === 0) { 
			str += '<div id="big-' + this.getBig(i) + '" class="big">';
		}
		
		// Small - Start
		str += '<div id="small-'+i+'" class="small">';//#small - start

		// Tiny - Entire matrix ( We use these for possible move values )
		for (j = 1; j <= 9; j+=1) {
			str += '<div id="tiny-' + j + '" class="tiny">' + j + '</div>';	
		}
		
		// Value - Container for both game values and entered/solved values.
		str += '<div class="value"></div>';

		// Small - End
		str += '</div>';
		
		// Big/Box - End 
		if(this.getSmall(i) == 8){
			str += '</div>';
		}
	};

	// Sudoku container - End
	str += '</div>';

	return str;
};

/**
 * refreshDisplay()
 * Summary: DOM walking refresh method. This replaced html string creation.
 * 
 * @param 	str 	divID 	Id of the div
 * @return 	void
 *
 **/
Sudoku.prototype.refreshDisplay = function(divID){
	var i, cellID, temp;

	for(i=0;i<81;i++){

		cellID = 'small-'+i;
		small = document.getElementById(cellID);

		// Game_Board piece found --- Place value and class
		if( this.gameBoard[i] ){
			temp = small.getElementsByClassName("value")[0];
			temp.innerHTML = this.gameBoard[i];
			small.className = small.className.replace(/\bentered-value\b/,'');
			small.className = "small game-value";

		// Solved/entered value found --- Place value and class
		}else if( this.solveBoard[i] ){
			temp = small.getElementsByClassName("value")[0];
			temp.innerHTML = this.solveBoard[i];
			small.className = small.className.replace(/\game-value\b/,'');
			small.className = "small entered-value";	
		
		// No value found - it's empty	
		}else{
			
			// Remove the "entered-value" class
			//small.className = small.className.replace(/\bentered-value\b/,'');
			small.className = small.className.replace( /(?:^|\s)entered-value(?!\S)/g , '' );
			small.className = small.className.replace( /(?:^|\s)game-value(?!\S)/g , '' );

			// Get list of possible moves for cell
			arr = this.getPossibles(i, 'bool');
			
			// Clear value - just in case
			temp = small.getElementsByClassName("value")[0];
			temp.innerHTML = '';

			for(j=1;j<=9;j++){

				tiny = 'tiny-'+j;
				tinyObj = document.getElementById(cellID).getElementsByClassName('tiny')[j-1];
				if( arr[j-1] !== true ){

				}
				if( arr[j-1] === true ){
					//tinyObj.className = tinyObj.className.replace(/\bhidden\b/,'');
					tinyObj.className = tinyObj.className.replace( /(?:^|\s)hidden(?!\S)/g , '' );

				}else{
					tinyObj.className = 'tiny hidden';	
				}	
			};
		}

	};
};

Sudoku.prototype.refreshControls = function(){

	document.getElementById('dead-cells-chkbox').checked = this.addOn_deadCells;
	document.getElementById('last-move-twins-chkbox').checked = this.addOn_lastMoveTwins;
	document.getElementById('numofmoves').value = 0;
	document.getElementById('numofpencils').value = 0;
	document.getElementById('txt-timer').value = 0;
};


// * -------------------------------------------
// * Manipulating Puzzle
// * -------------------------------------------

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
 * clearSolveBoard()
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
Sudoku.prototype.calcPossibles = function (changedCell) {
	
	// If given a cell that has changed, we know what possibles could have changed.
	// It's box, it's row, and it's column.
	if( changedCell >= 0 && changedCell < 81 ){
		var affectedCells = [];
		affectedCells = this.getBoxCells(changedCell).concat( this.getColumnCells(changedCell), this.getRowCells(changedCell)  );
		
		var cell;
		for(i=0; i<affectedCells.length-1; i+=1 ){
			cell = affectedCells[i];
			if( !this.gameBoard[cell] && !this.solveBoard[cell] ) {
				this.possBoard[cell] = this.check(cell);
			}
		}
	}else{
		var cell;
		for(cell=0; cell<81; cell++){
			if( !this.gameBoard[cell] && !this.solveBoard[cell] ) {
				this.possBoard[cell] = this.check(cell);
			}
		}
	}
};

Sudoku.prototype.getPossibleCells = function ( value, type){

	//Go through ALL the cells, and return an array of which I can use.
	var cell;
	var boolArr = [];
	for(cell=0;cell<81;cell++){

		if( !this.gameBoard[cell] && !this.solveBoard[cell] ){
			// Value is able to be placed here
			boolArr[cell] = this.check(cell, value);
		}else{
			boolArr[cell] = false;
		}
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
	this.moves += 1;
	
	// Gamebord - Can't Edit.
	if(this.gameBoard[cell]){
		return null;
	}
	
	// Grab possible values for current cell
	possVals = this.getPossibles(cell, "val");
	
	// No Possibles OR we've tried all possibles
	if( possVals.length < 1 || (this.solveBoard[cell] >= possVals[(possVals.length-1)]) ){
		this.solveBoard[cell] = '';
		return false;
	}

	// There is a No Possibles somewhere else on the board
	if( this.addOn_deadCells && !this.checkDeadCells() && !this.solveBoard[cell]){
		return false;
	}

	// Last Move Twins on Board - Mistake made by cell behind most likely
	if( this.addOn_lastMoveTwins  && !this.checkLastMoveTwins() && !this.solveBoard[cell]){
		//console.log('-Backpedal - twins');
		return this.groundZeroAlgo(cell, -1);
	}

	// Possibles moves - lets try lowest value one
	for (i = 0; i < possVals.length; i += 1 ){
		if (possVals[i] > this.solveBoard[cell] || !this.solveBoard[cell]) {
			this.solveBoard[cell] = possVals[i];
			this.pencils += 1;	
			return true;
		}
	}

};

/**
 * -------------------------------------------
 * sudoku.solver( )
 * -------------------------------------------
 * Summary: 
 * 
 * 
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
	if(this.currentCell === null){
		this.currentCell = 0;
		this.startStopwatch();
	}
	cell = this.currentCell;
	this.refreshDisplay();
	
	if(cell > 80 || cell < 0){
		this.stopTimer();
		this.stopStopwatch();
		this.refreshMovesStatus();
		return false;
	}
	else{
		if( this.direction === 1){
			this.highlightCell(cell);	
		}else{
			this.lowlightCell(cell);
		}
		x = this.solveCell(cell);
		this.calcPossibles(cell);
		
		// GameBoard - Cant play this cell
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
	this.refreshMovesStatus();
};

// --- 

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
 * groundZeroAlgo
 * @param  {int} cell      
 * @param  {str} direction [description]
 * @param  {int} wall 
 * @param  {int} bwall     
 */
Sudoku.prototype.groundZeroAlgo = function(cell, direction) {

	// Increment moves and refresh statuses
	this.moves += 1;
	this.refreshMovesStatus();
	
	// First Algo call - Set default values and start timer.
	if(!cell && cell !== 0 && cell !== -1){
		cell = -1;
		direction = 1;
		this.startStopwatch();
	}

	// Increment the cell by the direction (-1 or +1) we're going in 
	cell += direction;

	// Break Recursion - When solver goes "out-of-bounds"
	if (cell < 0 || cell > (this.size - 1)) {
		this.refreshDisplay();
		return true;
	}

	// Dead Cells on Board - Mistake made by cell behind most likely
	if( this.addOn_deadCells && !this.checkDeadCells() && !this.solveBoard[cell]){
		return this.groundZeroAlgo(cell, -1);
	}

	// Last Move Twins on Board - Mistake made by cell behind most likely
	if( this.addOn_lastMoveTwins  && !this.checkLastMoveTwins() && !this.solveBoard[cell]){
		//console.log('-Backpedal - twins');
		return this.groundZeroAlgo(cell, -1);
	}
	
	// "Ground Zero" Algo - Increments through cells numerically
	var possVals, i;
	
	// Current cell not part of gameBoard - Editing allowed
	if (!this.gameBoard[cell]) {
		
		// Get numerical array of possible values for this current cell
		possVals = this.getPossibles(cell, "val");

		for (i = 0; i < possVals.length; i += 1){
			
			// Only try a value if it's larger than the current "solved" value.
			if (possVals[i] > this.solveBoard[cell] || !this.solveBoard[cell]){
			
				this.solveBoard[cell] = possVals[i];
				this.pencils += 1;	
				return this.groundZeroAlgo( cell, 1);
			}
		}

		// Failed to place a new value in cell
		this.solveBoard[cell] = ''; // Clear cell as we backpedal
		return this.groundZeroAlgo(cell, -1);

	}
	//GameBoard Cell - Can't edit. Skip it. ( This is why we need to know the direction we're going in. )
	else{
		return this.groundZeroAlgo( cell, direction );
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

Sudoku.prototype.getBoxCells = function (cell){
	var start = this.getBoxStart(cell);
	var end = start + 9;
	var arr = [];
	var i;
	for(i=start; i < end; i += 1){
		arr.push(i);
	}
	return arr;
}


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
		var oldTime = document.getElementById('txt-timer').value;
		this.startTime = ( new Date().getTime() - oldTime );
	}
	
};

Sudoku.prototype.toggleGenerator = function (){
	
	// Timer is active - deactivate it
	if( this.timer ){
		this.timer = window.clearInterval(this.timer);
		var now = new Date().getTime();
		document.getElementById('txt-timer').value = (now-this.startTime)/1000;

	}else{
		// Start the interval
		this.timer = self.setInterval(this.genStr, this.interval);
		// Grab time from the 
		var oldTime = document.getElementById('txt-timer').value;
		this.startTime = ( new Date().getTime() - oldTime );
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


Sudoku.prototype.startStopwatch = function () {
	this.startTime = new Date().getTime();
};

Sudoku.prototype.stopStopwatch = function () {
	var now = new Date().getTime();
	var diff = now-this.startTime;
	diff = Math.floor((diff/100))/10;
	diff = diff/1000;
	document.getElementById('txt-timer').value = diff;
};

Sudoku.prototype.refreshStopwatch = function () {
	var now = new Date().getTime();
	var diff = now-this.startTime;
	//diff = Math.floor((diff/100))/10;
	diff = diff/1000;
	document.getElementById('txt-timer').value = diff;
}

/**
 * stopTimer()
 * Summary: Clears the interval and pops up an alert to shop the timer has stopped.
 * @return 	void
 **/
Sudoku.prototype.stopTimer = function () {
	this.timer = window.clearInterval(this.timer);
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
 * lowlightCell()
 * Summary:
 **/
Sudoku.prototype.lowlightCell = function (cell) {
	
	var last = this.currentCell + ( this.direction * -1);
	if(last >= 0 && last < 81){
		this.unHighlightCell(last);
	}
	
	var cellStr = "small-"+cell;	
	document.getElementById(cellStr).className += " lowlight";
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
	document.getElementById(cellStr).className = document.getElementById(cellStr).className.replace(/\blowlight\b/,'');
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
Sudoku.prototype.unhighlightCells = function(){
	var i;
	for(i=0;i<81;i+=1){
		this.unHighlightCell(i);
	}
};


Sudoku.prototype.refreshMovesStatus = function(){
	// Increment 'move counter'
	document.getElementById('numofmoves').value = this.moves;
	document.getElementById('numofpencils').value = this.pencils;
	this.refreshStopwatch();
};



Sudoku.prototype.toggleDeadCells = function(){
	this.groundZero_checkDeadCells = !this.groundZero_checkDeadCells;
};



Sudoku.prototype.randomizeArray = function( array ) {

    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;

};