define(['./scenegraph/Cena','./scenegraph/Sprite','./sistema/Util','../knockout'],function(cena,sprite,util,ko) {

	var object={
		cena : cena,
		sprite : sprite,
		cenas : [],
		indice : util.indice()
	};

	object.adicionar = function(cena) {
		object.cenas.push(cena);
	}

	object.quadro = function() {
		for(var cena in object.cenas) {
	    	object.cenas[cena].quadro();
		}
	}

	object.obterCenas = function(nome) {
		return ko.utils.arrayFilter(object.cenas,function(item) {
			return item.nome===nome;
		});
	}

	object.obterCena = function(nome) {
		var cenas=object.obterCenas(nome);
		if (cenas.length) {
			return cenas[0];
		}
		return null;
	}

	return object;

});