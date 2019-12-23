var users_data = {//все юзеры, в данном случае "Я" и "Собеседник" взято для примера
		users: ["Я", "Собеседник"]
}


window.onload=function(){
	
	var div1 = document.getElementById('send');//событие нажатия на кнопку "Отправить"
    div1.addEventListener('click', NewMessage, false);
	
	var div2 = document.getElementById('send2');//событие нажатия на кнопку "Отправить"
    div2.addEventListener('click', NewMessage2, false);
	
	
    function NewMessage() {//функция отрисовки отправленного своего сообщения в чате
		if (CheckMes()) {
			user = users_data.users[0];
		var message = document.querySelector('input');
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
			if (user=="Я")//частично реализована проверка на юзеров
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
		var message = document.querySelectorAll('input')[2];
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
			if (user=="Собеседник")//частично реализована проверка на юзеров
				{
					mes1.className="from_another"
					nameUser.className = "anotherName"
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
function CheckMes2() {//проверка своего пустого сообщения
	var message = document.querySelectorAll('input')[2];
	if (message.value=="")
	return false;
	else return true;
}

function CheckMes() {//проверка пустого сообщения от собеседника, в итоге она не потребуется
	var message = document.querySelector('input');
	if (message.value=="")
	return false;
	else return true;
}


 
 