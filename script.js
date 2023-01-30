// VARIABLE SETUP
let phrase; // Game variables
let lang;
const guesses = [];
let won = false;
let sendColor;

phrase = "Příběh starý jako čas"; // Test values
lang = "Czech";

const modal = document.querySelector('#modal'); // Modal variables
const helpButton = document.querySelector(".howto");
const closeModal = document.querySelector('.close-button');

let guessingBox = document.getElementById("guessingBox"); // Input box/button variables
let guessingButton = document.getElementById("guessingButton");

let validLangs = ["Abkhaz", "Adyghe", "Afar", "Afrikaans", "Ainu", "Gheg Albanian", "Tosk Albanian", "Aleut", "Altai", "Amharic", "Arabic", "Armaic", "Arbanaski", "Armenian", "Eastern Albanian", "Assamese", "Avar", "Azeri", "Balochi", "Basaa", "Bashkir", "Basque", "Belarusian", "Bemba", "Bengali", "Bihari", "Bole", "Brahui", "Brazilian", "Breton", "Bulgarian", "Burmese", "Burushaski", "Buryat", "Buyang", "Catalan", "Cebuano", "Chechen", "Cantonese", "Mandarin", "Chuvash", "Comorian", "Cornish", "Croatian", "Czech", "Danish", "Dargwa", "Dhivehi", "Digor Ossetic", "Dizi", "Douala", "Dutch", "English", "Estonian", "Even", "Faroese", "Finnish", "Flemish", "French", "Frisian", "Friulian", "Fula", "Galician", "Gelao", "Georgian", "German", "Greek", "Eastern Greenlandic", "Western Greenlandic", "Gujarati", "Gypsy Romani", "Hausa", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Iron Ossetic", "Ishkashimi", "Istro-Romanian", "Italian", "Japanese", "Javanese", "Kabardian", "Kabylian", "Kalasha", "Kalmyk", "Kannada", "Karelian", "Kashmiri", "Kazakh", "Ket", "Khanti", "Khmer", "Khowar", "Kivalliq", "Komi", "Korean", "Kurdish", "Kurukh", "Kyrgyz", "Labrador Inuttut", "Ladin", "Lahnda", "Lak", "Lao", "Latvian", "Letzebuergesch", "Lezgian", "Lithuanian", "Macedonian", "Magahi", "Malagasy", "Malayalam", "Maltese", "Mansi", "Maori", "Marathi", "Mari", "Marwari", "Mon", "Mongolian", "Nayi", "Nenets", "Nepali", "Norwegian Bokmal", "Norwegian Nynorsk", "Oriya", "Oromo", "Oroqen", "Pashto", "Pennsylvania Dutch", "Persian", "Polish", "Portuguese", "Provencal", "Punjabi", "Romanian", "Romansch", "Russian", "Sami", "Samoan", "Sardinian Logudorese", "Sardinian Nuorese", "Sariqoli", "Schwyzerduetsch", "Scots", "Scottish Gaelic", "Serbian", "Shan", "Sheko", "Sindhi", "Sinhalese", "Slovak", "Slovene", "Somali", "Spanish", "Sranan", "Swahili", "Swedish", "Tagalog", "Tahitian", "Tajik", "Tamasheq", "Tamil", "Tashelhit", "Tatar", "Tausug", "Telugu", "Thai", "Tibetan", "Tigrigna", "Tmazight", "Tsakonian", "Turkish", "Turkmen", "Tuvan", "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Veps", "Vietnamese", "Vlach", "Wakhi", "Walloon", "Warji", "Waziri", "Welsh", "Wolof", "Yakut", "Yiddish", "Yoruba", "Yupik", "Zazaki", "Zulu"]; // Verifies languages

// HTML & CSS SETUP
document.getElementById("guess-1").innerHTML = ""; // Clears guessing boxes at start
document.getElementById("guess-2").innerHTML = "";
document.getElementById("guess-3").innerHTML = "";
document.getElementById("guess-4").innerHTML = "";
document.getElementById("guess-5").innerHTML = "";
document.getElementById("guess-6").innerHTML = "";

document.getElementById("percent-1").style.background = "#808080";

// FUNCTIONS SETUP
function compareLanguages(guess, correct, callback) {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            let similarityScore;
            let guessCorrect = data.languageData.languages.find(lang => (lang.language1 === guess && lang.language2 === correct) || (lang.language1 === correct && lang.language2 === guess));
            if (guessCorrect) {
                similarityScore = guessCorrect.distance;
                callback(null, similarityScore);
            } else {
                callback("Similarity score not found", null);
            }
        })
        .catch(error => callback(error, null));
}

