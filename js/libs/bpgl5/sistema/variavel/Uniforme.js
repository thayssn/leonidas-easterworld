define(['../Temporizador'],function(temporizador) {

	var object={};

	object.criar = function(atual,val) {
		
		var object={
			inicio:atual,
			velocidade:val,
			posicao:atual,
			tempo:temporizador.criar()
		}

		object.calcular = function() {
			object.posicao=object.inicio+object.velocidade*object.tempo.segundos()
		}

		object.valor = function() {
			return object.posicao;
		}

		return object;
	}

	return object;

});