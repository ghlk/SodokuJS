/**
 * Class Sodoku
 * Summary: A sodoku class that contains solving and editing capabilities.
 * @param 	str 	name 	Name of sodoku obj created.
 * @param 	int 	size 	Size of the sodoku puzzle to create.
 *
 *  size - Default 81
 *
 * NOTES:
 * Brute force algo vs EvilBoard = 112144 moves. 1move/1sec = 31hours
 *
 **/
function Sodoku (name = 'mySodoku', size=81) {
	
	/* Creates the boards */
	var board = [ ], i;
	for (i=0; i<size; i++){ board.push(''); }
	
	/* Complete list of boards */
	this.gameBoard  = board.slice(0); //Exposed cells. (Puzzle to solve)
	this.possBoard  = board.slice(0); //Possible cell values.
	this.solveBoard = board.slice(0); //Solving values.
	this.emptyBoard = board.slice(0); //Used for resetting other boards.
	
	/* Bookmarks - Used to navigate when solving puzzle */
	this.solveBookmark = 0; //Used to step through solving process. 
	this.direction = 1; 	//'1' represents "positive" direction
	this.solvePlace = 0;	
	this.currentCell = null;
		
	/* Puzzle Settings */
	this.size = size; //size of the sodoku puzzle
	this.name = name; //Name of the Sodoku class created by the page (@params)
	this.t_possibles = true; //Show possibles or not

	/* Helper Values */
	this.timer;				// Timer used for solving the puzzle in intervals.
	this.interval 	= 1;	// Interval for timers. (ms)(1000 = 1s)
	this.step 		= 1 ;
	this.solverStr	= this.name+".solver();"; 
	this.stepStr	= this.name+".stepSolver();"; 
	this.moves = 0; //To count how long it takes to solve the problem.	
	
	/* Premade puzzles */
	this.testBoard = ['', 9, 2,'','', 1,'', 8,'','','','','','','', 1, 7,'','','', 7,'', 3,'', 4, 6, 2,'','','', 3,'','', 9, 1,'','', 9, 6, 5,'', 1, 7, 4,'','', 4, 1,'','', 9,'','','', 1, 3, 6,'', 4,'',7,'','','', 5, 2,'','','','','','','', 8,'', 2,'','', 6, 9,''];
	this.evilBoard = [ 5,'', 9,'','', 6,'', 7 , 8, 4,'','', 2,'','','','', 9, 7,'','','','','','','', 1,'', 6,'','','', 4,'','','', 9,'','','','','','','', 4,'','','', 9,'','','', 6,'', 1,'','','','','','','',5, 6,'','','','', 1,'','', 8, 2, 5,'', 3,'','', 1,'', 9];
}



/**
 * -------------------------------------------
 * Puzzle Creation
 * -------------------------------------------
**/


/**
 * newPuzzle()
 * Summary: Resets the puzzle board and other values, then populates it with a new puzzle, and displays the new game.
 * Notes: This can result in non-solvable puzzles. Keep that in mind.
 * 
 * @param 	int 	lines 	Number of "lines" or times to use the values 1-9 in the puzzle.
 * @param 	str 	divID 	The div ID to display the puzzle in.
 * @return 	void
 **/
Sodoku.prototype.newPuzzle = function (lines, divID) {

	/** Reset all boards **/
	this.gameBoard = this.emptyBoard.slice(0);
	this.possBoard = this.emptyBoard.slice(0);
	this.solveBoard = this.emptyBoard.slice(0);
	
	/** Reset values **/
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
}


/**
 * testPuzzle()
 * Summary: Sets the premade test puzzle in the board.
 **/
Sodoku.prototype.testPuzzle = function() {
	this.gameBoard = this.testBoard.slice(0);
	this.refreshDisplay();
}


/**
 * prepopulate()
 * Summary: Creates the puzzle by prepopulating an empty board with numbers in random cells.
 * @param 	int 	lines 	Number of times to inject the numbers 1-9 in the puzzle.
 * @return 	void
 **/
Sodoku.prototype.prepopulate = function (lines) {
	if(!lines){ lines = 1; }
	var x, val, cell;
	
	for(x = 0; x < lines; x++){ //# of lines loop...
		for(val = 1; val <= 9; val++){ //Populating loop...
			do{
				cell = this.getRandomEmptyCell();
			}while ( !(this.check(cell, val)) );
			this.gameBoard[cell] = val;
		}
	}
}


/**
 * getRandomEmptyCell()
 * Summary: Returns the location of a random empty cell. Used for puzzle creation.
 * @return 	int 	rand 	Random empty cell number.
 **/
Sodoku.prototype.getRandomEmptyCell = function () {
	var rand;
	do{
		rand = Math.floor( Math.random() * 81 );
	}while( this.gameBoard[rand] );
	return rand;
}


