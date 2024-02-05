define(["libs/bpgl5/bpgl5", "libs/knockout"], function (bp, ko) {
  var objeto = {};
  var cena;

  objeto.iniciar = function () {
    cena = bp.sg.cena.criar("jogo");
    bp.sg.adicionar(cena);
  };

  bp.criarCustom(objeto);

  return objeto;
});
