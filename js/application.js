var val = generateNewNumber();
var init_guesses = 10;
var guesses = init_guesses;
var prev_guesses = [];
var prev_guess = null;


$(document).ready(function () {
	$("#submit").on("click", collectGuess);
	$("#guessbox").on("keyup", function(event) {
		var key = event.which;
		if (key == 13) {
			if ($(this).hasClass("disabled")) alert("Please restart the game!");
			else collectGuess();
		}
	});


	$("#hint").on("click", function() {
		var dom = $("#hint-text");
		dom.toggleClass("show");
		if (dom.hasClass("show")) {
			dom.text("The answer is " + val);
		} else {
			dom.text("");
		}
	});

	$("#replay").on("click", function() {
		val = generateNewNumber();
		guesses = init_guesses;
		prev_guesses = [];
		prev_guess = null;
		$(".popup-text").text("");
		$(".disablable").removeClass("disabled");
		$(".container").removeClass("correct");
		$("#guessbox").removeAttr("disabled");
		clearInputBox();
		updateGuessText();
	});
});

function collectGuess() {
	var guess = $("#guessbox").val();

	if (validateNumber(guess)) return;

	var text = "";
	if (val == guess) {
		text = "You guessed correctly!"
		$(".container").addClass("correct");
		$(".disablable").addClass("disabled");
		$("#guessbox").attr("disabled","disabled");
	} else {
		var prevDiff = prev_guess ? Math.abs(val - prev_guess) : null;
		var curDiff = Math.abs(val - guess);
		var coldhot;

		if (prev_guess == null) {
			text += "It's your first guess";
			coldhot = "cold";
		} else {
			text += "You're getting <span class=\"colorme\">";
			if (curDiff > prevDiff) {
				text += "colder</span>";
				coldhot = "cold";
			} else {
				text += "warmer</span>";
				coldhot = "hot";
			}
		}

		if (guess < val) {
			text += ", your guess is too low!";
		} else if (guess > val) {
			text += ", your guess is too high!";
		}
	}

	if (guesses > 0) guesses--;
	updateGuessText();
	prev_guesses.push(guess);
	prev_guess = guess;
	clearInputBox();
	$("#status-text").html(text).fadeIn(100).fadeOut(100).fadeIn(100);
	$("#hint-text").removeClass("show");
	$("#hint-text").text("");
	printPrevGuesses(coldhot);
}

function validateNumber(guess) {
	if (guess == "") return true;
	else if (guesses == 0) {
		alert("You have no more guesses! Please click 'Play again'.");
		return true;
	} else if (guess % 1 != 0) {
		alert("Oops! Please make sure you're putting in an integer!");
		return true;
	} else if (guess < 0 || guess > 100) {
		alert("Whoa! You're supposed to guess a number between 1 and 100!");
		return true;
	} else if (prev_guesses.indexOf(guess) != -1) {
		alert("You already guessed this number!");
		return true;
	}
	return false
}

function generateNewNumber() {
	return Math.floor(Math.random() * 100) + 1;
}

function clearInputBox() {
	$("#guessbox").val("");
}

function updateGuessText() {
	var guess_text = guesses > 1 ? " guesses" : " guess"
	$("#guess-text").text("You have " + guesses + guess_text + " remaining.");
}

function printPrevGuesses(hotcold) {
	var color_text = hotcold == "hot" ? "class=\"hot\"" : "class=\"cold\""

	var text = prev_guesses.length != 1 ?
		$("#prev-text").html() + ", ": "Your previous guesses have been: <br>";

	text += "<span " + color_text + ">"
		+ prev_guesses[prev_guesses.length - 1] + "</span>";

	text = text.substring(0, text.length - 2);
	$("#prev-text").html(text);
	$(".colorme").addClass(hotcold);

//	var text = "Your previous guesses have been:<br>";
//	for (var i = 0; i < prev_guesses.length; i++) {
//		text += prev_guesses[i] + ", ";
//	}
//	text = text.substring(0, text.length - 2);
//	$("#prev-text").html(text)
}