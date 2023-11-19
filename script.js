 // VARIABLE SETUP

// Game variables
var DateTime = luxon.DateTime;
let phrase;
let lang;
const guesses = [];
const proxList = [];
let won = false;
let sendColor;
let proximities;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const lenSolutions = 139;

var response
// Time variables
var originDate = new Date("02/01/2023");
var currentDate = new Date();
var timeDifference = currentDate.getTime() - originDate.getTime();
var bablNumber = Math.floor(timeDifference / (1000 * 3600 * 24)); //Was ceil, danica thought was stupid, may change back

//sets gray background for the one box that didn't have the right color (idk why)
document.getElementById("percent-1").style.background = "#292929";

// Modal variables
const modal = document.querySelector('#modal');
const helpButton = document.querySelector(".howto");
const closeModal = document.querySelector('.close-button');
const phraseBox = document.querySelector('#phraseBox');

// Input box/button variables
let guessingBox = document.getElementById("guessingBox");
let guessingButton = document.getElementById("guessingButton");

// List of valid languages
const validLangs = ["Abkhaz", "Adyghe", "Afar", "Afrikaans", "Ainu", "Gheg Albanian", "Tosk Albanian", "Aleut", "Altai", 
    "Amharic", "Arabic", "Aramaic", "Arbanasi", "Armenian", "Eastern Armenian", "Assamese", "Avar", "Azeri",
    "Balochi", "Basaa", "Bashkir", "Basque", "Belarusian", "Bemba", "Bengali", "Bihari", "Bole", "Brahui", "Brazilian",
    "Breton", "Bulgarian", "Burmese", "Burushaski", "Buryat", "Buyang", "Catalan", "Cebuano", "Chechen",
    "Cantonese", "Mandarin", "Chuvash", "Comorian", "Cornish", "Croatian", "Czech", "Danish",
    "Dargwa", "Dhivehi", "Digor Ossetic", "Dizi", "Douala", "Dutch", "English", "Estonian", "Even",
    "Faroese", "Finnish", "Flemish", "French", "Frisian", "Friulian", "Fula", "Galician", "Gelao", "Georgian",
    "German", "Greek", "Eastern Greenlandic", "Western Greenlandic", "Gujarati", "Romani", "Hausa",
    "Hebrew", "Hindi", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Iron Ossetic", "Ishkashimi",
    "Istro-Romanian", "Italian", "Japanese", "Javanese", "Kabardian", "Kabylian", "Kalasha", "Kalmyk",
    "Kannada", "Karelian", "Kashmiri", "Kazakh", "Ket", "Khanti", "Khmer", "Khowar", "Kivalliq", "Komi", "Korean",
    "Kurdish", "Kurukh", "Kyrgyz", "Labrador Inuttut", "Ladin", "Lahnda", "Lak", "Lao", "Latvian", "Letzebuergesch",
    "Lezgian", "Lithuanian", "Macedonian", "Magahi", "Malagasy", "Malayalam", "Maltese", "Mansi", "Maori", "Marathi",
    "Mari", "Marwari", "Mon", "Mongolian", "Nayi", "Nenets", "Nepali", "Norwegian Bokmal", "Norwegian Nynorsk",
    "Oriya", "Oromo", "Oroqen", "Pashto", "Pennsylvania Dutch", "Persian", "Polish", "Portuguese", "Provencal",
    "Punjabi", "Romanian", "Romansch", "Russian", "Sami", "Samoan", "Sardinian Logudorese", "Sardinian Nuorese",
    "Sariqoli", "Schwyzerduetsch", "Scots", "Scottish Gaelic", "Serbian", "Shan", "Sheko", "Sindhi",
    "Sinhalese", "Slovak", "Slovene", "Somali", "Spanish", "Sranan", "Swahili", "Swedish", "Tagalog", "Tahitian",
    "Tajik", "Tamasheq", "Tamil", "Tashelhit", "Tatar", "Tausug", "Telugu", "Thai", "Tibetan", "Tigrigna",
    "Tmazight", "Tsakonian", "Turkish", "Turkmen", "Tuvan", "Ukrainian", "Urdu", "Uyghur", "Uzbek",
    "Veps", "Vietnamese", "Vlach", "Wakhi", "Walloon", "Warji", "Waziri", "Welsh", "Wolof", "Yakut", "Yiddish",
    "Yoruba", "Yupik", "Zazaki", "Zulu"];

// HTML & CSS SETUP