/**
 * -------------------------------------------
 * Checking Methods
 * -------------------------------------------
**/


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
Sodoku.prototype.check = function (cell, val) {

	/** BOX CHECK **/
	var box = this.checkBox(cell, val);
	console.log(box);
	/** ROW CHECK **/
	var row = this.checkRow(cell, val);
	
	/** COLUMN CHECK **/
	var column = this.checkColumn(cell, val);
	
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
}


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
Sodoku.prototype.checkBox = function (cell, val){
	
	//arr represents what values are valid moves
	var arr = [ true, true, true, true, true, true, true, true, true ];

	//Iterate through the entire box, starting with it's starting square.
	var start = this.getBoxStart(cell);
	for(var x=start; x < (start+9); x++){
			
		//If no value passed - return an Array of possible values for cell provided.
		if(!val){
			if( this.gameBoard[x] ){
				arr[ ( this.gameBoard[x]-1 ) ] = false;
			}else if( this.solveBoard[x]  ){
				arr[ ( this.solveBoard[x]-1) ] = false;
			}
		}else{
			if( this.gameBoard[x] === val || this.solveBoard[x] === val ){
				return false;
			}
		}
	}
	if(!val){
		return arr;
	}else{
		return true;
	}
}


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



/**
 * -------------------------------------------
 * Displaying & HTML
 * -------------------------------------------
**/


/**
 * getHTMLSkelaton()
 * Summary: Returns the HTML skelaton for the sodoku game.
 * @return 	str 	str 
 **/
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
};


/**
 * getHTML()
 **/
Sodoku.prototype.getHTML = function(showPossibles, showSolution) {

	if( showPossibles !== true) { showPossibles = false; }
	if( showSolution !== true) { showSolution = false; }
	
	if( showPossibles === true ){ this.calcPossibles(); }
	
	var str = '';
	var cell, k, possStr;
	
	str += '<div id="sodoku">'; //#sodoku - Start
	
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
};

/**
 * togglePossibles()
 * Summary: Toggles whether to show possible moves in the puzzle or not.
 * @param 	bool 	override 
 **/
Sodoku.prototype.togglePossibles = function(override=null){
	console.log('toggle'+this.t_possibles);
	if(override === true || override === false){
		this.t_possibles = override;
	}else{
		this.t_possibles = !this.t_possibles;
	}
	this.refreshDisplay();
};


/**
 * display()
 * Summary:
 *
 * @param 	str 	divID
 * @return 	void
 **/
Sodoku.prototype.display = function (divID) {
	if(!divID){ divID = 'game'; }
	document.getElementById(divID).innerHTML = mySodoku.getHTML(false, false);	
};

Sodoku.prototype.refreshDisplay = function(divID){
	if(!divID){divID='game';}
	
	document.getElementById(divID).innerHTML = mySodoku.getHTML(this.t_possibles, true);
}

Sodoku.prototype.empty = function () {
	this.gameBoard = this.emptyBoard.slice(0);
	this.display();
}


/**
 * getPossibles()
 * @param 	int 	cell 	The cell we are checking possibiles for.
 * @param 	str 	type 	Type of array we want back. Boolean of values.
 * @return 	arr 	boolArr Array of boolean values to represent possible values for cell.
 * @return 	arr 	valArr 	Array of values that are possible values for cell.
 */
Sodoku.prototype.getPossibles = function (cell, type) {
	
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
}


/**
 * calcPossibles
 * Summary: 
 **/
Sodoku.prototype.calcPossibles = function () {
	var cell;
	for(cell=0; cell<81; cell++){
		if( !this.gameBoard[cell] && !this.solveBoard[cell] ) {
			this.possBoard[cell] = this.check(cell);
		}
	}
}


/**
 * -------------------------------------------
 * Solving
 * -------------------------------------------
 **/

/**
 * Sodoku.solveCell(cell)
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
	this.refreshDisplay();
	
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








/**
 * -------------------------------------------
 * Position Methods
 * -------------------------------------------
 * 
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
Sodoku.prototype.getBig = function (cell){
	return Math.floor(cell/9);
}

/**
 * getBigRow()
 * @param 	int 	cell 	Numeric position of cell.
 **/
Sodoku.prototype.getBigRow = function (cell){
	return Math.floor( Math.floor(cell/9) / 3);
}

/**
 * getBigColumn()
 * @param 	int 	cell 	Numeric position of cell.
 * @return 	int 	Big Column that the cell belongs to.
 **/
Sodoku.prototype.getBigColumn = function (cell){
	return ( Math.floor(cell/9) % 3 );
}

/**
 * getSmall()
 * @param 	int 	cell 	Numeric position of cell
 * @return 	int 	Numeric position of the cell's small 
 */
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

/* */
Sodoku.prototype.getRowCells = function (cell) {
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
	
	// this.step = parseInt(document.getElementById('stepValue').value);
	// this.interval  = document.getElementById('interval').value;
	console.log(this.step + '  ' + this.interval);
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

Sodoku.prototype.highlightCells = function(cell){
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
}

Sodoku.prototype.unhighlightCells = function(cell){

}