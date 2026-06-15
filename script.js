// =========================
// GLOBAL VARIABLES
// =========================

let allQuestions = [];
let questions = [];

let currentQuestion = 0;

let correctCount = 0;
let wrongCount = 0;
let skippedCount = 0;

let finalScore = 0;

let selectedQuestionCount = 10;

// =========================
// SCREEN HELPERS
// =========================

function showScreen(id){

    document.querySelectorAll(".screen")
    .forEach(screen=>screen.classList.remove("active"));

    document.getElementById(id)
    .classList.add("active");

}

// =========================
// QUESTION COUNT
// =========================

const qDisplay = document.getElementById("q-count-display");

document.getElementById("q-plus").onclick=()=>{

    if(selectedQuestionCount<50){

        selectedQuestionCount +=5;

        qDisplay.innerHTML = selectedQuestionCount;

    }

};

document.getElementById("q-minus").onclick=()=>{

    if(selectedQuestionCount>5){

        selectedQuestionCount -=5;

        qDisplay.innerHTML = selectedQuestionCount;

    }

};

// =========================
// SHUFFLE
// =========================

function shuffle(array){

    return [...array]
    .sort(()=>Math.random()-0.5);

}

// =========================
// START QUIZ
// =========================

document.getElementById("btn-start")
.onclick=async()=>{

    showScreen("screen-loading");

    try{

        let response = await fetch("questions.json");

        allQuestions = await response.json();

        questions = shuffle(allQuestions)
        .slice(0,selectedQuestionCount);

        currentQuestion = 0;

        correctCount = 0;
        wrongCount = 0;
        skippedCount = 0;
        finalScore = 0;

        showScreen("screen-quiz");

        showQuestion();

    }

    catch(err){

        alert("Questions could not be loaded.");

        showScreen("screen-home");

    }

};

// =========================
// SHOW QUESTION
// =========================

function showQuestion(){

    let q = questions[currentQuestion];

    document.getElementById("q-num")
    .innerHTML =
    `${currentQuestion+1} / ${questions.length}`;

    let progress =
    ((currentQuestion+1)/questions.length)*100;

    document.getElementById("progress-fill")
    .style.width = progress+"%";

    document.getElementById("question-text")
    .innerHTML = q.question;

    let grid =
    document.getElementById("options-grid");

    grid.innerHTML="";

    document.getElementById("feedback-box")
    .classList.add("hidden");

    for(let key in q.options){

        let button =
        document.createElement("button");

        button.className =
        "option-btn";

        button.innerHTML =
        `${key}. ${q.options[key]}`;

        button.onclick=
        ()=>selectAnswer(key);

        grid.appendChild(button);

    }

}

// =========================
// ANSWER
// =========================

function selectAnswer(choice){

    let q = questions[currentQuestion];

    let answerText =
    q.options[q.correctAnswer];

    if(choice===q.correctAnswer){

        correctCount++;

        finalScore +=1;

        document.getElementById("feedback-answer")
        .innerHTML =
        "✅ सही उत्तर";

    }

    else{

        wrongCount++;

        finalScore -=0.2;

        document.getElementById("feedback-answer")
        .innerHTML =
        `❌ गलत<br>सही उत्तर: ${answerText}`;

    }

    document.getElementById("live-correct")
    .innerHTML = correctCount;

    document.getElementById("live-wrong")
    .innerHTML = wrongCount;

    document.getElementById("feedback-study")
    .innerHTML =
    q.studyPoint;

    document.getElementById("feedback-box")
    .classList.remove("hidden");

}

// =========================
// NEXT BUTTON
// =========================

document.getElementById("btn-next")
.onclick=()=>{

    currentQuestion++;

    if(currentQuestion>=questions.length){

        alert("Module 2 will handle result screen.");

        return;

    }

    showQuestion();

};
