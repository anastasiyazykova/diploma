function newEl(tag, parent){
	var el = document.createElement(tag);
	if(parent !== undefined){
		parent.appendChild(el);
	}
	return el;
}

GUESTION = 3

function generateQuestion(){
	var fields = [
		'Age', 'Gender', 'Name', 'Female', 'Banana', 'You are?', 'Agropequaria'
	];
	fields = fields.map(field => ({
		name: field,
		type: field.length < 5 ? 0 : 1
	}));
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
	var req = [];
	console.log(fields);
	for(var k in fields){
		req.push({id: +k, data: fields[k]});
	}
	console.log(req);
	req = await request({action: 'saveAnswer', fields: req, questionId: GUESTION});
	location.reload();
}

async function main(){
	var {fields} = await request({action: 'getQuestion', questionId: GUESTION});
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

async function main2(){
	Survey
		.StylesManager
		.applyTheme("modern");
	var {fields} = await request({action: 'getQuestion', questionId: GUESTION});
	console.log(fields);
	var json = {
		completedHtml: 'Yeah',
		pages: [],
		showQuestionNumbers: 'off'
	};
	var groups = {
		group0: {
			name: 'group0',
			elements: []
		},
		group1: {
			name: 'group1',
			elements: []
		}
	};
	json.pages = [groups.group0, groups.group1];
	for(var i = 0; i < fields.length; i++){
		var group = groups[`group${fields[i].type}`];
		group.elements.push({
				"type": "rating",
				"name": '' + fields[i].id,
				"title": fields[i].name
		})
	}
	window.survey = new Survey.Model(json);
	survey
		.onComplete
		.add(function (result) {
			onSubmit(result.data);
		});
	$("#surveyElement").Survey({model: survey});
}

window.onload = () => main2();
