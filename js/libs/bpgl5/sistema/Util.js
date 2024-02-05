define([],function() {

	var objeto={};

	objeto.post = function(url, data, callback, callbackFalha, async) {
		if (typeof async == 'undefined')
			async=true;
		$.ajax({
			url:url,
			type:"POST",
			data:data,
			async:async,
			contentType:"application/json; charset=utf-8",
			success: function(data) {
				if (callback)
					callback(data);
			},
			error: function(data) {
				if (callbackFalha)
					callbackFalha(data);
				alert("Something is wrong over here, it was not suposed to happen.\nMaybe '"+url+"' is missing, invalid, or not available right now. The game will not run properly!");
			}
		});
	};

	objeto.indice = function() {
		var indice=this;
		this.objetos=[];

		this.push = function(objeto) {
			if (indice.objetos[objeto.chave]) {
				indice.objetos[objeto.chave].push(objeto);
			} else {
				indice.objetos[objeto.chave]=[objeto];
			}
		}

		this.obter = function(chave) {
			return indice.objetos[chave];
		}

		this.obterPrimeiro = function(chave) {
			var todos=indice.objetos[chave];
			if (!todos)
				return null;	
			return todos[0];
		}
	};

	objeto.dialogo = function(titulo, html, config) {
		$( "#dialog-modal" ).attr("title",titulo);
		$( "#dialog-modal" ).html(html);  	
		$( "#dialog-modal" ).dialog(config);
	}

	objeto.cleanArray = function(array,deleteValue) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] == deleteValue) {         
				array.splice(i, 1);
				i--;
			}
		}
		return array;
	};


	return objeto;
});