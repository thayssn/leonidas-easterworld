/**
* M�dulo Highsetup, respons�vel por carregar modelo de dados em formato BPML, e gerar objetos.
* 
* Para carregar o modelo, usar as fun��es carregar ou carregarURL.
* 
* Para gerar um objeto, usar a fun��o gerar.
* 
@class Highsetup
**/
define(["./Util","../../knockout"],function(util,ko) {

	var objeto={
		produto:ko.observable({}),
		escopos:ko.observableArray(),
		classes:ko.observable({}),
		configuracoes:ko.observable({}),
		valores:ko.observable({})
	};

	objeto.criarClasse=function(classes,nome,superclasses) {
		classes()[nome]=superclasses;
	}

	objeto.criarClasses=function(classes,modelo,superclasses) {
		if (modelo instanceof Array) {
			for (var i in modelo) {
				objeto.criarClasses(classes,modelo[i],superclasses);
			}
		} else if (typeof modelo == "object") {
			objeto.criarClasse(classes,modelo.nome,superclasses);
			superclasses=superclasses.slice();
			superclasses.push(modelo.nome);
			objeto.criarClasses(classes,modelo.filhas,superclasses);
		} else {
			objeto.criarClasse(classes,modelo,superclasses);
		}
	}

	objeto.extend = function (original, context, key) {
		for (key in context)
			if (context.hasOwnProperty(key))
				if (Object.prototype.toString.call(context[key]) === '[object Object]')
					original[key] = objeto.extend(original[key] || {}, context[key]);
				else
					original[key] = context[key];
		return original;
	};

/**
* Carrega os dados de configura��o, dados dois par�metros do tipo string (URL do arquivo de modelo e o de configura��es).
* 
* Ap�s chamar esta fun��o, ser� poss�vel gerar objetos.
* 
* A carga dos arquivos � feita de forma ass�ncrona, ou seja, ap�s executar esta fun��o, imediatamente os dados j� est�o carregados.
* 
* Exemplo de uso:
* 
* bp.sistema.highsetup.carregarURL("./dados/modelo.json","./dados/config.json");
* 
@method carregarURL
**/
	objeto.carregarURL = function(modelo, config) {
		util.post(modelo,null,function(dadosModelo) {
			util.post(config,null,function(dadosConfig) {
				objeto.carregar(ko.toJSON(dadosModelo),ko.toJSON(dadosConfig));
			},function(data) {
				console.log("File "+config+" not found. ");
				console.log(data);
			},false);
		},function(data) {
			console.log("File "+config+" not found. ");
			console.log(data);
		},false);
	}

/**
* Carrega os dados de configura��o, dados dois par�metros do tipo string (o modelo e o configura��es).
* 
* Ap�s chamar esta fun��o, ser� poss�vel gerar objetos.
* 
@method carregar
**/
	objeto.carregar = function(modelo, config) {
		objeto.classes({});
		objeto.criarClasses(objeto.classes,JSON.parse(modelo).modelo.classes,[]);

		objeto.escopos(JSON.parse(modelo).modelo.escopos);

		var configuracoes=JSON.parse(config).configuracoes;
		objeto.configuracoes(configuracoes);

		objeto.valores({});
		for (var i in configuracoes) {
			var config=configuracoes[i];
			var novo={};
			novo[config.escopo]={};
			novo[config.escopo][config.chave]={};
			novo[config.escopo][config.chave][config.classe]=config.valor;
			objeto.extend(objeto.valores(),novo);
		}
	}

/**
* Gera um objeto apartir das configura��es j� carregadas.
* 
* Recebe como par�metro um objeto que informa o contexto onde o objeto � gerado, este deve ter um campo para cada n�vel de escopo existente, que informa um "caminho" do contexto atual, o segundo par�metro � a classe do objeto a ser gerado.
* 
* Exemplo de uso:
* 
* bp.sistema.highsetup.gerar({"jogo":"Mario World","mundo":"3","fase":"2"},"tartaruga");
* 
@method gerar
**/
	objeto.gerar = function(contexto, classe) {
		var produto={};
		var superclasses=objeto.classes()[classe];
		if (!superclasses) {
			alert("Classe n�o encontrada: "+classe);
		} else {
			// para cada escopo
			// para cada superclasse
			// se houver config nesse escopo e nessa classe, extender
			for (var i in objeto.escopos()) {
				var escopo=objeto.escopos()[i];
				if (objeto.valores()[escopo]) { // existem dados definidos para esse escopo
					if (objeto.valores()[escopo][contexto[escopo]]) { // existem dados definidos para esta chave nesse escopo

						for (var c in superclasses) {
							var superclasse=superclasses[c];
							if (objeto.valores()[escopo][contexto[escopo]][superclasse]) { // existem dados definidos para esta superclasse nessa chave nesse escopo
								objeto.extend(produto,objeto.valores()[escopo][contexto[escopo]][superclasse]);
							}
						}

						if (objeto.valores()[escopo][contexto[escopo]][classe]) { // existem dados definidos para esta classe nessa chave nesse escopo
							objeto.extend(produto,objeto.valores()[escopo][contexto[escopo]][classe]);
						}
					}
				}
			}
		}
		return produto;
	}

	return objeto;
});