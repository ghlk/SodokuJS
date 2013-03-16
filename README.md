sudokuJS - Playing/Solving Library
========

A javascript Library for playing and solving Sudoku.



#Playing - User 
Allow for user-inputted puzzles as well as solving.  
These modes are toggled between each other.

#Solving - AI

**Our solvers come in 2 varieties.**

##Solvers
Recursive solvers will simply run as fast as they can and spit our their answer.
They can occassionally have a hangup, but are usually done quickly.

##Steppers
Steppers are user interactive. They show their solution as they progress through the board.  
Steppers can be used in 2 ways.  
They can be "stepped through", having the user click through each individual move, or 
Note: Uses async timeouts.

###"Ground Zero" - A numerical-order brute-force algorithm.
Starts at cell 0. Increments to cell 1, until solves cell 80.
It never solves a cell higher on the chain than itself.

###"One Way" - Solves no-brainer cells first, then brute-force.
It looks for any cells with only 1 possible move and fills them in. It continues to do this until there are no "One Way" cells left. After this, it uses the "Ground Zero" algo.
 
###"Weighted" - ( *pending-not-coded* )
Fills in any "one way" cells. 
After that it weighs what cell to fix next by looking at adjacent cell possibles.
 
	Current cell = 3 4 9
	NeighborA=  3 4 //Cell in row/column, etc…
	NeighborB = 3 4 
	
In this example cells 3 and 4 must be used for themselves, not the current cell.
So let's *not* use those values.
Note: This is similar to twins/triplets add-ons. But the twins/triplets break the puzzle and prove an incorrect solution somewhere earlier on the queue. "weighted" will be looking at cells that are valid.

##Algorithm Add-Ons
Algo add-ons can be toggled on and off for all algorithms. They will significantly speed up solutions.

### Dead Cells
(An empty cell that has no possible moves left)

### Twin Cells
(When two cells have same last move avilable.)

### Triplets
(When three cells have same last 2 moves.)

### Enough For Class
