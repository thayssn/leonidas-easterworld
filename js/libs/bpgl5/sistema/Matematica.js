define(['./matematica/Interpolacoes'],function(interpolacoes) {

	var object={
		interpolacoes:interpolacoes,
		fatorConversaoGrausRadianos:Math.PI/180,
	};

	object.random = function(min, max) {
		return min+(max-min)*Math.random();
	}

	object.randomBoolean = function(probabilidade) {
		if (probabilidade==undefined)
			probabilidade=2;
		return Math.random()*probabilidade<1;
	}

	object.randomInt = function(min, max) {
		var i=Math.floor(object.random(min, max+1));
		if (i<min)
			return min;
		if (i>max)
			return max;
		return i;
	}

	object.distanciaSprites2D = function(a,b) {
		var dx=Math.abs(a.x.valor()-b.x.valor());
		var dy=Math.abs(a.y.valor()-b.y.valor());
		return Math.sqrt(dx*dx+dy*dy);
	}

	return object;

});