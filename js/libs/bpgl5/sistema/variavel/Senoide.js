define(['../Temporizador'],function(temporizador) {

	var object={};

	object.criar = function(min,max,periodo) {
		
		var amplitude=(max-min);
		var centro=min+amplitude/2;

		var object={
			min:min,
			max:max,
			amplitude:amplitude,
			centro:centro,
			periodo:periodo,
			posicao:centro
		}

		object.calcular = function() {
			object.posicao=object.centro+object.amplitude*Math.sin((temporizador.tempo.segundos()/object.periodo)*(Math.PI));
		}

		object.valor = function() {
			return object.posicao;
		}

		return object;
	}

	return object;

});