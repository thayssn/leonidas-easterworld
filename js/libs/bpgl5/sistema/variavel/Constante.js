define([],function() {

	var object={};

	object.criar = function(atual,val) {
		
		var object={
			val:val
		}

		object.calcular = function() {
		}

		object.valor = function() {
			return object.val;
		}

		return object;
	}

	return object;

});