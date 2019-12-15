(function () {
    document.addEventListener('DOMContentLoaded', function () {
        let
            cells = document.querySelector('.cells');
        //Обработчик нажатия ПКМ на любую клетку внутри игрового поля
        cells.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            let target = event.target;
            if (target.classList.contains('cell')) {

                setClearFlag(target);
            }
        })
        //Обработчик нажатия ЛКМ на любую клетку внутри игрового поля
        cells.addEventListener('click', (event) => {
            let target = event.target;
            if (target.classList.contains('cell')) {
                move(target);
            }
        })
        new_game_btn.addEventListener('click', newGame)

        //Объект ячейки
        let cell =
        {
            x: 0,
            y: 0,
            isMine: false,
            isOpen: false,
            isBlock: false,
            minesAround: 0
        };

        //Игровое поле
        let gameField = [];
        //Количество мин в игре
        let countMine = 0;
        //Количество линей в поле
        let countLine = 0;
        //Количество колонок в поле
        let countColumn = 0;

        newGame();

        //Функция отрисовки поля
        function newGame() {
            const level = difficulty_level.options.selectedIndex;
            gameField = [];
            switch (level) {
                case 0:
                    countLine = 9;
                    countColumn = 9;
                    countMine = 10;
                    break;
                case 1:
                    countLine = 16;
                    countColumn = 16;
                    countMine = 40;
                    break;
                case 2:
                    countLine = 16;
                    countColumn = 30;
                    countMine = 99;
                    break;
            }
            cells.style.height = `${countLine / countColumn * 100}%`
            //Очистить поле
            cells.innerHTML = '';
            //Отрисовать поле
            for (let i = 0; i < countLine; i++) {
                let thisLine = document.createElement('div');
                thisLine.className = "row";
                for (let j = 0; j < countColumn; j++) {
                    let thisCell = document.createElement('div');
                    thisCell.className = "cell";
                    thisCell.id = `cell_${i}_${j}`;
                    thisLine.appendChild(thisCell);
                }
                cells.appendChild(thisLine);
            }
        }

        //Функция открытия ячеек
        function openCell(cellForOpen) {
            //????event.classList.add('open');
            //document.getElementById(`cell_${x}_${y}`').classList.add('open');
            let thisElem = document.getElementById(`cell_${cellForOpen.x}_${cellForOpen.y}`);
            if (cellForOpen.isMine) {
                thisElem.className = "cell_bomb";
            }
            else
                if (cellForOpen.minesAround == 0) {
                    thisElem.className = "cell_open";
                }
                else {
                    thisElem.className = `cell_number_${cellForOpen.minesAround}`;
                }
            cellForOpen.isOpen = true;
        }

        //Функция обработки нажатия на пустое поле (вокруг этой ячейки нет мин)
        function emptyField(x, y) {
            openCell(gameField.filter(item => item.x == x && item.y == y)[0]);
            let cellsForOpen = [];
            let check_cells = cellAround(x, y);
            for (let i = 0; i < check_cells.length; i++) {
                openCell(check_cells[i]);
            }
            check_cells = check_cells.filter(item => item.minesAround == 0);
            while (check_cells.length != 0) {
                let cellsForOpen = cellAround(check_cells[0].x, check_cells[0].y);
                for (let i = 0; i < cellsForOpen.length; i++) {
                    openCell(cellsForOpen[i]);
                }
                cellsForOpen = cellsForOpen.filter(item => item.minesAround == 0);
                check_cells.shift();
                check_cells = check_cells.concat(cellsForOpen);
            }
        }

        //Сбор закрытых ячеек вокруг обрабатываемой
        function cellAround(x, y) {
            let first_line = (x - 1 < 0 ? 0 : x - 1);
            let last_line = (x + 1 < countLine ? x + 1 : countLine - 1);
            let first_column = (y - 1 < 0 ? 0 : y - 1);
            let last_column = (y + 1 < countColumn ? y + 1 : countColumn - 1);
            
            let check_cells = game_field.filter(item => item.y >= first_column && item.y <= last_column
                && item.x <= last_line && item.x >= first_line
                && item.isMine == false && item.isOpen == false);
            return check_cells;
        }

        //Функция проверки выигрыша игрока
        function youWin() {
            let check_cells = game_field.filter(item => item.isMine == false && item.isOpen == false)
            if (check_cells.length == 0) {
                alert("Вы выйграли.");
                check_cells = game_field.filter(item => item.isMine == true);
                for (let i = 0; i < check_cells.length; i++) {
                    check_cells[i].isBlock = true;
                }
            }
        }

        //Функция добавления/снятия флага
        function setClearFlag(cell) {
            let id = cell.id.split('_')
            let x = id[1];
            let y = id[2];
            let cellInArr = game_field.filter(item => item.x == x && item.y == y)[0]
            if (cell.classList.contains('cell_flag')) {
                cell.classList.remove('cell_flag');
                cellInArr.isBlock = false;
            }
            else 
            {
                cell.classList.add('cell_flag');
                cellInArr.isBlock = true;
            }

        }
    }, false);
}());