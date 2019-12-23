var users_data = {//все юзеры, в данном случае "Я" и "Собеседник" взято для примера
		users: ["Артем", "Олег","Женя", "Кирилл","Илья", "Никита"],
		points: ["200","300","200","300","200","300"]
}


window.onload=function(){
	
	var div1 = document.getElementById('send');//событие нажатия на кнопку "Отправить"
    div1.addEventListener('click', NewMessage, false);
	
	var div2 = document.getElementById('send2');//событие нажатия на кнопку "Отправить"
    div2.addEventListener('click', NewMessage2, false);
	
	
    function NewMessage() {//функция отрисовки отправленного своего сообщения в чате
		if (CheckMes()) {
			user = users_data.users[0];
		var message = document.querySelector('#message_input');
		if (document.querySelectorAll("ul").length==0)
			{
				var window1 = document.createElement('ul');
				var chat = document.querySelector('.chat');
				chat.appendChild(window1);

			}
		else
			{
				var window1 = document.querySelector('ul');
			}
		let main = document.createElement('div');
		main.className = "main"
		var nameUser =	document.createElement('span');
		nameUser.innerHTML=user;
		main.appendChild(nameUser);
			
			
		let mes1 = document.createElement('li');
			if (user=="Артем")//частично реализована проверка на юзеров
				{
					mes1.className="from_me"
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
	
	
function NewMessage2() {//функция отрисовки отправленного чужого сообщения в чате, функция написана под этот пример, нужно будет реализовать проверку на юзеров, и соединить эти две функции в одну
		if (CheckMes2()) {
			user = users_data.users[1];
		var message = document.querySelector('#message_from');
		if (document.querySelectorAll("ul").length==0)
			{
				var window1 = document.createElement('ul');
				var chat = document.querySelector('div');
				chat.appendChild(window1);

			}
		else
			{
				var window1 = document.querySelector('ul');
			}
		let main = document.createElement('div');
		main.className = "main"
		var nameUser =	document.createElement('span');
		nameUser.innerHTML=user;
		main.appendChild(nameUser);
		let mes1 = document.createElement('li');
			if (user!="Олег")//частично реализована проверка на юзеров
				{
					mes1.className="from_another"
					nameUser.className = "anotherName"
				}
		mes1.innerHTML = message.value;

		main.appendChild(mes1);	
			window1.appendChild(main);
		message.value = "";
		
	var chat = document.querySelector('.chat');
	chat.scrollTop = 9999;		
	}
	}

}
function CheckMes2() {//проверка своего пустого сообщения
	var message = document.querySelector('#message_from');
	if (message.value=="")
	return false;
	else return true;
}

function CheckMes() {//проверка пустого сообщения от собеседника, в итоге она не потребуется
	var message = document.querySelector('#message_input');
	if (message.value=="")
	return false;
	else return true;
}

function login(){//Функция логина на сервер
	        let Nickname = user_name_input.value;
        	fetch('../../api/users', {
        		method: 'POST',
        		headers:{'content-type': 'application/json; charset=UTF-8'},
        		body:JSON.stringify({"name":Nickname}),
            }).then(res =>{
            	if (res.status === 200){
            	console.log('Логин пользователя '+Nickname+' прошёл успешно!');	
            } else if (res.status === 400) {
            	throw new Error("Пользователь с таким именем уже существует")
            }
            }).catch(e=> alert(e));
        }  


 function exit(){//Функция выхода с сервера
           fetch('../../api/users', {
                   		method: 'DELETE',
                   		headers:{'content-type': 'application/json; charset=UTF-8'},
                       }).then(res =>{
                       	if (res.status === 200){
                       	console.log('Выход прошёл успешно!');	
                       } else if (res.status === 400) {
                       	throw new Error("Ошибка выхода!")
                       }
                       }).catch(e=> alert(e));
            }


 function user_check(){//Функция выводящая в консоль список залогиненых пользователей
            fetch('../../api/users')
            .then(res =>{
            if (res.status === 200){
            console.log('Запрос списка пользователей прошёл успешно!');
            return res.json();
           } else if (res.status === 400) {
            throw new Error("Ошибка запроса списка пользователей!")
            }
            })
            .then(data=>{
            	console.log(data)
            })
            .catch(e=> alert(e));
    }    


 function start_game(){//Функция начала игры
           fetch('../../api/records', {
        		method: 'POST',
        		headers:{'content-type': 'application/json; charset=UTF-8'},
        		body:JSON.stringify({"game":"Сапёр"}),
            }).then(res =>{
            	if (res.status === 200){
            	console.log('Информация о начале игры успешно отправлена!');
            	return res.json();	
            } else if (res.status === 400) {
            	throw new Error("Не удалось отправить информацию о начале игры!")
            }
            })
            .then(data=>{
            	console.log(data);
            	id_game = data.id;
            })
            .catch(e=> alert(e));
        }  

 function record_list(){//Функция получения списка рекордов(не работает)
           fetch('../../api/records').then(res =>{
            	if (res.status === 200){
            	console.log('Список рекордов успешно получен!');
            	return res.json();	
            } else if (res.status === 400) {
            	throw new Error("Не удалось получить список рекордов!")
            }
            })
           .then(data=>{
            	console.log(data);
            })
           .catch(e=> alert(e));
        }  

 function end_game(){//Функция завершения игры

           fetch('../../api/records', {
        		method: 'PATCH',
        		headers:{'content-type': 'application/json; charset=UTF-8'},
        		body:JSON.stringify({"id":id_game,"score":123}),
            }).then(res =>{
            	if (res.status === 200){
            	console.log('Информация о завершении игры успешно отправлена!');	
            } else if (res.status === 400) {
            	throw new Error("Не удалось отправить информацию о завершении игры!")
            }
            }).catch(e=> alert(e));
        }  
 function send_message(){//Функция отправления сообщения
 	    let message = message_input.value;
           fetch('../../api/messages', {
        		method: 'POST',
        		headers:{'content-type': 'application/json; charset=UTF-8'},
        		body:JSON.stringify({"text":message}),
            }).then(res =>{
            	if (res.status === 200){
            	console.log('Сообщение успешно отправлено!');	
            } else if (res.status === 400) {
            	throw new Error("Не удалось отправить сообщение!")
            }
            }).catch(e=> alert(e));
        } 

  function recive_messages(){//Функция получения массива сообщений
           fetch('../../api/messages')
           .then(res =>{
            	if (res.status === 200){
            	console.log('Массив сообщений успешно получен!');
            	return res.json();	
            } else if (res.status === 400) {
            	throw new Error("Не удалось получить массив сообщений!")
            }
            })
            .then(data=>{
            	console.log(data);
            })
            .catch(e=> alert(e));
        }    