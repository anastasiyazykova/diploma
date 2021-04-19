function newEl(tag, parent){
	var el = document.createElement(tag);
	if(parent !== undefined){
		parent.appendChild(el);
	}
	return el;
}

GUESTION = 3;

function generateQuestion(){
	var fields = [
		{
			type: 'mark',
			title: 'Лекторы хороши?'
		},
		{
			type: 'mark',
			title: 'Лекторы хороши?'
		}
		
	];
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
	for(var k in fields){
		req.push({id: +k, data: fields[k]});
	}
	req = await request({action: 'saveAnswer', fields: req, questionId: GUESTION});
	location.reload();
}

async function main(){
	Survey
		.StylesManager
		.applyTheme("modern");
	var {fields} = await request({action: 'getQuestion', questionId: GUESTION});
	console.log(fields);
	var json = {
		completedHtml: 'Yeah',
		pages: [{
			name: 'page1',
			elements: fields.map(field => {
				if (field.data.type=='mark') {
					return {
						type: "rating",
            			name: '' + field.id,
						title: field.data.title,
						minRateDescription: "1",
						maxRateDescription: "5"
					}
				}
			})
		}],
		showQuestionNumbers: 'off'
	};
	window.survey = new Survey.Model(json);
	survey
		.onComplete
		.add(result => onSubmit(result.data));
	$("#surveyElement").Survey({model: survey});
}

window.onload = () => main();
