define(['../Temporizador'],function(temporizador) {

	var TICKS_POR_SEGUNDO=30;

	var object={};

	object.criar = function(atual,vel,aceleracao,minvel,maxvel) {
		
		var object={
			inicio:atual,
			velocidadeInicial:vel,
			velocidade:vel,
			posicao:atual,
			tempo:temporizador.criar(),
			aceleracao:aceleracao,
			minvel:minvel,
			maxvel:maxvel,
			ticks:0
		}

		object.calcular = function() {
			while (object.ticks<=object.tempo.segundos()*TICKS_POR_SEGUNDO) {
				object.ticks++;
				object.velocidade=object.velocidadeInicial+object.aceleracao*object.tempo.segundos();
				
				if (object.velocidade>object.maxvel)
					object.velocidade=object.maxvel;
				if (object.velocidade<object.minvel)
					object.velocidade=object.minvel;

				object.posicao+=object.velocidade/TICKS_POR_SEGUNDO;
			}
		}

		object.valor = function() {
			return object.posicao;
		}

		return object;
	}

	return object;

});