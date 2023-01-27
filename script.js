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

// Sends original gray to CSS
let color = 808080;
documentElement.style.setProperty('--main-color', color);

// Fetches data.json
let validLangs = ["Abkhaz", "Adyghe", "Afar", "Afrikaans", "Ainu", "Gheg Albanian", "Tosk Albanian", "Aleut", "Altai", "Amharic", "Arabic", "Armaic", "Arbanaski", "Armenian", "Eastern Albanian", "Assamese", "Avar", "Azeri", "Balochi", "Basaa", "Bashkir", "Basque", "Belarusian", "Bemba", "Bengali", "Bihari", "Bole", "Brahui", "Brazilian", "Breton", "Bulgarian", "Burmese", "Burushaski", "Buryat", "Buyang", "Catalan", "Cebuano", "Chechen", "Cantonese", "Mandarin", "Chuvash", "Comorian", "Cornish", "Croatian", "Czech", "Danish", "Dargwa", "Dhivehi", "Digor Ossetic", "Dizi", "Douala", "Dutch", "English", "Estonian", "Even", "Faroese", "Finnish", "Flemish", "French", "Frisian", "Friulian", "Fula", "Galician", "Gelao", "Georgian", "German", "Greek", "Eastern Greenlandic", "Western Greenlandic", "Gujarati", "Gypsy Romani", "Hausa", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Iron Ossetic", "Ishkashimi", "Istro-Romanian", "Italian", "Japanese", "Javanese", "Kabardian", "Kabylian", "Kalasha", "Kalmyk", "Kannada", "Karelian", "Kashmiri", "Kazakh", "Ket", "Khanti", "Khmer", "Khowar", "Kivalliq", "Komi", "Korean", "Kurdish", "Kurukh", "Kyrgyz", "Labrador Inuttut", "Ladin", "Lahnda", "Lak", "Lao", "Latvian", "Letzebuergesch", "Lezgian", "Lithuanian", "Macedonian", "Magahi", "Malagasy", "Malayalam", "Maltese", "Mansi", "Maori", "Marathi", "Mari", "Marwari", "Mon", "Mongolian", "Nayi", "Nenets", "Nepali", "Norwegian Bokmal", "Norwegian Nynorsk", "Oriya", "Oromo", "Oroqen", "Pashto", "Pennsylvania Dutch", "Persian", "Polish", "Portuguese", "Provencal", "Punjabi", "Romanian", "Romansch", "Russian", "Sami", "Samoan", "Sardinian Logudorese", "Sardinian Nuorese", "Sariqoli", "Schwyzerduetsch", "Scots", "Scottish Gaelic", "Serbian", "Shan", "Sheko", "Sindhi", "Sinhalese", "Slovak", "Slovene", "Somali", "Spanish", "Sranan", "Swahili", "Swedish", "Tagalog", "Tahitian", "Tajik", "Tamasheq", "Tamil", "Tashelhit", "Tatar", "Tausug", "Telugu", "Thai", "Tibetan", "Tigrigna", "Tmazight", "Tsakonian", "Turkish", "Turkmen", "Tuvan", "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Veps", "Vietnamese", "Vlach", "Wakhi", "Walloon", "Warji", "Waziri", "Welsh", "Wolof", "Yakut", "Yiddish", "Yoruba", "Yupik", "Zazaki", "Zulu"];

// Guessing box variable setup
let guessingBox = document.getElementById("guessingBox");
let guessingButton = document.getElementById("guessingButton");

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
          let proximity = (100 - distance);
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
  if (0 <= proximity <= 14) {
    color = ff4d3d;
  } else if (14 < proximity <= 28) {
    color = ff6a3d;
  } else if (28 < proximity <= 42) {
    color = ff9b3d;
  } else if (42 < proximity <= 56) {
    color = ffcf3d;
  } else if (56 < proximity <= 70) {
    color = fff53d;
  } else if (70 < proximity <= 84) {
    color = e2ff3d;
  } else if (84 < proximity < 100) {
    color = b5ff3d;
  } else if (proximity === 100) {
    color = e36fd7;
  }
  documentElement.style.setProperty('--main-color', color);
  if (guesses.length === 1) {
    document.getElementById("percent-1").innerHTML = proximity + "%";
  } else if (guesses.length === 2) {
    document.getElementById("percent-2").innerHTML = proximity + "%";
  } else if (guesses.length === 3) {
    document.getElementById("percent-3").innerHTML = proximity + "%";
  } else if (guesses.length === 4) {
    document.getElementById("percent-4").innerHTML = proximity + "%";
  } else if (guesses.length === 5) {
    document.getElementById("percent-5").innerHTML = proximity + "%";
  } else if (guesses.length === 6) {
    document.getElementById("percent-6").innerHTML = proximity + "%";
  } 
}

// Welcome modal
function popMessage(heading, text) {
  document.getElementById("popHeading").innerHTML = heading;
  document.getElementById("popText").innerHTML = text;
  modal.showModal();
}
popMessage("Welcome to Babl!", "A twist on the traditional Wordle, you'll test out your linguistic skills through a daily guessing puzzle. Here's how to play: Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!");

// Event listener collects values from guessing box
function guessingFunction() {
  let arrInput = guessingBox.value;
  if (validLangs.includes(arrInput)) {
    if (guesses.length < 6 && won === false && arrInput != lang) {
      guesses.push(arrInput);
      printGuess(guesses);
      printPercent(calculateProx(arrInput,lang));
    } else if (guesses.length < 6 && won === false && arrInput === lang) {
        won = true;
        popMessage("You won!", "You're a language genius! Come back tomorrow for the next puzzle.");
    } else if (guesses.length === 6 && won === false) {
      popMessage("You lost!", "You didn't guess the correct language. Come back tomorrow for the next puzzle.");
    }
  } else {
    popMessage("Uh-oh!", "You entered a language that doesn't exist. Make sure that the first letter is capitalized. If that doesn't work, check out this list of accepted languages.");
  }
  guessingBox.value = "";
}

// Event listener can close modal
closeModal.addEventListener('click', () => {
  modal.close();
});

helpButton.addEventListener('click', () => {
  popMessage("Welcome to Babl!", "A twist on the traditional Wordle, you'll test out your linguistic skills through a daily guessing puzzle. Here's how to play: Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!");
});