for (var i = 1; i<7; i++) {
  document.getElementById("guess-"+i).innerHTML = ""; // Clears guessing boxes at start
}

window.onload = async function() {
  let currentSolution = await getSolution()
  console.log(currentSolution.phrase)
  console.log(currentSolution.language)
  phraseBox.innerText = currentSolution.phrase
  lang = currentSolution.language
  response = await fetch("./out.json", { method: 'GET' });
  proximities = await response.json();
  guessingBox.value = "";
}

// FUNCTIONS SETUP

// share function
async function shareGame() {
  console.log("share");
  let messageShare = document.getElementById("emojiGridText").innerText
  messageShare = messageShare.substring(0, messageShare.length - 6); //eliminates the share at the end
     if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          const shareMessage = {
               title: "Babl",
               text: `${messageShare}`
          }
          navigator.share(shareMessage);
     } else {
          navigator.clipboard.writeText(messageShare);
     }
    // alert("copied to clipboard!");
  await makePopup("Copied to clipboard!", 1000)
}


// Compares languages by reading JSON, returns similarity in percent
async function compareLanguages(guess, correct) {
  if (!proximities) {
    console.log(proximities);
  }
  return 100 - parseInt(proximities.map[proximities.indices[guess]][proximities.indices[correct]]);
}

async function getSolution() {
  const d = new Date();
  const origDate = new Date("11/19/23"); //It's jank, but this code ONLY WORKS IF IT STARTS ON A SUNDAY
  let timePassed = Math.floor(Math.abs(d-origDate) / 1000 / 60 / 60 / 24) //time elapsed in days
  let weekday = d.getDay();
  let num = 1;
  //let data = await fetch("./solutionsGod.json", { method: 'GET' }).then(response => response.json(response));
  if (weekday == 0) { //Sun
    num = Math.floor(timePassed/7);
  } else if (weekday > 0 && weekday < 4) { //Mon, Tues, Wed
    num = Math.floor(timePassed/7) * 3 + (timePassed - Math.floor(timePassed/7)*7);
  } else { //Thurs, Fri, Sat
    num = Math.floor(timePassed/7) * 3 + (timePassed - Math.floor(timePassed/7)*7) - 3;
    //console.log(data)
  }
  

  let data = await fetch(weekday == 0? "./solutionsGod.json" : weekday > 0 && weekday < 4? "./solutionsEasy.json" : "./solutionsMedium.json", { method: 'GET' }).then(response => response.json(response));
  console.log("num", num);
  console.log("time passed: " + timePassed);
  console.log(weekday);
  return data[String("opt" + num)]

  // timepassed / 7 for sunday
  // var num;
  // var originDateII = new Date("10/06/2023"); // change back to 14
  // var currentDateII = new Date();
  // var num = Math.floor((currentDateII.getTime() - originDateII.getTime())/86400000);
  // // let data = await fetch("./solutionsGod.json", { method: 'GET' }).then(response => response.json(response)); // TEMP
  // var num = 0; // TEMP
  // if (weekday = 0) {
  //   num = num - (6 * (num % 5)); // Take out all non-Sundays
  // } else if (weekday > 0 && weekday < 4) {
  //   num = num - (4 * (num % 3)*3); // Take out all non-Monday/Wednesday/Tuesdays
  // } else {
  //   num = num - (4 * (num % 6)*3); // Take out all non-Thursday/Friday/Saturdays
  // }
  // if (dayOfWeek == 1 || dayOfWeek == 2) {
  //   num = parseInt(String(date.getDay()) + String(date.getDate()) + String(date.getMonth()) + String(date.getFullYear())) ** 7 % 35 + 1;
  //   return data.Week.EarlyWeek[String("opt" + num)]
  //   //Early week
  // } else if (dayOfWeek <= 4) {
  //   //Mid week
  //   num = parseInt(String(date.getDay()) + String(date.getDate()) + String(date.getMonth()) + String(date.getFullYear())) ** 7 % 51 + 1;
  //   return data.Week.MidWeek[String("opt" + num)]
  // } else if (dayOfWeek <= 6) {
  //   //Late week
  //   num = (parseInt(String(date.getDay()) + String(date.getDate()) + String(date.getMonth()) + String(date.getFullYear()))) ** 7 % 48 + 1;
  //   return data.Week.EndWeek[String("opt" + num)]
  // } else {
  //   //Sunday
  //   num = (parseInt(String(date.getDay()) + String(date.getDate()) + String(date.getMonth()) + String(date.getFullYear()))) ** 7 % 15 + 1;
  //   return data.Week.Sunday[String("opt" + num)]
  // }
  
}


