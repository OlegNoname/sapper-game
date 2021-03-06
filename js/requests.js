var users_data = {//все юзеры, в данном случае "Я" и "Собеседник" взято для примера
	users: ["Артем", "Олег", "Женя", "Кирилл", "Илья", "Никита"],
	points: ["200", "300", "200", "300", "200", "300"]
}

let id_game = ''//переменная хранящая id текущей игровой сессии
let mess_mass = {}//Массив последних 5 сообщений
let flag1 = 0;//Флаг, нужный для считывания сообщений

function requests() {

	var div1 = document.getElementById('send');//событие нажатия на кнопку "Отправить"
	div1.addEventListener('click', NewMessage, false);

	var div2 = document.getElementById('send2');//событие нажатия на кнопку "Отправить"
	div2.addEventListener('click', NewMessage2, false);

	function NewMessage() {//функция отрисовки отправленного своего сообщения в чате
		if (CheckMes()) {
			user = users_data.users[0];
			var message = document.querySelector('#message_input');
			if (document.querySelectorAll("ul").length == 0) {
				var window1 = document.createElement('ul');
				var chat = document.querySelector('.chat');
				chat.appendChild(window1);

			}
			else {
				var window1 = document.querySelector('ul');
			}
			let main = document.createElement('div');
			main.className = "main"
			var nameUser = document.createElement('span');
			nameUser.innerHTML = user_name_output.value;
			main.appendChild(nameUser);


			let mes1 = document.createElement('li');
			if (user == "Артем")//частично реализована проверка на юзеров
			{
				mes1.className = "from_me"
				nameUser.className = "myName"
			}

			mes1.innerHTML = message.value;

			main.appendChild(mes1);
			window1.appendChild(main);
			message.value = "";

			var chat = document.querySelector('div');
			chat.scrollTop = 9999;
		}
	}


}

function NewMessage2(mess,nick) {//функция отрисовки отправленного чужого сообщения в чате, функция написана под этот пример, нужно будет реализовать проверку на юзеров, и соединить эти две функции в одну
			user = nick;
			var message = mess;
			if (document.querySelectorAll("ul").length == 0) {
				var window1 = document.createElement('ul');
				var chat = document.querySelector('.chat');
				chat.appendChild(window1);

			}
			else {
				var window1 = document.querySelector('ul');
			}
			let main = document.createElement('div');
			main.className = "main"
			var nameUser = document.createElement('span');
			nameUser.innerHTML = user;
			main.appendChild(nameUser);
			let mes1 = document.createElement('li');
			mes1.className = "from_another"
			nameUser.className = "anotherName"
			mes1.innerHTML = message;

			main.appendChild(mes1);
			window1.appendChild(main);
			message.value = "";

			var chat = document.querySelector('.chat');
			chat.scrollTop = 9999;
		
	}


function CheckMes2() {//проверка своего пустого сообщения
	var message = document.querySelector('#message_from');
	if (message.value == "")
		return false;
	else return true;
}

function CheckMes() {//проверка пустого сообщения от собеседника, в итоге она не потребуется
	var message = document.querySelector('#message_input');
	if (message.value == "")
		return false;
	else return true;
}


//Функция логина на сервер и отрисовки игрового поля, если такое имя не занято
function login(callback) {
	let Nickname = user_name_input.value;
	fetch('../../api/users', {
		method: 'POST',
		headers: { 'content-type': 'application/json; charset=UTF-8' },
		body: JSON.stringify({ "name": Nickname }),
	}).then(res => {
		if (res.status === 200) {
			setInterval(recive_messages,500);
			console.log('Логин пользователя ' + Nickname + ' прошёл успешно!');
			//Скрытие начального окна и появление игрового поля
			callback()
		} else if (res.status === 400) {
			throw new Error("Пользователь с таким именем уже существует")
		}
	}).catch(e => alert(e));
}

