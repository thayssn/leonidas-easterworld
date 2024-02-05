define(['./variavel/Constante','./variavel/Uniforme','./variavel/Acelerada','./variavel/Interpolada','./variavel/Senoide'],function(constante,uniforme,acelerada,interpolada,senoide) {

	var object={};

	object.criar = function(valor) {
		
		var object={
			val:constante.criar(0,valor?valor:0),
			min:null,
			max:null,
			ciclo:false
		}

		object.constante = function(v) {
			object.val=constante.criar(object.valor(),v);
		}

		object.uniforme = function(v) {
			if (object.val && object.val.velocidade && object.val.velocidade===v)
				return;
			object.val=uniforme.criar(object.valor(),v);
		}

		object.acelerada = function(v,aceleracao,minvel,maxvel) {
			if (object.val && object.val.aceleracao && object.val.aceleracao===aceleracao
				 && object.val.vel && object.val.vel===v)
				return;
			object.val=acelerada.criar(object.valor(),v,aceleracao,minvel,maxvel);
		}

		object.senoide = function(min,max,periodo) {
			object.val=senoide.criar(min,max,periodo);
		}

		object.calcular = function() {
			object.val.calcular();
		}

		object.valor = function() {
			var valor = object.val.valor();
			if (object.min!=null && object.max!=null) {
	    		if (!object.ciclo) {
	    			if (valor>object.max)
	    				valor=object.max;
	    			if (valor<object.min)
	    				valor=object.min;
	    		} else {
	    			var range=object.max-object.min;
	    			var deslocamento=valor-object.min;
	    			if (deslocamento>range) {
	    				valor=object.min+deslocamento%range;
	    			} else if (deslocamento<0) {
	    				valor=object.min+(deslocamento+range*1000000)%range;
	    			}
	    		}
	    	}
			return valor;
		}

		object.limite = function(min,max) {
			if (min>max) {
				var aux=min;
				min=max;
				max=aux;
			}
			object.min=min;
			object.max=max;
		}

		return object;
		
	}

	return object;

});