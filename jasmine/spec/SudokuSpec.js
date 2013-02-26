
describe("Sudoku Game and Solver", function(){

	var x = new Sudoku();

	it("instantiates class", function() {
	  expect( new Sudoku() ).not.toBeNull;
	});

	it("get random empty cell", function(){
		
		expect( x.getRandomEmptyCell ).not.toBeNull;
	});

	if("made text puzzle", function(){
		//var x = new Sudoku();
		x.textPuzzle();
		expect( x.gameBoard ).toEqual( x.testBoard );
	});

});

