// VARIABLE SETUP

// Game variables
let phrase;
let lang;
const guesses = [];
let won = false;
let sendColor;

// Test values
phrase = "Příběh starý jako čas";
lang = "Czech";


//sets gray background for the one box that didn't have the right color (idk why)
document.getElementById("percent-1").style.background = "#828282"


// Modal variables
const modal = document.querySelector('#modal');
const helpButton = document.querySelector(".howto");
const closeModal = document.querySelector('.close-button');

// Input box/button variables
let guessingBox = document.getElementById("guessingBox");
let guessingButton = document.getElementById("guessingButton");

// List of valid languages
let validLangs = ["Abkhaz", "Adyghe", "Afar", "Afrikaans", "Ainu", "Gheg Albanian", "Tosk Albanian", "Aleut", "Altai", "Amharic", "Arabic", "Armaic", "Arbanaski", "Armenian", "Eastern Albanian", "Assamese", "Avar", "Azeri", "Balochi", "Basaa", "Bashkir", "Basque", "Belarusian", "Bemba", "Bengali", "Bihari", "Bole", "Brahui", "Brazilian", "Breton", "Bulgarian", "Burmese", "Burushaski", "Buryat", "Buyang", "Catalan", "Cebuano", "Chechen", "Cantonese", "Mandarin", "Chuvash", "Comorian", "Cornish", "Croatian", "Czech", "Danish", "Dargwa", "Dhivehi", "Digor Ossetic", "Dizi", "Douala", "Dutch", "English", "Estonian", "Even", "Faroese", "Finnish", "Flemish", "French", "Frisian", "Friulian", "Fula", "Galician", "Gelao", "Georgian", "German", "Greek", "Eastern Greenlandic", "Western Greenlandic", "Gujarati", "Gypsy Romani", "Hausa", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Iron Ossetic", "Ishkashimi", "Istro-Romanian", "Italian", "Japanese", "Javanese", "Kabardian", "Kabylian", "Kalasha", "Kalmyk", "Kannada", "Karelian", "Kashmiri", "Kazakh", "Ket", "Khanti", "Khmer", "Khowar", "Kivalliq", "Komi", "Korean", "Kurdish", "Kurukh", "Kyrgyz", "Labrador Inuttut", "Ladin", "Lahnda", "Lak", "Lao", "Latvian", "Letzebuergesch", "Lezgian", "Lithuanian", "Macedonian", "Magahi", "Malagasy", "Malayalam", "Maltese", "Mansi", "Maori", "Marathi", "Mari", "Marwari", "Mon", "Mongolian", "Nayi", "Nenets", "Nepali", "Norwegian Bokmal", "Norwegian Nynorsk", "Oriya", "Oromo", "Oroqen", "Pashto", "Pennsylvania Dutch", "Persian", "Polish", "Portuguese", "Provencal", "Punjabi", "Romanian", "Romansch", "Russian", "Sami", "Samoan", "Sardinian Logudorese", "Sardinian Nuorese", "Sariqoli", "Schwyzerduetsch", "Scots", "Scottish Gaelic", "Serbian", "Shan", "Sheko", "Sindhi", "Sinhalese", "Slovak", "Slovene", "Somali", "Spanish", "Sranan", "Swahili", "Swedish", "Tagalog", "Tahitian", "Tajik", "Tamasheq", "Tamil", "Tashelhit", "Tatar", "Tausug", "Telugu", "Thai", "Tibetan", "Tigrigna", "Tmazight", "Tsakonian", "Turkish", "Turkmen", "Tuvan", "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Veps", "Vietnamese", "Vlach", "Wakhi", "Walloon", "Warji", "Waziri", "Welsh", "Wolof", "Yakut", "Yiddish", "Yoruba", "Yupik", "Zazaki", "Zulu"];

// HTML & CSS SETUP

for (var i = 1; i<7; i++) {
  document.getElementById("guess-"+i).innerHTML = ""; // Clears guessing boxes at start
}

// FUNCTIONS SETUP

// Compares languages by reading JSON, returns similarity in percent
async function compareLanguages(guess, correct) {
  let data = await fetch("./data.json", { method: 'GET' }).then(response => response.json(response));
  console.log(data);
  let similarityScore;
  let guessCorrect = await data.languageData.languages.find(lang => (lang.language1 === guess && lang.language2 === correct) || (lang.language1 === correct && lang.language2 === guess));
  console.log(guessCorrect);
  similarityScore = guessCorrect.distance;
  return 100 - parseInt(similarityScore);
}

// Sends guess to HTML
function printGuess(guesses) {
  document.getElementById("guess-" + guesses.length).innerHTML = guesses[guesses.length - 1];
}

// Sends percent and colors to HTML & CSS
function printPercent(proximity) {
  const colors = ["#8b0000", "#ff4d3d", "#ff6a3d", "#ff9b3d", "#ffcf3d", "#fff53d", "#e2ff3d", "#b5ff3d", "#21ff3b"];
  const checkpoints = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  var sendColor = "";
  // Iterates over both arrays and fits the color to the checkpoints
  for (var i = 0; i<checkpoints.length; i++) {
    if (checkpoints[i-1] <= proximity && proximity <= checkpoints[i]) {
      sendColor = colors[i];
    }
    if (proximity == 100) {
      sendColor = "#ff00ff"
    }
  }  
  document.getElementById("percent-" + guesses.length).innerHTML = proximity + "%";
  document.getElementById("percent-" + guesses.length).style.background = sendColor;
}

// Lets you input guesses
async function guessingFunction() {
  let arrInput = guessingBox.value.trim();
  arrInput = arrInput.charAt(0).toUpperCase() + arrInput.slice(1).toLowerCase();
  console.log("Omg it's actually calling guessingFunction");
  if (!validLangs.includes(arrInput)) {
    document.getElementById("popHeading").innerHTML = "Uh-oh!";
    document.getElementById("popText").innerHTML = "You entered a language that doesn't exist. Make sure that the first letter is capitalized. If that doesn't work, check out this list of accepted languages.";
    modal.showModal();
    return;
  }
  if (guesses.length < 5 && won == false && arrInput != lang) {
    guesses.push(arrInput);
    guessingBox.value = "";
    printGuess(guesses);
    let proximity = await compareLanguages(arrInput, lang);
    console.log(proximity + "proximity")
    printPercent(proximity);
  } else if (guesses.length <= 6 && won == false && arrInput == lang) {
    won = true;
    guesses.push(arrInput);
    printGuess(guesses);
    printPercent(await compareLanguages(arrInput, lang));
    document.getElementById("popHeading").innerHTML = "You won!";
    document.getElementById("popText").innerHTML = "You're a language genius! Come back tomorrow for the next puzzle.";
    modal.showModal();
  } else if (guesses.length == 5 && won == false && arrInput != lang) {
    guesses.push(arrInput);
    printGuess(guesses);
    printPercent(await compareLanguages(arrInput, lang));
    document.getElementById("popHeading").innerHTML = "You lost!";
    document.getElementById("popText").innerHTML = "You didn't guess the correct language. Come back tomorrow for the next puzzle.";
    modal.showModal();
  }
}

// EVENT LISTENER SETUP

// Technical not an EL, opens modal
document.getElementById("popHeading").innerHTML = "Welcome to Babl!";
document.getElementById("popText").innerHTML = "A twist on the traditional Wordle, you'll test out your linguistic skills through a daily guessing puzzle. Here's how to play: Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!";
modal.showModal();

// Adds button to close modal
closeModal.addEventListener('click', () => {
  modal.close();
});

// Opens modal when the help button is clicked
helpButton.addEventListener('click', () => {
  document.getElementById("popHeading").innerHTML = "Welcome to Babl!";
  document.getElementById("popText").innerHTML = "A twist on the traditional Wordle, you'll test out your linguistic skills through a daily guessing puzzle. Here's how to play: Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!";
  modal.showModal();
});

// Lets you press enter to input guess
guessingBox.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    guessingButton.click();
  }
});
guessingButton.addEventListener("click", () => guessingFunction());

// Automatically scrolls back to the top of the page when refreshed
window.onunload = function () {
    window.scrollTo(0,0);
};
