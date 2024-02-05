require(["app/setup"], function (setup) {
  var Anim = {},
    mobile = setup.mobile,
    clicaveis = [];

  function debug(texto) {
    if (!$("#debug")[0]) {
      $("body").append('<div id="debug"></div>');
    }
    $("#debug").text(texto);
  }

  if (mobile) {
    $("#tutorial").remove();
  }

  var posicaoModal = function () {
    if (!mobile) {
      $(".modal .janela").each(function () {
        var janela = $(this);
        var pai = $(this).parent();
        var alturaPai = pai.outerHeight();
        var altura = $(this).outerHeight();
        if (alturaPai < altura) {
          $(this).css({ marginTop: 0, top: 0 });
          $(".aba", pai).css({ marginTop: 0, top: 0 });
        } else {
          $(this).css({ marginTop: -(altura / 2), top: "50%" });
          $(".aba", pai).css({ marginTop: -(altura / 2), top: "50%" });
        }
        $(".aba.esquerda", pai).css({
          marginLeft: function () {
            return -(janela.width() / 2 + 26 + $(this).width()) + "px";
          },
        });
        $(".aba.direita", pai).css({
          marginLeft: function () {
            return +(janela.width() / 2 + 16) + "px";
          },
        });
      });
    } else {
      $(".modal").each(function () {
        if ($(this).hasClass("beginning")) {
          $(".aba", this).css({ margin: 0, top: "260px" });
          $(".aba.direita", this).css({ margin: 0, left: "51%" });
          $(".aba.esquerda", this).css({ margin: 0, left: "2%" });
        }
        if ($(this).hasClass("information")) {
          $(".aba.direita", this).css({ margin: 0, left: "51%" });
          $(".aba.esquerda", this).css({ margin: 0, left: "2%" });
        }
        if ($(this).hasClass("tutorial")) {
          $(".aba.direita", this).css({ margin: 0, right: "51%" });
          $(".aba.esquerda", this).css({ margin: 0, left: "5%" });
        }
      });
    }
  };

  var imgPre = new Array(),
    imgLoaded = new Array(),
    cont = 0,
    timerId;
  var carregaImagens = function () {
    var i = 0,
      src,
      er = new RegExp("img/[a-zA-Z0-9._-]+");
    $("*").each(function () {
      if (this.className) {
        try {
          src = er.exec($("." + this.className).css("background-image"));
          if (src && src[0]) {
            imgPre[i] = new Image();
            imgPre[i].src = src;
            i++;
          }
        } catch (exp) {
          console.log("exception loading images " + exp);
        }
      }
    });
    for (var j = 0; j < imgPre.length; j++) {
      imgLoaded[j] = false;
    }
    checkLoad();
  };

  var checkLoad = function checkLoad() {
    if (cont == imgPre.length) {
      viewModel.loaded(true);
      return;
    }
    for (var i = 0; i < imgPre.length; i++) {
      if (imgLoaded[i] == false && imgPre && imgPre[i].complete) {
        imgLoaded[i] = true;
        $(".loadImg div").css({
          width: Math.ceil((cont * 100) / imgPre.length) + "%",
        });
        cont++;
      }
    }
    timerId = setTimeout(checkLoad, 50);
  };

  window.onload = new carregaImagens();
  window.onload = posicaoModal;
  window.onresize = posicaoModal;

  var world = $("#world"),
    fundo = $("#fundo"),
    mapa1 = $(".world1"),
    mapa2 = $(".world2"),
    mapa3 = $(".world3"),
    abduzida = $("#abduzida"),
    arvores = $(".arvore, .coqueiro"),
    aves = $(".ave"),
    balao = $(".balao"),
    barquinhos = $(".barquinho"),
    barquinho3 = $("#barquinho3"),
    bolhas = $(".bolhas"),
    boneco = $("#boneco"),
    carroCenoura = $("#carro_cenoura1"),
    carrosCenouras = $(".carro_cenoura").not("#carro_cenoura1"),
    clouds = $(".cloud"),
    coelho = $(".coelho_correndo"),
    coelhos = $(".coelho"),
    disco = $("#disco"),
    estacao = $(".estacao"),
    aveMergulho = $("#ave26"),
    splash = $("#splash"),
    farol = $(".farol"),
    ovni = $("#disco .ovni"),
    ovos = $(".ovo"),
    pinheiros = $(".pinheiro"),
    luz = $("#luz"),
    montanhas = $(".montanha"),
    observatorio = $("#observatorio"),
    ovelhas = $(".ovelha"),
    passarinho_ovo = $("#passarinho_ovo");
  (plantas = $(".planta")),
    (poste = $(".poste")),
    (relogio = $("#estacao .relogio")),
    (roda_gigante = $("#roda_gigante")),
    (sombra = $("#disco .sombra")),
    (teleferico = $("#teleferico")),
    (toPlay = $(".toPlay")),
    (toPlay1 = $("#toPlay1")),
    (toPlay2 = $("#toPlay2")),
    (toPlay3 = $("#toPlay3")),
    (trator = $("#trator")),
    (tubarao = $("#tubarao")),
    (w = fundo.width()),
    (h = fundo.height()),
    (w1 = mapa1.width()),
    (h1 = mapa1.height()),
    (pw = world.width()),
    (ph = world.height());
  //move o mapa centralizando-o em um elemento específico
  var centralizar = function (mapa, elemento) {
    if (mapa[0] && elemento[0]) {
      var mapaTop = +mapa.css("top").replace("px", "");
      var mapaLeft = +mapa.css("left").replace("px", "");
      var objTop =
        +elemento.css("top").replace("px", "") + elemento.height() / 2;
      var objLeft =
        +elemento.css("left").replace("px", "") + elemento.width() / 2;
      var posicao = {
        top: $(window).height() / 2 - (objTop + mapaTop),
        left: $(window).width() / 2 - (objLeft + mapaLeft),
      };
      fundo.css(posicao);
    }
  };

  function centralizarPorWave() {
    if (viewModel.wave() == "wave1") {
      centralizar(mapa1, toPlay1);
    } else if (viewModel.wave() == "wave2") {
      centralizar(mapa2, toPlay2);
    } else if (viewModel.wave() == "wave3") {
      centralizar(mapa3, toPlay3);
    }
  }

  viewModel.wave.subscribe(function () {
    centralizarPorWave();
  });

  centralizarPorWave();

  //arrastar o world
  if (mobile) {
    Draggable.create(fundo, {
      type: "x,y",
      edgeResistance: 0.97,
      bounds: "#world",
    });
  } else {
    fundo.pep({
      useCSSTranslation: false,
      shouldPreventDefault: false,
      constrainTo: (function () {
        //setInterval(function() { console.log(fundo.css("top"), fundo.css("left"), [(ph - h), 0, 0, (pw - w)]) }, 2000);
        return [ph - h, 0, 0, pw - w];
      })(),
    });
  }

  //objetos que executam ações ao serem clicados
  var clicavel = function (obj, podeClicar) {
    var $obj = $(obj);
    podeClicar =
      podeClicar !== false && podeClicar !== "false" ? "true" : "false";
    if (!$obj[0]) return false;
    clicaveis.push(obj);
    if ($obj.length > 1) {
      $($obj).each(function () {
        $(this).attr("data-clickable", podeClicar);
        this.style.cursor = podeClicar === "true" ? "pointer" : "move";
        return;
      });
    }
    $obj.attr("data-clickable", podeClicar);
    $obj[0].style.cursor = podeClicar === "true" ? "pointer" : "move";
  };
  clicavel(".pinheiro");
  clicavel(".ovo");
  clicavel("#teleferico, #teleferico *", false);
  clicavel(".relogio");
  clicavel(".ovni");
  clicavel(".ovelha");
  clicavel(".poste");
  clicavel(".ave");
  clicavel(".carro_cenoura");
  clicavel("#observatorio");
  clicavel(".toPlay");
  clicavel(".balao");
  clicavel(".coelho");
  clicavel("#montanha2");
  clicavel("#passarinho_ovo");

  //mover o cenário com as 4 setas
  function moverCenario(direcao) {
    var distancia = 300,
      duracao = 0.6,
      y = +fundo.css("top").replace("px", "") || 0,
      x = +fundo.css("left").replace("px", "") || 0,
      valor = 0;
    switch (direcao) {
      case "top":
        valor = y >= 0 - distancia ? 0 : "+=" + distancia;
        return TweenLite.to(fundo, duracao, { top: valor, ease: Sine.easeOut });
      case "right":
        valor = x <= pw - w + distancia ? pw - w : "-=" + distancia;
        return TweenLite.to(fundo, duracao, {
          left: valor,
          ease: Sine.easeOut,
        });
      case "bottom":
        valor = y <= ph - h + distancia ? ph - h : "-=" + distancia;
        return TweenLite.to(fundo, duracao, { top: valor, ease: Sine.easeOut });
      case "left":
        valor = x >= 0 - distancia ? 0 : "+=" + distancia;
        return TweenLite.to(fundo, duracao, {
          left: valor,
          ease: Sine.easeOut,
        });
    }
  }
  $(".seta.top").tap(function () {
    moverCenario("top");
  });
  $(".seta.right").tap(function () {
    moverCenario("right");
  });
  $(".seta.bottom").tap(function () {
    moverCenario("bottom");
  });
  $(".seta.left").tap(function () {
    moverCenario("left");
  });

  var anima = function anima() {
    //definições iniciais
    TweenLite.set(luz, { opacity: 0.3 });
    TweenLite.set(abduzida, { scaleX: -1 });
    TweenLite.set(aves[4], { scaleX: -1 });
    TweenLite.set($(".pata.dianteira", ovelhas), { rotation: -20 });
    TweenLite.set($(".pata.traseira", ovelhas), { rotation: 20 });
    TweenLite.set(sombra, { scale: 0.1, opacity: 0 });
    TweenLite.set(farol, { opacity: 0 });
    TweenLite.set(splash, { opacity: 0 });
    TweenLite.set(clouds[0], { top: 50 });
    TweenLite.set(clouds[1], { top: 220 });
    TweenLite.set(clouds[2], { top: 480 });
    TweenLite.set(clouds[3], { top: 50 });
    TweenLite.set(clouds[4], { top: 220 });
    TweenLite.set(clouds[5], { top: 480 });
    TweenLite.set(coelho, { scaleX: -1 });
    TweenLite.set(coelhos[0], { scale: 1.02 });
    TweenLite.set(coelhos[1], { scale: 1 });
    TweenLite.set(coelhos[2], { scale: 1.08 });
    TweenLite.set(coelhos[3], { scale: 1.08 });
    TweenLite.set(coelhos[4], { scale: 1.08 });
    TweenLite.set(ovos[2], { rotation: -70, top: "-=60", opacity: 0 });
    TweenLite.set(carroCenoura, { rotation: -10 });
    TweenLite.set(ovos[3], { top: "-=60", opacity: 0 });
    TweenLite.set($(".coelhinho", trator), {
      top: "+=70",
      height: 1,
      opacity: 0,
    });
    TweenLite.set($("#estacao .janela"), { opacity: 0 });
    TweenLite.set($("#boneco .agua"), { scale: 0.1 });
    TweenLite.set($("#boneco .agua"), { scale: 0.1 });

    //Animações
    Anim.patinhasRetas = function () {
      return new TweenMax.to($("#abduzida .pata"), 0.5, {
        rotation: 0,
        transformOrigin: "center top",
        ease: Elastic.easeOut,
      });
    };
    Anim.patinhasAbertas = function () {
      TweenLite.to($(".pata.dianteira", ovelhas), 0.1, { rotation: -20 });
      TweenLite.to($(".pata.traseira", ovelhas), 0.1, { rotation: 20 });
    };
    Anim.patinhas = function () {
      var t = new TimelineMax({
        repeat: 10,
        yoyo: true,
        onComplete: Anim.patinhasRetas,
      });
      t.staggerFromTo(
        $("#abduzida .pata"),
        0.125,
        { rotation: -20 },
        { rotation: 20, transformOrigin: "center top", ease: Bounce.easeInOut }
      );
      return t;
    };
    Anim.posicionarOvelha = function () {
      return new TweenMax.from(abduzida, 0.5, {
        top: 1760,
        ease: Bounce.easeOut,
      });
    };
    Anim.ovni = new TimelineMax({
      repeat: 1,
      yoyo: true,
      paused: true,
      repeatDelay: 2,
    });
    Anim.ovni
      .to(disco, 0.1, { left: 706, top: 1448, ease: Linear.easeNone })
      .to(disco, 0.1, { left: 717, top: 1435, ease: Linear.easeNone })
      .to(disco, 0.1, { left: 732, top: 1441, ease: Linear.easeNone })
      .to(disco, 0.1, { left: 732, top: 1456, ease: Linear.easeNone })
      .to(disco, 0.1, { left: 717, top: 1460, ease: Linear.easeNone })
      .staggerTo(farol, 0.6, { opacity: 1 }, 0.2, 0)
      .add("luz")
      .add(Anim.patinhasAbertas, "luz")
      .to(luz, 0.5, { height: 312 }, "luz")
      .to(
        $("#abduzida .cabeca"),
        1,
        { rotation: 30, ease: Elastic.easeOut },
        "luz+=0.1"
      )
      .add("subindo")
      .to(abduzida, 4, { top: 1700, ease: Elastic.easeOut }, "subindo")
      .to(
        sombra,
        3,
        { opacity: 1, scale: 0.75, ease: Elastic.easeOut },
        "subindo"
      )
      .add(Anim.patinhasRetas, "subindo")
      .to(
        $("#abduzida .cabeca"),
        1,
        { rotation: -10, ease: Elastic.easeOut },
        "subindo+=1"
      )
      .add(Anim.patinhas, "subindo+=1.5")
      .add(Anim.patinhasRetas)
      .to(
        $("#abduzida .cabeca"),
        1,
        { rotation: 45, ease: Elastic.easeOut },
        "subindo+=3.5"
      )
      .to(
        $("#abduzida .cabeca"),
        0.5,
        { rotation: 10, ease: Elastic.easeOut },
        "subindo+=4.2"
      )
      .add("abduzindo", "subindo+=4.5")
      .to(
        abduzida,
        1.5,
        {
          top: 1580,
          scaleX: -0.5,
          scaleY: 0.75,
          opacity: 0,
          ease: Back.easeIn,
        },
        "abduzindo"
      )
      .to(
        sombra,
        1.5,
        { opacity: 0, scale: 0.2, ease: Elastic.easeIn },
        "abduzindo"
      )
      .to(luz, 0.5, { height: 78 })
      .to(disco, 0.3, { left: 706, top: 1448, ease: Linear.easeNone })
      .to(disco, 0.3, { left: 732, top: 1441, ease: Linear.easeNone })
      .to(disco, 1.5, {
        top: 300,
        left: 1800,
        rotation: 30,
        opacity: 0,
        ease: Back.easeIn,
      });

    ovni.tap(function () {
      Anim.ovni.play(0);
      setTimeout(function () {
        bp.sistema.audio.play("quick_abduction.mp3");
        setTimeout(function () {
          bp.sistema.audio.play("sheep.mp3");
          setTimeout(function () {
            bp.sistema.audio.play("abduction.mp3");
          }, 3500);
        }, 2000);
      }, 500);
    });

    var animacaoCoelhoParado = function (coelho, i) {
      var t = new TimelineMax({ repeat: -1, repeatDelay: 2, delay: i });
      t.set($(".orelha.direita", coelho), { rotation: 0 })
        .to($(".orelha.direita", coelho), 0.1, {
          rotation: 10,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".orelha.direita", coelho), 0.1, {
          rotation: -20,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".orelha.direita", coelho), 0.1, {
          rotation: 0,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".orelha.direita", coelho), 0.1, {
          rotation: 10,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".orelha.direita", coelho), 0.1, {
          rotation: -10,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".orelha.direita", coelho), 0.1, {
          rotation: 0,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".olhos", coelho), 0.1, { opacity: 0, ease: Linear.easeNone }, 1)
        .to($(".olhos", coelho), 0.1, { opacity: 1, ease: Linear.easeNone })
        .to($(".olhos", coelho), 0.1, { opacity: 0, ease: Linear.easeNone })
        .to($(".olhos", coelho), 0.1, { opacity: 1, ease: Linear.easeNone })
        .set($(".orelha.esquerda", coelho), { rotation: 0 })
        .to($(".orelha.esquerda", coelho), 0.1, {
          rotation: 10,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".orelha.esquerda", coelho), 0.1, {
          rotation: -20,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".orelha.esquerda", coelho), 0.1, {
          rotation: 0,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".orelha.esquerda", coelho), 0.1, {
          rotation: 10,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".orelha.esquerda", coelho), 0.1, {
          rotation: -10,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .to($(".orelha.esquerda", coelho), 0.1, {
          rotation: 0,
          transformOrigin: "center bottom",
          ease: Linear.easeNone,
        })
        .set(
          $(".olhos", coelho),
          { opacity: 0, ease: Linear.easeNone },
          "+=0.1"
        )
        .set(
          $(".olhos", coelho),
          { opacity: 1, ease: Linear.easeNone },
          "+=0.1"
        )
        .set(
          $(".olhos", coelho),
          { opacity: 0, ease: Linear.easeNone },
          "+=0.4"
        )
        .set(
          $(".olhos", coelho),
          { opacity: 1, ease: Linear.easeNone },
          "+=0.1"
        )
        .set(
          $(".olhos", coelho),
          { opacity: 0, ease: Linear.easeNone },
          "+=2.5"
        )
        .set(
          $(".olhos", coelho),
          { opacity: 1, ease: Linear.easeNone },
          "+=0.1"
        )
        .set(
          $(".olhos", coelho),
          { opacity: 0, ease: Linear.easeNone },
          "+=0.8"
        )
        .set(
          $(".olhos", coelho),
          { opacity: 1, ease: Linear.easeNone },
          "+=0.1"
        );
      return t;
    };
    var animacaoCoelho = function (coelho) {
      var t = new TimelineMax({ paused: true });
      t.set($(".sentado", coelho), { opacity: 1 })
        .set($(".correndo .baixo", coelho), { opacity: 0 })
        .set($(".correndo .alto", coelho), { opacity: 0 })
        .add("subindo")
        .to(
          $(".sentado", coelho),
          0.2,
          { top: -40, ease: Linear.easeNone },
          "subindo"
        )
        .to(
          $(".pernas", coelho),
          0.05,
          { top: 62, ease: Linear.easeNone },
          "subindo"
        )
        .to($(".pernas", coelho), 0.15, { top: 47, ease: Linear.easeNone })
        .add("descendo")
        .to(
          $(".sentado", coelho),
          0.5,
          { top: 0, ease: Bounce.easeOut },
          "descendo"
        )
        .to(
          $(".pernas", coelho),
          0.25,
          { top: 52, ease: Back.easeOut },
          "descendo+=0.1"
        )
        .add("subindo2")
        .to(
          $(".sentado", coelho),
          0.2,
          { top: -40, ease: Linear.easeNone },
          "subindo2"
        )
        .to(
          $(".pernas", coelho),
          0.05,
          { top: 62, ease: Linear.easeNone },
          "subindo2"
        )
        .to($(".pernas", coelho), 0.15, { top: 47, ease: Linear.easeNone })
        .add("descendo2")
        .to(
          $(".sentado", coelho),
          0.5,
          { top: 0, ease: Bounce.easeOut },
          "descendo2"
        )
        .to(
          $(".pernas", coelho),
          0.25,
          { top: 52, ease: Back.easeOut },
          "descendo2+=0.1"
        )
        .add("correndo")
        .set($(".sentado", coelho), { opacity: 0 }, "correndo")
        .set($(".correndo .alto", coelho), { opacity: 1 }, "correndo")
        .set($(".correndo", coelho), { left: -10 }, "correndo")
        .to(
          $(".correndo", coelho),
          0.5,
          { left: -130, ease: Linear.easeNone },
          "correndo"
        )
        .set($(".correndo .alto", coelho), { opacity: 0 }, "correndo+=0.15")
        .set($(".correndo .baixo", coelho), { opacity: 1 }, "correndo+=0.15")
        .set($(".correndo .alto", coelho), { opacity: 1 }, "correndo+=0.35")
        .set($(".correndo .baixo", coelho), { opacity: 0 }, "correndo+=0.35")
        .add("virada1")
        .set($(".correndo", coelho), { scaleX: -1 }, "virada1")
        .to(
          $(".correndo", coelho),
          1,
          { left: 70, ease: Linear.easeNone },
          "virada1"
        )
        .set($(".correndo .alto", coelho), { opacity: 0 }, "virada1+=0.15")
        .set($(".correndo .baixo", coelho), { opacity: 1 }, "virada1+=0.15")
        .set($(".correndo .alto", coelho), { opacity: 1 }, "virada1+=0.35")
        .set($(".correndo .baixo", coelho), { opacity: 0 }, "virada1+=0.35")
        .set($(".correndo .alto", coelho), { opacity: 0 }, "virada1+=0.55")
        .set($(".correndo .baixo", coelho), { opacity: 1 }, "virada1+=0.55")
        .set($(".correndo .alto", coelho), { opacity: 1 }, "virada1+=0.75")
        .set($(".correndo .baixo", coelho), { opacity: 0 }, "virada1+=0.75")
        .set($(".correndo .alto", coelho), { opacity: 0 }, "virada1+=1")
        .set($(".correndo .baixo", coelho), { opacity: 1 }, "virada1+=1")
        .add("virada2")
        .set($(".correndo", coelho), { scaleX: 1 }, "virada2")
        .to(
          $(".correndo", coelho),
          0.5,
          { left: 6, ease: Sine.easeOut },
          "virada2"
        )
        .set($(".correndo .alto", coelho), { opacity: 0 }, "virada2+=0.05")
        .set($(".correndo .baixo", coelho), { opacity: 1 }, "virada2+=0.05")
        .set($(".correndo .alto", coelho), { opacity: 1 }, "virada2+=0.30")
        .set($(".correndo .baixo", coelho), { opacity: 0 }, "virada2+=0.30")
        .set($(".correndo .alto", coelho), { opacity: 0 }, "virada2+=0.45")
        .set($(".correndo .baixo", coelho), { opacity: 1 }, "virada2+=0.45")
        .set($(".correndo .alto", coelho), { opacity: 1 }, "virada2+=0.50")
        .set($(".correndo .baixo", coelho), { opacity: 0 }, "virada2+=0.50")
        .add("parada")
        .set($(".correndo", coelho), { left: 0 }, "parada")
        .set($(".correndo .baixo", coelho), { opacity: 0 }, "parada")
        .set($(".correndo .alto", coelho), { opacity: 0 }, "parada")
        .set($(".sentado", coelho), { opacity: 1 }, "parada");
      return t;
    };

    Anim.coelhos = [];
    Anim.coelhosParados = [];
    coelhos.each(function (i) {
      Anim.coelhos[i] = false;
      Anim.coelhosParados[i] = new animacaoCoelhoParado(this, i);
      $(this).tap(function () {
        if (!Anim.coelhos[i]) {
          Anim.coelhos[i] = animacaoCoelho(this);
        }
        if (Anim.coelhos[i].progress() != 1) {
          Anim.coelhos[i].play();
        } else {
          Anim.coelhos[i].restart();
        }
        setTimeout(function () {
          bp.sistema.audio.play("abduct_rabbit.mp3");
        }, 1000);
      });
    });

    $(montanhas[1]).tap(function () {
      if (!Anim.coelhos[0]) {
        Anim.coelhos[0] = animacaoCoelho(coelhos[0]);
      }
      if (Anim.coelhos[0].progress() != 1) {
        Anim.coelhos[0].play();
      } else {
        Anim.coelhos[0].restart();
      }
    });

    var animacaoAves = function (ave) {
      var coracao = $(ave).next(".coracao");
      console.log(coracao);
      var t = new TimelineMax({ paused: true });
      t.fromTo(ave, 0.3, { y: -5 }, { y: 0 });
      t.fromTo(coracao, 1, { opacity: 0, y: 0 }, { opacity: 1, y: -15 }).to(
        coracao,
        0.5,
        {
          opacity: 0,
          y: 0,
        }
      );

      if (t.progress() && t.progress() !== 1) {
        t.play();
      } else {
        t.restart();
      }
      return t;
    };
    var animacaoAvesParadas = function (ave, delay) {
      var t = new TimelineMax({ repeat: -1, repeatDelay: 1, delay: delay })
        .to($(".olhos", ave), 0.05, { opacity: 0, ease: Linear.easeNone }, 1)
        .to($(".olhos", ave), 0.05, { opacity: 1, ease: Linear.easeNone });
    };

    Anim.avesParadas = [];
    aves.each(function (i) {
      animacaoAvesParadas(this, i);
      $(this)
        .not("#ave26")
        .tap(function () {
          animacaoAves(this);
          bp.sistema.audio.play("egg_bird.mp3");
        });
    });

    aveMergulho.tap(function () {
      if (!Anim.mergulho) {
        Anim.mergulho = new TimelineMax();
        Anim.mergulho
          .set(aveMergulho, {
            x: 0,
            y: 0,
            opacity: 1,
          })
          .to(aveMergulho, 0.7, { x: 15, rotation: 20, ease: Cubic.easeInOut })
          .to(aveMergulho, 0.2, {
            x: 60,
            y: -40,
            ease: Cubic.easeInOut,
          })
          .to(aveMergulho, 0.2, { x: 80, y: 50 })
          .call(() => {
            bp.sistema.audio.play("splash.mp3");
          })
          .set(splash, {
            scale: 0.4,
            transformOrigin: "right bottom",
          })
          .to(aveMergulho, 0.1, {
            opacity: 0,
          })
          .to(splash, 0.2, {
            opacity: 1,
            scale: 0.4,
            transformOrigin: "right bottom",
          })
          .to(splash, 0.2, {
            opacity: 0,
          })
          .set(aveMergulho, { x: 0, y: 40, scale: 0.7, rotation: 0 })
          .to(aveMergulho, 1, {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
          });
      }
      if (Anim.mergulho.progress() != 1) {
        Anim.mergulho.play();
      } else {
        Anim.mergulho.restart();
      }
    });
    carrosCenouras.tap(() => {
      bp.sistema.audio.play("honk.mp3");
    });
    function animaNuvens() {
      for (var i = 0, r; i < clouds.length; i++) {
        r = Math.random() * 30 + 10;
        if (i < 3) {
          TweenMax.fromTo(
            clouds[i],
            r,
            { left: "100%" },
            { left: "-502", repeat: -1 }
          );
        } else {
          TweenMax.fromTo(
            clouds[i],
            r,
            { left: 4677 },
            { left: -502, repeat: -1 }
          );
        }
      }
    }

    animaNuvens();

    Anim.evitarOvo = [];

    Anim.ovos = function Anim_ovos(i) {
      var t = new TimelineMax();
      t.to(ovos[i], 0.75, { top: "+=60", opacity: 1, ease: Bounce.easeOut }).to(
        ovos[i],
        0.1,
        { rotation: "-=30", ease: Elastic.easeOut },
        0.5
      );
      Anim.evitarOvo.push(i);
      return t;
    };

    ovos.each(function () {
      var p = this;
      $(this).tap(function () {
        TweenMax.fromTo(
          p,
          0.25,
          { height: "+=5", top: "-=5" },
          { height: "-=5", top: "+=5", repeat: 2, ease: Elastic.easeInOut }
        );
        var sort = Date.now() % 4;
        if (sort == 0) bp.sistema.audio.play("egg_bird.mp3");
        else if (sort == 1) bp.sistema.audio.play("egg_cat.mp3");
        else if (sort == 2) bp.sistema.audio.play("egg_cow.mp3");
        else if (sort == 3) bp.sistema.audio.play("egg_horse.mp3");
      });
    });

    pinheiros.each(function () {
      var p = this;
      $(this).tap(function () {
        TweenMax.fromTo(
          p,
          0.25,
          { height: "+=5", top: "-=5" },
          { height: "-=5", top: "+=5", repeat: 2, ease: Elastic.easeInOut }
        );
        bp.sistema.audio.play("shakingtree.mp3");
      });
    });

    $(pinheiros[2]).tap(function () {
      if (Anim.evitarOvo.indexOf(2) < 0) {
        Anim.ovos(2);
        setTimeout(function () {
          bp.sistema.audio.play("egg_shock.mp3");
        }, 200);
      }
    });

    $(pinheiros[3]).tap(function () {
      if (Anim.evitarOvo.indexOf(3) < 0) {
        Anim.ovos(3);
        setTimeout(function () {
          bp.sistema.audio.play("egg_shock.mp3");
        }, 200);
      }
    });

    Anim.balao = false;
    balao.tap(function () {
      if (!Anim.balao) {
        Anim.balao = new TimelineMax();
        Anim.balao
          .add("up")
          .set(balao, { top: 519, left: 702 }, "up")
          .to(balao, 15, { top: -2000, ease: Cubic.easeInOut }, "up")
          .to(balao, 3, { rotation: -20, ease: Cubic.easeInOut }, "up+=3")
          .to(balao, 3, { rotation: 20, ease: Cubic.easeInOut }, "up+=6")
          .to(balao, 3, { rotation: -20, ease: Cubic.easeInOut }, "up+=9")
          .to(balao, 3, { rotation: 0, ease: Cubic.easeInOut }, "up+=12")
          .to(balao, 4, { left: "-=50", ease: Cubic.easeInOut }, "up+=4")
          .to(balao, 4, { left: "+=250", ease: Cubic.easeInOut }, "up+=8")
          .to(balao, 3, { left: "-=100", ease: Cubic.easeInOut }, "up+=12")
          .add("volta", "up+=15")
          .to(balao, 10, { top: 519, ease: Cubic.easeInOut }, "volta")
          .to(balao, 2, { rotation: -20, ease: Cubic.easeInOut }, "volta+=2")
          .to(balao, 2, { rotation: 20, ease: Cubic.easeInOut }, "volta+=4")
          .to(balao, 2, { rotation: -20, ease: Cubic.easeInOut }, "volta+=6")
          .to(balao, 2, { rotation: 0, ease: Cubic.easeInOut }, "volta+=8")
          .to(balao, 5, { left: "+=150", ease: Cubic.easeInOut }, "volta+=0")
          .to(balao, 5, { left: 702, ease: Cubic.easeInOut }, "volta+=5");
        bp.sistema.audio.play("inflate_baloon.mp3");
      }
      if (Anim.balao.progress() != 1) {
        Anim.balao.play();
      } else {
        Anim.balao.restart();
      }
    });

    Anim.bonde = false;
    var animacaoBonde = function () {
      if (!Anim.bonde) {
        Anim.bonde = new TimelineMax({ repeat: 1, yoyo: true, repeatDelay: 2 });
        Anim.bonde
          .add("inicio")
          .to(relogio, 3, { rotation: 720, ease: Cubic.easeOut }, "inicio")
          .staggerTo(
            "#estacao .janela",
            0.1,
            { opacity: 1, ease: Cubic.easeIn },
            0.1,
            "inicio"
          )
          .add("up", "inicio+=1")
          .to(
            $(".conjunto", teleferico),
            4,
            { left: "+=600", top: "-=390", ease: Quad.easeIn },
            "up"
          )
          .to(
            $(".bonde", teleferico),
            1,
            {
              rotation: "+=5",
              transformOrigin: "center top",
              ease: Linear.easeNone,
            },
            "up"
          )
          .to(
            $(".bonde", teleferico),
            0.5,
            {
              rotation: "-=16",
              transformOrigin: "center top",
              ease: Linear.easeNone,
            },
            "up+=1"
          )
          .to(
            $(".bonde", teleferico),
            0.4,
            {
              rotation: "+=12",
              transformOrigin: "center top",
              ease: Linear.easeNone,
            },
            "up+=1.5"
          )
          .to(
            $(".bonde", teleferico),
            0.3,
            {
              rotation: "-=4",
              transformOrigin: "center top",
              ease: Linear.easeNone,
            },
            "up+=1.9"
          )
          .add("obs")
          .to(
            $(".porta", observatorio),
            0.3,
            { opacity: 1, ease: Cubic.easeOut },
            "obs"
          )
          .to(
            $(".porta", observatorio),
            0.3,
            { opacity: 1, ease: Cubic.easeOut },
            "obs"
          )
          .to(
            $(".luneta", observatorio),
            1,
            { height: "+=30", top: "-=30", ease: Cubic.easeInOut },
            "obs"
          )
          .to(
            $(".lente", observatorio),
            0.1,
            { backgroundColor: "#ffffff", ease: Cubic.easeInOut },
            "obs+=2"
          )
          .to(
            $(".lente", observatorio),
            0.1,
            { backgroundColor: "transparent", ease: Cubic.easeInOut },
            "obs+=2.5"
          )
          .to(
            $(".lente", observatorio),
            0.1,
            { backgroundColor: "#ffffff", ease: Cubic.easeInOut },
            "obs+=2.7"
          );
        bp.sistema.audio.play("clock.mp3");
      }
      if (Anim.bonde.progress() > 0) {
        Anim.bonde.play();
      } else {
        Anim.bonde.restart();
      }
    };
    relogio.tap(animacaoBonde);
    observatorio.tap(animacaoBonde);

    Anim.boneco = false;
    var animacaoBoneco = function () {
      if (!Anim.boneco) {
        Anim.boneco = new TimelineMax({
          repeat: 1,
          yoyo: true,
          repeatDelay: 5,
        });
        Anim.boneco
          .to(boneco, 0.5, { opacity: 1, ease: Cubic.easeIn }, 0)
          .add("inicio")
          .to($(".agua", boneco), 5, { scale: 1, ease: Quad.easeOut }, "inicio")
          .to(
            $(".orelha.esquerda", boneco),
            1,
            { top: "+=90", ease: Cubic.easeIn },
            "inicio"
          )
          .to(
            $(".orelha.direita", boneco),
            1,
            { top: "+=90", ease: Cubic.easeIn },
            "inicio+=0.3"
          )
          .to(
            $(".orelha", boneco),
            0.3,
            { opacity: 0, ease: Cubic.easeIn },
            "inicio+=0.8"
          )
          .to(
            $(".olho.esquerdo", boneco),
            1,
            { top: "+=70", ease: Bounce.easeOut },
            "inicio+=1"
          )
          .to(
            $(".olho.direito", boneco),
            1,
            { top: "+=70", ease: Bounce.easeOut },
            "inicio+=1.3"
          )
          .staggerTo(
            $(".braco", boneco),
            1,
            { top: "+=50", ease: Bounce.easeOut },
            0.3,
            "inicio+=2"
          )
          .to(
            $(".botao.cima", boneco),
            1,
            { top: "+=42", ease: Bounce.easeOut },
            "inicio+=2.2"
          )
          .to(
            $(".botao.baixo", boneco),
            1,
            { top: "+=28", ease: Bounce.easeOut },
            "inicio+=2.7"
          )
          .to(
            $(".cabeca", boneco),
            1,
            { top: "+=70", opacity: 0, ease: Bounce.easeOut },
            "inicio+=2.3"
          )
          .to(
            $(".corpo", boneco),
            1,
            { height: "-=60", top: "+=60", opacity: 0, ease: Quint.easeOut },
            "inicio+=2.5"
          );
        setTimeout(function () {
          bp.sistema.audio.play("sad_falling_sound.mp3");
        }, 500);
      }
      if (Anim.boneco.progress() > 0) {
        Anim.boneco.play();
      } else {
        Anim.boneco.restart();
      }
    };
    boneco.tap(animacaoBoneco);

    Anim.bonecoBracos = new TimelineMax({
      repeat: -1,
      yoyo: true,
      repeatDelay: 6,
    });
    Anim.bonecoBracos
      .set($(".braco.direito", boneco), {
        rotation: 0,
        transformOrigin: "left bottom",
      })
      .set($(".braco.esquerdo", boneco), {
        rotation: 0,
        transformOrigin: "right bottom",
      })
      .to(
        $(".braco.direito", boneco),
        0.1,
        { rotation: -10, ease: Cubic.easeInOut },
        "a"
      )
      .to(
        $(".braco.esquerdo", boneco),
        0.1,
        { rotation: +10, ease: Cubic.easeInOut },
        "a"
      )
      .to(
        $(".braco.direito", boneco),
        0.1,
        { rotation: +10, ease: Cubic.easeInOut },
        "b"
      )
      .to(
        $(".braco.esquerdo", boneco),
        0.1,
        { rotation: -10, ease: Cubic.easeInOut },
        "b"
      )
      .to(
        $(".braco.direito", boneco),
        0.1,
        { rotation: -10, ease: Cubic.easeInOut },
        "c"
      )
      .to(
        $(".braco.esquerdo", boneco),
        0.1,
        { rotation: +10, ease: Cubic.easeInOut },
        "c"
      )
      .to(
        $(".braco.direito", boneco),
        0.1,
        { rotation: +10, ease: Cubic.easeInOut },
        "d"
      )
      .to(
        $(".braco.esquerdo", boneco),
        0.1,
        { rotation: -10, ease: Cubic.easeInOut },
        "d"
      )
      .to(
        $(".braco.direito", boneco),
        0.1,
        { rotation: -10, ease: Cubic.easeInOut },
        "e"
      )
      .to(
        $(".braco.esquerdo", boneco),
        0.1,
        { rotation: +10, ease: Cubic.easeInOut },
        "e"
      )
      .to(
        $(".braco.direito", boneco),
        0.1,
        { rotation: +10, ease: Cubic.easeInOut },
        "f"
      )
      .to(
        $(".braco.esquerdo", boneco),
        0.1,
        { rotation: -10, ease: Cubic.easeInOut },
        "f"
      );

    $(".balao_oceano").each((i, balao) => {
      Anim.baloesOceano = new TimelineMax({
        repeat: -1,
        yoyo: true,
        delay: i + 1.85,
      })
        .set(balao, {
          rotation: 0,
          y: 0,
        })
        .to(balao, 2, { rotation: -2, y: -30, x: 5, ease: Cubic.easeInOut })
        .to(balao, 1, { rotation: 0, y: -30, x: 0, ease: Cubic.easeInOut })
        .to(balao, 2, { rotation: 2, y: 0, x: -5, ease: Cubic.easeInOut })
        .to(balao, 1, { rotation: 0, y: 0, x: 0, ease: Cubic.easeInOut });
    });

    Anim.plantas = new TimelineMax({ repeat: -1, yoyo: true });
    Anim.plantas
      .set(plantas, { skewX: 0, rotation: 0, transformOrigin: "center bottom" })
      .staggerTo(
        plantas,
        0.5,
        { skewX: 3, rotation: -3, ease: Cubic.easeInOut },
        0.3
      )
      .staggerTo(
        plantas,
        1.0,
        { skewX: -2, rotation: +2, ease: Cubic.easeInOut },
        0.3,
        1
      )
      .staggerTo(
        plantas,
        1.0,
        { skewX: 4, rotation: -4, ease: Cubic.easeInOut },
        0.3,
        2
      )
      .staggerTo(
        plantas,
        1.0,
        { skewX: -2, rotation: +2, ease: Cubic.easeInOut },
        0.3,
        3
      )
      .staggerTo(
        plantas,
        1.0,
        { skewX: 1, rotation: -1, ease: Cubic.easeInOut },
        0.3,
        4
      )
      .staggerTo(
        plantas,
        1.0,
        { skewX: -1, rotation: +1, ease: Cubic.easeInOut },
        0.3,
        5
      )
      .staggerTo(
        plantas,
        1.0,
        { skewX: 0, rotation: 0, ease: Cubic.easeInOut },
        0.3,
        6
      );

    Anim.arvores = new TimelineMax({ repeat: -1, yoyo: true });
    Anim.arvores
      .set($(".copa, .folhas", arvores), {
        skewX: 0,
        rotation: 0,
        transformOrigin: "center 80%",
      })
      .staggerTo(
        $(".copa, .folhas", arvores),
        0.5,
        { skewX: 1, rotation: 0, ease: Cubic.easeInOut },
        0.5
      )
      .staggerTo(
        $(".copa, .folhas", arvores),
        1.0,
        { skewX: -2, rotation: +2, ease: Cubic.easeInOut },
        0.5,
        1.5
      )
      .staggerTo(
        $(".copa, .folhas", arvores),
        1.0,
        { skewX: 2, rotation: -2, ease: Cubic.easeInOut },
        0.5,
        2.5
      )
      .staggerTo(
        $(".copa, .folhas", arvores),
        1.0,
        { skewX: -2, rotation: +2, ease: Cubic.easeInOut },
        0.5,
        4.5
      )
      .staggerTo(
        $(".copa, .folhas", arvores),
        1.0,
        { skewX: 1, rotation: -1, ease: Cubic.easeInOut },
        0.5,
        5.5
      )
      .staggerTo(
        $(".copa, .folhas", arvores),
        1.0,
        { skewX: -1, rotation: +1, ease: Cubic.easeInOut },
        0.5,
        6.5
      )
      .staggerTo(
        $(".copa, .folhas", arvores),
        1.0,
        { skewX: 0, rotation: 0, ease: Cubic.easeInOut },
        0.5,
        7.5
      );

    Anim.carroCenoura = false;
    Anim.rodinhas = function () {
      var t = new TimelineMax({ repeat: 210, yoyo: true });
      t.staggerFromTo(
        $(".roda", carroCenoura),
        0.05,
        { top: 96 },
        { top: 98, ease: Bounce.easeInOut },
        0.02
      );
      return t;
    };
    Anim.olhoCarroCenoura = new TimelineMax({ repeat: -1, repeatDelay: 5 });
    Anim.olhoCarroCenoura
      .to(
        $(".olho", carroCenoura),
        0.01,
        { height: 2, ease: Linear.easeNone },
        0
      )
      .to(
        $(".olho", carroCenoura),
        0.01,
        { height: 10, ease: Linear.easeNone },
        0.1
      )
      .to(
        $(".olho", carroCenoura),
        0.01,
        { height: 2, ease: Linear.easeNone },
        3
      )
      .to(
        $(".olho", carroCenoura),
        0.01,
        { height: 2, ease: Linear.easeNone },
        3.1
      )
      .to(
        $(".olho", carroCenoura),
        0.01,
        { height: 10, ease: Linear.easeNone },
        3.2
      )
      .to(
        $(".olho", carroCenoura),
        0.01,
        { height: 2, ease: Linear.easeNone },
        5
      )
      .to(
        $(".olho", carroCenoura),
        0.01,
        { height: 10, ease: Linear.easeNone },
        5.1
      )
      .to(
        $(".olho", carroCenoura),
        0.01,
        { height: 2, ease: Linear.easeNone },
        5.3
      )
      .to(
        $(".olho", carroCenoura),
        0.01,
        { height: 10, ease: Linear.easeNone },
        5.5
      );
    var animacaoCarroCenoura = function () {
      if (!Anim.carroCenoura) {
        Anim.carroCenoura = new TimelineMax();
        Anim.carroCenoura
          .to(carroCenoura, 0.5, { opacity: 1, ease: Cubic.easeIn }, 0)
          .add("inicio")
          .set(carroCenoura, {
            scaleY: 1,
            left: 938,
            top: 1406,
            rotation: -10,
            ease: Quint.easeOut,
          })
          .add(Anim.rodinhas, "inicio")
          .to(
            carroCenoura,
            1,
            {
              left: "-=60",
              top: "+=15",
              rotation: "-=10",
              ease: Quint.easeOut,
            },
            "inicio+=1"
          )
          .to(
            carroCenoura,
            1,
            {
              left: "+=120",
              top: "-=35",
              rotation: "+=15",
              ease: Quint.easeIn,
            },
            "inicio+=2"
          )
          .to(
            carroCenoura,
            0.4,
            {
              left: "+=250",
              top: "+=1",
              rotation: "+=15",
              ease: Linear.easeNone,
            },
            "inicio+=3"
          )
          .to(carroCenoura, 0.4, {
            left: "+=150",
            top: "+=20",
            rotation: "-=40",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.4, {
            left: "+=100",
            top: "-=60",
            rotation: "-=40",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=20",
            top: "-=60",
            rotation: "-=20",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "-=10",
            top: "-=60",
            rotation: "-=20",
            ease: Linear.easeNone,
          })
          .set(carroCenoura, {
            scaleY: -1,
            left: "+=100",
            top: "-=15",
            rotation: "+=5",
          })
          .to(carroCenoura, 0.15, {
            left: "-=22",
            top: "-=70",
            rotation: "-=20",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.15, {
            left: "-=60",
            top: "-=80",
            rotation: "-=20",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.15, {
            left: "-=80",
            top: "-=50",
            rotation: "-=20",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.15, {
            left: "-=130",
            top: "-=10",
            rotation: "-=15",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.3, {
            left: "-=250",
            top: "-=0",
            rotation: "+=1",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=110",
            top: "-=40",
            rotation: "+=50",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.15, {
            left: "-=30",
            top: "-=70",
            rotation: "+=30",
            ease: Linear.easeNone,
          })
          .set(carroCenoura, {
            scaleY: 1,
            left: "-=100",
            top: "+=15",
            rotation: "-=5",
          })
          .to(carroCenoura, 0.15, {
            left: "+=5",
            top: "-=70",
            rotation: "+=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.15, {
            left: "+=40",
            top: "-=100",
            rotation: "+=20",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "+=55",
            top: "-=80",
            rotation: "-=12",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "+=40",
            top: "-=90",
            rotation: "-=25",
            ease: Linear.easeNone,
          })
          .set(carroCenoura, {
            scaleY: -1,
            left: "+=80",
            top: "-=15",
            rotation: "-=5",
          })
          .to(carroCenoura, 0.15, {
            left: "-=15",
            top: "-=100",
            rotation: "-=35",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "-=70",
            top: "-=50",
            rotation: "-=35",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=190",
            top: "-=5",
            rotation: "-=10",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "-=50",
            top: "-=10",
            rotation: "+=35",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "-=5",
            top: "-=60",
            rotation: "+=45",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "-=45",
            top: "-=70",
            rotation: "-=60",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "-=80",
            top: "-=10",
            rotation: "-=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "-=80",
            top: "+=10",
            rotation: "-=40",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "-=40",
            top: "+=60",
            rotation: "-=40",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "-=20",
            top: "+=50",
            rotation: "+=45",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.1, {
            left: "-=40",
            top: "+=20",
            rotation: "+=35",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=140",
            top: "+=15",
            rotation: "-=15",
            opacity: 0,
            ease: Linear.easeNone,
          })

          .to(carroCenoura, 0.2, {
            left: "-=140",
            top: "+=65",
            rotation: "-=10",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=140",
            top: "+=65",
            rotation: "+=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=50",
            top: "+=15",
            rotation: "+=20",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=100",
            top: "-=75",
            rotation: "+=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=100",
            top: "-=100",
            rotation: "-=10",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.3, {
            left: "-=130",
            top: "-=75",
            rotation: "-=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=120",
            top: "-=5",
            rotation: "-=20",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=125",
            top: "+=50",
            rotation: "-=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=100",
            top: "+=110",
            rotation: "-=10",
            ease: Linear.easeNone,
          })
          .set(carroCenoura, {
            scaleY: 1,
            left: "+=70",
            top: "+=40",
            rotation: "-=0",
            opacity: 1,
          })
          .to(carroCenoura, 0.2, {
            left: "-=30",
            top: "+=100",
            rotation: "-=40",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "-=0",
            top: "+=100",
            rotation: "-=0",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.8, {
            left: "-=0",
            top: "+=710",
            rotation: "-=0",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.3, {
            left: "+=30",
            top: "+=125",
            rotation: "-=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=70",
            top: "+=100",
            rotation: "-=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=100",
            top: "+=50",
            rotation: "-=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=130",
            top: "-=30",
            rotation: "-=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=75",
            top: "-=55",
            rotation: "-=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=45",
            top: "-=120",
            rotation: "-=25",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=10",
            top: "-=115",
            rotation: "+=25",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=70",
            top: "-=75",
            rotation: "+=25",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=60",
            top: "-=20",
            rotation: "+=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=70",
            top: "+=5",
            rotation: "+=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=70",
            top: "+=25",
            rotation: "+=20",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=20",
            top: "+=90",
            rotation: "+=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=30",
            top: "+=80",
            rotation: "-=35",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=70",
            top: "+=30",
            rotation: "-=40",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.5, {
            left: "+=450",
            top: "+=5",
            rotation: "-=0",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=120",
            top: "-=5",
            rotation: "-=30",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            left: "+=130",
            top: "-=60",
            rotation: "+=5",
            ease: Linear.easeNone,
          })
          .to(carroCenoura, 0.2, {
            scaleY: 1,
            left: 938,
            top: 1406,
            rotation: -370,
            ease: Linear.easeNone,
          });
        bp.sistema.audio.play("carrot_car.mp3");
      }
      Anim.carroCenoura.timeScale(1.1);
      if (Anim.carroCenoura.progress() != 1) {
        Anim.carroCenoura.play();
      } else {
        Anim.carroCenoura.restart();
      }
    };
    carroCenoura.tap(animacaoCarroCenoura);

    Anim.trator = false;
    var animacaoTrator = function () {
      if (!Anim.trator) {
        Anim.trator = new TimelineMax();
        Anim.trator
          .add("inicio")
          .to(trator, 2, { left: "-=30", ease: Cubic.easeInOut }, "inicio")
          .staggerTo(
            $(".roda", trator),
            2,
            { rotation: "-=50", ease: Cubic.easeInOut },
            0,
            "inicio"
          )
          .to(trator, 2, { left: "+=30", ease: Cubic.easeInOut }, "inicio+=2")
          .staggerTo(
            $(".roda", trator),
            2,
            { rotation: "+=50", ease: Cubic.easeInOut },
            0,
            "inicio+=2"
          )
          .to(trator, 2, { left: "+=30", ease: Cubic.easeInOut }, "inicio+=2")
          .to(
            $(".coelhinho", trator),
            0.5,
            { height: 64, top: "-=70", opacity: 1, ease: Cubic.easeInOut },
            "inicio+=1.5"
          )
          .to(
            $(".coelhinho", trator),
            0.3,
            { height: 1, top: "+=70", opacity: 0, ease: Cubic.easeInOut },
            "inicio+=3.5"
          );
        bp.sistema.audio.play("truck_engine.mp3");
      }
      if (Anim.trator.progress() != 1) {
        Anim.trator.play();
      } else {
        Anim.trator.restart();
      }
    };
    trator.tap(animacaoTrator);

    Anim.toPlay = new TimelineMax({ repeat: -1, repeatDelay: 0 });
    Anim.toPlay
      .set(toPlay, { transformOrigin: "center 70%" })
      .to(toPlay, 0.35, { top: "-=50", rotation: 0, ease: Cubic.easeOut })
      .to(toPlay, 0.35, { top: "+=50", rotation: 0, ease: Cubic.easeIn })
      .to(toPlay, 0.35, { top: "-=90", rotation: -20, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: 10, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: -40, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: 10, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: -40, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: 10, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: -40, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: 10, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: -40, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: 10, ease: Linear.easeNone })
      .to(toPlay, 0.35, { top: "+=90", rotation: 0, ease: Linear.easeNone })

      .to(toPlay, 0.35, { top: "-=50", rotation: 0, ease: Cubic.easeOut })
      .to(toPlay, 0.35, { top: "+=50", rotation: 0, ease: Cubic.easeIn })
      .to(toPlay, 0.35, { top: "-=90", rotation: +20, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: -10, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: +40, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: -10, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: +40, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: -10, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: +40, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: -10, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: +40, ease: Linear.easeNone })
      .to(toPlay, 0.08, { rotation: -10, ease: Linear.easeNone })
      .to(toPlay, 0.35, { top: "+=90", rotation: 0, ease: Linear.easeNone });

    var tutorial = $(".esquemaTutorial div");
    Anim.tutorial = new TimelineMax({ repeat: -1 });
    Anim.tutorial.staggerFromTo(
      tutorial,
      0.5,
      { opacity: 0 },
      { opacity: 1, ease: Linear.easeNone },
      0.5
    );

    Anim.roda_gigante = new TimelineMax({ repeat: -1 });
    Anim.roda_gigante
      .to(
        $(".placa", roda_gigante),
        10,
        { rotation: 360, ease: Linear.easeNone },
        0
      )
      .to(
        $(".ovos", roda_gigante),
        10,
        { rotation: 360, ease: Linear.easeNone },
        0
      )
      .to(
        $(".ovo", roda_gigante),
        10,
        {
          rotation: -360,
          transformOrigin: "center 35%",
          ease: Linear.easeNone,
        },
        0
      );

    Anim.fogos1 = new TimelineMax({ repeat: -1, repeatDelay: 8 });
    Anim.fogos1
      .set($("#fogos_1 .rastro"), {
        scale: 0.01,
        rotation: 20,
        opacity: 1,
        transformOrigin: "right bottom",
      })
      .set($("#fogos_1 .explosao"), { scale: 0.01, opacity: 0 })
      .to(
        $("#fogos_1 .rastro"),
        0.6,
        { scale: 1, rotation: 0, ease: Linear.easeNone },
        0.25
      )
      .to($("#fogos_1 .rastro"), 0.5, { opacity: 0, ease: Cubic.easeIn }, 0.45)
      .to(
        $("#fogos_1 .explosao"),
        1,
        { scale: 1, opacity: 1, ease: Bounce.easeOut },
        0.6
      )
      .to(
        $("#fogos_1 .explosao"),
        0.5,
        { opacity: 0, ease: Linear.easeNone },
        1.6
      );

    Anim.fogos2 = new TimelineMax({ repeat: -1, repeatDelay: 8, delay: 0.5 });
    Anim.fogos2
      .set($("#fogos_2 .explosao"), { scale: 0.01, opacity: 0 })
      .to(
        $("#fogos_2 .explosao"),
        1,
        { scale: 1, opacity: 1, ease: Bounce.easeOut },
        0
      )
      .to(
        $("#fogos_2 .explosao"),
        0.5,
        { opacity: 0, ease: Linear.easeNone },
        1
      );

    Anim.fogos3 = new TimelineMax({ repeat: -1, repeatDelay: 8, delay: 05 });
    Anim.fogos3
      .set($("#fogos_3 .rastro"), {
        scale: 0.01,
        rotation: -20,
        opacity: 1,
        transformOrigin: "left bottom",
      })
      .set($("#fogos_3 .explosao"), { scale: 0.01, opacity: 0 })
      .to(
        $("#fogos_3 .rastro"),
        0.6,
        { scale: 1, rotation: 0, ease: Linear.easeNone },
        0.25
      )
      .to($("#fogos_3 .rastro"), 0.5, { opacity: 0, ease: Cubic.easeIn }, 0.45)
      .to(
        $("#fogos_3 .explosao"),
        1,
        { scale: 1, opacity: 1, ease: Bounce.easeOut },
        0.6
      )
      .to(
        $("#fogos_3 .explosao"),
        0.5,
        { opacity: 0, ease: Linear.easeNone },
        1.6
      );

    Anim.passarinhoOvo = new TimelineMax({ repeat: -1, repeatDelay: 4 });
    Anim.passarinhoOvo
      .set($(".corpinho", passarinho_ovo), { top: 10, scale: 0.8 }, 0)
      .set(
        $(".casca_top", passarinho_ovo),
        { top: 10, left: 3, rotation: -5, transformOrigin: "right bottom" },
        0
      )
      .set($(".casca_top", passarinho_ovo), { rotation: -15 }, "+=0.1")
      .set($(".casca_top", passarinho_ovo), { rotation: -5 }, "+=0.1")
      .set($(".casca_top", passarinho_ovo), { rotation: -15 }, "+=0.1")
      .set($(".casca_top", passarinho_ovo), { rotation: -5 }, "+=0.1")
      .set($(".casca_top", passarinho_ovo), { rotation: -20 }, "+=0.1")
      .set($(".casca_top", passarinho_ovo), { rotation: -10 }, "+=0.1");
    Anim.saindoDoOvo = false;
    var animacaoSaindoDoOvo = function () {
      if (!Anim.saindoDoOvo) {
        Anim.saindoDoOvo = new TimelineMax();
        Anim.saindoDoOvo
          .add("inicio")
          .to(
            $(".casca_top", passarinho_ovo),
            0.6,
            { top: -6, rotation: 0, left: 6, ease: Back.easeOut },
            "inicio"
          )
          .to(
            $(".corpinho", passarinho_ovo),
            0.6,
            { top: 0, scale: 1, ease: Back.easeOut },
            "inicio"
          )
          .to(
            $(".casca_top", passarinho_ovo),
            0.5,
            { top: -7, rotation: -1, left: 6, ease: Back.easeOut },
            "inicio+=0.6"
          )
          .to(
            $(".corpinho", passarinho_ovo),
            0.5,
            { top: 1, scale: 1.01, ease: Back.easeOut },
            "inicio+=0.6"
          )
          .to(
            $(".corpinho", passarinho_ovo),
            0.3,
            { top: 10, scale: 0.8 },
            "inicio+=1.1"
          )
          .to(
            $(".casca_top", passarinho_ovo),
            0.3,
            { top: 10, left: 3, rotation: -5, transformOrigin: "right bottom" },
            "inicio+=1.1"
          );
        //                bp.sistema.audio.play("");
      }
      if (Anim.saindoDoOvo.progress() != 1) {
        Anim.saindoDoOvo.play();
      } else {
        Anim.saindoDoOvo.restart();
      }
    };
    passarinho_ovo.tap(animacaoSaindoDoOvo);

    Anim.poste = false;
    TweenLite.set($(".light", poste), { scale: 0.1, opacity: 0 });
    var animacaoPoste = function () {
      if (!Anim.poste) {
        Anim.poste = new TimelineMax();
        Anim.poste
          .add("inicio")
          .to(
            $(".light", poste),
            0.6,
            { scale: 1.0, opacity: 1, ease: Back.easeOut },
            "inicio"
          )
          .to(
            $(".light", poste),
            1.2,
            { scale: 0.1, opacity: 0, ease: Bounce.easeIn },
            "inicio+=3"
          );
        //                bp.sistema.audio.play("");
      }
      if (Anim.poste.progress() != 1) {
        Anim.poste.play();
      } else {
        Anim.poste.restart();
      }
    };
    poste.tap(animacaoPoste);

    Anim.tubarao = new TimelineMax({ repeat: -1, repeatDelay: 16 });
    Anim.tubarao
      .set($(".barbatana", tubarao), {
        top: 60,
        height: 40,
        left: 0,
        scaleX: 1,
      })
      .to($(".barbatana", tubarao), 1, {
        top: 0,
        height: 59,
        left: 100,
        ease: Linear.easeNone,
      })
      .to($(".barbatana", tubarao), 1, {
        top: 60,
        height: 40,
        left: 200,
        ease: Linear.easeNone,
      })
      .set($(".barbatana", tubarao), { top: 60, height: 40, scaleX: -1 }, "+=2")
      .to($(".barbatana", tubarao), 1, {
        top: 0,
        height: 59,
        left: 100,
        ease: Linear.easeNone,
      })
      .to($(".barbatana", tubarao), 1, {
        top: 60,
        height: 40,
        left: 0,
        ease: Linear.easeNone,
      });

    Anim.ondas = new TimelineMax({ repeat: -1 });
    Anim.ondas
      .fromTo(
        $(".onda"),
        2,
        { left: 0 },
        { left: -33, ease: Linear.easeNone },
        0
      )
      .fromTo(
        $(".onda"),
        2,
        { left: 0 },
        { left: -33, ease: Linear.easeNone },
        2
      )
      .fromTo(
        $(".onda"),
        2,
        { left: 0 },
        { left: -33, ease: Linear.easeNone },
        4
      )
      .fromTo(
        $(".onda"),
        2,
        { left: 0 },
        { left: -33, ease: Linear.easeNone },
        6
      )
      .fromTo(
        $(".onda"),
        2,
        { left: 0 },
        { left: -33, ease: Linear.easeNone },
        6
      );

    Anim.barco = new TimelineMax({ repeat: -1 });
    Anim.barco
      .fromTo(
        $(".barco"),
        1,
        { rotation: 3 },
        { rotation: -3, ease: Linear.easeNone }
      )
      .fromTo(
        $(".barco"),
        1,
        { rotation: -3 },
        { rotation: 3, ease: Linear.easeNone }
      );

    Anim.bolhas = [];
    bolhas.each(function (i, b) {
      Anim.bolhas[i] = new TimelineMax({ repeat: -1 });
      Anim.bolhas[i]
        .staggerFromTo(
          $("div", b),
          1,
          { scale: 0.1, opacity: 0 },
          { scale: 1, opacity: 1, ease: Linear.easeNone },
          0.2
        )
        .staggerFromTo(
          $("div", b),
          1,
          { scale: 1, opacity: 1 },
          { scale: 0.1, opacity: 0, ease: Linear.easeNone },
          0.2
        );
    });

    Anim.barquinhos = [];
    barquinhos.each(function (i, b) {
      Anim.barquinhos[i] = new TimelineMax({ repeat: -1 });
      Anim.barquinhos[i]
        .fromTo(
          $(".barco", b),
          1,
          { rotation: 3 },
          { rotation: -3, ease: Linear.easeNone }
        )
        .fromTo(
          $(".barco", b),
          1,
          { rotation: -3 },
          { rotation: 3, ease: Linear.easeNone }
        );
    });

    Anim.barquinho3 = new TimelineMax({ repeat: -1, repeatDelay: 3 });
    Anim.barquinho3
      .to(barquinho3, 8, { left: "+=50", ease: Cubic.easeInOut })
      .to(barquinho3, 8, { left: "-=50", ease: Cubic.easeInOut });
    Anim.navio = new TimelineMax({ repeat: -1, repeatDelay: 3 });
    Anim.navio
      .to($("#navio"), 8, { left: "+=500", ease: Cubic.easeInOut })
      .to($("#navio"), 20, { left: "-=500", ease: Cubic.easeInOut });
  };

  anima();
});
