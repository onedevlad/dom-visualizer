function id(id){
	return document.getElementById(id);
}

id("html").setAttribute("oninput", "reinput(this.value)");
window.frames[0].document.open();
window.frames[0].document.write("<p style='color: white'>Тут буде відображатись DOM-дерево</p>");
window.frames[0].document.close();

function reinput(text){
	text=text.replace(/src=\"[\S]*\"/gim, "src=''");
	text=text.replace(/href=\"[\S]*\"/gim, "href=''");
	text=text.replace("</body>", "<link rel='stylesheet' type='text/css' href='styles/iframe-styles.css'><script type='text/javascript' defer src='scripts/iframe_scripts.js'></script></body>");
	text=text.split(">\n").join(">");
	text=text.split("\n<").join("<");
	if(text.indexOf("</html>") > -1){
		text=text.slice(0, text.indexOf("</html>")+7);
	}
	window.frames[0].document.open();
	window.frames[0].document.write(text);
	window.frames[0].document.close();
}

//id("image").style.width="49%";
//id("html").style.width="49%";

var studying_on=false;
function resize(el){
	if(el === "image"){
		id("image").style.width="calc(100% - 20px)";
		id("html").style.width="0";
	}
	if(el === "html"){
		id("image").style.width="0";
		id("html").style.width="calc(100% - 20px)";
	}
	if(el === "mid"){
		id("image").style.width="calc(50% - 15px)";
		id("html").style.width="calc(50% - 15px)";
	}
	if(el === "studying"){
		if(studying_on){
			id("image").style.height="90%";
			id("html").style.height="90%";
			id("studying").style.height="0";
			studying_on=!studying_on;
		}
		else{
			id("image").style.height="52%";
			id("html").style.height="52%";
			id("studying").style.height="39%";
			studying_on=!studying_on;
		}
	}
}

function clear_dom_task_vars(){
	window.frames[0].window.fail=false;
	window.frames[0].window.correct_answers=0;
	window.frames[0].window.chosen_els=[];
	window.frames[0].window.marked_els=[];
	window.frames[0].window.answers={};
	if(!!window.frames[0].document.body.getAttribute("data-__DOM_id__")){
		window.frames[0].document.getElementById("__DOM_css__").innerHTML="";
		window.frames[0].document.getElementById("__DOM_css_marking__").innerHTML="";
		window.frames[0].document.getElementById("__DOM_selector__").value="";
		var marked=window.frames[0].document.getElementsByClassName("marked");
		var markedLength=marked.length;
		for(var i=0; i<markedLength; i++){
			marked[0].classList.remove('marked');
		}
	}
}

function create_new_task(){
	id("studying").innerHTML=id("studying").innerHTML+"<div class='task'><ul class='marked_elements'></ul><br/><ol class='correct_answers'></ol><b>Всього правильних відповідей: <span class='correct_answers_counter'>0</span></b></div>";
	clear_dom_task_vars();
}
create_new_task();

function remove_task(){
	document.querySelector("#studying .task:last-of-type").outerHTML="";
	clear_dom_task_vars();
}