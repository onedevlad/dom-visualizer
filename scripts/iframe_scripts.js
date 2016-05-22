/********************** EDITABLE BLOCK ****************************/

var block_width=120;// Width of a single block (px)
var block_height=40;// Height of a single block (px)
var block_margin_top=80;// Vertical margins (px)
var block_margin_left=20;// Horizontal margins (px)
var field_padding_top=0;// A top padding of a rendering field (px)
var field_padding_left=10;// A left padding of a rendering field (px)
var exeptions={
	">>": true,
	">~": true,
	">+": true,

	"+>": true,
	"++": true,
	"+~": true,

	"~>": true,
	"~+": true,
	"~~": true,
	"odd(": true,
	"even(": true,
	"()": true,
};

var last_chars_exeptions={
	">": true,
	" ": true,
	"+": true,
	"~": true,
	":": true,
	",": true,
}

/************************ DO NOT EDIT BELOW THIS POINT ******************************/

var taken_ids=0;
var els={};
var marked_els=[];
var chosen_els=[];
var answers={};
var correct_answers=0;
var fail=false;
var exept_selectors="[id^='__DOM_'][id$='__'], [class^='__DOM_'][class$='__'], meta, script, style, link";

function id(id){
	return document.getElementById(id);
}

function rerender(){
	if(!!id("__DOM_styles__")){id("__DOM_styles__").outerHTML="";}
	var __DOM_styles__=document.createElement("style");
	__DOM_styles__.type="text/css";
	__DOM_styles__.id="__DOM_styles__";
	document.head.appendChild(__DOM_styles__);
	var __DOM_jquery__=document.createElement("script");
	__DOM_jquery__.type="text/javascript";
	__DOM_jquery__.id="__DOM_jquery__";
	__DOM_jquery__.src="scripts/jquery.js";
	document.head.appendChild(__DOM_jquery__);
	var __DOM_select__=document.createElement("P");
	__DOM_select__.id="__DOM_select__";
	document.body.appendChild(__DOM_select__);
	var __DOM_css__=document.createElement("style");
	__DOM_css__.type="text/css";
	__DOM_css__.id="__DOM_css__";
	document.head.appendChild(__DOM_css__);
	var __DOM_css_marking__=document.createElement("style");
	__DOM_css_marking__.type="text/css";
	__DOM_css_marking__.id="__DOM_css_marking__";
	document.head.appendChild(__DOM_css_marking__);
	var __DOM_overlay__=document.createElement("DIV");
	__DOM_overlay__.id="__DOM_overlay__";
	document.body.appendChild(__DOM_overlay__);
	var __DOM_title__=document.createElement("DIV");
	__DOM_title__.id="__DOM_title__";
	document.body.appendChild(__DOM_title__);
	//rendering
	id("__DOM_jquery__").onload=function(){
		$("#__DOM_select__").html("$(\" <input type='text' id='__DOM_selector__'> \");");
		$("#__DOM_selector__").on("input", function(){
			//$("#__DOM_css__").html("");
			$(".__DOM_block__").removeClass("chosen");
			chosen_els=[];
			var fail=false;
			var script_value=$("#__DOM_selector__").val().split("\'").join("").split("\"").join("");
			try{
				var code=script_value.split(",").join(",[data-hilighting_allowed=true]").split(">").join(">[data-hilighting_allowed=true]").split(" ").join(" [data-hilighting_allowed=true]").split("+").join("+[data-hilighting_allowed=true]").split("~").join("~[data-hilighting_allowed=true]");
				code="$('[data-hilighting_allowed=true]"+code+"')";
				var el=eval(code);
			}
			catch(e){
				return;
			}
			var statement=true;
			for(e in exeptions){
				if(script_value.indexOf(e) !== -1){
					statement=false;
					break;
				}
			}
			for(e in last_chars_exeptions){
				if(script_value.charAt(-1) === e){
					statement=false;
					break;
				}
			}
			if(el.length > 0 && script_value.length > 0 && statement && script_value.charAt(-1) !== ">"){
				setTimeout(function(){
					for(var i=0; i<el.length; i++){
						if($(el[i]).get(0).tagName.toLowerCase() === $(el[i]).html().toLowerCase()){
							if(script_value.toLowerCase().indexOf($(el[i]).get(0).tagName.toLowerCase()) > -1){//User is calling a non-existent element (created from text node) by it's name
								return;
							}
							if($(el[i]).prev().length > 0){
								el[i]=el[i].previousSibling;
							}
							else if($(el[i]).next().length > 0){
								el[i]=el[i].nextSibling;
							}
							else{
								continue;
							}
						}
						var tmp=$(el[i]).attr("data-__DOM_id__");
						if(!!tmp){
							chosen_els[tmp]=true;
							$("#__DOM_block_"+tmp+"__").addClass("chosen");
							//$("#__DOM_css__").html($("#__DOM_css__").html()+"#__DOM_block_"+tmp+"__{-webkit-animation: pulsate 1.5s linear infinite !important; animation: pulsate 1.5s linear infinite !important;}\n");
						}
					}
					if(!!answers[script_value]){
						fail=true;
					}
					if(marked_els.length === 0){
						fail=true;
					}
					else{
						for(var j=0; j<marked_els.length; j++){
							if(marked_els[j] !== chosen_els[j]){
								fail=true;
							}
						}
					}
					if(marked_els.length !== chosen_els.length){
						fail=true;
					}
					if(!fail){
						answers[script_value]=true;
						window.parent.document.querySelector("#studying .task:last-of-type .correct_answers_counter").innerHTML=++correct_answers;
						window.parent.document.querySelector("#studying .task:last-of-type .correct_answers").innerHTML=window.parent.document.querySelector("#studying .task:last-of-type .correct_answers").innerHTML+"<li class='answer'>Вирішено: $(\""+script_value+"\")</li>";
					}
				}, 0);
			}
	});
		function analyze(){
			$("*:not("+exept_selectors+")").contents().filter(function(p){if(!!this.data){if(this.nodeType === 3 && !!this.data.split("\n").join("").split("\t").join("").split("\r").join("").split(" ").join("").length){$(this).wrap("<div data-__DOM_text_node_value__='"+this.data+"' data-__DOM_text_node__='true'></div>")}}});
			$("*:not("+exept_selectors+")").each(function(i, el){
				taken_ids++;
				$(this).attr("data-__DOM_id__", taken_ids);
				if(!$(this).attr("data-__DOM_text_node__")){
					$(this).attr("data-hilighting_allowed", "true");
				}
				var this_left=0;
				var this_top=50;
				if($(this).get(0).tagName.toUpperCase() !== "HTML"){
					var this_left=(($(this).index()*block_width)+($(this).index()*block_margin_left))+(els[$(this).parent().attr("data-__DOM_id__")].left);
					if($(this).prev().length >= 1){
						if(!!els[$(this).prev().attr("data-__DOM_id__")]){
							if(els[$(this).prev().attr("data-__DOM_id__")].right_margin > 0){
								this_left=els[$(this).prev().attr("data-__DOM_id__")].right_margin;
							}
							else{
								this_left=els[$(this).prev().attr("data-__DOM_id__")].left+block_width+block_margin_left;
							}
						}
						else{
							this_left=0;
						}
					}
					var this_top=els[$(this).parent().attr("data-__DOM_id__")].top+block_margin_top+block_height;
				}
				els[taken_ids]={};
				els[taken_ids].left=this_left;
				els[taken_ids].top=this_top;
				els[taken_ids].right_margin=0;
				els[taken_ids].h_line_width=0;
				if($(this)[0].tagName.toUpperCase() !== "HTML"){
					var margin_right=0;
					var margin_offset=0;
					if($(this).parent().length > 0){
						if($(this).children().length === 0 && $(this).attr("data-__DOM_id__") === $(this).parent().children().last().attr("data-__DOM_id__")){//The last and empty
							$(this).parents().each(function(){
								if(!!els[$(this).parent().attr("data-__DOM_id__")]){
									els[$(this).attr("data-__DOM_id__")].right_margin=(this_left+block_width+block_margin_left);
								}
							});
						}
					}
					els[$(this).parent().attr("data-__DOM_id__")].h_line_width=this_left-els[$(this).parent().attr("data-__DOM_id__")].left;
				}
				if($("*:not("+exept_selectors+")").length-1 === i){
					taken_ids=0;
					render();
				}
			});
		}
		function render(){
			$("*:not("+exept_selectors+")").each(function(i, el){
				taken_ids++;
				if(!!$(this).attr("data-__DOM_text_node__")){
					var cur_tag_name=$(this).attr("data-__DOM_text_node_value__");
				}
				else{
					var cur_tag_name=$(this).get(0).tagName.toUpperCase();
				}
				if(cur_tag_name !== "HTML"){
					var __DOM_line__=document.createElement("DIV");
					__DOM_line__.className="__DOM_line__";
					__DOM_line__.id="__DOM_line_"+taken_ids+"__";
					__DOM_line__.title=cur_tag_name;
					document.body.appendChild(__DOM_line__);
					$(__DOM_line__).css({"width": "1px"});
					$(__DOM_line__).css({"height": (block_margin_top/2)+"px"});
					$(__DOM_line__).css({"left": (field_padding_left+els[taken_ids].left+(block_width/2))+"px"});
					$(__DOM_line__).css({"top": (field_padding_top+els[taken_ids].top-(block_margin_top/2))+"px"});
				}
				if($(this).children().not(exept_selectors).length > 0){
					var __DOM_line__=document.createElement("DIV");
					__DOM_line__.className="__DOM_line__";
					__DOM_line__.id="__DOM_line_"+taken_ids+"__";
					__DOM_line__.title=cur_tag_name;
					document.body.appendChild(__DOM_line__);
					$(__DOM_line__).css({"width": "1px"});
					$(__DOM_line__).css({"height": (block_margin_top/2)+"px"});
					$(__DOM_line__).css({"left": (field_padding_left+els[taken_ids].left+(block_width/2))+"px"});
					$(__DOM_line__).css({"top": (field_padding_top+els[taken_ids].top+block_height)+"px"});
				}
				if($(this).children().not(exept_selectors).length > 1){
					var __DOM_line__=document.createElement("DIV");
					__DOM_line__.className="__DOM_line__";
					__DOM_line__.id="__DOM_line_"+taken_ids+"__";
					document.body.appendChild(__DOM_line__);
					$(__DOM_line__).css({"width": els[taken_ids].h_line_width});
					$(__DOM_line__).css({"height": "1px"});
					$(__DOM_line__).css({"left": (field_padding_left+els[taken_ids].left+(block_width/2))+"px"});
					$(__DOM_line__).css({"top": (field_padding_top+els[taken_ids].top+block_height+(block_margin_top/2))+"px"});
				}

				var el_id=$(this).attr("id");
				if(!el_id){el_id="";}
				else{el_id="#"+el_id}
				var el_cls=$(this).attr("class");
				if(!el_cls){el_cls="";}
				else{el_cls="."+el_cls}

				var __DOM_block__=document.createElement("DIV");
				__DOM_block__.className="__DOM_block__";
				__DOM_block__.id="__DOM_block_"+taken_ids+"__";
				document.body.appendChild(__DOM_block__);

				__DOM_block__.innerHTML="<span class='__DOM_tag_name__'>"+cur_tag_name+"</span>";
				__DOM_block__.innerHTML+="<span class='__DOM_tag_attrs__'><span class='__DOM_tag_id_attr__'>"+el_id+"</span><span style='"+(el_id?"":"top: 0;")+"' class='__DOM_tag_class_attr__'>"+el_cls+"</span></span>";

				$(__DOM_block__).css({
					"width": block_width+"px",
					"height": block_height+"px",
					"left": (field_padding_left+els[$(this).attr("data-__DOM_id__")].left)+"px",
					"top": (field_padding_top+els[$(this).attr("data-__DOM_id__")].top)+"px",
					"font-size": (block_height/2)+"px",
				});

				$(__DOM_block__).on("contextmenu", function(){
					var cur_id=parseFloat($(this).attr("id").replace("__DOM_block_", "").replace("__", ""));
					if(window.parent.document.querySelectorAll("#studying .task").length > 0 && !!$("[data-__DOM_id__="+cur_id+"]").attr("data-hilighting_allowed")){
						for(var j=0; j<marked_els.length; j++){
							if(marked_els[j]){
								$("#__DOM_block_"+j+"__").removeClass("marked");
							}
						}

						if(marked_els[cur_id]){
							delete marked_els[cur_id];
							window.parent.document.querySelector("#studying .task:last-of-type [data-__DOM_id__='"+cur_id+"']").outerHTML="";
						}
						else{
							marked_els[cur_id]=true;
							window.parent.document.querySelector("#studying .task:last-of-type .marked_elements").innerHTML=window.parent.document.querySelector("#studying .task:last-of-type .marked_elements").innerHTML+"<li data-__DOM_id__='"+cur_id+"'>"+$(this).children(".__DOM_tag_name__").html()+"</li>";
						}
						setTimeout(function(){
							for(var j=0; j<marked_els.length; j++){
								if(marked_els[j]){
									$("#__DOM_block_"+j+"__").addClass("marked");
								}
							}
						}, 0);
						return false;
					}
				});
			});
		}
		analyze();
	}
}

rerender();