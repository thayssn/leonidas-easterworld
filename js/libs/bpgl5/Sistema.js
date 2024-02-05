define(['./sistema/Graficos',
	'./sistema/Ambiente',
	'./sistema/Variavel',
	'./sistema/Matematica',
	'./sistema/Medidas',
	'./sistema/Temporizador',
	'./sistema/Entrada',
	'./sistema/Audio',
	'./sistema/Util',
	'./sistema/Servico',
	'./sistema/Highsetup',
	'./sistema/Integracoes'],function(graficos,ambiente,variavel,matematica,medidas,temporizador,entrada,audio,util,servico,highsetup,integracoes) {

	var object={
		graficos:graficos,
		ambiente:ambiente,
		variavel:variavel,
		matematica:matematica,
		medidas:medidas,
		temporizador:temporizador,
		entrada:entrada,
		audio:audio,
		util:util,
		servico:servico,
		highsetup:highsetup,
		integracoes:integracoes
	};

	return object;

});