function calculateProx(arrInput, lang, callback) {
  compareLanguages(arrInput, lang, (error, distance) => {
    if (error) {
      callback(error, null);
    } else {
      let proximity = (100 - distance);
      callback(null, proximity);
    }
  });
}

function printGuess(guesses) { // Sends guess to HTML
  document.getElementById("guess-" + guesses.length).innerHTML = guesses[guesses.length];

function printPercent(proximity) { // Sends percent and colors to HTML & CSS
  console.log(proximity)
  const colors = ["#ff4d3d","#ff6a3d","#ff9b3d","#ffcf3d","#fff53d","#e2ff3d","#b5ff3d","#21ff3b"];
  const checkpoints = [12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  sendColor = "";
  let i = 0;
  while (sendColor == "") {
    if (proximity < checkpoints[i]) {
      sendColor = colors[i];
    }
    i++;
  }
  document.getElementById("percent-" + guesses.length).innerHTML = proximity + "%";
  document.getElementById("percent-" + guesses.length).style.background = sendColor;
}

//Tells you if the answer is right or wrong
function guessingFunction() {
  let arrInput = guessingBox.value;
  Console.log("Omg it's actually calling guessingFunction");
  if (!validLangs.includes(arrInput)) {
    document.getElementById("popHeading").innerHTML = "Uh-oh!";
    document.getElementById("popText").innerHTML = "You entered a language that doesn't exist. Make sure that the first letter is capitalized. If that doesn't work, check out this list of accepted languages.";
    modal.showModal();
    return
  }
    if (guesses.length < 5 && won == false && arrInput != lang) {
      guesses.push(arrInput);
      printGuess(guesses);
      let proximity = calculateProx(arrInput,lang);
      printPercent(proximity);
    } else if (guesses.length <= 6 && won == false && arrInput == lang) {
      won = true;
      guesses.push(arrInput);
      printGuess(guesses);
      printPercent(calculateProx(arrInput,lang));
      document.getElementById("popHeading").innerHTML = "You won!";
      document.getElementById("popText").innerHTML = "You're a language genius! Come back tomorrow for the next puzzle.";
      modal.showModal();
    } else if (guesses.length == 5 && won == false && arrInput != lang) {
      guesses.push(arrInput);
      printGuess(guesses);
      printPercent(calculateProx(arrInput,lang));
      document.getElementById("popHeading").innerHTML = "You lost!";
      document.getElementById("popText").innerHTML = "You didn't guess the correct language. Come back tomorrow for the next puzzle.";
      modal.showModal();
  }
  guessingBox.value = "";
}
// EVENT LISTENER SETUP
document.getElementById("popHeading").innerHTML = "Welcome to Babl!"; // Technical not an EL, opens modal
document.getElementById("popText").innerHTML = "A twist on the traditional Wordle, you'll test out your linguistic skills through a daily guessing puzzle. Here's how to play: Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!";
modal.showModal();

closeModal.addEventListener('click', () => {
  modal.close();
});

helpButton.addEventListener('click', () => {
  document.getElementById("popHeading").innerHTML = "Welcome to Babl!"; // Technical not an EL, opens modal
  document.getElementById("popText").innerHTML = "A twist on the traditional Wordle, you'll test out your linguistic skills through a daily guessing puzzle. Here's how to play: Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!";
  modal.showModal();
});

guessingBox.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    guessingButton.click();
  }
});
guessingButton.addEventListener("click", () => guessingFunction());