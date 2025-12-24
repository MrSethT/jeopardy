# 🏟️ Jeopardy! – A Trivia Game in HTML

An interactive trivia game built using vanilla html and JavaScript inspired by the TV show **"Jeopardy!"**.  
The game is built as a board of clue tiles

---

## 🎮 Game Description

- There are up to **3 players or teams**:
    - Team A
    - Team B
    - Team C
- The game board shows the categories and dollar amounts for each clue
- Selecting a tile shows the "answer" and the first player to ring in gets the chance to give the corresponding "clue"
    - If they are correct, the dollar amount of the answer is added to their earnings
    - If they are incorrect, the dollar amount of the answer is deducted from their earnings 
- The clues MUST be given in the form of a question 😀
- The game is over when all the tiles are completed and the winner is determined by wich player/team has the most money 

---

## ⌨️ Game Controls

- **T** – Starts the theme music  
- **Shift+T** – Stops the theme music  
- **A** – Team A responded correctly to the current answer
- **Shif+A** – Team A responded incorrectly to the current answer  
- **B** – Team B responded correctly to the current answer
- **Shif+B** – Team B responded incorrectly to the current answer  
- **C** – Team C responded correctly to the current answer
- **Shif+C** – Team C responded incorrectly to the current answer  
- **Q** – No team has rung in, show the current clue and do not award any dollar amount to any team
- **S** – Show the current score/earnings of each team
- **H** – Display the hint for the current answer if one is available
- **F** – Start the Final Jeopardy! round
- Minimal on-screen interaction/clicks — the game is intended to be run quickly by a host

---

## 🧠 Final Jeopardy

If desired, a round of Final Jeopardy can also be played. Enter Final Jeopardy at any time by pressing the **F** key.  The game will display a single category, the current dollar amounts for each team and a place to enter their wagers. 
Clicking on the category will display the clue 
clicking on the clue will start a 30 second theme 🎶 allowing each team time to submit their answer.  
Clicking on the "answer" will then reveal the correct "clue" and allow final scoring. 

The dollar amounts are awarded using the ✅ and ❌ buttons by the dollar amount after each team has given their response.

The team with the most money at the end of the round wins the game.

---

##  📸 Screenshots

The Board
![Alt text](/media/board.png?raw=true "The Board")

An Answer
![Alt text](/media/answer.png?raw=true "An Answer")

Final Jeopardy!
![Alt text](/media/final.png?raw=true "Final Jeopardy")

---

## 🔍 Clue Generation Sources

[The Jeopardy! TV Show Game Archive](https://j-archive.com/)
<br>
[Trivia For CHildren](https://www.funtrivia.com/trivia-quiz/ForChildren/You-Can-Count-On-It-362573.html)<br>
[An encoder for creating anogram clues and number puzles](https://cryptii.com/)

---

## 🗂️ Project Structure

Categories, clues, and hints are written in the game.js file and loaded when the page loads.  The game board is built dynamically using JavaScript and the game logic is handled by the game.js file.

```txt
css/        # CSS files  (ignore)
fonts/      # font files (ignore)    
images/
├── *.*                # images for the clues
js/
├── vendor/            # third party libraries
├── main.js            # maps images in directory stucture 
├── plugins.js         # third party plugins
│
game.json              # game categories and clues **Edit this one**
jeopardy.HTML		   # main HTML file (ignore)
|

```

---

## 🧾 JSON format (schema)

Your game is described by a single JSON object with a few top-level fields, a list of categories, and a required `final` clue.

---

### Top-level shape

```json
{
  "categories": [ /* REQUIRED: list of 4-6 categories */ ],
  "final": { /* REQUIRED: final jeopardy-style clue */ }
}
```

### Category object

A **category** represents one column on the game board and contains a set of related clues.

```json
{
  "name": "CATEGORY NAME",
  "clues": [ /* list of 5 clue objects */ ]
}
```

### Clue object

A **clue** represents a single prompt-and-answer pair within a category.

```json
{
  "clue": "Clue text shown to the player",
  "question": "Correct response (Jeopardy-style)",
  "hint": "Optional hint text or emojis",
  "image": "Optional image path or URL to show duing the clue",
  "imageq": "Optional alternate or hidden image path or URL to show during the question",
}
```

### Final object

The **final** object defines the final (Jeopardy-style) clue shown at the end of the game.

```json
{
  "category": "FINAL CATEGORY TITLE",
  "clue": "Final clue text shown to the player",
  "question": "Correct final response"
}
```

---

## 📦 Installation

1. Desgined to be run in IIS, but can be run in any web server
2. Clone or download the repository
3. Edit the `game.json` file to add or modify your own game board
4. Open the `jeopardy.html` file in a web browser
5. Enjoy!