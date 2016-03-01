angular.module('con4', [])
    .controller('GameController', function ($scope) {
        $scope.grid = [];
        $scope.startup = true
// Start Game 
        $scope.newGame = function () {
            $scope.victory = false
            $scope.currentplayer = ""
            $scope.activePlayer = $scope.player1Color
            $scope.grid = buildGrid();
        }
// End start game
// build grid
        function buildGrid() {
            $scope.startup = false
            $scope.grid = []
            for (var i = 0; i < 6; i++) {
                var row = i
                $scope.grid[row] = [];
                for (var j = 0; j < 7; j++) {
                    var column = j
                    $scope.grid[row].push({ row: row, col: column })
                }
            }
            console.log($scope.grid);
            return $scope.grid
        }
// end build grid
        //  this is being passed from the UI "dropToken(cell.col)"
// this function is for dropping the game token
        $scope.dropToken = function (col) {
            if ($scope.victory) { return }
            debugger;
            console.log(col)
            //The col is passed in from the view
            //columnn is full no space available
            //Bad Drop
            if ($scope.grid[0][col].hasToken) {
                return;
            }
            //Find the southMost unoccupied row
			/**
			 * Always start at row 0 and then increment
			 * until you have reached the final row or 
			 * found a cell that already has a token
			 */
            var row = checkSouth(0, col);

            var cell = $scope.grid[row][col];
            cell.hasToken = true;
            cell.color = $scope.activePlayer
			checkVictory(cell);
            endTurn();
            //endTurn and checkVictory
        }
// This function checks for available slots
        function checkSouth(row, col) {
            debugger
           
            //Base case 1 found south Token return row - 1 to go back one step
            if ($scope.grid[row][col].hasToken) {
                row--
                return row
            }
			
            //base case 2 reached bottom of grid return row or 5
            if (row >= 5) {
                return row;
            }
            row++
            return checkSouth(row, col)          
		}
// this function calls victory
        function checkVictory(cell) {
            var horizontalMatches = 0;
            //Check Horizontal
            horizontalMatches += checkNextCell(cell, 0, 'left');
            horizontalMatches += checkNextCell(cell, 0, 'right');
			
            //Check Vertical
            var verticalMatches = 0;
            verticalMatches += checkNextCell(cell, 0, 'bottom');
			
            //Check DiagLeftUp and RightDown
            var diagLeft = 0;
            diagLeft += checkNextCell(cell, 0, 'diagUpLeft');
            diagLeft += checkNextCell(cell, 0, 'diagBotRight');
			
            //Check DiagRigthUp and LeftDown
            var diagRight = 0;
            diagRight += checkNextCell(cell, 0, 'diagUpRight');
            diagRight += checkNextCell(cell, 0, 'diagBotLeft');

            if (verticalMatches >= 3 || horizontalMatches >= 3 || diagLeft >= 3 || diagRight >= 3) {
                //You can do better than an alert 
                $scope.victory = true
                alert(cell.color + ' Wins');
            }
        }
// This function checks the cells around the token cell
        function getNextCell(cell, direction) {
            var nextRow = cell.row;
            var nextCol = cell.col;

            console.log('get next cell function');
            console.log(cell);
            console.log(nextRow, nextCol);
            switch (direction) {
                case 'left':
                    nextCol--;
                    break;
                case 'right':
                    nextCol++;
                    break;
                case 'bottom':
                    nextRow++;
                    break;
                case 'diagUpLeft':
                    nextRow--;
                    nextCol--;
                    break;
                case 'diagUpRight':
                    nextRow--;
                    nextCol++;
                    break;
                case 'diagBotLeft':
                    nextRow++;
                    nextCol--;
                    break;
                case 'diagBotRight':
                    nextRow++;
                    nextCol++;
                    break;
            }
            if (nextRow < 0 || nextRow > 5 || nextCol > 6) {
                console.log('returning null');
                return null;
            } else return $scope.grid[nextRow][nextCol];

        }

        function checkNextCell(cell, matches, direction) {
			/**
			 * var nextCell = getNextCell(cell, direction)
			 * check if nextCell is defined 
			 * if nextCell.hasToken and nextCell.color
			 * matches cell.color 
			 * increment matches and then 
			 * return checkNextCell(nextCell, matches, direction)
			 * 
			 * otherwise return matches
			 */

            var nextCell = getNextCell(cell, direction)
            if (nextCell && nextCell.hasToken && nextCell.color === cell.color) {
                matches++
                return checkNextCell(nextCell, matches, direction)
            } else {
                return matches
            }
        }

        function endTurn() {
debugger;
            if ($scope.activePlayer === $scope.player1Color) {
                $scope.activePlayer = $scope.player2Color;
                $scope.currentplayer = $scope.player2
            } else {
                $scope.activePlayer = $scope.player1Color;
                $scope.currentplayer = $scope.player1
            }
        }
    });