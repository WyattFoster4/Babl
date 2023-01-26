// Defines game variables
let phrase;
let lang;
const guesses = [];
let won = false;
let prompt;

// TEST VALUES - REMOVE LATER!
phrase = "Ejemplo";
lang = "Spanish";

// Modal variables
const modal = document.querySelector('#modal');
const helpButton = document.querySelector(".howto");
const closeModal = document.querySelector('.close-button');

// Guessing box variable setup
let guessingBox = document.getElementById("guessingBox");
let guessingButton = document.getElementById("guessingButton");

function guess() {
  alert("guessed!");
}

// Enter key = clicking "guess"
guessingBox.addEventListener("keyup", function(event) {
  guessingButton.addEventListener("click", () => guessingFunction());
  if (event.keyCode === 13) {
    guessingButton.click();
  }
});

// Function compares languages
function compareLanguages(guess, correct) {
    return new Promise((resolve, reject) => {
        // Fetch the JSON data
        fetch("data.json")
            .then(response => response.json())
            .then(data => {
                // Find the similarity score
                let similarityScore;
                let guessCorrect = data.languageData.languages.find(lang => (lang.language1 === guess && lang.language2 === correct) || (lang.language1 === correct && lang.language2 === guess));
                if (guessCorrect) {
                    similarityScore = guessCorrect.distance;
                    return resolve(similarityScore);
                } else {
                    reject("Similarity score not found");
                }
            })
            .catch(error => reject(error));
    });
}

// Empty the guessing boxes
document.getElementById("guess-1").innerHTML = "";
document.getElementById("guess-2").innerHTML = "";
document.getElementById("guess-3").innerHTML = "";
document.getElementById("guess-4").innerHTML = "";
document.getElementById("guess-5").innerHTML = "";
document.getElementById("guess-6").innerHTML = "";

async function calculateProx(arrInput,lang) {
  return compareLanguages(arrInput, lang)
      .then(distance => {
          let proximity = (100 - distance) + "%";
          printPercent(proximity);
      })
      .catch(error => console.error(error)); 
}

// Function sends guess to HTML
function printGuess(guesses) {
  if (guesses.length === 1) {
    document.getElementById("guess-1").innerHTML = guesses[0];
  } else if (guesses.length === 2) {
    document.getElementById("guess-2").innerHTML = guesses[1];
  } else if (guesses.length === 3) {
    document.getElementById("guess-3").innerHTML = guesses[2];
  } else if (guesses.length === 4) {
    document.getElementById("guess-4").innerHTML = guesses[3];
  } else if (guesses.length === 5) {
    document.getElementById("guess-5").innerHTML = guesses[4];
  } else if (guesses.length === 6) {
    document.getElementById("guess-6").innerHTML = guesses[5];
  } 
}

// Function sends % to HTML
function printPercent(proximity) {
  if (guesses.length === 1) {
    document.getElementById("percent-1").innerHTML = proximity;
  } else if (guesses.length === 2) {
    document.getElementById("percent-2").innerHTML = proximity;
  } else if (guesses.length === 3) {
    document.getElementById("percent-3").innerHTML = proximity;
  } else if (guesses.length === 4) {
    document.getElementById("percent-4").innerHTML = proximity;
  } else if (guesses.length === 5) {
    document.getElementById("percent-5").innerHTML = proximity;
  } else if (guesses.length === 6) {
    document.getElementById("percent-6").innerHTML = proximity;
  } 
}

// Welcome modal
document.getElementById("popHeading").innerHTML = "Welcome to Babl!";
document.getElementById("popText").innerHTML = "A twist on the traditional Wordle, you'll test out your linguistic skills through a daily guessing puzzle. Here's how to play: Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!";
modal.showModal();

// Event listener collects values from guessing box
function guessingFunction() {
  let arrInput = guessingBox.value;
  if (arrInput !== "" && arrInput !== " ") {
    if (data.hasOwnProperty(arrInput)) {
      if (guesses.length < 6 && won === false) {
        guesses.push(arrInput);
        printGuess(guesses);
        printPercent(calculateProx(arrInput,lang));
        if (arrInput === lang) {
          won = true;
          document.getElementById("popHeading").innerHTML = "You won!";
          document.getElementById("popText").innerHTML = "You're a language genius! Come back tomorrow for the next puzzle.";
          modal.showModal();
        }
      }
    } else {
      document.getElementById("popHeading").innerHTML = "Uh-oh!";
      document.getElementById("popText").innerHTML = "You entered a language that doesn't exist. Make sure that the first letter is capitalized. If that doesn't work, check out this list of accepted languages.";
    }
    if (guesses.length === 6 && won === false) {
      document.getElementById("popHeading").innerHTML = "You lost!";
      document.getElementById("popText").innerHTML = "You didn't guess the correct language. Come back tomorrow for the next puzzle.";
      modal.showModal();
    }
  }
  guessingBox.value = "";
}

// Event listener can close modal
closeModal.addEventListener('click', () => {
  modal.close();
});
helpButton.addEventListener('click', () => {
  document.getElementById("popHeading").innerHTML = "Welcome to Babl!";
  document.getElementById("popText").innerHTML = "A twist on the traditional Wordle, you'll test out your linguistic skills through a daily guessing puzzle. Here's how to play: Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!";
  modal.showModal();
});

guessingFunction();