function exit() {//Функция выхода с сервера
	fetch('../../api/users', {
		method: 'DELETE',
		headers: { 'content-type': 'application/json; charset=UTF-8' },
	}).then(res => {
		if (res.status === 200) {
			console.log('Выход прошёл успешно!');
		} else if (res.status === 400) {
			throw new Error("Ошибка выхода!")
		}
	}).catch(e => alert(e));
}


function user_check() {//Функция выводящая в консоль список залогиненых пользователей
	fetch('../../api/users')
		.then(res => {
			if (res.status === 200) {
				console.log('Запрос списка пользователей прошёл успешно!');
				return res.json();
			} else if (res.status === 400) {
				throw new Error("Ошибка запроса списка пользователей!")
			}
		})
		.then(data => {
			console.log(data)
		})
		.catch(e => alert(e));
}


function start_game() {//Функция начала игры
	fetch('../../api/records', {
		method: 'POST',
		headers: { 'content-type': 'application/json; charset=UTF-8' },
		body: JSON.stringify({ "game": "Сапёр" }),
	}).then(res => {
		if (res.status === 200) {
			console.log('Информация о начале игры успешно отправлена!');
			return res.json();
		} else if (res.status === 400) {
			throw new Error("Не удалось отправить информацию о начале игры!")
		}
	})
		.then(data => {
			console.log(data);
			id_game = data.id;
		})
		.catch(e => alert(e));
}

function record_list() {//Функция получения списка рекордов
	fetch('../../api/records').then(res => {
		if (res.status === 200) {
			console.log('Список рекордов успешно получен!');
			return res.json();
		} else if (res.status === 400) {
			throw new Error("Не удалось получить список рекордов!")
		}
	})
		.then(data => {
			console.log(data);
		})
		.catch(e => alert(e));
}

function end_game(score) {//Функция завершения игры

	fetch('../../api/records/'+id_game, {
		method: 'PATCH',
		headers: { 'content-type': 'application/json; charset=UTF-8' },
		body: JSON.stringify({ "id": id_game, "score":score}),
	}).then(res => {
		if (res.status === 200) {
			console.log('Информация о завершении игры успешно отправлена!');
		} else if (res.status === 400) {
			throw new Error("Не удалось отправить информацию о завершении игры!")
		}
	}).catch(e => alert(e));
}
function send_message() {//Функция отправления сообщения
	let message = message_input.value;
	fetch('../../api/messages', {
		method: 'POST',
		headers: { 'content-type': 'application/json; charset=UTF-8' },
		body: JSON.stringify({ "text": message }),
	}).then(res => {
		if (res.status === 200) {
			console.log('Сообщение успешно отправлено!');
		} else if (res.status === 400) {
			throw new Error("Не удалось отправить сообщение!")
		}
	}).catch(e => alert(e));
}

function check_new_mess(new_mess_mass){
	for (let i = 0; i < 5;i++){
		if (!(new_mess_mass[i].time === mess_mass[0].time) && !(new_mess_mass[i].time === mess_mass[1].time) && !(new_mess_mass[i].time === mess_mass[2].time) && !(new_mess_mass[i].time === mess_mass[3].time) && !(new_mess_mass[i].time === mess_mass[4].time) && !(new_mess_mass[i].isMine)){
        NewMessage2(new_mess_mass[i].text,new_mess_mass[i].user);
		} 
	}
}

function recive_messages() {//Функция получения массива сообщений
	fetch('../../api/messages')
		.then(res => {
			if (res.status === 200) {
				/*console.log('Массив сообщений успешно получен!');*///закоменчено ибо дикий спам
				return res.json();
			} else if (res.status === 400) {
				throw new Error("Не удалось получить массив сообщений!")
			}
		})
		.then(data => { 
			/*console.log(data);*/
			if ((flag1 === 1 )) {
			check_new_mess(data);
			}
			mess_mass = data;
			flag1 = 1;
		})
		.catch(e => alert(e));
}    