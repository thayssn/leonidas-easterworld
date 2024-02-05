define([],function() {

	var object={
		teclas:{},
		teclasPressionadasAgora:{}
	};

	document.addEventListener('keydown', function(event) {
		object.teclas[event.keyCode]=true;
	});

	document.addEventListener('keyup', function(event) {
		object.teclas[event.keyCode]=false;
	});

	object.esquerda = function() {
		if (bp.sistema.entrada.teclado.teclas['37'])
			return true;
		else
			return false;
	};

	object.direita = function() {
		if (bp.sistema.entrada.teclado.teclas['39'])
			return true;
		else
			return false;
	};

	return object;

});