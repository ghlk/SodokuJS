/**
 * SudokuJS Library ( Consider rename: SudokuSandboxJS or SudokuJSSandbox )
 * Version: 0.1
 * Requirements: None (Maybe a version of ECMAScript? or uncooperative browsers?)
 * 
 * This library is a stand-alone JS Sudoku "sandbox".
 * Solving puzzles will have different algorithm options and "add-ons" that will expedite the solving.
 * This library also includes complete event delegation and user interaction.
 * Allowing user-inputted solutions and puzzles, as well as a "step-by-step" solver.
 * Which shows each move the algorithm attempts at a speed the user can follow (and alter).
 *
 * NOTES:
 * Brute force algo vs EvilBoard = 112144 moves. 1move/1sec = 31hours
 * 
 **/
(function (window, undefined) {

	'use strict';
	/** Private Variables **/
	var gameBoard = [],
		possBoard = [],
		solveBoard = [],
		emptyBoard = [],
		randomBoard = [],

		// Dynamic Values
		boardContainer = '',
		boardSizeSmall = 3,
		boardSizeBig = 9,
		boardSize = 81,

		// Solving / Generation Vals
		direction = 1,
		currentCell = null,
		addOn_deadCells = true,
		addOn_lastMoveTwins = true,

		// UI Vals
		timer = null,
		interval = 1,
		moves = 0,
		pencils = 0,
		step = 1,
		startTime = 0,

		// Premade puzzles
		premadeStrings = [
			'4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......',
			'52...6.........7.13...........4..8..6......5...........418.........3..2...87.....',
			'6.....8.3.4.7.................5.4.7.3..2.....1.6.......2.....5.....8.6......1....',
			'48.3............71.2.......7.5....6....2..8.............1.76...3.....4......5....',
			'....14....3....2...7..........9...3.6.1.............8.2.....1.4....5.6.....7.8...',
			'......52..8.4......3...9...5.1...6..2..7........3.....6...1..........7.4.......3.',
			'6.2.5.........3.4..........43...8....1....2........7..5..27...........81...6.....',
			'.524.........7.1..............8.2...3.....6...9.5.....1.6.3...........897........',
			'6.2.5.........4.3..........43...8....1....2........7..5..27...........81...6.....',
			'.923.........8.1...........1.7.4...........658.........6.5.2...4.....7.....9.....',
			'6..3.2....5.....1..........7.26............543.........8.15........4.2........7..',
			'.6.5.1.9.1...9..539....7....4.8...7.......5.8.817.5.3.....5.2............76..8...'
		],
		easyBoard = ['', 9, 2, '', '', 1, '', 8, '', '', '', '', '', '', '', 1, 7, '', '', '', 7, '', 3, '', 4, 6, 2, '', '', '', 3, '', '', 9, 1, '', '', 9, 6, 5, '', 1, 7, 4, '', '', 4, 1, '', '', 9, '', '', '', 1, 3, 6, '', 4, '', 7, '', '', '', 5, 2, '', '', '', '', '', '', '', 8, '', 2, '', '', 6, 9, ''],
		evilBoard = [5, '', 9, '', '', 6, '', 7, 8, 4, '', '', 2, '', '', '', '', 9, 7, '', '', '', '', '', '', '', 1, '', 6, '', '', '', 4, '', '', '', 9, '', '', '', '', '', '', '', 4, '', '', '', 9, '', '', '', 6, '', 1, '', '', '', '', '', '', '', 5, 6, '', '', '', '', 1, '', '', 8, 2, 5, '', 3, '', '', 1, '', 9]
	;

	// Bring document to local scope
	var document = window.document;



	// * -------------------------------------------
	// * Class and Initialization
	// * -------------------------------------------

	/**
	 * Class Sudoku
	 */
	function Sudoku() {
		//Moved variables to init()
	}

	/**
	 * Remaining default values and brings Sudoku to global scope.
	 */
	var init = function () {

		// Initialize the boards
		emptyBoard = new Array(boardSize);
		var mySudoku = window.mySudoku = new Sudoku();
	};



	// * -------------------------------------------
	// * Reset All the Things
	// * -------------------------------------------
	
	/**
	 * emptyAllBoards
	 * @return void
	 */
	var emptyAllBoards = function () {
		gameBoard = emptyBoard.slice(0);
		possBoard = emptyBoard.slice(0);
		solveBoard = emptyBoard.slice(0);
		randomBoard = emptyBoard.slice(0);
	};

	/**
	 * 
	 * @return {[type]} [description]
	 */
	var resetAllValues = function () {

		this.solveBookmark = 0;
		moves = 0;
		pencils = 0;
		direction = 1;
		this.solvePlace = 0;
		currentCell = null;
	};

	/**
	 * empty()
	 * Summary: Empties the board and refreshes the display.
	 *
	 **/
	var empty = function () {
		gameBoard = emptyBoard.slice(0);
		solveBoard = emptyBoard.slice(0);
		refreshDisplay();
	};

	/**
	 * clearSolveBoard()
	 * Summary: Empties the board and refreshes the display.
	 *
	 **/
	var clear = function () {
		solveBoard = emptyBoard.slice(0);
		refreshDisplay();
	};

	// * -------------------------------------------
	// * Puzzle Creation
	// * -------------------------------------------

	/**
	 * Sets the selected test puzzle.
	 **/
	Sudoku.prototype.premadePuzzle = function (num) {

		emptyAllBoards();
		num = num || 1;
		pencils = 0;
		moves = 0;

		// Set the game board
		gameBoard = puzzleStringToArray(premadeStrings[num]);

		document.getElementById('current-puzzle').innerHTML = 'Puzzle #'+num;
		refreshDisplay();
	};

	Sudoku.prototype.recurseGenerate = function (currentNumber, direction, moves, flag) {

		if (!currentNumber) { this.empty(); }

		// Set defaults
		currentNumber = currentNumber || 1;
		direction = direction || 1;
		moves = moves || [];
		flag = flag || 1;
		var count = 0, x, possibleMoves, cell;


		// Break Recursion - Puzzle done.
		if (currentNumber > 2 || flag > 10) {
			console.log(' --- END --- ' );
			refreshDisplay();
			return true;
		}


		// Check for Dead cells - Will trigger backpedaling
		if (!checkDeadCells()) {
			return 
		}


		// Get array of possible cell moves.
		var possibleMoves = this.getPossibleCells(currentNumber, 'val');


		// Count how many of this value is in the puzzle
		for (x = 0; x < 81; x += 1) {
			if (gameBoard[x] === currentNumber) { count += 1; }
		}

		// Completed currentNumber - increment value
		if (count === 9) {
			console.log(possibleMoves.length);
			console.log( ' Current Number Completed ' );
			return this.recurseGenerate(currentNumber + 1, 1, moves, flag+1);
		}

		// do{
		// 	// Select a possible move by random
		// 	randMove = Math.floor (Math.random () * possibleMoves.length - 1); // 0-length

		// 	// Place our current number into that random available cell.
		// 	gameBoard[possibleMoves[randMove]] = currentNumber;
			
		// 	// This move just created some dead-cells, so let's remove this cell-option and lets try another.
		// 	if( !checkDeadCells() ){
		// 		// Remove that cell from our possible list
		// 		possibleMoves[randMove].splice(randMove,1);
		// 	}

		// }while( !checkDeadCells() && possiblesMoves.length > 0 );

		


		// We're backpedaling 
		if( direction === -1 ){
			console.log('backpedaling');
			//- we need to choose the last value placed and remove it
			var lastmove = moves[moves.length-1];
			gameBoard[lastmove] = '';

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
			gameBoard[cell] = currentNumber;
			moves.push(cell);
			return this.recurseGenerate( currentNumber, 1, moves, flag+1 );
		
		}else{
			// No moves left - Clear cell
			gameBoard[cell] = '';
			moves.pop();
			return this.recurseGenerate( currentNumber, -1, moves, flag+1 )
		}
	};

	Sudoku.prototype.generateCell = function (cell) {

		var possVals, i;
		moves += 1;
		
		// Grab possible values for current cell
		possVals = this.getPossibles(cell, "val");
		
		// No Possibles OR we've tried all possibles
		if( possVals.length < 1 ){
			//gameBoard[cell] = '';
			return false; // Backpedal
		}

		if( gameBoard[cell] >= possVals[possVals.length-1]){
			//gameBoard[cell] = '';
			return false; // Backpedal
		}

		// There is a No Possibles somewhere else on the board
		if( this.addOn_deadCells && !checkDeadCells() && !gameBoard[cell]){
			return false; // Backpedal
		}

		// Last Move Twins on Board - Mistake made by cell behind most likely
		if( this.addOn_lastMoveTwins  && !checkLastMoveTwins() && !gameBoard[cell]){
			return false; // Backpedal
		}
		
		// Possibles moves - lets try lowest value one
		for (i = 0; i < possVals.length; i += 1 ){
			if (possVals[i] > gameBoard[cell] || !gameBoard[cell]) {
				gameBoard[cell] = possVals[i];
				pencils += 1;	
				return true;
			}
		}


		// rand = Math.floor( Math.random() * possVals.length );
		// if (possVals[rand] > gameBoard[cell] || !gameBoard[cell]) {
		// 	gameBoard[cell] = possVals[rand];
		// 	pencils += 1;	
		// 	return true;
		// }else{
		// 	gameBoard[cell] = '';
		// 	return false;

		// }
	};

	Sudoku.prototype.generateController = function (){

		var cell, result;
		var tempArr = [];
		var i;
		
		// Make a randomized board we use as a guide and solve puzzle that way.
		if( !randomBoard ){
			for(i=0;i<81;i+=1){
				tempArr.push(i);
			}
			randomBoard = randomizeArray(tempArr);
			direction = 1;
			startStopwatch();
			cellCounter = 0;
		}

		currentCell = randomBoard[cellCounter];
		cell = currentCell;
		
		// Null means we have no more empty cells to play with.
		if( cell === null ){
			this.stopTimer();
			refreshMovesStatus();
			currentCell = null;
			cellCounter = null;
			return false;
		
		}else{
			
			// Solve the cell
			result = this.generateCell(cell);
			
			refreshDisplay(cell);
			
			unHighlightCells();
			
			if( direction === -1 ){
				lowlightCell(cell);	
			}else{
				highlightCell(cell);	
			}
			
				
			
			// We placed a value in a cell - we can continue on.
			if(result === true){
				// We placed a new cell.
				direction = 1;
				cellCounter += direction;
			}
			else if(result === false){
				// We need to backpedal - clear the current cell.
				gameBoard[cell] = '';
				direction = -1;
				cellCounter += direction;			
			}
			document.getElementById('cell-counter').value = cellCounter;
		}
		refreshMovesStatus();
	};

	var puzzleStringToArray = function (puzzleString) {

		//var puzzleString = premadeStrings[num];
		var tempArr = puzzleString.split('');
		var i;
		for(i=0;i<tempArr.length;i++){
			if( tempArr[i] === '.' ){
				tempArr[i]='';
			}
		}
		return tempArr;
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
	var check = function (cell, val) {
		
		/** BOX CHECK **/
		var box = checkBox(cell, val);
		
		/** ROW CHECK **/
		var row = checkRow(cell, val);
		
		/** COLUMN CHECK **/
		var column = checkColumn(cell, val);
		
		/** EMPTY CHECK **/
		var empty = true;
		
		/** If NO value passed, return array-of-booleans value-1 is placed in arr[0] **/
		if(!val){
			var arr = [ ];
			for(var i=0; i<9; i++){

				//arr[i] = !( !box[i] || !row[i] || !column[i] );
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
	var checkBox = function (cell, val){
		
		/* Represents moves 1-9*/
		var arr = [ true, true, true, true, true, true, true, true, true ];

		/* Iterate through the entire box, starting with it's starting square. */
		var start = getBoxStart(cell);
		
		//Create array of valid moves for this box
		for(var i = start; i < (start + 9); i += 1){
			
			// Look for cell with value
			if( gameBoard[i] ){
				// We've found a value, let's mark that value as not usable for the box.
				arr[ ( gameBoard[i]-1 ) ] = false;
			}else if( solveBoard[i]  ){
				arr[ ( solveBoard[i]-1) ] = false;
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
	var checkRow = function (cell, val){
		
		var i, x, boolArr, cells, arr;
		cells = getRowCells(cell);
		arr = [ true, true, true, true, true, true, true, true, true ]; 

		for(i=0; i<9; i++){
			x = cells[i];
			
			if( gameBoard[x] ){
				arr[ (gameBoard[x] - 1) ] = false;
			}else if( solveBoard[x]  ){
				arr[ (solveBoard[x] - 1) ] = false;
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
	var checkColumn = function (cell, val){
		
		var x, arr, cells;
		cells = getColumnCells(cell);
		arr = [ true, true, true, true, true, true, true, true, true ]; 

		for(var i=0; i<9; i++){
			x = cells[i];
			if( gameBoard[x] ){
				arr[ (gameBoard[x] - 1) ] = false;
			}else if( solveBoard[x]  ){
				arr[ (solveBoard[x] - 1) ] = false;
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
	var checkPuzzle = function(alertFlag){

		var x, y;
		for(x=0;x<81;x++){
			
			if(gameBoard[x]){
				//console.log('check cell:'+x+' value:'+gameBoard[x]);
				y = gameBoard[x];
				gameBoard[x] = '';
				if( !check(x, y) ){
					//console.log('THIS PUZZLE FAILED');
					gameBoard[x] = y;
					if(alertFlag===true){ alert('Puzzle FAILED'); }
					
					return false;
				}
				gameBoard[x] = y;
			}
		}
		if(alertFlag===true){alert('Puzzle SUCCESS');}
		return true;
	};

	/**
	 * [checkDeadCells description]
	 * @return {[type]} [description]
	 */
	var checkDeadCells = function () {
		var cell, possibles;
		for(cell=0; cell<81; cell++){

			if(!gameBoard[cell] && !solveBoard[cell]) {
				
				if( getPossibles(cell).length == 0 ){
					return false;
				}
			}
		}
		return true;
	};

	var checkLastMoveTwins = function () {
		
		// Check all these cells and we check all cells
		var specialCells = [0,28,56,12,40,68,24,52,80],
			affectedCells = [],
			tempArr = [],
			possibles = [],
			boxCells, rowCells, colCells;
		var affectedCell, i, j, val;

		for( i = 0; i < specialCells.length; i += 1){

			// Check the BOX, ROW, and COLUMN seperately
			boxCells = getBoxCells(specialCells[i]);
			rowCells = getRowCells(specialCells[i]);
			colCells = getColumnCells(specialCells[i]);

			if( !checkArrayForTwins( boxCells ) || !checkArrayForTwins(rowCells) || !checkArrayForTwins(colCells) ){
				// Last move twins found somewhere
				return false;
			}
		}
		return true;
	};

	var checkArrayForTwins = function (arrayCells){

		var i, tempArr = [], cell, possibles = [], val;
		for(i = 0; i < arrayCells.length; i += 1){
			cell = arrayCells[i];

			if (!gameBoard[cell] && !solveBoard[cell]){

				possibles = getPossibles(cell);

				if( possibles.length === 1 ){
					val = possibles[0];
					if( tempArr[val] === true ){
						return false;
					}else{
						tempArr[val] = true;
					}
				}
			}
		}
		return true;
	};


	// * -------------------------------------------
	// * Possible Moves
	// * -------------------------------------------

	/**
	 * getPossibles()
	 * @param 	int 	cell 	The cell we are checking possibiles for.
	 * @param 	str 	type 	Type of array we want back. Boolean of values.
	 * @return 	arr 	boolArr Array of boolean values to represent possible values for cell.
	 * @return 	arr 	valArr 	Array of values that are possible values for cell.
	 */
	var getPossibles = function (cell, type) {
		
		// Possibles arr (boolean)
		var boolArr = check(cell),
			valArr = [ ],
			i;
		for(i = 0; i < 9; i += 1){
			if (boolArr[i]) {
				valArr.push(i + 1);
			}
		}
		if(type === "bool"){
			return boolArr;
		}else{
			return valArr;
		}
	};

	/**
	 * calcPossibles
	 * Summary: 
	 **/
	var calcPossibles = function (changedCell) {
		
		// If given a cell that has changed, we know what possibles could have changed.
		// It's box, it's row, and it's column.
		if( changedCell >= 0 && changedCell < 81 ){
			var affectedCells = [];
			affectedCells = getBoxCells(changedCell).concat( getColumnCells(changedCell), getRowCells(changedCell)  );
			
			var cell;
			for(i=0; i<affectedCells.length-1; i+=1 ){
				cell = affectedCells[i];
				if( !gameBoard[cell] && !solveBoard[cell] ) {
					possBoard[cell] = check(cell);
				}
			}
		}else{
			var cell;
			for(cell=0; cell<81; cell++){
				if( !gameBoard[cell] && !solveBoard[cell] ) {
					possBoard[cell] = check(cell);
				}
			}
		}
	};

	var getPossibleCells = function ( value, type){

		//Go through ALL the cells, and return an array of which I can use.
		var cell;
		var boolArr = [];
		for(cell=0;cell<81;cell++){

			if( !gameBoard[cell] && !solveBoard[cell] ){
				// Value is able to be placed here
				boolArr[cell] = check(cell, value);
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

	// * -------------------------------------------
	// * Ground Zero Algorithm
	// * 	Numerical Cell Order
	// * 	Always tries lowest possible value for cell
	// * -------------------------------------------

	/**
	 * sudoku.solveCell(cell)
	 * Summary: To solve a single cell only. 
	 *
	 * @param 	int 	cell
	 * @return 	boll 	true 	Increment solver.
	 * @return 	bool 	false 	Decrement solver.
	 * @return 	bool 	null 	Continue solver. (in current direction)
	 *
	 * Parents: 
	 *	solver();
	 *
	 **/
	Sudoku.prototype.gzSolveCell = function(cell){
		
		var possVals, i;
		moves += 1;
		
		// Gamebord - Can't Edit.
		if(gameBoard[cell]){
			return null;
		}
		
		// Grab possible values for current cell
		possVals = getPossibles(cell, "val");
		
		// No Possibles OR we've tried all possibles
		if( possVals.length < 1 || (solveBoard[cell] >= possVals[(possVals.length-1)]) ){
			return false;
		}

		// There is a No Possibles somewhere else on the board
		if( addOn_deadCells && !checkDeadCells() && !solveBoard[cell]){
			return false;
		}

		// Last Move Twins on Board - Mistake made by cell behind most likely
		if( addOn_lastMoveTwins && !checkLastMoveTwins() && !solveBoard[cell]){
			return false;
		}

		// Possibles moves - lets try lowest value one
		for (i = 0; i < possVals.length; i += 1 ){
			if (possVals[i] > solveBoard[cell] || !solveBoard[cell]) {
				solveBoard[cell] = possVals[i];
				pencils += 1;	
				return true;
			}
		}
	};

	/**
	 * -------------------------------------------
	 * sudoku.solveCellController( )
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
	Sudoku.prototype.gzStepper = function(){

		var result, tempCell;

		// Called for the first time
		if (currentCell === null) {
			currentCell = 0;
			direction = 1;
			startStopwatch();
		}
		
		// Solved puzzle or out-of-bounds
		if(currentCell > 80 || currentCell < 0){
			stopTimer();
			refreshStopwatch();
			refreshMovesStatus();
			return false;
		}
		else{

			// Unhighlight the cell you just came from
			if( currentCell > 0 && currentCell < 81 ){
				unHighlightCell(currentCell + ((-1) * direction));	
			}

			// Can't edit gameBoard pieces, so continue on until we dont have one
			if (gameBoard[currentCell]) {
				while (gameBoard[currentCell]) {
					currentCell += direction;
				}
			}
			
			// Attempt to solve this cell - null=gameCell - true=solved - false=cant solve
			result = this.gzSolveCell(currentCell);
			
			// Refresh display for the user - (must be done before highlighting)
			refreshDisplay(currentCell);
			refreshMovesStatus();

			if (direction) {
				highlightCell(currentCell);
			} else {
				lowlightCell(currentCell);
			}

			//Placed value - Let's go forward
			if(result === true){
				direction = 1;
			}
			//Problem - Clear the current cell and backpedal
			else if(result === false){
				solveBoard[currentCell] = '';
				direction = (-1);
			}
			
			// Increment or decrement depending on direction
			currentCell += direction;
		}
	};

	/**
	 * groundZeroAlgo
	 * @param  {int} cell      
	 * @param  {str} direction [description]
	 * @param  {int} wall 
	 * @param  {int} bwall     
	 */
	Sudoku.prototype.gzSolver = function(cell, direction) {

		// Increment moves and refresh statuses
		moves += 1;
		refreshMovesStatus();
		
		// First Algo call - Set default values and start timer.
		if(!cell && cell !== 0 && cell !== -1){
			cell = -1;
			direction = 1;
			startStopwatch();
			moves = 0;
			pencils = 0;
			solveBoard = emptyBoard.slice(0);
		}

		// Increment the cell by the direction (-1 or +1) we're going in 
		cell += direction;

		// Break Recursion - When solver goes "out-of-bounds"
		if (cell < 0 || cell > (boardSize - 1)) {
			refreshDisplay();
			return true;
		}

		// Dead Cells on Board - Mistake made by cell behind most likely
		if( addOn_deadCells && !checkDeadCells() && !solveBoard[cell]){
			return this.gzSolver(cell, -1);
		}

		// Last Move Twins on Board - Mistake made by cell behind most likely
		if( addOn_lastMoveTwins && !checkLastMoveTwins() && !solveBoard[cell]){
			return this.gzSolver(cell, -1);
		}
		
		// "Ground Zero" Algo - Increments through cells numerically
		var possVals, i;
		
		// Current cell not part of gameBoard - Editing allowed
		if (!gameBoard[cell]) {
			
			// Get numerical array of possible values for this current cell
			possVals = getPossibles(cell, "val");

			for (i = 0; i < possVals.length; i += 1){
				
				// Only try a value if it's larger than the current "solved" value.
				if (possVals[i] > solveBoard[cell] || !solveBoard[cell]){
				
					solveBoard[cell] = possVals[i];
					pencils += 1;	
					return this.gzSolver( cell, 1);
				}
			}

			// Failed to place a new value in cell
			solveBoard[cell] = ''; // Clear cell as we backpedal
			return this.gzSolver(cell, -1);

		}
		//GameBoard Cell - Can't edit. Skip it. ( This is why we need to know the direction we're going in. )
		else{
			return this.gzSolver( cell, direction );
		}
	};


	// * -------------------------------------------
	// * Only Option Algorithm - (Fills cells with only 1 option left)
	// * -------------------------------------------

	/**
	 * filleSinglePossibles()
	 * Summary:
	 * 
	 **/
	Sudoku.prototype.fillSinglePossibles = function() {

		var i, finished = true;
		var x = 0;
		
		//Step through possibles
		for(i=0; i<81; i++){
			
			//If not game-pice----
			if(!gameBoard[i]){
				
				possVals = getPossibles(i, "val");
				
				if( possVals.length === 1 ){
					solveBoard[i] = possVals[0];
					x++;
				}
				else if( possVals.length > 1){
					finished = false;
				}
			}
		}
		moves += x;
		document.getElementById('numofmoves').value = moves;
		refreshDisplay();
		return true;
	};



	// * -------------------------------------------
	// * Get Position Methods
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
	var getBig = function (cell){
		return Math.floor(cell/9);
	};

	/**
	 * getBigRow()
	 * @param 	int 	cell 	Numeric position of cell.
	 **/
	var getBigRow = function (cell){
		return Math.floor( Math.floor(cell/9) / 3);
	};

	/**
	 * getBigColumn()
	 * @param 	int 	cell 	Numeric position of cell.
	 * @return 	int 	Big Column that the cell belongs to.
	 **/
	var getBigColumn = function (cell){
		return ( Math.floor(cell/9) % 3 );
	};

	/**
	 * getSmall()
	 * @param 	int 	cell 	Numeric position of cell
	 * @return 	int 	Numeric position of the cell's small 
	 */
	var getSmall = function (cell){
		return cell % 9;
	};

	/**
	 * getSmallRow()
	 * Summary: What row the cell accompanies in the 'big' box.
	 * @param 	int 	cell 	Numerical position of the cell in question
	 * @return 	int 	pos 	
	 **/
	var getSmallRow = function (cell){
		return Math.floor( ( cell % 9 ) / 3);
	};

	/**
	 * getSmallColumn()
	 * Summary:
	 * @param 	int 	cell
	 **/
	var getSmallColumn = function (cell) {
		return ( cell % 9 ) % 3;
	};

	/**
	 * getBoxStart()
	 * Summary: Returns the cell number of the beginning of the box that the cell lives.
	 * @param 	int 	cell 	Numerical value of the cell in question.
	 **/
	var getBoxStart = function (cell) {
		return getBig(cell) * 9;
	};

	/**
	 * getRowStart()
	 * Summary: Returns the position of the cell that is at the beginning of the row cell param is in.
	 * @param 	int 	cell
	 * @return 	int 	start 	Numerical value of cell at beginning of row.
	 **/
	var getRowStart = function (cell) {
		return (( Math.floor(getBig(cell) / 3) * 3) * 9) + ( getSmallRow(cell) * 3 );
	};

	/**
	 * getColumnStart()
	 * Summary: Returns the position of the beginning cell of the column the cell 
	 * @param 	int 	cell
	 * @return 	int 	cell 	The numerical value of the cell that is at the beginning of the column that the cell param belongs to.
	 **/
	var getColumnStart = function (cell) {
		return ( getBig(cell) % 3) * 9 + ( getSmallColumn(cell) );
	};

	/**
	 * getRowCells()
	 * Summary: 
	 * @param 	int 	cell
	 * @return 	int 	cell 
	 **/
	var getRowCells = function (cell) {
		var start = getRowStart(cell);
		var arr = [ ];
		var end = start + 20 + 1;
		var step = 1;
		var i;
		for(i=start; i<end; i+=step){
			arr.push(i);
			if( getSmallColumn(i) === 2 ){
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
	var getColumnCells = function (cell) {
		var start = getColumnStart(cell);
		var arr = [ ];
		var end = start + 61;
		var step = 1;
		var i;
		for(i=start; i<end; i+=step){
			arr.push(i);
			if( getSmallRow(i) === 2 ){
				step = 21;
			}
			else{
				step = 3;
			}
		}
		return arr;
	};

	/**
	 * [getBoxCells description]
	 * @param  {[type]} cell [description]
	 * @return {[type]}      [description]
	 */
	var getBoxCells = function (cell) {
		var start = getBoxStart(cell);
		var end = start + 9;
		var arr = [];
		var i;
		for(i=start; i < end; i += 1){
			arr.push(i);
		}
		return arr;
	}

	/**
	 * [getAffectedCells description]
	 * @param  {[type]} cell [description]
	 * @return {[type]}      [description]
	 */
	var getAffectedCells = function (cell) {
		return getBoxCells(cell).concat(getColumnCells(cell), getRowCells(cell));
	}

	// * -------------------------------------------
	// * User Interface 
	// * -------------------------------------------

	/**
	 * startSolver()
	 * Summary:
	 **/
	Sudoku.prototype.toggleGzStepper = function () {
		
		// Timer is already active - Toggle off
		if( timer ){
			
			stopTimer();
			refreshStopwatch();
			document.getElementById('gz-status').className = 'inactive';
		
		}else{

			timer = true;

			// Recursive async timer 
			(function recursiveAsync(){

				// Call our solver method ( shows progress of algorithms )
				mySudoku.gzStepper();
				if( timer === true ){
					
					//Update the interval value
					interval = document.getElementById('interval').value || interval ;
					
					// Recursive call
					setTimeout(recursiveAsync, interval);
				}
				
			})();

			// This allows us to pause and continue the solver and have a continuous stopwatch
			var oldTime = document.getElementById('txt-timer').value;
			startTime = ( new Date().getTime() - oldTime );
			document.getElementById('gz-status').className = 'active';
		}
	};

	
	Sudoku.prototype.toggleCreateStepper = function () {

	};



	var startStopwatch = function () {
		startTime = new Date().getTime();
	};

	var refreshStopwatch = function () {
		var now = new Date().getTime();
		var diff = now - startTime;
		//diff = Math.floor((diff/100))/10;
		diff = diff/1000;
		document.getElementById('txt-timer').value = diff;
	}

	/**
	 * stopTimer()
	 * Summary: Clears the interval and pops up an alert to shop the timer has stopped.
	 * @return 	void
	 **/
	var stopTimer = function () {
		timer = false;
		document.getElementById('gz-status').className = 'inactive';
	};


	Sudoku.prototype.toggleDeadCellsAddOn = function (checkboxVal) {
		//addOn_deadCells = checkboxVal;
		addOn_deadCells = !addOn_deadCells;
	};

	Sudoku.prototype.toggleTwinsAddOn = function (checkboxVal) {
		addOn_lastMoveTwins = !addOn_lastMoveTwins;
		//addOn_lastMoveTwins = checkboxVal;
	};

	// * -------------------------------------------
	// * DOM Manipulation
	// * -------------------------------------------

	/**
	 * refreshDisplay()
	 * Summary: DOM walking refresh method. This replaced html string creation.
	 * 
	 * @param 	str 	divID 	Id of the div
	 * @return 	void
	 *
	 **/
	var refreshDisplay = function(cellID) {
		var i, cellID, temp, small, arr, j, tiny, tinyObj;

		for (i = 0; i < 81; i += 1) {

			cellID = 'small-'+i;
			small = document.getElementById(cellID);

			// Game_Board piece found --- Place value and class
			if( gameBoard[i] ){
				temp = small.getElementsByClassName("value")[0];
				temp.innerHTML = gameBoard[i];
				small.className = small.className.replace(/\bentered-value\b/,'');
				small.className = "small game-value";

			// Solved/entered value found --- Place value and class
			}else if( solveBoard[i] ){
				temp = small.getElementsByClassName("value")[0];
				temp.innerHTML = solveBoard[i];
				small.className = small.className.replace(/\game-value\b/,'');
				small.className = "small entered-value";	
			
			// No value found - it's empty	
			}else{
				
				// Remove the "entered-value" class
				//small.className = small.className.replace(/\bentered-value\b/,'');
				small.className = small.className.replace( /(?:^|\s)entered-value(?!\S)/g , '' );
				small.className = small.className.replace( /(?:^|\s)game-value(?!\S)/g , '' );

				// Get list of possible moves for cell
				arr = getPossibles(i, 'bool');
				
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

	/**
	 * [refreshControls description]
	 * @return {[type]} [description]
	 */
	var refreshControls = function() {

		document.getElementById('dead-cells-chkbox').checked = addOn_deadCells;
		document.getElementById('last-move-twins-chkbox').checked = addOn_lastMoveTwins;
		document.getElementById('numofmoves').value = 0;
		document.getElementById('numofpencils').value = 0;
		document.getElementById('txt-timer').value = 0;
	};


	/**
	 * highlightCell()
	 * Summary:
	 **/
	var highlightCell = function (cell) {
		var cellStr = "small-"+cell;	
		document.getElementById(cellStr).className += " highlight";
	};

	/**
	 * lowlightCell()
	 * Summary:
	 **/
	var lowlightCell = function (cell) {
		var cellStr = "small-"+cell;	
		document.getElementById(cellStr).className += " lowlight";
	};

	/**
	 * unHighlightCell()
	 * Summary:
	 * @param 	int 	cell 	Numerical position of the cell to highlight.
	 *
	 **/
	var unHighlightCell = function (cell) {
		var cellStr = "small-"+cell;
		document.getElementById(cellStr).className = document.getElementById(cellStr).className.replace(/\bhighlight\b/,'');
		document.getElementById(cellStr).className = document.getElementById(cellStr).className.replace(/\blowlight\b/,'');
	};

	/**
	 * unhighlightCells() NOT USED
	 **/
	var unhighlightCells = function() {
		var i;
		for(i=0;i<81;i+=1){
			unHighlightCell(i);
		}
	};

	var refreshMovesStatus = function() {
		// Increment 'move counter'
		document.getElementById('numofmoves').value = moves;
		document.getElementById('numofpencils').value = pencils;
		refreshStopwatch();
	};




	// * -------------------------------------------
	// * Helpers
	// * -------------------------------------------

	var randomizeArray = function( array ) {

	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;

	};

	// * -------------------------------------------
	// * Displaying & HTML/DOM
	// * -------------------------------------------

	/**
	 * [displaySkelaton description]
	 * @param  {[type]} divID [description]
	 * @return {[type]}       [description]
	 */
	Sudoku.prototype.displaySkelaton = function (divID) {
		boardContainer = divID;
		var elem = document.getElementById(divID);
		elem.innerHTML = getHTMLSkelaton();
		// Call for DOM elements on this div
		domEvents(divID);
	};

	/**
	 * [displayControls description]
	 * @param  {[type]} divID [description]
	 * @return {[type]}       [description]
	 */
	Sudoku.prototype.displayControls = function (divID) {
		// Create strings of the many fieldsets we have
		// Place them in the divID provided
		var elem = document.getElementById(divID);
		elem.innerHTML = getControls();
		// Call required event delegation
		controlsDomEvents(divID);
	};

	/**
	 * getHTMLSkelaton()
	 * Summary: Returns the HTML skelaton for the sudoku game.
	 * @return 	str 	str 
	 **/
	var getHTMLSkelaton = function() {
		var str, i, j;

		// Sudoku container - Start
		str = '<div id="sudoku">';
		
		for (i = 0; i < boardSize; i += 1){
			
			// Big/Box - Start
			if (getSmall(i) === 0) { 
				str += '<div id="big-' + getBig(i) + '" class="big">';
			}
			
			// Small - Start
			str += '<div id="small-'+i+'" class="small">';//#small - start

			// Tiny - Entire matrix (Used to display possible moves)
			for (j = 1; j <= 9; j += 1) {
				str += '<div id="tiny-' + j + '" class="tiny">' + j + '</div>';	
			}
			
			// Value - Container for both game values and entered/solved values.
			str += '<div class="value"></div>';

			// Small - End
			str += '</div>';
			
			// Big/Box - End 
			if(getSmall(i) == 8){
				str += '</div>';
			}
		};

		// Sudoku container - End
		str += '</div>';

		return str;
	};

	/**
	 * [getControls description]
	 * @return {[type]} [description]
	 */
	var getControls = function() {

		var puzzle = '<fieldset id="puzzle-controls"> <legend>New Puzzle</legend>';
		puzzle += '<label>Premade:</label> <select id="premade-select"> ';
		puzzle += '<option value="0">0</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> </select>';
		puzzle += '<input type="button" id="premade-btn" value="Populate">';
		puzzle += '<hr>';
		puzzle += '<label>Generation: (not done)</label>';
		puzzle += '<input type="button" id="gen-recursive" Value="Recursive Generate">';
		puzzle += '<input type="button" id="gen-toggle" Value="Toggle Gen">';
		puzzle += '<input type="button" id="gen-step" Value="Step">';
		puzzle += '</fieldset>';

		var solving = '<fieldset id="solving-controls"> <legend>Editing</legend>';
		solving += '<input type="button" value="Clear Solved Cells" ><br>';
		solving += '<input type="button" value="Clear Board" >';
		solving += '<hr>';
		solving += '<select id="edit-mode"> <option value="solve" selected>solve mode</option> <option value="edit" >edit mode</option> </select>';
		solving += '</fieldset>';

		var groundzero =  '<fieldset> <legend>Ground Zero Algo</legend>';
		groundzero += '<span id="gz-status" class="status"> Algo <strong>not</strong> currently running... </span>';
		groundzero += '<label>Dead Cells:</label><input id="dead-cells-chkbox" type="checkbox" checked>';
		groundzero += '<label>Last Move Twins:</label><input id="last-move-twins-chkbox" type="checkbox" checked>';
		groundzero += '<hr>';
		groundzero += '<input id="gz-toggle" type="button" value="Start/Stop">';
		groundzero += '<select id="interval"> <option value="1">1ms</option> <option value="100">100</option><option value="200">200</option><option value="500">500</option><option value="1000">1000</option></select>';
		groundzero += '<input id="gz-step" type="button" value="Step">';
		groundzero += '<hr>';
		groundzero += '<input id="gz-solver" type="button" value="Solve Puzzle">';
		groundzero += '	</fieldset>';

		var lastmove_ctrls = 
		lastmove_ctrls += '<fieldset> <legend>Only Option Algo</legend>';
		lastmove_ctrls += '<input type="button" Value="Run">';
		lastmove_ctrls += '<br>Great when starting.';
		lastmove_ctrls += '</fieldset>';

		var debug_ctrls = '<fieldset id="debug"> <legend>Status</legend>';
		debug_ctrls += '<span id="current-puzzle" class="status"></span>';
		debug_ctrls += '<input type="text" id="numofmoves" disabled><label for="numofmoves" class="small-label">Moves:</label>';
		debug_ctrls += '<br>';
		debug_ctrls += '<input type="text" id="numofpencils" disabled><label for="numofpencils" class="small-label">Penciled:</label>';
		debug_ctrls += '<br>';
		debug_ctrls += '<input type="text" id="txt-timer" disabled>';
		debug_ctrls += '<label for="timer" class="small-label">Time (s):</label>';
		debug_ctrls += '<br>';
		debug_ctrls += '<input type="text" id="cell-counter" disabled>';
		debug_ctrls += '<label for="timer" class="small-label">Cell Cnt:</label>';
		debug_ctrls += '</fieldset>';

		return puzzle+solving+groundzero+debug_ctrls;
	};


	// * -------------------------------------------
	// * DOM Events & Delegation
	// * -------------------------------------------

	var controlsDomEvents = function (wrapperID) {
		
		var elem = document.getElementById(wrapperID);
		elem.onclick = function(e){
			var t = getTarget(e);
			var elemID = t.id;
			console.log(elemID);
			switch (elemID) {
				

				// Premade
				case "premade-btn":
					//Grab value from select
					var val = document.getElementById('premade-select').value;
					mySudoku.premadePuzzle(val);
					break;

				// Creation
				case "gen-step":
					break;
				case "gen-toggle":
					break;
				

				// Solving (gz = groundzero)
				case "gz-step":
					mySudoku.gzStepper();
					break;
				case "gz-toggle":
					mySudoku.toggleGzStepper();
					break;
				case "gz-solver":
					mySudoku.gzSolver();
	    			break;

	    		// Add-on Toggles
	    		case "dead-cells-chkbox":
	    			mySudoku.toggleDeadCellsAddOn();
	    			break;
	    		case "last-move-twins-chkbox":
	    			mySudoku.toggleTwinsAddOn();
	    			break;
	    	}
		};
	};

	var domEvents = function (wrapperID) {


		var elem = document.getElementById(wrapperID);
		elem.onclick = function(e) {

			var t = getTarget(e),
				small = null,
				wrapperClass = '';
				
			// Must be in the small if it's not a small
			if( t.className !== 'small' ){
				small = t.parentNode;
			}

			// Iterate down to our 'value' node
			if(t.className === 'tiny'){
				while (t.nextSibling) {
					t = t.nextSibling;
					if (t.nodeName === 'DIV' && t.className === 'value') {
						break;
					}
				}
			}
			if (t.className === 'value' ){

				var txt = '<input type="text" id="edit-txtbox" value="" class="edit-txt" > ';
				wrapperClass = document.getElementById(wrapperID).className;
				
				// Gameboard piece - Allow if it is in game-edit mode.
				if ( wrapperClass === 'game-edit' || (small.className !== 'small game-value' && wrapperClass !== 'game-edit')) {
					t.innerHTML = txt;
					document.getElementById('edit-txtbox').focus();
				}
			}
		};

		// Onblur Event Delegation - ( Needs attention to allow for IE support )
		elem.addEventListener('blur', commit, true);
	};

	/**
	 * commit()
	 * @return {[type]} [description]
	 */
	var commit = function() {
		
		// Grab what class the sudoku funct is.
		var gameClass = document.getElementById(boardContainer).className;
		
		// Find the textbox and parent
		var txtbox = document.getElementById('edit-txtbox');
		var parent = txtbox.parentNode.parentNode;
		parent.className = parent.className.replace(/\bhighlight\b/,'');
		
		// Grab the text value from the textbox - 
		var value = txtbox.value;

		// Decide where it goes
		var cell = parent.id.substr(6);
		
		// No value - User's cancelling event
		if(!value){

			if( gameClass === 'game-edit'){
				//Remove value if there is one.
				if( gameBoard[cell] ){
					gameBoard[cell] = '';
				}
			}else{
				//Remove value if there is one.
				if( solveBoard[cell] ){
					solveBoard[cell] = '';
				}
			}

		}else if( check(cell, value) === true ){
			
			if( gameClass === 'game-edit'){
				gameBoard[cell] = value;
			}else{
				solveBoard[cell] = value;
			}
		}else{
			// Value is inavlid move for this cell
			solveBoard[cell] ='';
			gameBoard[cell] ='';
			alert('That value is invalid. Try something else.');
		}
		
		refreshDisplay();
		return true;
	};



	/***********************************************
	* Initialize Library and bring to global scope *
	************************************************/
	init();

})(window);