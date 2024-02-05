define([],function() {

	var tempoAbsoluto;

	var object={
	}

	object.tick = function() {
		tempoAbsoluto=new Date().getTime();
	}

	object.criar = function() {
		var object={
		};

		object.tempoRaw = function() {
			return tempoAbsoluto;
		}

		object.inicio=object.tempoRaw();

		object.reiniciar = function() {
			object.inicio=object.tempoRaw();
		}

		object.tempo = function() {
			return object.tempoRaw()-object.inicio;
		}

		object.segundos = function() {
			return object.tempo()/1000;
		}

		object.segundosInt = function() {
			return Math.floor(object.tempo()/1000);
		}

		return object;
	}

	object.tick();
	object.tempo=object.criar();

	return object;

});