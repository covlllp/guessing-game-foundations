var val = generateNewNumber();
var INIT_GUESSES = 6;
var guesses = INIT_GUESSES;
var prev_guesses = [];
var prev_guess = null;


$(document).ready(function () {
	updateGuessText();

	// JQuery to collect Guesses
	$("#submit").on("click", collectGuess);
	$("#guessbox").on("keyup", function(event) {
		var key = event.which;
		if (key == 13) {
			if ($(this).hasClass("disabled")) alert("Please restart the game!");
			else collectGuess();
		}
	});

	// Toggle hints
	$("#hint").on("click", toggleHints);

	// Replaying the game
	$("#replay").on("click", replayGame);
});

// Function collects guess and checks if game is over. Updates HTML.
function collectGuess() {
	var guess = $("#guessbox").val();
	var coldhot;
	var text;

	// Validate guess
	if (validateNumber(guess)) return;

	// Check if guess is right. If not, return formatted text
	if (val == guess) {
		text = "You guessed correctly!";
		endGame("correct");
	} else {
		var obj = getHotColdText(guess);
		text = obj[0];
		coldhot = obj[1];
	}

	// Check if game is over
	updateGuessParams(guess);
	if (guesses == 0) {
		endGame("lose");
		text = "You ran out of guesses, you lose!";
	}

	// Update HTML
	updateGuessText();
	$("#status-text").html(text).fadeIn(100).fadeOut(100).fadeIn(100);
	printPrevGuesses(coldhot);
	removeHints();
}

// Updates guess global variables
function updateGuessParams(guess) {
	if (guesses > 0) guesses--;
	prev_guesses.push(guess);
	prev_guess = guess;
}

// Returns hot or cold text
function getHotColdText(guess) {
	var text = "";
	var coldhot;
	var prevDiff = prev_guess ? Math.abs(val - prev_guess) : null;
	var curDiff = Math.abs(val - guess);

	if (prev_guess == null) {
		text += "It's your first guess,";
		coldhot = "cold";
	} else {
		text += "You're getting <span class=\"colorme\">";
		if (curDiff > prevDiff) {
			text += "colder</span>,";
			coldhot = "cold";
		} else {
			text += "warmer</span>,";
			coldhot = "hot";
		}
	}
	if (guess < val) {
		text += " your guess is too low!";
	} else if (guess > val) {
		text += " your guess is too high!";
	}
	return [text, coldhot];
}

// Toggles showing number
function toggleHints() {
	var dom = $("#hint-text");
	dom.toggleClass("show");
	if (dom.hasClass("show")) {
		dom.text("The answer is " + val);
	} else {
		removeHints();
	}
}

// Ends the game with either winning or losing
function endGame(winFlag) {
	$(".container").addClass(winFlag);
	$(".disablable").addClass("disabled");
	$("#guessbox").attr("disabled","disabled");
}

// Restarts the game
function replayGame() {
	val = generateNewNumber();
	guesses = INIT_GUESSES;
	prev_guesses = [];
	prev_guess = null;
	$(".popup-text").text("");
	$("#status-text").text("You have restarted the game!");
	$(".disablable").removeClass("disabled");
	$(".container").removeClass("correct");
	$(".container").removeClass("lose");	
	$("#guessbox").removeAttr("disabled");
	clearInputBox();
	updateGuessText();
	removeHints();
}

// Hides showing number
function removeHints() {
	$("#hint-text").removeClass("show");
	$("#hint-text").text("");
}

// Checks if guess is valid
function validateNumber(guess) {
	clearInputBox();
	var dom = $("#status-text");

	if (guess == "") return true;
	else if (guesses == 0) {
		shakeAndUpdate("You have no more guesses! Please click 'Play again'.");
		return true;
	} else if (guess % 1 != 0) {
		shakeAndUpdate("Oops! Please make sure you're putting in an integer!");
		return true;
	} else if (guess < 0 || guess > 100) {
		shakeAndUpdate("Whoa! You're supposed to guess a number between 1 and 100!");
		return true;
	} else if (prev_guesses.indexOf(guess) != -1) {
		shakeAndUpdate("You already guessed this number!");
		return true;
	}
	return false
}

function shakeAndUpdate(text) {
	$("#status-text").text(text);
	$("#guessbox").effect("shake");
}

// Generates new number
function generateNewNumber() {
	return Math.floor(Math.random() * 100) + 1;
}

// Clears the input box
function clearInputBox() {
	$("#guessbox").val("");
}

// Updates how many guesses remain
function updateGuessText() {
	var dom = $("#guess-text");
	var guess_text = guesses > 1 ? " guesses" : " guess"
	if (guesses == 0) {
		dom.html("The final number was <b>" + val + "</b>");
	} else {
		dom.text("You have " + guesses + guess_text + " remaining.");
	}
}

// Prints previous guesses
function printPrevGuesses(hotcold) {
	var color_text = hotcold == "cold" ? "class=\"cold\"" : "class=\"hot\""
	var text = prev_guesses.length != 1 ?
		$("#prev-text").html() + ", ": "Your previous guesses have been: <br>";
	text += "<span " + color_text + ">"
		+ prev_guesses[prev_guesses.length - 1] + "</span>";
	$("#prev-text").html(text);
	$(".colorme").addClass(hotcold);
}