angular.module('con4', [])
    .controller('GameController', function ($scope) {
        $scope.grid = [];
        $scope.background = "teal"
        $scope.newGame = function () {
            $scope.victory = false
            $scope.activePlayer = $scope.player1Color
            $scope.grid = buildGrid();
        }

        function buildGrid() {

			/**
			 * Cell Schema
			 * {
			 * 		row: number,
			 * 		col: number
			 * }
			 */
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
        //  this is being passed from the UI "dropToken(cell.col)"

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
			/**
			 * Once the row is identified
			 * set the cell by accessing 
			 * $scope.grid[row][col]
			 **/
            checkVictory(cell);
            endTurn();
            //endTurn and checkVictory
        }

        function checkSouth(row, col) {
            debugger
            /**
             * Let's use recursion
             * A recursive function is...
             * a function that calls itself
             * until some condition is met
             * 
             * Check South will need essentially two base cases
             * 
             */
			
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
			/**
			 * if neither base case 
			 * (***increment row***, then return checkSouth())
			 * make sure to pass the arguments through
			 */
        }

        function checkVictory(cell) {
            //This one is a gimme you shouldn't have to change anything here
            //Once you fix the checkNextCell function the green squiggles should dissapear.
            //If they don't make sure you are returning a number from the checkNextCell function
			
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

        function getNextCell(cell, direction) {
			/**
			 * var nextRow = cell.row;
			 * var nextCol = cell.col;
			 * 
			 * adjust the values of nextRow
			 * and nextCol as needed based upon
			 * the direction of travel.
			 * 
			 * if nextRow > 0 or < 5 
			 * or if nextCol > 6 
			 * return null;
			 * 
			 * otherwise 
			 * return $scope.grid[nextRow][nextCol];
			 */
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

            if ($scope.activePlayer === $scope.player1Color) {
                $scope.activePlayer = $scope.player2Color
            } else {
                $scope.activePlayer = $scope.player1Color
            }
        }
    });