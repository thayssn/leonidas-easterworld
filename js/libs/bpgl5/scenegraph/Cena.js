define(['../Sistema','../../knockout'],function(sistema,ko) {

	var object={};

	object.criar = function(nome) {
		
		var object={
			stage : new PIXI.Stage(0x212121, true),
			nome : nome,
			chave: nome,
			sprites : [],
			indiceSprites : new sistema.util.indice()
		};

		object.adicionar = function(sprite) {
			object.stage.addChild(sprite.pixi_sprite);
			object.sprites.push(sprite);
			object.indiceSprites.push(sprite);
			sprite.cena=object;
		}

		object.remover = function(sprite) {
			object.stage.removeChild(sprite.pixi_sprite);
			var index=object.sprites.indexOf(sprite);
			if (index>-1)
				object.sprites.splice(index,1);
		}

		object.quadro = function() {
			for(var sprite in object.sprites) {
		    	object.sprites[sprite].quadro();
			}
		}

		object.obterSprites = function(nome) {
			return object.indiceSprites.obter(nome);
			/*return ko.utils.arrayFilter(object.sprites,function(item) {
				return item.nome===nome;
			});*/
		}

		object.obterSprite = function(nome) {
			return object.indiceSprites.obterPrimeiro(nome);
			/*var sprites=object.obterSprites(nome);
			if (sprites.length) {
				return sprites[0];
			}
			return null;*/
		}

		return object;
	}

	return object;

});