define([
  "./util",
  "../libs/bpgl5/bpgl5",
  "./saucer",
  "./memo",
  "../../data/text",
  "../../data/balance",
], function (util, bp, saucer, memo, texts, balance) {
  var getData = function (action, success, data) {
    try {
      util.post(
        "data/" + action + ".json",
        data,
        function (data) {
          success(data);
        },
        function (data) {
          console.log("fail " + data);
        },
        true
      );
    } catch (ex) {
      console.log("exp " + ex);
    }
  };

  var post = function (action, success, data, fail) {
    try {
      data.action = action;
      util.post(
        "./service/index.php",
        data,
        function (data) {
          success(data);
        },
        function (data) {
          if (fail) fail(data);
          console.log("fail " + data);
        },
        true
      );
    } catch (ex) {
      console.log("exp " + ex);
    }
  };

  var use = function (action, success, data, fail) {
    data.action = action;
    data.token = viewModel.token();
    data.groupKey = data.groupKey || viewModel.groupKey();

    if (
      window.location.href.indexOf("localhost") == -1 &&
      window.location.href.indexOf("192.") == -1
    )
      post(action, success, ko.toJSON(data), fail);
    else getData("test/" + action, success, ko.toJSON(data));
  };

  var confirm = function (action, success, data) {
    use(
      action,
      function (data) {
        try {
          if (data.status && data.status == "ok") success();
          else viewModel.showError(data);
        } catch (ex) {
          console.log("exp " + ex);
        }
      },
      data
    );
  };

  var viewModel = {
    screen: ko.observable("loading"),
    wave: ko.observable("wave1"),
    selectedGame: ko.observable("1"),
    text: ko.observable(),
    token: ko.observable(),
    name: ko.observable(),
    email: ko.observable(),
    pass: ko.observable(),
    fb: ko.observable(),
    prize: null,
    themePlaying: ko.observable(true),
    loaded: ko.observable(false),
    showInvalid: ko.observable(false),
    firstStart: ko.observable(true),

    countryCode: ko.observable("--"),
    lang: ko.observable(),
    group: ko.observable(),
    selectedGroup: ko.observable(),
    filter: ko.observable(""),
    optOut: ko.observable(false),
    myGroups: ko.observableArray([]),
    textYouWin: ko.observable("....missing text, configuration error here..."),

    gameplay: ko.observable(),
    game: ko.observable({
      score: ko.observable(0),
      lifes: ko.observable(3),
      lifesArray: ko.computed(function () {
        return new Array(
          viewModel && viewModel.game() && viewModel.game().lifes()
        );
      }), //ko.observableArray(),
      theme: ko.observable(1),
      showTheme: ko.observable(true),
      level: ko.observable(1),
      time: ko.observable(""),
    }),

    cards: [],

    groupEdit: {
      name: ko.observable(),
      description: ko.observable(),
      email: ko.observable(),
      phone: ko.observable(),
      address: ko.observable(),
      city: ko.observable(),
      zip: ko.observable(),
      country: ko.observable(),
      groupType: ko.observable(),
    },

    prizeForm: {
      name: ko.observable(),
      email: ko.observable(),
      street: ko.observable(),
      number: ko.observable(),
      birthdate: ko.observable(),
      city: ko.observable(),
      zip: ko.observable(),
      country: ko.observable(),
    },

    createdGroup: ko.observable(),

    reg_email: ko.observable(""),
    reg_name: ko.observable(""),
    reg_pass: ko.observable(""),
    reg_pass2: ko.observable(""),

    cheatBrowserIncompatible: ko.observable(false),
    cheatCountry: ko.observable(null),
    cheatOutOfTime: ko.observable(false),
    cheatWinEasterEgg: ko.observable(false),
    cheatWinCoupon: ko.observable(false),
    cheatWinGame: ko.observable(false),
    cheatLoseGame: ko.observable(false),
  };

  viewModel.cheatWinGame.subscribe(function () {
    if (viewModel.cheatWinGame() == true) {
      viewModel.game().score(150);
      viewModel.game().lifes(0);
      breakItBad();
      viewModel.cheatWinGame(false);
    }
  });

  viewModel.cheatLoseGame.subscribe(function () {
    if (viewModel.cheatLoseGame() == true) {
      viewModel.game().score(50);
      viewModel.game().lifes(0);
      breakItBad();
      viewModel.cheatLoseGame(false);
    }
  });

  viewModel.createdGroup.subscribe(function () {
    if (!viewModel.createdGroup()) {
      viewModel.groupEdit.name(null);
      viewModel.groupEdit.description(null);
      viewModel.groupEdit.email(null);
      viewModel.groupEdit.phone(null);
      viewModel.groupEdit.address(null);
      viewModel.groupEdit.city(null);
      viewModel.groupEdit.zip(null);
      viewModel.groupEdit.country(null);
      viewModel.groupEdit.groupType(null);
    } else {
      viewModel.groupEdit.name(viewModel.createdGroup().name);
      viewModel.groupEdit.description(viewModel.createdGroup().description);
      viewModel.groupEdit.email(viewModel.createdGroup().email);
      viewModel.groupEdit.phone(viewModel.createdGroup().phone);
      viewModel.groupEdit.address(viewModel.createdGroup().address);
      viewModel.groupEdit.city(viewModel.createdGroup().city);
      viewModel.groupEdit.zip(viewModel.createdGroup().zip);
      viewModel.groupEdit.country(viewModel.createdGroup().country);
      viewModel.groupEdit.groupType(viewModel.createdGroup().groupType);
    }
  });

  var addCard = function (index) {
    viewModel.cards.push({
      virado: ko.observable(0),
      type: ko.observable(0),
      position: ko.observable(0),
      cardClick: function () {
        var i = memo.cardClick(index);
      },
    });
  };

  for (var i = 0; i < 12; i++) {
    addCard(i);
  }
  /*
	$("#playing .seta.right").vmousedown(function() {
        console.log("right down");
   	});

	$("#playing .seta.left").vmousedown(function() {
        console.log("left down");
   	});

	$("#playing .seta.right").vmouseup(function() {
        console.log("right up");
   	});

	$("#playing .seta.left").vmouseup(function() {
        console.log("left up");
   	});
*/

  viewModel.fb_lang = ko.computed(function () {
    var fb =
      viewModel.fb() &&
      viewModel
        .fb()
        .replace(
          "callback.php&",
          "callback.php" + escape("?lang=") + viewModel.lang() + "&"
        );
    return fb;
  });

  viewModel.soundOnOff = function () {
    var playing = bp.sistema.audio.pauseOrPlay("EasterWorldLoop_v001.mp3");
    bp.sistema.audio.turnOnOff();
    viewModel.themePlaying(playing);
  };

  viewModel.simpleShare = function () {
    var pontos = game.score();
    var groupKey = viewModel.groupKey();

    bp.sistema.integracoes.facebook.feed({
      method: "feed",
      name: "Leonidas Chocolate Easterworld",
      caption: viewModel.getText("facebook_i_have_scored")(),
      description: viewModel
        .getText("facebook_i_have_done_X")()
        .replace("X", pontos),
      link: location.href + "?groupKey=" + groupKey,
      picture: "https://easterworld.leonidas.com/img/logo_leonidas.png",
    });
  };

  viewModel.simpleInvite = function () {
    var groupKey = viewModel.groupKey();
    FB.ui(
      {
        method: "apprequests",
        title: "Easterworld",
        data: "https://easterworld.leonidas.com/?groupKey=" + groupKey,
        message: viewModel
          .getText("facebook_join_leonidas_X")()
          .replace(
            "X",
            "https://easterworld.leonidas.com/?groupKey=" + groupKey
          ),
      },
      function (callback) {
        console.log(callback);
      }
    );
  };

  bp.sistema.integracoes.facebook.init("628630807210497");

  viewModel.worldBackgroundPanel = ko.computed(function () {
    return (
      viewModel.screen() != "playing" &&
      viewModel.screen() != "language" &&
      viewModel.screen() != "incompatible" &&
      viewModel.screen() != "welcomeNoWin" &&
      viewModel.screen() != "register"
    );
  });

  viewModel.tutorial = ko.observable(false);

  viewModel.worldBackground = ko.computed(function () {
    return (
      viewModel.screen() != "playing" &&
      viewModel.screen() != "language" &&
      viewModel.screen() != "incompatible"
    );
  });

  var updateFBLink = function () {
    util.post(
      "fb/fb.php",
      ko.toJSON({
        url: window.location.href + "#lang=" + viewModel.lang(),
      }),
      function (data) {
        viewModel.fb(data.fb);
        if (
          viewModel.token &&
          viewModel.token != "" &&
          viewModel.token != "ask" &&
          viewModel.data &&
          viewModel.data.token
        ) {
        }
      },
      function (data) {
        console.log(
          "Something is so much wrong over here.. we didn't get the facebook URL for login."
        );
      },
      false
    );
  };

  if (window.location.href.indexOf("localhost") == -1) updateFBLink();

  window.viewModel = viewModel;

  window.gameRunning = false;
  window.gameIntervalId = 0;

  viewModel.sendScore = function (game, score, runAfter) {
    viewModel.prize = null;
    use(
      "score",
      function (data) {
        if (data.status) {
          console.log("sent score " + score + " at " + game);
          viewModel.prize = data.prize;
          viewModel.updateAllGroups();
          if (runAfter) runAfter();
        } else {
          console.log("error at getAllGroups.");
          if (runAfter) runAfter();
        }
      },
      {
        game: game,
        value: score,
      },
      function () {
        if (runAfter) runAfter();
      }
    );
  };

  viewModel.cleanGameScene = function () {
    var g = viewModel.gameplay();
    var game = viewModel.game();
    if (!g || !g.ovos) return;
    for (var i in g.ovos) {
      var ovo = g.ovos[i];
      if (!ovo) continue;
      $(ovo.element).remove();
      g.ovos[i] = null;
    }
  };

  viewModel.group.subscribe(function () {
    viewModel.updateToken();
  });

  viewModel.selectedGame.subscribe(function () {
    viewModel.updateToken();
  });

  viewModel.screen.subscribe(function () {
    viewModel.showInvalid(false);

    if (gameRunning && viewModel.screen() != "playing") {
      gameRunning = false;
      if (gameIntervalId) {
        clearInterval(gameIntervalId);
        gameIntervalId = 0;
      }
    } else if (!gameRunning && viewModel.screen() == "playing") {
      gameRunning = true;

      if (viewModel.selectedGame() == "1") {
        saucer.play();
      }
      if (viewModel.selectedGame() == "2") {
        memo.play();
      }
      if (viewModel.selectedGame() == "2") {
        memo.play();
      }
    }
  });

  viewModel.groupSelected = function () {
    return viewModel.selectedGroup() != null;
  };

  viewModel.imInTheSelectedGroup = function () {
    return (
      viewModel.selectedGroup() &&
      viewModel.myGroups.indexOf(viewModel.selectedGroup().key) >= 0
    );
  };

  viewModel.lang("");
  window.balance = {};

  viewModel.lang.subscribe(function () {
    viewModel.changeLang();
  });

  viewModel.allGroups = ko.observableArray([]);

  viewModel.updateMyGroups = function () {
    use(
      "getMyGroups",
      function (data) {
        viewModel.myGroups(data.groups);
      },
      {}
    );
  };

  viewModel.myGroupsData = ko.computed(function () {
    return ko.utils.arrayFilter(viewModel.allGroups(), function (item) {
      for (var i in viewModel.myGroups())
        if (item.key == viewModel.myGroups()[i]) return true;
      return false;
    });
  });

  viewModel.allGroupsFiltered = ko.computed(function () {
    return ko.utils.arrayFilter(viewModel.allGroups(), function (item) {
      var members =
        typeof item.members == "function" ? item.members() : item.members;
      for (var i in members) {
        var member = members[i];
        if (member.toLowerCase().indexOf(viewModel.filter().toLowerCase()) >= 0)
          return true;
      }
      return (
        viewModel.filter() == "" ||
        item.name.toLowerCase().indexOf(viewModel.filter().toLowerCase()) >=
          0 ||
        item.ownerName
          .toLowerCase()
          .indexOf(viewModel.filter().toLowerCase()) >= 0
      );
    });
  });

  viewModel.changeLang = function () {
    viewModel.text(viewModel.texts && viewModel.texts[viewModel.lang()]);
    updateFBLink();
  };

  $.getJSON("https://freegeoip.net/json/", function (location) {
    viewModel.countryCode(location.country_code);
  });

  viewModel.winDailyPrize = function () {
    return viewModel.prize != null;
  };

  viewModel.share = function () {
    alert("Shared!");
  };

  viewModel.isValidBrowser = ko.computed(function () {
    if (viewModel.cheatBrowserIncompatible()) return false;

    try {
      if (
        //navigator.userAgent.match(/Android/i)
        //||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      ) {
        return false;
      }
    } catch (er) {}

    var s = document.createElement("p").style;
    return (
      "transition" in s ||
      "WebkitTransition" in s ||
      "MozTransition" in s ||
      "msTransition" in s ||
      "OTransition" in s
    );
  });

  viewModel.imMobile = ko.computed(function () {
    if (!viewModel.isValidBrowser()) {
      return false;
    }
    var isMobile = false;
    try {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      ) {
        isMobile = true;
      }
    } catch (er) {}

    if (window.innerWidth <= 800 && window.innerHeight <= 600) {
      isMobile = true;
    }

    return isMobile;
  });

  viewModel.win = function () {
    if (!viewModel.token()) viewModel.screen("welcomeYouWinUnregister");
    else if (viewModel.winDailyPrize()) {
      if (viewModel.prize.indexOf("dailyCoupons") != -1)
        viewModel.textYouWin(viewModel.getText("welcomeYouWinDailyCoupons")());
      else if (viewModel.prize.indexOf("dailyEggs") != -1)
        viewModel.textYouWin(viewModel.getText("welcomeYouWinDailyEggs")());
      viewModel.screen("welcomeYouWinDaily");
    } else {
      viewModel.screen("youHaveTickets");
    }
  };

  viewModel.proceed = function () {
    use(
      "registerWin",
      function (data) {
        viewModel.goWorld();
      },
      viewModel.prizeForm
    );
  };

  viewModel.backToWelcome = function () {
    viewModel.token(null);
    if (viewModel.countryCode() == "BE" || viewModel.countryCode() == "FR") {
      viewModel.screen("welcome");
    } else {
      viewModel.screen("welcomeNoWin");
    }
  };

  viewModel.countryCode.subscribe(function () {
    if (viewModel.screen() == "welcome" || viewModel.screen() == "welcomeNoWin")
      viewModel.backToWelcome();
  });

  viewModel.goMessage = function (lang) {
    viewModel.lang(lang);
    viewModel.backToWelcome();
    bp.sistema.audio.play("EasterWorldLoop_v001.mp3", true, 0.3);
  };

  viewModel.getText = function (key) {
    return ko.computed(function () {
      return (viewModel.text() && viewModel.text()[key]) || "$" + key;
    });
  };

  viewModel.goRegister = function () {
    viewModel.screen("register");
  };

  viewModel.goLogin = function () {
    viewModel.screen("login");
    viewModel.token("....");
    viewModel.selectedGroup(null);
    viewModel.group(null);
  };

  viewModel.goAgain = function () {
    if (!viewModel.token()) viewModel.screen("youLose");
    else viewModel.screen("playAgainLose");
  };

  viewModel.goPlaying = function () {
    viewModel.screen("playing");
  };

  viewModel.backRegister = function () {
    viewModel.screen("login");
  };

  viewModel.goModeSelect = function (game) {
    if (game) viewModel.selectedGame(game);

    if (!viewModel.token()) viewModel.goGameSingle();
    else viewModel.screen("modeSelect");
  };

  viewModel.goEditMyGroup = function () {
    viewModel.groupEdit(viewModel.myGroup());
    viewModel.screen("editMyGroup");
  };

  viewModel.goMyGroups = function () {
    viewModel.screen("myGroups");
  };

  viewModel.playForFun = function () {
    viewModel.token(null);
    viewModel.goWorld();
  };

  viewModel.okFacebook = function () {
    //viewModel.token("...");
    //viewModel.goWorld();
  };

  viewModel.showError = function (data) {
    var msg = "generic_error";
    if (data && data.status) msg = data.status;
    msg = viewModel.getText(msg);
    if (msg) msg = msg();
    else msg = "Error " + data;
    alert(msg);
  };

  viewModel.executeLogin = function (data) {
    viewModel.token(data.token);
    viewModel.name(data.name || "??");

    if (!data.myGroup || !data.myGroup.name) data.myGroup = null;

    viewModel.group(data.myGroup);
    viewModel.createdGroup(data.myGroup);
    viewModel.goWorld();

    viewModel.updateMyGroups();
  };

  viewModel.okLogin = function (success) {
    var email = viewModel.reg_email();
    var pass = viewModel.reg_pass();
    pass = CryptoJS.SHA512(pass).toString(CryptoJS.enc.Hex);

    viewModel.reg_email("");
    viewModel.reg_pass("");

    use(
      "login",
      function (data) {
        if (data && data.token) {
          if (success && typeof success == "function") success();

          viewModel.email(email);
          viewModel.pass(pass);
          viewModel.executeLogin(data);
        } else {
          viewModel.showError(data);
        }
      },
      {
        email: email,
        password: pass,
        game: "ALC" + viewModel.selectedGame(),
      }
    );
  };

  viewModel.groupKey = function () {
    return viewModel.group() && viewModel.group().key;
  };

  viewModel.gameCode = function () {
    var game = "ALC" + viewModel.selectedGame();

    if (viewModel.groupKey()) game += "g" + viewModel.groupKey();

    return game;
  };

  viewModel.updateToken = function (success) {
    if (!viewModel.email()) return;

    if (!viewModel.pass()) viewModel.pass("");

    var game = viewModel.gameCode();

    use(
      "login",
      function (data) {
        if (data && data.token) {
          if (success && typeof success == "function") success();

          viewModel.token(data.token);
        } else {
          viewModel.showError(data);
        }
      },
      {
        email: viewModel.email(),
        password: viewModel.pass(),
        game: game,
      }
    );
  };

  viewModel.okRegister = function () {
    var email = viewModel.reg_email();
    var name = viewModel.reg_name();
    var pass = viewModel.reg_pass();

    confirm(
      "register",
      function (data) {
        //console.log('register ok');

        viewModel.okLogin(function () {
          viewModel.reg_email("");
          viewModel.reg_name("");
          viewModel.reg_pass("");

          if (viewModel.optOut()) {
            confirm(
              "optout",
              function (data) {
                //console.log('optout ok');
              },
              {
                email: email,
              }
            );
          }
        });
      },
      {
        name: name,
        email: email,
        password: CryptoJS.SHA512(pass).toString(CryptoJS.enc.Hex),
      }
    );
  };

  viewModel.goWorld = function () {
    viewModel.screen("world");
  };

  viewModel.goGameSingle = function () {
    viewModel.group(null);
    viewModel.goGame();
  };

  viewModel.goGroupPlay = function (selected) {
    viewModel.selectedGroup(selected);
    viewModel.goGameGroup();
  };

  viewModel.goGameGroup = function () {
    if (viewModel.selectedGroup()) viewModel.group(viewModel.selectedGroup());
    viewModel.goGame();
  };

  viewModel.goGame = function () {
    viewModel.screen("playing");
  };

  viewModel.goGroup = function () {
    viewModel.screen("group");

    viewModel.updateAllGroups();
  };

  viewModel.logout = function () {
    viewModel.backToWelcome();
  };

  viewModel.quitGroup = function () {};

  viewModel.goCreateGroup = function () {
    viewModel.screen("createGroup");
  };

  viewModel.goEditGroup = function () {
    viewModel.screen("editGroup");
  };

  viewModel.updateAllGroups = function () {
    use(
      "getAllGroups",
      function (data) {
        if (data.groups) {
          viewModel.allGroups(data.groups);
          for (var i in viewModel.allGroups()) {
            var group = viewModel.allGroups()[i];
            group.members = ko.observableArray(group.members);
          }
        } else {
          console.log("error at getAllGroups.");
        }
      },
      {}
    );
  };

  viewModel.goFindGroup = function () {
    viewModel.selectedGroup(undefined);
    viewModel.filter("");
    viewModel.screen("findGroup");
  };

  viewModel.createGroup = function () {
    var data = ko.toJS(viewModel.groupEdit);
    data.token = viewModel.token();
    data.ownerName = viewModel.name();

    use(
      "createGroup",
      function (retorno) {
        data.key = retorno.key;
        viewModel.screen("group");
        viewModel.createdGroup(data);
        viewModel.myGroups.push(retorno.key);
        viewModel.group(data);
        viewModel.selectedGroup(null);
        viewModel.selectedGroup(retorno.key);
        viewModel.updateAllGroups();
      },
      data
    );
  };

  viewModel.editGroup = function () {
    var data = ko.toJS(viewModel.groupEdit);
    data.token = viewModel.token();
    data.ownerName = viewModel.name();

    use(
      "editGroup",
      function (data) {
        viewModel.screen("group");
        viewModel.createdGroup(viewModel.group());
      },
      data
    );
  };

  viewModel.backGroup = function () {
    viewModel.screen("group");
  };

  viewModel.goLogin = function () {
    viewModel.screen("login");
  };

  viewModel.joinGroup = function () {
    if (viewModel.selectedGroup()) {
      use(
        "joinGroup",
        function (data) {
          viewModel.myGroups.push(viewModel.selectedGroup().key);
          viewModel.selectedGroup().members().push(viewModel.name());
          var sel = viewModel.selectedGroup();
          viewModel.selectedGroup(null);
          viewModel.selectedGroup(sel);
        },
        {
          groupKey: viewModel.selectedGroup().key,
        }
      );
    }
  };

  var languageOrIncompatible = function () {
    if (viewModel.isValidBrowser()) {
      viewModel.screen("language");
    } else {
      viewModel.screen("incompatible");
    }

    if (window.location.href.indexOf("data=") != -1) {
      try {
        var inicioData = window.location.href.indexOf("data=") + 6;
        var fimData = window.location.href.indexOf("#_=_");
        var data = "";
        if (fimData == -1)
          data = JSON.parse(
            unescape(window.location.href.substring(inicioData - 1))
          );
        else
          data = JSON.parse(
            unescape(window.location.href.substring(inicioData - 1, fimData))
          );
        if (data.lang) viewModel.lang(data.lang);
        //viewModel.token(data.token);
        if (data.data) {
          viewModel.executeLogin(data.data);
          viewModel.email(data.email);
          viewModel.pass("");
        }
        console.log("data " + viewModel.token());
        //viewModel.goWorld();
      } catch (exp) {
        console.log("can't login automaticly " + window.location.href);
      }
    }
  };

  viewModel.cheatBrowserIncompatible.subscribe(function () {
    languageOrIncompatible();
  });

  viewModel.cheatCountry.subscribe(function () {
    viewModel.countryCode(viewModel.cheatCountry());
  });

  languageOrIncompatible();

  viewModel.mobile = viewModel.imMobile();

  viewModel.balance = balance;
  viewModel.wave(balance.wave || "wave1");

  viewModel.texts = texts;
  var lang = viewModel.lang();
  if (!lang) lang = "EN";
  viewModel.lang("");
  viewModel.lang(lang);

  viewModel.loaded(true);

  viewModel.zoom = ko.observable(1);

  viewModel.zoomIn = function () {
    if (viewModel.zoom() < 1.3) {
      viewModel.zoom(viewModel.zoom() + 0.05);
    }
    TweenLite.set($("#fundo"), { scale: viewModel.zoom() });
  };

  viewModel.zoomOut = function () {
    if (viewModel.zoom() > 0.7) {
      viewModel.zoom(viewModel.zoom() - 0.05);
    }
    TweenLite.set($("#fundo"), { scale: viewModel.zoom() });
  };
  /*
FB.getLoginStatus(function(response) {
	console.log(response.status);
  if (response.status === 'connected') {
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token 
    // and signed request each expire
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
  } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
  } else {
    // the user isn't logged in to Facebook.
  }
 });
*/
  ko.applyBindings(viewModel);

  return viewModel;
});
