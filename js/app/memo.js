define(["../libs/bpgl5/bpgl5", "../../data/balance"], function (bp, balance) {
  var module = {};

  var HOW_MUCH_CARDS = 12;

  var cardImpl = function (qual) {
    console.log(qual);
  };

  module.cardClick = function (qual) {
    cardImpl(qual);
  };

  module.play = function () {
    //var ovni=document.getElementById("ovni");

    var cards = [];

    for (var i = 0; i < HOW_MUCH_CARDS; i++) {
      var card = {
        index: i,
        type: 1 + Math.floor(i / 2),
        element: $(".card" + i),
        model: viewModel.cards[i],
      };
      viewModel.cards[i].logic = card;
      cards.push(card);

      card.model.position(i);
      card.model.type(card.type);
    }

    var start = Date.now();
    var time = ko.observable(0);

    var frame = 0;
    var scoreSum = 0;
    var turn = 0;
    var game = viewModel.game();
    var canClick = false;
    var ultimaVirada = null;

    game.theme.subscribe(function () {
      game.showTheme(true);
      setTimeout(function () {
        game.showTheme(false);
      }, 3000);
    });

    var renderTime = function () {
      game.time(moment(time() * 1000).format("mm:ss"));
      var byTime = Math.floor(40 * game.level() - time());
      if (byTime < 0) byTime = 0;
      game.score(scoreSum + byTime);
    };

    game.memo = {};

    game.theme(3);
    game.score(0);
    game.level(1);
    renderTime();

    var viraTodas = function (val) {
      for (var i in viewModel.cards) {
        viewModel.cards[i].virado(val);
      }
    };

    var todasViradas = function () {
      for (var i in viewModel.cards) {
        if (!viewModel.cards[i].virado()) return false;
      }
      return true;
    };

    var todaFechadas = function () {
      for (var i in viewModel.cards) {
        if (viewModel.cards[i].virado()) return true;
      }
      return false;
    };

    var terminate = function () {
      var endGame = function () {
        if (game.score() < balance.collector_achievment) viewModel.goAgain();
        else viewModel.win();
      };

      if (viewModel.token()) {
        viewModel.sendScore(viewModel.gameCode(), game.score(), endGame);
      } else {
        endGame();
      }
    };

    var trocaCartas = function () {
      game.memo.troca(
        bp.sistema.matematica.randomInt(0, HOW_MUCH_CARDS - 1),
        bp.sistema.matematica.randomInt(0, HOW_MUCH_CARDS - 1)
      );
    };

    cardImpl = function (qual) {
      if (!canClick) {
        return;
      }
      if (cards[qual].model.virado()) {
        return;
      }

      var acertou;
      var comparada = ultimaVirada;
      if (ultimaVirada != null) {
        acertou = cards[qual].type == cards[ultimaVirada].type;
        ultimaVirada = null;
      } else {
        ultimaVirada = qual;
      }

      cards[qual].model.virado(1);

      if (acertou != undefined) {
        canClick = false;

        setTimeout(function () {
          canClick = true;
          if (!acertou) {
            cards[qual].model.virado(0);
            cards[comparada].model.virado(0);
            //bp.sistema.audio.play("memory_miss.ogg");
          } else {
            //bp.sistema.audio.play("memory_match.ogg");
            if (todasViradas()) {
              if (game.level() == 3) {
                terminate();
              } else {
                scoreSum = game.score();
                time(0);
                game.level(game.level() + 1);
                game.theme(4 - game.level());
                setTimeout(function () {
                  canClick = false;
                  trocas = 20;
                }, 3000);
                return;
              }
            }
          }

          if (game.level() == 2 && turn % 4 == 0) {
            trocas++;
          }
          if (game.level() == 3 && turn % 2 == 0) {
            trocas++;
          }

          turn++;
        }, 400);
      }
    };

    viraTodas(1);

    game.memo.troca = function (qual, porQual) {
      var p = cards[qual].model.position();
      cards[qual].model.position(cards[porQual].model.position());
      cards[porQual].model.position(p);

      //console.log("change "+qual+" to "+porQual);
    };

    var trocas = 20;

    gameIntervalId = setInterval(function () {
      frame++;
      if (trocas > 0) {
        trocas--;
        trocaCartas();

        if (trocas == 0 && todasViradas()) {
          viraTodas(0);
          canClick = true;
        }
      }

      if (canClick && trocas == 0) {
        time(time() + 0.2);
        renderTime();
      }
    }, 200);
  };

  return module;
});
