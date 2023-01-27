# READ ME - Babl

## What are we doing?
Welcome to Babl! We've decided to build a brand new language-guessing game for the internet! Inspired by Wordle and Neardle, we've brought a brand new take to daily word puzzles. 

## How to play
Every day, a new phrase in a foreign language will appear on Babl. You have to guess what language the phrase is written in (it doesn't matter what the phrase actually says). If your guess is right, you'll win! If your guess is wrong, we'll tell you how close you got. You only get 6 tries. Good luck!

## List of Broken Things
Before continuing build, see if you can fix one of these things. We've all been making major logic changes and we all collectively broke it. Yay!

|Thing|What Happened?|Root Ideas|
|---|---|---|
|Uh-oh Message|Desite printing guesses to the screen, shows modal alerting of a bad guess|Running if & else at the same time? Something's up in the conditional|
|Passing colors|All guesses display as red|Something to fix in printPercent() function|
|Rounding %s|When rounding proximity values, fills in all guesses and forces a loss|Literally no way to avoid this yet|
|Scrollbar|Would like to always show scrollbar, and style it to be more obvious|Mess around with scrollbar styles (without removing mobile styles)|

## Build status
Currently working on it! Here's our task board. Feel free to update based on your current tasks. 

|Task|Status|People|
|---|---|---|
|CSS & HTML Basic Site Setup|COMPLETED|LUKE|
|Input for words|COMPLETED|LUKE & WYATT|
|Language Proximity Calculator|COMPLETED|LÉO & WYATT|
|Fonts and graphics|IN PROGRESS|LUKE|
|Guess boxes|IN PROGRESS|LUKE & WYATT|
|Time sensors|NOT STARTED|WYATT|
|Solutions| IN PROGRESS|WYATT|
|Troubleshooting|IN PROGRESS|EVERYONE|
|How-to Modal|COMPLETED|BY SOMEONE|
|Move files to Git|COMPLETED|LÉO|
|Final hosting|ON HOLD UNTIL COMPLETION OF PROJECT|WYATT & LÉO|

## What we're using
We're hosting our code on Replit and GitHub. We've been programming with HTML, CSS, and JS. We're also using an external json file to calculate language proximity.

## Contributors
Luke Dreyfuss, Wyatt Foster, and Léo Fitzpatrick: Original creators and programmers
Abe Kirschner & Ryder Something: Inspiration and logistical setup
Josh Wardle: For being a legend and making Wordle
Open AI's ChatGPT for helping us debug
elinguistics.net: The original producers of the algorithm we use
@polvanrijn on GitHub: Author of the scraper program for elinguistics.net

Thanks to everyone that helped make this project possible!