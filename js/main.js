var Memory = {
  init: function (categories, final) {
    this.roundValue = 200;
    this.$game = $(".game");
    this.$final = $(".final");
    this.$verse = $(".verse");
    this.$modal = $(".modal");
    this.$overlay = $(".modal-overlay");
    this.$restartButton = $("button.restart");
    this.$showButton = $("button.show");
    this.$score = $(".score");
    this.animSpeed = 10;
    this.categoryArray = categories;
    this.final = final;
    this.prepareCategories(this.categoryArray);
    this.setup();
  },

  prepareCategories: function (categoryArray) {
    this.$categories = $(categoryArray);
    this.$categories.each(function (k, cat) {
      cat.$clues = $(cat.clues);
    });
  },
  promote: function (element) {
    element.parent().addClass("winning");
  },

  updateScores: function () {
    $(".team").removeClass("winning");
    let scores = [this.scoreA, this.scoreB, this.scoreC].sort(function (a, b) {
      return a - b;
    });
    var highest = scores[scores.length - 1];
    if (highest > 0) {
      if (this.scoreA == highest) {
        this.promote($(".teamA"));
      }
      if (this.scoreB == highest) {
        this.promote($(".teamB"));
      }
      if (this.scoreC == highest) {
        this.promote($(".teamC"));
      }
    }
    this.$score.fadeIn();
    this.animateScoreChange($(".teamA"), this.scoreA);
    this.animateScoreChange($(".teamB"), this.scoreB);
    this.animateScoreChange($(".teamC"), this.scoreC);

    $("#txtWagerA")[0].max = this.scoreA;
    $("#txtWagerB")[0].max = this.scoreB;
    $("#txtWagerC")[0].max = this.scoreC;

    console.log("A " + this.scoreA);
    console.log("B " + this.scoreB);
    console.log("C " + this.scoreC);
  },

  setup: function () {
    this.formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    //this.setRandomDailyDouble();
    this.htmlGame = this.buildHTMLGame();
    this.$game.html(this.htmlGame);
    this.populateFinal();
    this.$memoryCards = $(".card");
    this.$game
      .find(".category")
      .css("width", 100 / this.$categories.length + "%");

    this.paused = false;
    this.currentClueId = 0;
    this.scoreA = 0;
    this.scoreB = 0;
    this.scoreC = 0;
    this.binding();
  },

  binding: function () {
    this.$memoryCards.on("click", this.cardClicked);
    this.$restartButton.on("click", $.proxy(this.reset, this));
    this.$showButton.on("click", $.proxy(this.showVerse, this));
    this.$score.on("click", $.proxy(this.hideScore, this));
    $(document).on("keypress", $.proxy(this.keypress, this));
  },

  keypress: function (e) {
    console.log(e);
    if (e.which >= 48 && e.which <= 57) {
      //isnumeric
      //ignore key press
    } else {
      e.preventDefault();
      $(".right").hide();
      $(".wrong").hide();
      if (e.key == " ") {
        $(".c").show();
      } else if (e.key == "f") {
        //final jeopardy
        if ($(".final").is(":visible")) {
          $(".final").hide();
          $(".question").show();
        } else {
          $(".final").show();
          $(".question").hide();
        }
        this.updateScores();
      } else if (e.key == "s") {
        $(".q").hide();
        $(".final").hide();
        this.updateScores();
      } else if (e.key == "t") {
        //t
        $("#audioTheme")[0].play();
      } else if (e.key == "T") {
        //T
        $("#audioTheme")[0].pause();
      } else if (e.key == "h") {
        //h
        $(".card .inside.picked .hint").show();
      } else {
        var currentClueCard = $(".card .inside.picked");

        if (currentClueCard.length) {
          var currentClueValue = currentClueCard.parent().data("value");
          if (currentClueCard.parent().data("is-daily-double")) {
            currentClueValue = parseInt($(".wager").val());
          }
          console.log(currentClueCard.parent().data("is-daily-double"));
          hideClue = false;
          hideQuestion = false;
          if (e.key == "A") {
            this.scoreA -= currentClueValue;
            hideQuestion = true;
            $(".wrong").show();
          } else if (e.key == "B") {
            this.scoreB -= currentClueValue;
            hideQuestion = true;
            $(".wrong").show();
          } else if (e.key == "C") {
            this.scoreC -= currentClueValue;
            hideQuestion = true;
            $(".wrong").show();
          } else if (e.key == "a") {
            hideClue = true;
            this.scoreA += currentClueValue;
            $(".right").show();
          } else if (e.key == "b") {
            hideClue = true;
            this.scoreB += currentClueValue;
            $(".right").show();
          } else if (e.key == "c") {
            hideClue = true;
            this.scoreC += currentClueValue;
            $(".right").show();
          } else if (e.key == "q") {
            hideClue = true;
          }

          if (hideQuestion) {
            $(".q").hide();
          } else {
            $(".q").show();
          }

          if (hideClue) {
            $(".picked").removeClass("picked");
            currentClueCard.addClass("answered");
          }

          this.updateScores();
        }
      }
    }
  },

  // kinda messy but hey
  cardClicked: function () {
    var _ = Memory;
    var $card = $(this);
    if (
      !_.paused &&
      !$card.hasClass("title") &&
      !$card.find(".inside").hasClass("answered") &&
      !$card.find(".inside").hasClass("picked")
    ) {
      $card.find(".inside").addClass("picked");
      $card.addClass("picked");
      $card.parent().addClass("picked");
      var imageq = $card.data("qi");
      var img = "";
      if (imageq) {
        img = "<img src='" + imageq + "'/><br/>";
      }

      $(".q").html(img + $card.data("q"));

      if ($card.data("is-daily-double")) {
        $(".c").hide();
        $(".wager").focus().select();
      }

      if ($(".answered").length == $(".card").length) {
        _.win();
      }
    }
  },

  win: function () {
    this.paused = true;
    setTimeout(function () {
      Memory.showModal();
      Memory.hideVerse();
      Memory.$game.fadeOut();
    }, 1000);
  },

  showModal: function () {
    this.$overlay.show();
    this.$modal.fadeIn("slow");
  },

  showVerse: function () {
    this.$verse.fadeIn("slow");
  },

  hideModal: function () {
    this.$overlay.hide();
    this.$modal.hide();
  },

  hideVerse: function () {
    this.$verse.hide();
  },
  startSong: function () {
    $("#audio")[0].play();
  },
  startThemeSong: function () {
    $("#audio")[1].play();
  },
  hideScore: function (e) {
    if (e.target.type == "number") {
      return;
    } else if ($(e.target).hasClass("finalCategory")) {
      $(".finalCategory").hide();
      $(".finalClue").show();
    } else if ($(e.target).hasClass("finalClue")) {
      if (!this.played) {
        this.played = true;
        this.startSong();
      } else {
        $(".finalQuestion").show();
      }
    } else if ($(e.target).hasClass("finalClue")) {
    } else if ($(e.target).hasClass("btn")) {
      var delta = parseInt($(e.target).parent().children(".wager").val());
      var letter = $(e.target).parent().children(".wager")[0].id.substring(8);
      var score = this["score" + letter];

      if ($(e.target).hasClass("btnRight")) {
        score += delta;
      } else if ($(e.target).hasClass("btnWrong")) {
        score -= delta;
      }
      this["score" + letter] = score;
      this.updateScores();
    } else {
      this.$score.fadeOut();
    }
  },

  animateScoreChange: function (elem, newScore) {
    let oldScore = Number(elem.text().replace(/[^0-9\-]/g, ""));
    let delta = (newScore - oldScore) / 100;
    this.animateValueChange(elem, oldScore, newScore, delta);
  },
  animateValueChange: function (elem, fromValue, toValue, delta) {
    if (delta == undefined) {
      delta = fromValue < toValue ? 2 : -2;
    }
    /*A recursive function to increase the number.*/
    elem.text(this.formatter.format(fromValue));
    if (
      (delta > 0 && fromValue < toValue) ||
      (delta < 0 && fromValue > toValue)
    ) {
      setTimeout(function () {
        //Delay a bit before calling the function again.
        Memory.animateValueChange(elem, fromValue + delta, toValue, delta);
      }, this.animSpeed);
    }
  },

  reset: function () {
    this.hideModal();
    this.setup();
    this.$game.show("slow");
  },

  setRandomDailyDouble: function () {
    let cat = Math.floor(Math.random() * this.$categories.length);
    let ans =
      Math.floor(Math.random() * (this.$categories[cat].clues.length - 1)) + 1;
    console.log(cat + "," + ans);
    this.$categories[cat].clues[ans].isDailyDouble = true;
  },

  buildHTMLGame: function () {
    var frag = "";
    var nf = this.formatter;
    var roundValue = this.roundValue;
    this.$categories.each(function (k, cat) {
      frag +=
        '<div class="category"> <div class="card title" data-id="' +
        "cat-" +
        k +
        '"><div class="inside">\
				<div class="front" ><p>' +
        cat.name.toUpperCase() +
        '</p></div>\
				<div class="back"><p>' +
        cat.name.toUpperCase() +
        "</p></div></div>\
                </div>";
      cat.$clues.each(function (l, ans) {
        ans.question = ans.question.trim();
        if (!ans.question.endsWith("?")) {
          ans.question = ans.question + "?";
        }
        frag +=
          '<div class="card clue" data-value="' +
          (l + 1) * roundValue +
          '" data-is-daily-double="' +
          (ans.isDailyDouble ? "true" : "false") +
          '" data-q="' +
          ans.question +
          '" data-hint="' +
          ans.hint +
          '" data-qi="' +
          (ans.imageq ?? "") +
          '">';
        frag += '<div class="inside">';

        frag += '<div class="front" >';
        if (ans.isDailyDouble) {
          frag += '<div class="dailyDouble blinking">DAILY DOUBLE!</div>';
          frag += '<input class="wager" type="text" value="0" />';
        }
        frag += '<p class="a">';
        if (ans.image) {
          frag += '<img class="a" src="' + ans.image + '">';
        }

        var hint = "";
        if (ans.hint) {
          hint =
            "<br/><span class='hint' style='display:none;' >" +
            ans.hint +
            "</span>";
        }
        frag +=
          ans.clue.replace('{name}', cat.name).toUpperCase() +
          hint +
          '</p></div>\
				<div class="back"><p>$' +
          (l + 1) * roundValue +
          "</p></div></div>\
				</div>";
      });
      frag += "</div>";
    });
    return frag;
  },
  populateFinal: function () {
    if (this.final) {
      $(".finalClue").text(this.final.clue.toUpperCase());
      $(".finalCategory").text(this.final.category.toUpperCase());
      $(".finalQuestion").text(this.final.question);
    }
  },
};

var categories = [];

var cachebuster = Math.round(new Date().getTime() / 1000);
fetch("game.json?" + cachebuster)
  .then((resp) => resp.json())
  .then(function (data) {
    categories = data.categories;
    Memory.init(categories, data.final);
  });
