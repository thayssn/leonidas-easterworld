define([],function() {

	var object={
	};

	object.setup = function(renderer) {
		object.renderer=renderer;
	};

	object.quadro = function(scenegraph) {
		for(var cena in scenegraph.cenas)
	    	object.renderer.render(scenegraph.cenas[cena].stage);
	}

	return object;

});