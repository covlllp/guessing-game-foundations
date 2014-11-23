var val = generateNewNumber();
var init_guesses = 5;
var guesses = init_guesses;
var prev_guesses = [];
var prev_guess = null;


$(document).ready(function () {
	$("#submit").on("click", collectGuess);
	$("#guessbox").on("keyup", function(event) {
		var key = event.which;
		if (key == 13) collectGuess();
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
		clearInputBox();
		updateGuessText();
	});
});

function collectGuess() {
	var guess = $("#guessbox").val();

	if (validateNumber(guess)) return;

	var text;
	if (val == guess) {
		text = "You guessed correctly!"
	} else if (guess < val) {
		text = "You guessed too low!";
	} else if (guess > val) {
		text = "You guessed too high!";
	}
	$("#status-text").text(text).fadeIn(100).fadeOut(100).fadeIn(100);
	prev_guesses.push(guess);
	prev_guess = guess;
	printPrevGuesses();
	$("#hint-text").removeClass("show");
	$("#hint-text").text("");

	if (guesses > 0) guesses--;
	updateGuessText();
}

function validateNumber(guess) {
	var flag = false;
	if (guess == "") flag = true;
	else if (guess % 1 != 0) {
		alert("Oops! Please make sure you're putting in an integer!");
		flag = true;
	} else if (guess < 0 || guess > 100) {
		alert("Whoa! You're supposed to guess a number between 1 and 100!");
		flag = true;
	} else if (guesses == 0) {
		alert("You have no more guesses! Please click 'Play again'.");
		flag = true;
	} else if (prev_guesses.indexOf(guess) != -1) {
		alert("You already guessed this number!");
		flag = true;
	}

	if (flag) clearInputBox();
	return flag;
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

function printPrevGuesses() {
	var text = "Your previous guesses have been:<br>";
	for (var i = 0; i < prev_guesses.length; i++) {
		text += prev_guesses[i] + ", ";
	}
	text = text.substring(0, text.length - 2);
	console.log(text);
	$("#prev-text").html(text).fadeIn(100).fadeOut(100).fadeIn(100);
}