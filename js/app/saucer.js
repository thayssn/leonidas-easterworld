define(["../libs/bpgl5/bpgl5", "../../data/balance"], function (bp, balance) {
  var module = {};

  module.play = function () {
    var ovni = document.getElementById("ovni");
    var hat = document.getElementById("hat");
    var light = document.getElementById("light");
    ovni.style.position = "relative";

    viewModel.cleanGameScene();

    viewModel.gameplay({
      x: 0,
      vx: 0,
      limitvx: 1,
      minvx: 0.1,
      anterior: Date.now(),
      start: Date.now(),
      trepida: 0,
      delta: 0,
      breakingTime: 0,
      ovos: [],
    });

    var g = viewModel.gameplay();
    var game = viewModel.game();

    game.theme.subscribe(function () {
      game.showTheme(true);
      setTimeout(function () {
        game.showTheme(false);
      }, 3000);
    });

    viewModel.tutorial(true);
    game.lifes(3);
    game.score(0);
    game.theme(0);
    game.theme(1);
    game.level(1);

    var l = 1,
      factor = 1;

    var updateL = function () {
      l = Math.min($("#playing").height(), $("#playing").width());
      factor = l;
    };
    updateL();

    breakItBad = function () {
      g.breakingTime = g.anterior;
    };
    var breakingRange = 2000;
    var breaking = false;
    var frame = 0;
    var time = 0;

    var size = 0.2;
    var halfScreen = 1;
    var nextSpawn = Date.now();
    var death_shake = 0.03;

    var hashSize = 8;
    var hash = new Array(hashSize);
    var hashOrder = 1;

    gameIntervalId = setInterval(function () {
      var now = Date.now();
      g.delta = (now - g.anterior) / 1000.0;
      g.anterior = now;

      frame++;
      time = now - g.start;

      ovni.style.top =
        factor * 0.5 +
        (breaking
          ? bp.sistema.matematica.random(-death_shake, death_shake) * factor
          : balance.ufo_bounce *
            0.05 *
            factor *
            Math.sin((((now % 1000) - 500) / 1000) * 2 * Math.PI)) +
        "px";

      if (g.breakingTime != 0) {
        breaking = g.breakingTime > now - breakingRange;

        if (breaking == false) {
          game.lifes(game.lifes() - 1);
          g.breakingTime = 0;

          if (game.lifes() < 0) {
            viewModel.cleanGameScene();

            var endGame = function () {
              if (game.score() < balance.collector_achievment)
                viewModel.goAgain();
              else viewModel.win();
            };

            if (viewModel.token()) {
              viewModel.sendScore(viewModel.gameCode(), game.score(), endGame);
            } else {
              endGame();
            }
          }
        }
      }

      if (frame % 10 == 0) {
        var halfScreen = $("#playing").width() / 2;

        updateL();

        $(".player").width(0.2 * factor);
        $(".player").height(0.4 * factor);

        for (var i in g.ovos) {
          var ovo = g.ovos[i];
          if (!ovo) continue;
          $(ovo.element).width(ovo.data.width * factor);
          $(ovo.element).height(ovo.data.height * factor);
        }
      }

      if (nextSpawn && nextSpawn < now) {
        var type =
          !viewModel.tutorial() &&
          bp.sistema.matematica.randomBoolean(2.0 / balance.items_frequency)
            ? game.score() > balance.limit_score ||
              time > balance.limit_time ||
              bp.sistema.matematica.randomBoolean(
                balance.limit_score /
                  game.score() /
                  balance.dificulty_factor /
                  (time / (balance.limit_time / 2))
              ) ||
              bp.sistema.matematica.randomBoolean(5.0 / balance.bad_frequency)
              ? "bad"
              : "good"
            : "scenery";

        var object = viewModel.balance.elements[game.theme()][type];
        object = object[bp.sistema.matematica.randomInt(0, object.length - 1)];

        var ovo1 = $(
          "<div style=\"background-image: url('./game_img/" +
            object.name +
            ".png')\">"
        );

        if (object.name.indexOf("morrinho") != -1)
          $(ovo1).insertAfter($("#back2Reference"));
        else $(ovo1).insertAfter($("#backReference"));

        var rangeX = 0.9;

        ovo1.css({ top: -1000, left: 0, position: "absolute" });
        var ovo = {
          element: ovo1[0],
          data: {
            x: bp.sistema.matematica.random(-rangeX / 2, rangeX / 2),
            y: 0,
            vy:
              0.3 * balance.stage_speed +
              (balance.stage_speed_increase * time) / 120000,
            timeout: 0,
            type: type,
            name: object.name,
            width: object.width,
            height: object.height,
            start: Date.now(),
          },
        };
        g.ovos.push(ovo);

        if (ovo.data.type == "scenery") {
          var hashSort = Date.now() % hashSize;
          var order = hashOrder + 1;
          while (hash[hashSort] && hash[hashSort] == order - 1) {
            hashSort = (hashSort + 1) % hashSize;
          }
          hashOrder++;
          hash[hashSort] = order;
          //console.log(hash[hashSort]+" "+hashSort+" "+(((hashSort+0.5)/hashSize)-0.5)+" "+((hashSort/hashSize)-0.5)*rangeX);

          var pieceSize = rangeX / hashSize;
          ovo.data.x =
            ((hashSort + 0.5) / hashSize - 0.5) * rangeX +
            bp.sistema.matematica.random(-pieceSize / 2, pieceSize / 2);
        }

        ovo.element.style.left =
          halfScreen + (ovo.data.x - size / 2) * factor + "px";

        nextSpawn =
          now +
          bp.sistema.matematica.random(
            50 * balance.frequency,
            500 * balance.frequency
          );
      }

      var deg =
        g.vx * 30 +
        (balance.ufo_bounce * 20 -
          Math.abs((balance.ufo_bounce * 0.02 * g.vx) / g.limitvx)) *
          Math.sin((((now % 2000) - 1000) / 2000) * 2 * Math.PI);
      if (hat.style.transform != undefined)
        hat.style.transform = "rotate(" + deg + "deg)";
      else {
        hat.style["-webkit-transform"] = "rotate(" + deg + "deg)";
        hat.style["-moz-transform"] = "rotate(" + deg + "deg)";
      }
      var esq = bp.sistema.entrada.teclado.esquerda();
      var dir = bp.sistema.entrada.teclado.direita();

      if (Math.abs(g.vx) > 0.001) g.vx /= 1 + 2 * g.delta * balance.ufo_break;

      if (!breaking && esq == !dir) {
        if (viewModel.tutorial()) {
          viewModel.tutorial(false);
        }
        if (esq) {
          g.vx -= 1 * g.delta * balance.ufo_acceleration;
          if (g.vx < -g.limitvx) g.vx = -g.limitvx;
          if (g.vx > -g.minvx) g.vx = -g.minvx;
        }
        if (dir) {
          g.vx += 1 * g.delta * balance.ufo_acceleration;
          if (g.vx > g.limitvx) g.vx = g.limitvx;
          if (g.vx < g.minvx) g.vx = g.minvx;
        }
      }
      g.x += g.vx * g.delta * balance.ufo_speed;
      if (g.x > 0.5) g.x = 0.5;
      if (g.x < -0.5) g.x = -0.5;

      ovni.style.left =
        $("#playing").width() / 2 +
        (g.x - size / 2) * factor +
        (breaking
          ? bp.sistema.matematica.random(-death_shake, death_shake) * factor
          : 0) +
        "px";

      for (var i in g.ovos) {
        var ovo = g.ovos[i];
        if (!ovo) continue;
        ovo.data.y = -0.5 + (ovo.data.vy * (now - ovo.data.start)) / 1000 - 0.2;
        ovo.element.style.top = ovo.data.y * factor + "px";
        ovo.element.style.left =
          halfScreen + (ovo.data.x - size / 2) * factor + "px";

        if (
          ovo.data.y > 1.2 ||
          (ovo.data.timeout != 0 && ovo.data.timeout < now)
        ) {
          $(ovo.element).remove();
          g.ovos[i] = null;
        }

        if (ovo.data.type == "scenery") {
        } else if (
          ovo.data.timeout == 0 &&
          !breaking &&
          ovo.data.y > 0.7 &&
          ovo.data.y < 0.85 &&
          Math.abs(ovo.data.x - g.x) < 0.08
        ) {
          if (ovo.data.type == "good") {
            game.score(game.score() + balance.egg_points);
          } else {
            breakItBad();
            //bp.sistema.audio.play("ufo_break.ogg");
          }

          game.level(
            Math.floor(game.score() / 90) * 3 +
              (game.score() % 90 < 30 ? 1 : game.score() % 90 < 60 ? 2 : 3)
          );
          game.theme(
            game.score() % 90 < 30 ? 1 : game.score() % 90 < 60 ? 2 : 3
          );

          ovo.data.vy = -0.0;
          ovo.data.timeout = now + 2000;
          bp.sistema.audio.play("quick_abduction.ogg");

          if (ovo.data.name.indexOf("passarinho") != -1)
            bp.sistema.audio.play("abduct_bird.ogg");
          if (ovo.data.name.indexOf("coelho") != -1)
            bp.sistema.audio.play("abduct_rabbit.ogg");
          if (ovo.data.name.indexOf("ovelha") != -1)
            bp.sistema.audio.play("abduct_sheep.ogg");

          $(".player").addClass("abduzindo");
          setTimeout(function () {
            $(".player").removeClass("abduzindo");
          }, 200);
        }
      }

      g.ovos = bp.sistema.util.cleanArray(g.ovos, null);
    }, 1000 / 30);
  };

  return module;
});
