define(['./Util'],function(util) {

	var objeto={
		chave:"-"
	};

	objeto.setup = function(chave) {
		objeto.chave=chave;
	}

	objeto.postarPontuacao = function(valor,exibirRecordes) {

		var enviar = function() {
			util.post("https://www.bpixel.com.br/servlets/Comum15?tipoRegistro=highscores&dados=valor:"+valor+";jogo:"+objeto.chave+";versaojogo:1;dificuldade:0;user_name:"+objeto.nome+";user_id:0;pais:BR",
				null,
				function() {
					if (exibirRecordes==undefined || exibirRecordes) {

						util.dialogo(
							"Pontuação",
							"<iframe src='https://www.bpixel.com.br/score.html?jogo="+objeto.chave+"' width='170' height='380'></iframe>", {
								width: 220,
								height: 440,
								modal: true
							}
						);
					}
				},function(data) {
					console.log("Error. "+data);
				},true);
		}

		if (objeto.nome) {
			enviar();
		} else {
			util.dialogo(
				"Nome",
				"<input type='text' id='nome'></input>", 
				{
	                buttons: {
	                    'Ok': function() {
	                        objeto.nome = $('#nome').val();
	                        enviar();
	                    }
	                }
				});
		};

	};

	return objeto;
});