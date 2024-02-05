define([],function() {

	var object={
		largura:800,
		altura:400
	};

	object.largura2=object.largura/2;
	object.altura2=object.altura/2;
	
	object.lado=Math.min(object.largura,object.altura);
	object.fatorLargura=object.largura/object.lado;
	object.fatorAltura=object.altura/object.lado;

	return object;

});