function generateWinningNumber() {
    return result = Math.floor(Math.random()*100)+1;
}

// from: https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, temp, selected;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    selected = Math.floor(Math.random() * m--);


    // And swap it with the current element.
    temp = array[m];
    array[m] = array[selected];
    array[selected] = temp;
  }

  return array;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
    if(num < 1 || num > 100 || typeof num !== 'number')
        throw "That is an invalid guess.";
    this.playersGuess = num;
    return this.checkGuess();    
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess === this.winningNumber){
        $('#hint', '#submit').prop('disabled', true);
        $('#title1').text("Press Reset.");
        return "You Win!";
    }
    else if(this.pastGuesses.indexOf(this.playersGuess) >= 0) 
        return "Already guessed that!";
    else {
        this.pastGuesses.push(this.playersGuess);
        console.log(this.playersGuess + " was registered");
        $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
    
        if(this.pastGuesses.length >= 5){
            $('#hint', '#submit').prop('disabled', true);
            $('#title1').text("Press Reset.");
            return "You Lose.";
        }
    }
    if(this.isLower()){
        console.log('Should guess higher.');
        $('#title1').text("Guess Higher.");
    }

    else {
        $('#title1').text("Guess Lower.");
        console.log('Should guess lower.');

    } 

    if(this.difference() < 10) 
        return "You\'re burning up!";
    else if(this.difference() < 25) 
        return "You\'re lukewarm.";
    else if(this.difference() < 50)
        return "You\'re a bit chilly.";
    else return "You\'re ice cold!";
}

function newGame(){
    return new Game;
}

Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);
}

$(document).ready(function() { 
    var game = newGame();
    $('#submit').on('click', function(event) {
        console.log('The submit button was clicked!');
        submitGuess(game);
        });
    $('#player-input').keypress(function(event) {
        if( event.which == 13)
            submitGuess(game);
        });
    $('#reset').on('click', function(event){
        game = newGame();
        $('#title').text("Good Old Fashioned");
        $('#title1').text("Guessing Game");
        $('h2').text("Guess a number, any number!"); 
        $('h3').text("Well, one between 1 and 100.");
        $('.guess').text('-');  
        $('#hint', '#submit').prop('disabled', false);
    });
    $('#hint').on('click', function(event){
        var hints = game.provideHint();
        $('#title').text('The winning number is ');
        $('#title1').text(hints[0]+', '+hints[1]+', or '+hints[2]);
    });
      
});

function submitGuess(game){
    var guess = $('#player-input').val();
    $('#player-input').val('');
    var output = game.playersGuessSubmission(+(guess));
    console.log(output);
    $('#title').first().text(output); 
    $('h2').text('');  
    $('h3').text('');
}