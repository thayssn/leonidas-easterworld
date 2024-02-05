/**
* Módulo BPGL5, base da engine. Apartir deste módulo são chamados outros módulos, como Scenegraph e Sistema.
* 
* Neste módulo é criado o renderer da engine PIXI, o Canvas, e o loop principal que será repassado ao módulo principal do jogo.
* 
@module bpgl5
@class bpgl5
**/

define(['./Scenegraph','./Sistema'],function(scenegraph,sistema) {

	var objeto={
		scenegraph:scenegraph,
		sg:scenegraph,
		sistema:sistema,
		jogo:null
	};

	bp=objeto;

	window.width = window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth;
    window.height = window.innerHeight ||
                 document.documentElement.clientHeight ||
                 document.body.clientHeight;

    if (typeof PIXI == 'undefined') {
    	console.log("PIXI not found.");
    } else {
		var pixi_renderer = PIXI.autoDetectRenderer(sistema.ambiente.largura, sistema.ambiente.altura);
		
		var canvas=document.getElementById("canvas");
		if (!canvas)
			canvas=document.body;
		canvas.appendChild(pixi_renderer.view);

		sistema.graficos.render.setup(pixi_renderer);
	}

	objeto.ciclo=function(jogo) {
	    sistema.temporizador.tick();

	    scenegraph.quadro();

	    if (jogo.quadro)
	    	jogo.quadro();

	    sistema.graficos.render.quadro(scenegraph);
	}

	objeto.criar=function(jogo) {
		objeto.jogo=jogo;
		
		requestAnimFrame( animate );

		jogo.iniciar();
		function animate() {
		    requestAnimFrame( animate );

		    objeto.ciclo(jogo);
		}
	}

	objeto.criarCustom=function(jogo) {
		jogo.idInterval = setInterval(function() {
			objeto.ciclo(jogo);
			console.log("frame");
		}, 1000 / 30);
	}

	objeto.pararCustom=function(jogo) {
		if (!jogo || !jogo.idInterval)
			console.log("Can't stop a game that has not started.");
		clearInterval(jogo.idInterval);
	}

	return objeto;
});