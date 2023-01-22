// Setting up variables to keep track of the quiz
let currentQuestionIndex = 0;
let time = questions.length *15;
let timerID;

// Adding HTML elements
let questionsElement = document.getElementById("questions");
let timerElement = document.getElementById("time");
let choicesElement = document.getElementById("choices");
let submitButton = document.getElementById("submit");
let startButton = document.getElementById("start");
let initialElement = document.getElementById("initials");
let feedbackElement = document.getElementById("feedback");

// Adding audio elements
let sfxRight = new Audio("assets/sfx/correct.wav"); 
let sfxWrong = new Audio("assets/sfx/incorrect.wav"); 

// Defining the quiz logic 
function questionClick(){
    if(this.value !== questions[currentQuestionIndex].answer) {
        time -= 15;
        if(time < 0) {
            time = 0;
        }
        timerElement.textContent = time;
        sfxWrong.play();
        feedbackElement.textContent = "wrong :(";
    }   else {
        sfxRight.play();
        feedbackElement.textContent = "correct!";
    }

    feedbackElement.setAttribute("class", "feedback");
    setTimeout(function(){
        feedbackElement.setAttribute("class", "feedback hide")
    }, 1000);
    currentQuestionIndex++;
    if(currentQuestionIndex === questions.length) {
        endQuiz();
    } else {
        getQuestion();
    }
}

// Calling a function to display questions
function getQuestion(){
    let currentQuestion = questions[currentQuestionIndex];
    let titleElement = document.getElementById("question-title");
    titleElement.textContent = currentQuestion.title;
    choicesElement.innerHTML = "";
    currentQuestion.choices.forEach(function(choice, index) {
        let choiceButton = document.createElement("button");
        choiceButton.setAttribute("class", "choice");
        choiceButton.setAttribute("value", choice);
        choiceButton.textContent = `${index + 1}. ${choice}`;
        choiceButton.addEventListener("click", questionClick);
        choicesElement.append(choiceButton);
    })
} 

// Defining the function that runs when the time is up/quiz ends
function endQuiz(){
    clearInterval(timerID);
    let endScreenElement = document.getElementById("end-screen");
    endScreenElement.removeAttribute("class");
    let finalScoreElement = document.getElementById("final-score");
    finalScoreElement.textContent = time;
    questionsElement.setAttribute("class", "hide");
}

// Defining the timer function
function clockTick(){
    time--;
    timerElement.textContent = time;
    if(time <= 0){
        endQuiz();
    } 
}

// Defining the function that runs when the quiz starts
function startQuiz(){
    let startScreenElement = document.getElementById("start-screen");
    startScreenElement.setAttribute("class", "hide");
    questionsElement.removeAttribute("class");
    timerID = setInterval(clockTick, 1000);
    timerElement.textContent = time;
    getQuestion();
}

// Defining the function that saves scores
function saveHighScore(){
    let initials = initialElement.value.trim();
    if(initials !== ""){
        let highScores = JSON.parse(localStorage.getItem("highscores")) || [];
        let newScore = {
            score: time,
            initials: initials
        }
        highScores.push(newScore);
        localStorage.setItem("highscores", JSON.stringify(highScores));
        window.location.href = "highscores.html";
    }
}

function checkForEnter(event){
    if(event.key === "Enter") {
        saveHighScore();
    }
}

// Setting up events
startButton.addEventListener("click", startQuiz);

submitButton.addEventListener("click", saveHighScore);

initialElement.addEventListener("keyup", checkForEnter);