// Sends guess to HTML
function printGuess(guesses) {
  document.getElementById("guess-" + guesses.length).innerHTML = guesses[guesses.length - 1];
}

// Sends percent and colors to HTML & CSS
function printPercent(proximity) {
  const colors = ['ff0000', '#fe3900', '#fb5600', '#f66d00', '#ee8200', '#e39500', '#d7a600', '#c8b700', '#b6c700', '#a1d600', '#86e400', '#62f200', '#06ff00'];
  const checkpoints = [0, 9, 16, 25, 35, 42, 49, 63, 70, 77, 84, 93, 100];
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
  proxList.push(proximity);
}

// Hides boxes, switch
function hideGame() {
  const solutionBox = document.getElementById("solutionBox")
  const guessingButton = document.getElementById("guessingButton")
  const guessingBox = document.getElementById("guessingBox")
  const copyButton = document.getElementById("copy-button")
  guessingButton.innerText = "Share";
  guessingBox.readOnly = true;
  guessingBox.value = "Today's solution: " + lang
  guessingButton.addEventListener("click", () => {
    document.getElementById("popHeading").innerHTML = "Share";
    if (won == true) {
      document.getElementById("popText").innerHTML = "You're a language genius! Come back tomorrow for the next puzzle. Want to learn more about " + lang + "? Click " + "<a class='inner-link' href='https://en.wikipedia.org/wiki/" + lang + "_language' target='_blank'>here.</a>";

    } else {
      document.getElementById("popText").innerHTML = "You didn't guess the correct language. Come back tomorrow for the next puzzle. Today's solution: " + lang;
    }
    document.getElementById("emojiGridText").innerHTML = emojiGrid(proxList, bablNumber) + "<button class = \"share-button\" id=\"copy-button\" type=\"button\" onclick='shareGame()'>Share</button>";
    modal.showModal()

    copyButton.addEventListener("click", () => {
        shareGame();
    })
  });
  // copyButton = document.getElementById("copy-button")
   copyButton.addEventListener("click", () => {
        shareGame();
    })
  
  // document.getElementById("solutionBox").style.zIndex = "10";
  // document.getElementById("shareButton").style.zIndex = "10";
  // document.getElementById("guessingBox").style.display = "none";
  // document.getElementById("solutionBox").innerHTML = "Today's solution: " + lang;
}

async function shareGame() {
  console.log("share");
  let messageShare = document.getElementById("emojiGridText").innerText
  messageShare = messageShare.substring(0, messageShare.length - 6); //eliminates the share at the end
     if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          const shareMessage = {
               title: "Babl",
               text: `${messageShare}`
          }
          navigator.share(shareMessage);
     } else {
          navigator.clipboard.writeText(messageShare);
     }
    // alert("copied to clipboard!");
  await makePopup("Copied to clipboard!", 1000)
}

var notificationShowing = false;
async function makePopup(text, time) {
  console.log("popup")
     if (notificationShowing === false) {
          notificationShowing = true
          const body = document.getElementById("body")
          const popup = document.createElement("h1")
          popup.classList.add("popup")
          const popupText = document.createTextNode(text)
          popup.appendChild(popupText)
          popup.style.visibility = "hidden"
          body.appendChild(popup)
          const width = popup.clientWidth
          popup.style.paddingTop = `${15}px`
          popup.style.paddingBottom = `${15}px`
          popup.style.top = `${window.innerHeight * 0.1}px`
          popup.style.left = `${(window.innerWidth / 2) - popup.clientWidth / 2}px`
          popup.style.visibility = "visible"
          popup.style.zIndex = "9999"
          await sleep(time)
          popup.style.visibility = "hidden"
          popup.remove()
     }
     notificationShowing = false
}

function fixInput(str) {
return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(function(word) {
        return word[0].toUpperCase() + word.substr(1);
    })
    .join(' ');
 }

