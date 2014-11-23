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
		var text = "The answer is " + val;
		$("#hint-text").text(text);
	});

	$("#replay").on("click", function() {
		val = generateNewNumber();
		guesses = init_guesses;
		$(".popup-text").text("");
		clearInputBox();
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
	$("#status-text").text(text);

	if (guesses > 0) guesses--;
	$("#guess-text").text("You have " + guesses + " guesses remaining.");
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