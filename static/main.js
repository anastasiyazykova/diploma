function newEl(tag, parent){
	var el = document.createElement(tag);
	if(parent !== undefined){
		parent.appendChild(el);
	}
	return el;
}

function generateQuestion(){
	var fields = [
		'Age', 'Gender', 'Name', 'Female', 'Banana', 'You are?', 'Agropequaria'
	];
	fields = fields.map(field => ({'name': field}));
	return {fields, action: 'saveQuestion'};
}

async function request(data){
	var h = new XMLHttpRequest();
	h.open('POST', '/api/', true);
	h.send(JSON.stringify(data));
	await new Promise(cb => h.onload = cb);
	return JSON.parse(h.responseText);
}

async function onSubmit(fields){
	var req = fields.map(field => ({id: field.id, data: field.value.value}));
	req = await request({action: 'saveAnswer', fields: req, questionId: 1});
	location.reload();
}

async function main(){
	var {fields} = await request({action: 'getQuestion', questionId: 1});
	for(var field of fields){
		var name = newEl('span', cont);
		name.classList.add('name');
		name.innerText = field.name;
		var value = newEl('input', cont);
		value.classList.add('value');
		field.value = value;
	}
	var but = newEl('button', cont);
	but.classList.add('submit');
	but.innerText = 'Submit!';
	but.onclick = () => onSubmit(fields);
}

window.onload = () => main();