// Lets you input guesses
async function guessingFunction() {
  let arrInput = fixInput(guessingBox.value);

  if (!validLangs.includes(arrInput) && !won) {
    let link = "list.html"
    document.getElementById("popHeading").innerHTML = "Uh-oh!";
    document.getElementById("popText").innerHTML = "You entered a language that doesn't exist. Check out <a class='inner-link' href=" + link + " target='_blank'>this link</a> for a list of accepted languages.";
    guessingBox.value = "";
    modal.showModal();
    return;
  }
  if (guesses.length < 5 && won == false && arrInput != lang) {
    guesses.push(arrInput);
    guessingBox.value = "";
    printGuess(guesses);
    let proximity = await compareLanguages(arrInput, lang);
    console.log(proximity)
    printPercent(proximity);
  } else if (guesses.length <= 6 && won == false && arrInput == lang) {
    won = true;
    guesses.push(arrInput);
    printGuess(guesses);
    printPercent(await compareLanguages(arrInput, lang));
    if (bablNumber % 50 < 6) {
      document.getElementById("popHeading").innerHTML = "You won! BABL " + bablNumber + " HYPE!!!";
    } else {
      document.getElementById("popHeading").innerHTML = "You won!";
    }
    //lang = "Ancient Aramaic"
    document.getElementById("popText").innerHTML = "You're a language genius! Come back tomorrow for the next puzzle. Want to learn more about " + lang + "? Click " + "<a class='inner-link' href='https://en.wikipedia.org/wiki/" + lang.replace(/ /g,"_") + "_language' target='_blank'>here.</a>";
    document.getElementById("emojiGridText").innerHTML = emojiGrid(proxList, bablNumber) + "<button class = \"share-button\" id=\"copy-button\" type=\"button\" onclick='shareGame()'>Share</button>";
    guessingBox.value = "";
    modal.showModal();
    hideGame();
  } else if (guesses.length == 5 && won == false && arrInput != lang) {
    guesses.push(arrInput);
    printGuess(guesses);
    printPercent(await compareLanguages(arrInput, lang));
    document.getElementById("popHeading").innerHTML = "You lost!";
    document.getElementById("popText").innerHTML = "You didn't guess the correct language. Come back tomorrow for the next puzzle. Today's solution: " + lang;
    hideGame();
    document.getElementById("emojiGridText").innerHTML = emojiGrid(proxList, bablNumber) + "<button class = \"share-button\" id=\"copy-button\" type=\"button\" onclick='shareGame()'>Share</button>";
    guessingBox.value = "";
    modal.showModal();
  }
}

// Generates emoji grid
function emojiGrid(proxList, bablNumber) { 
  let block = "";
  let message;
  if (proxList.length == 6 && proxList[5] != 100) {
    message = "Babl #" + bablNumber + " FAIL<br>";
  } else {
    message = "Babl #" + bablNumber + " " + proxList.length + "/6 <br>";
  }
  if (bablNumber % 50 < 6) {
    message = message + " BABL " + bablNumber + " HYPE!!!";
  }
  console.log(proxList)
  for (var i = 0; i < proxList.length; i++) {
    console.log(proxList[i])
    if (proxList[i] >= 0 && proxList[i] < 25) {
      block = "🟥🟥🟥🟥🟥"; 
    } else if (proxList[i] >= 25 && proxList[i] < 50) {
      block = "🟧🟧🟧🟧🟧";
    } else if (proxList[i] >= 50 && proxList[i] < 75) {
      block = "🟨🟨🟨🟨🟨";
    } else if (proxList[i] >= 75 && proxList[i] < 100) {
      block = "🟩🟩🟩🟩🟩";
    } else if (proxList[i] == 100) {
      block = "🟪🟪🟪🟪🟪";
    }
    message = message + " " + block + " " /* + proxList[i] + "% */ + "<br>";
  }
  return message;
}

// EVENT LISTENER SETUP

// Technical not an EL, opens modal
if (bablNumber % 50 < 6) {
  document.getElementById("popHeading").innerHTML = "Welcome to Babl! BABL " + bablNumber + " HYPE!!!";
} else {
  document.getElementById("popHeading").innerHTML = "Welcome to Babl!";
}
document.getElementById("popText").innerHTML = "Here's how to play: Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!";
modal.showModal();

// Adds button to close modal
closeModal.addEventListener('click', () => {
  modal.close();
});

// Opens modal when the help button is clicked
helpButton.addEventListener('click', () => {
  if (bablNumber % 50 < 6) {
    document.getElementById("popHeading").innerHTML = "Welcome to Babl! BABL " + bablNumber + " HYPE!!!";
  } else {
    document.getElementById("popHeading").innerHTML = "Welcome to Babl!";
  }
  document.getElementById("popText").innerHTML = "Here's how to play: Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!";
  document.getElementById("emojiGridText").innerHTML = " ";
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
  document.getElementById("html").style.zoom = "100%"
};
