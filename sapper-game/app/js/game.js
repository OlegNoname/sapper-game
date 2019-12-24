function game() {
    let
        cells = document.querySelector('.cells'),
        chat = document.querySelector('.chat_main'),
        gameWindowIsWide = false,
        userName = '';

    //Обработчик нажатия ПКМ на любую клетку внутри игрового поля
    cells.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        let target = event.target;
        if (target.classList.contains('cell')) {
            setClearFlag(target);
        }
    })
    //Обработчик нажатия на кнопку после завершения игры
    game_over_btn.addEventListener('click', () => {
        game_window_modal_background.style.display = 'none';
        lose.style.display = 'none';
        win.style.display = 'none';
        newGame();
    })
    //Обработчик нажатия ЛКМ на любую клетку внутри игрового поля
    cells.addEventListener('click', (event) => {
        let target = event.target;
        if (target.classList.contains('cell')) {
            move(target);
        }
    })

    //Запуск игры после подтверждения имени игрока
    new_game_btn.addEventListener('click', newGame);
    start_btn.addEventListener('click', () => {
        login(() => {
            userName = user_name_input.value;
            user_name_output.value = userName;
            start_menu.style.display = 'none';
            content_modal_background.style.display = 'none';
            chat.style.display = 'flex';
            game_window.style.display = 'flex';
        });
    })

    //класс ячейки
    class Cell {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.isMine = false;
            this.isOpen = false;
            this.isBlock = false;
            this.minesAround = 0;
        }
    }
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
        const GameWindow = document.getElementById('game_window');
        const wideGameWindow = document.querySelector('.game_window_wide');
        //Сбрасываем ширину по умолчанию до стандартной

        console.log(GameWindow.offsetWidth)
        gameField = [];

        switch (level) {
            case 0:
                countLine = 9;
                countColumn = 9;
                countMine = 10;
                cells.style.fontSize = '2em';
                GameWindow.style.width = '';
                gameWindowIsWide = false;
                break;
            case 1:
                countLine = 16;
                countColumn = 16;
                countMine = 40;
                cells.style.fontSize = '1em';
                GameWindow.style.width = '';
                gameWindowIsWide = false;
                break;
            case 2:
                countLine = 20;
                countColumn = 24;
                countMine = 99;
                cells.style.fontSize = '0.8em';
                //Установка размера игрового поля в зависимости количества строк и столбцов
                //Если поле становится прямоугольным, то необходимо менять пропорции поля
                const widthFactor = countColumn / countLine;
                //Выставляем новую ширину для пропорциональности поля
                if (!gameWindowIsWide) {
                    GameWindow.style.width = `${widthFactor * GameWindow.offsetWidth}px`;
                    gameWindowIsWide = true;
                }
                break;
        }

        // cells.style.width = `${countColumn / countLine * 100}%`;
        // menu.style.width = `${countColumn / countLine * 100}%`;

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

    //Функция обработки хода
    function move(cell) {
        let id = cell.id.split('_')
        let x = id[1];
        let y = id[2];
        if (gameField.filter(item => item.isMine == true).length == 0) {
            newField(x, y);
        }
        else {
            let cellInArr = gameField.filter(item => item.x == x && item.y == y)[0];
            if (!cellInArr.isOpen && !cellInArr.isBlock) {
                if (cellInArr.isMine) {
                    youLose(cellInArr);
                }
                else if (cellInArr.minesAround == 0) {
                    emptyField(cellInArr);
                    youWin();
                }
                //emptyField(x, y);
                else {
                    openCell(cellInArr);
                    youWin();

                }
            }
        }
    }

    //возвращает случайное значение
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    }


    //генерация нового поля
    function newField(x, y) {
        for (let i = 0; i < countLine; i++) {
            gameField[i] = []
            for (let j = 0; j < countColumn; j++) {
                gameField[i][j] = new Cell(i, j);
            }
        }
        for (let i = 0; i < countMine; i++) {
            yy = getRandomInt(0, countLine);
            xx = getRandomInt(0, countColumn);
            //while (xx == y || yy == x) {
            while (gameField[yy][xx].isMine == true || xx == y || yy == x) {
                yy = getRandomInt(0, countLine);
                xx = getRandomInt(0, countColumn);
            }
            gameField[yy][xx].isMine = true;
            if (gameField[yy + 1] && gameField[yy + 1][xx])
                gameField[yy + 1][xx].minesAround++;
            if (gameField[yy] && gameField[yy][xx + 1])
                gameField[yy][xx + 1].minesAround++;
            if (gameField[yy - 1] && gameField[yy - 1][xx])
                gameField[yy - 1][xx].minesAround++;
            if (gameField[yy] && gameField[yy][xx - 1])
                gameField[yy][xx - 1].minesAround++;
            if (gameField[yy - 1] && gameField[yy - 1][xx - 1])
                gameField[yy - 1][xx - 1].minesAround++;
            if (gameField[yy + 1] && gameField[yy + 1][xx + 1])
                gameField[yy + 1][xx + 1].minesAround++;
            if (gameField[yy - 1] && gameField[yy - 1][xx + 1])
                gameField[yy - 1][xx + 1].minesAround++;
            if (gameField[yy + 1] && gameField[yy + 1][xx - 1])
                gameField[yy + 1][xx - 1].minesAround++;
        }
        gameField = gameField.reduce(function (flat, current) {
            return flat.concat(current);
        }, [])
        let thisCell = gameField.filter(item => item.x == x && item.y == y)[0];
        if (thisCell.minesAround == 0)
            emptyField(thisCell)
        else
            openCell(thisCell);
    }

    //Функция открытия ячеек
    function openCell(cellForOpen) {
        let thisElem = document.getElementById(`cell_${cellForOpen.x}_${cellForOpen.y}`);
        if (cellForOpen.isMine) {
            thisElem.className = "cell cell_bomb";
            //thisElem.classList.add("cell_bomb");
        }
        else
            if (cellForOpen.minesAround == 0) {
                thisElem.className = "cell cell_open";
                //thisElem.classList.add("cell_open");
            }
            else {
                thisElem.classList.add(`cell_number_${cellForOpen.minesAround}`);
                thisElem.classList.add('cell_open');
                //thisElem.className = `cell_number_${cellForOpen.minesAround}`;
            }
        cellForOpen.isOpen = true;
    }


    function youLose(cellInArr) {
        openCell(cellInArr);

        const pressedCell = document.getElementById(`cell_${cellInArr.x}_${cellInArr.y}`);
        //Добавляется красный цвет нажатой бомбе
        pressedCell.style.background = '#ff5050';
        let openMines = gameField.filter(item => item.isMine == true);
        openMines.forEach(item => openCell(item));
        for (let i = 0; i < gameField.length; i++) {
            gameField[i].isBlock = true;
            gameField[i].isOpen = true;
        }
        game_window_modal_background.style.display = 'flex';
        lose.style.display = 'block';
        //Вызов таблицы лидеров
        // setTimeout(tableLid(), 2000);
    }

    //Функция обработки нажатия на пустое поле (вокруг этой ячейки нет мин)
    function emptyField(cellInArr) {
        //openCell(gameField.filter(item => item.x == x && item.y == y)[0]);
        openCell(cellInArr);
        let cellsForOpen = [];
        let check_cells = cellAround(cellInArr.x, cellInArr.y);
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

        let check_cells = gameField.filter(item => item.y >= first_column && item.y <= last_column
            && item.x <= last_line && item.x >= first_line
            && item.isMine == false && item.isOpen == false);
        return check_cells;
    }

    //Функция проверки выигрыша игрока
    function youWin() {
        let check_cells = gameField.filter(item => item.isMine == false && item.isOpen == false)
        if (check_cells.length == 0) {
            cellsMines = gameField.filter(item => item.isMine == true);
            for (let i = 0; i < cellsMines.length; i++) {
                cellsMines[i].isBlock = true;
                cellsMines[i].isOpen = true;
            }
            //Открывается победное окно
            game_window_modal_background.style.display = 'flex';
            win.style.display = 'block';
            //Вызов таблицы лидеров
            // setTimeout(tableLid(), 2000);
        }
    }

    //Функция добавления/снятия флага
    function setClearFlag(cell) {
        let id = cell.id.split('_')
        let x = id[1];
        let y = id[2];

        if (gameField.filter(item => item.isMine == true).length == 0) {
            newField(x, y);
        }

        let cellInArr = gameField.filter(item => item.x == x && item.y == y)[0]
        if (!cellInArr.isOpen) {
            if (cell.classList.contains('cell_flag')) {
                cell.classList.remove('cell_flag');
                cellInArr.isBlock = false;
            }
            else {
                cell.classList.add('cell_flag');
                cellInArr.isBlock = true;
            }
        }

    }
    function tableLid() {
        BubbleSort();
        var gameWindow = document.getElementById("game_window_modal_background");
        var nextTable = document.createElement('div');
        nextTable.className = "windowtable";
        gameWindow.appendChild(nextTable);

        var nameTable = document.createElement('div');
        nameTable.className = "nameTable";
        gameWindow.appendChild(nameTable);

        nameTable.innerHTML = "Таблица лидеров:"
        var tableList = document.createElement('div');
        tableList.className = "tableList";
        nextTable.appendChild(tableList);
        var tableLid = document.createElement('table')
        var stroka = document.createElement('tr');
        for (let i = 0; i < 3; i++) {
            let NumberUser = "№";
            let NameUser = "Имя пользователя";
            let Ochki = "Счёт";
            var stolb = document.createElement('th');
            if (i == 0) {
                stolb.id = "NumberUser";
                stolb.innerHTML = NumberUser;
            }
            if (i == 1) {
                stolb.id = "NameUser";
                stolb.innerHTML = NameUser;
            }
            if (i == 2) {
                stolb.id = "Ochki";
                stolb.innerHTML = Ochki;
            }
            stroka.appendChild(stolb);
        }
        tableLid.appendChild(stroka);
        var count = 0;

        for (let i = 0; i < users_data.users.length; i++) {
            count++;
            var stroka2 = document.createElement('tr');
            for (let j = 0; j < 3; j++) {
                var stolbUser = document.createElement('th');
                if (j == 0) {
                    stolbUser.innerHTML = count;
                }
                if (j == 1) {
                    stolbUser.innerHTML = users_data.users[i];
                }
                if (j == 2) {
                    stolbUser.innerHTML = users_data.points[i];
                }
                stroka2.appendChild(stolbUser);
            }
            tableLid.appendChild(stroka2);
        }


        tableList.appendChild(tableLid);
    }
    function BubbleSort()//Метод сортировки пузырьком
    {
        for (let i = 0; i < users_data.users.length; i++) {
            for (let j = 0; j < users_data.users.length; j++) {
                if (users_data.points[j] < users_data.points[j + 1])
                    ObmenMest(j, j + 1)
            }
        }
    }

    function ObmenMest(first, second)//Метод, позволяющий поменять два элемента массива местами
    {
        let any = users_data.points[first];
        users_data.points[first] = users_data.points[second];
        users_data.points[second] = any;

        let any2 = users_data.users[first];
        users_data.users[first] = users_data.users[second];
        users_data.users[second] = any2;
    }

}