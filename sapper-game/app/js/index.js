(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const
            cells = document.querySelector('.cells');
        //Обработчик нажатия ПКМ на любую клетку внутри игрового поля
        cells.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            let target = event.target;
            if (target.classList.contains('cell')) {

                setClearFlag(target);
            }
        })
        //Функция добавления/снятия флага
        function setClearFlag(cell) {
            if (cell.classList.contains('cell_flag')) {
                cell.classList.remove('cell_flag');
            }
            else cell.classList.add('cell_flag');

        }
    }, false);
}());