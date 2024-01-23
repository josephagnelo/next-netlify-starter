import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

const express = require('express');
const say = require('say');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const readline = require('readline');


// 1. read the file spellingbee.txt
const file = fs.readFileSync('./pages/spellingbee.txt', 'utf8');
// 2. split the file into an array of words
const words = file.split('\n');

// Function to generate a random word
const getRandomWord = () => {
    //const words = ['apple', 'banana', 'cherry', 'grape', 'orange'];
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
};

// Main function to handle the game
const startGame = (req, res) => {
    const word = getRandomWord();
    const audioUrl = `/audio?word=${encodeURIComponent(word)}`;

    // Display HTML page with buttons
    res.send(`
    <html>
      <body>
        <h1>Say the Spelling!</h1>
        <button onclick="playAudio()">Hear the Word</button>
        <button onclick="nextWord()">Next Word</button>
        <div>
        <input type="text" id="wordInput" placeholder="Enter word">
        <button onclick="submitSpelling()">Submit Spelling</button>
        </div>
        <p id="result"></p>
        <script>
          let score = 0;
          //let currentWord = '${word}';

          function playAudio() {
            var audio = new Audio('${audioUrl}');
            console.log('Playing audio for ${word} from url ${audioUrl}');
            audio.play();
          }

          function submitSpelling() {
            //const spelling = prompt('Enter the spelling:');
            const spelling = document.getElementById('wordInput');
            const encodedSpell = encodeURIComponent(spelling);
            fetch('/check?word=${encodeURIComponent(word)}&spelling='+encodedSpell)
              .then(response => response.json())
              .then(data => {
                //score += data.correct ? 1 : 0;
                //document.getElementById('score').innerText = 'Score: ' + score;
                document.getElementById('result').innerText = data.message;
              });
          }

          function nextWord() {
            fetch('/')
              .then(response => response.text())
              .then(html => {
                document.body.innerHTML = html;
                location.reload()
              });
          }
        </script>
      </body>
    </html>
  `);
};

// Function to handle audio requests
const playAudio = (req, res) => {
    const word = req.query.word || '';
    say.speak(word);
    res.writeHead(200, {
        "Content-Type": "audio/mp3"
    });
    res.send();
};

// Function to check spelling
const checkSpelling = (req, res) => {
    const word = req.query.word || '';
    const spelling = req.query.spelling || '';
    const correct = spelling.toLowerCase() === word.toLowerCase();
    const message = correct ? 'Correct!' : `Incorrect. You wrote :  ${spelling}  The correct spelling is "${word}".`;
    res.json({ correct, message });
};

// Set up routes
app.get('/', startGame);
app.get('/audio', playAudio);
app.get('/check', checkSpelling);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome to my app!" />
        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>
      </main>

      <Footer />
    </div>
  )
}
