define(['../Sistema'],function(sistema) {

	var object={};

	object.criar = function(nome,visao,controlador) {
		
		var object={
			nome: nome,
			chave: nome,
			cena: null,
			
			x:sistema.variavel.criar(),
			y:sistema.variavel.criar(),
			z:sistema.variavel.criar(),

			rx:sistema.variavel.criar(),
			ry:sistema.variavel.criar(),
			rz:sistema.variavel.criar(),

			sx:sistema.variavel.criar(1),
			sy:sistema.variavel.criar(1),
			sz:sistema.variavel.criar(1),

			a:sistema.variavel.criar(1),

			segundoAtual:0,
			quadroAtual:0
		};

		object.reiniciar = function() {
			object.tempo.reiniciar();
			object.segundoAtual=object.tempo.segundosInt();
		}

		object.quadro = function() {

			object.quadroAtual++;
			var segundoAtual=object.tempo.segundosInt();
			if (segundoAtual>object.segundoAtual) {
				object.segundoAtual=segundoAtual;
				if (object.controlador)
					object.controlador.segundo(object);
			}

			if (object.controlador)
				object.controlador.quadro(object);

			object.x.calcular();
			object.y.calcular();
			//object.z.calcular();

			//object.rx.calcular();
			//object.ry.calcular();
			object.rz.calcular();

			object.sx.calcular();
			object.sy.calcular();
			//object.sz.calcular();

			object.a.calcular();

			object.pixi_sprite.position.x = sistema.ambiente.largura2+object.x.valor()*sistema.ambiente.lado;
			object.pixi_sprite.position.y = sistema.ambiente.altura2-object.y.valor()*sistema.ambiente.lado;
			//object.pixi_sprite.position.z = object.z.valor();

			//object.pixi_sprite.rotation.x = object.rx.valor()*sistema.matematica.fatorConversaoGrausRadianos;
			//object.pixi_sprite.rotation.y = object.ry.valor()*sistema.matematica.fatorConversaoGrausRadianos;
			object.pixi_sprite.rotation = object.rz.valor()*sistema.matematica.fatorConversaoGrausRadianos;

			object.pixi_sprite.scale.x = object.sx.valor();
			object.pixi_sprite.scale.y = object.sy.valor();
			//object.pixi_sprite.scale.z = object.sz.valor();

			object.pixi_sprite.alpha = object.a.valor();
		}

		object.distancia2D = function(outroSprite) {
			return sistema.matematica.distanciaSprites2D(object,outroSprite);
		}

		object.contato = function(outroSprite) {
			var dx=Math.abs(object.x.valor()-outroSprite.x.valor());
			var dy=Math.abs(object.y.valor()-outroSprite.y.valor());
			var distx=(object.sx.valor()+outroSprite.sx.valor())/2;
			var disty=(object.sy.valor()+outroSprite.sy.valor())/2;
			return dx<distx && dy<disty;
		}

		object.clique = function(callback) {
			object.pixi_sprite.setInteractive(true);
			object.pixi_sprite.click = callback;
		}

		object.texture = PIXI.Texture.fromImage('img/'+visao+'.png');

		// gambi sinistra pra fazer o pixi acreditar que a textura é tamanho padrão "1" que corresponde ao lado da tela.
		object.texture.width = sistema.ambiente.lado;
		object.texture.height = sistema.ambiente.lado;
		object.texture.baseTexture.width = sistema.ambiente.lado;
		object.texture.baseTexture.height = sistema.ambiente.lado;

		object.texture = new PIXI.Texture(object.texture,new PIXI.Rectangle(0,0,sistema.ambiente.lado,sistema.ambiente.lado));

		object.pixi_sprite = new PIXI.Sprite(object.texture); 
				
		object.pixi_sprite.anchor.x = 0.5;
		object.pixi_sprite.anchor.y = 0.5;

		object.controlador = controlador;
		object.tempo = sistema.temporizador.criar();

		if (object.controlador)
			object.modelo=object.controlador.inicio(object);

		object.quadro();

		return object;
	}

	return object;

});