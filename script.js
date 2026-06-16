// ===== STATE =====

let questions = [];
let answers = [];
let current = 0;
let score = 0;
let wrongQuestions = [];
let timer;
let timeLeft = 30;

// ===== ELEMENTS =====

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");

const currentEl = document.getElementById("current");
const totalEl = document.getElementById("total");

const scoreEl = document.getElementById("score");

const progressFill = document.getElementById("progressFill");

const feedbackCard = document.getElementById("feedbackCard");

const answerStatus = document.getElementById("answerStatus");

const correctAnswerBox = document.getElementById("correctAnswerBox");

const fullExplanation = document.getElementById("fullExplanation");

// ===== LOAD QUESTIONS =====

fetch("questions.json")
.then(response => response.json())
.then(data => {

    questions = data.sort(() => Math.random() - 0.5);

    totalEl.innerText = questions.length;

    answers = Array(questions.length).fill(null);

    showQuestion();

})
.catch(error => {

    console.error(error);

    questionEl.innerHTML = "Failed to load questions.";

});


// ===== SHOW QUESTION =====

function showQuestion() {

    let q = questions[current];

    startTimer();


    currentEl.innerText = current + 1;

    questionEl.innerHTML = q.question;

    scoreEl.innerText = score.toFixed(1);

    progressFill.style.width =
        ((current + 1) / questions.length) * 100 + "%";

    optionsEl.innerHTML = "";

    for (let key in q.options) {

        let option = document.createElement("div");

        option.className = "option";

        if (
            answers[current] &&
            answers[current].choice === key
        ) {

            option.classList.add("selected");

        }

        option.innerHTML = `
            <div class="circle"></div>
            <div>${q.options[key]}</div>
        `;

        option.onclick = () => selectAnswer(key);

        optionsEl.appendChild(option);

    }

   if (answers[current]) {

    showFeedback();

    highlightOptions();

}
else {

    feedbackCard.classList.add("hidden");

}

}


// ===== SELECT ANSWER =====

function selectAnswer(choice) {

    if (answers[current]) return;
    clearInterval(timer);

    let q = questions[current];

    let correct = choice === q.correctAnswer;

    answers[current] = {

        choice: choice,

        correct: correct

    };

  if (correct) {

    score += 1;

}
else {

    score -= 0.2;

    wrongQuestions.push(q);

}

    }

    scoreEl.innerText = score.toFixed(1);

    highlightOptions();

    showFeedback();

}


// ===== HIGHLIGHT =====

function highlightOptions() {

    let q = questions[current];

    let allOptions = document.querySelectorAll(".option");

    let index = 0;

    for (let key in q.options) {

        if (key === q.correctAnswer) {

            allOptions[index].classList.add("correct");

        }

        if (
            answers[current].choice === key &&
            key !== q.correctAnswer
        ) {

            allOptions[index].classList.add("wrong");

        }

        index++;

    }

}


// ===== FEEDBACK =====

function showFeedback() {

    feedbackCard.classList.remove("hidden");

    let q = questions[current];

    let userAnswer = answers[current];

   if (userAnswer.correct) {

    answerStatus.innerHTML =
    "<span style='color:#16A34A'>✓ Correct</span>";

}
else {

    answerStatus.innerHTML =
    "<span style='color:#DC2626'>✗ Wrong</span>";

}
    correctAnswerBox.innerHTML = `
        Correct Answer
        <br><br>
        <b>
        ${q.correctAnswer}.
        ${q.options[q.correctAnswer]}
        </b>
    `;

    fullExplanation.innerHTML = q.studyPoint
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join("<br><br>");

}
// ===== TIMER =====

function startTimer() {

    clearInterval(timer);

    timeLeft = 30;

    document.getElementById("timer").innerText = timeLeft;
    
const timerElement = document.getElementById("timer");

if (timeLeft <= 10) {

    timerElement.style.color = "#DC2626";

}
else {

    timerElement.style.color = "#64748B";

}
    timer = setInterval(() => {

        timeLeft--;

        document.getElementById("timer").innerText = timeLeft;

       if (timeLeft <= 0) {

    clearInterval(timer);

    if (current < questions.length - 1) {

        current++;

        showQuestion();

    }
    else {

        showResult();

    }

}

        }

    }, 1000);

}

// ===== NEXT =====

document.getElementById("nextBtn").onclick = () => {

    if (current < questions.length - 1) {

        current++;

        showQuestion();

    }
    else {

        showResult();

    }

};


// ===== PREVIOUS =====

document.getElementById("prevBtn").onclick = () => {

    if (current > 0) {

        current--;

        showQuestion();

    }

};


// ===== RESULT =====

function showResult() {
clearInterval(timer);
    document.getElementById("quizContainer")
        .classList.add("hidden");

    document.getElementById("resultScreen")
        .classList.remove("hidden");

    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    answers.forEach(a => {

        if (a === null) {

            skipped++;

        }
        else if (a.correct) {

            correct++;

        }
        else {

            wrong++;

        }

    });

    document.getElementById("finalScore")
        .innerText = score.toFixed(1);

    document.getElementById("correctCount")
        .innerText = correct;

    document.getElementById("wrongCount")
        .innerText = wrong;

    document.getElementById("skippedCount")
        .innerText = skipped;

    let accuracy =
        ((correct / questions.length) * 100)
        .toFixed(1);

    document.getElementById("accuracy")
        .innerText = accuracy + "%";

    let quote = "";

    if (accuracy >= 90) {

        quote =
            "Consistency has turned knowledge into confidence.";

    }
    else if (accuracy >= 80) {

        quote =
            "You're building strong habits.";

    }
    else if (accuracy >= 60) {

        quote =
            "A little revision today creates big results tomorrow.";

    }
    else {

        quote =
            "Every mistake today becomes experience tomorrow.";

    }

    document.getElementById("quote")
        .innerText = quote;

}


// ===== RESTART =====

document.getElementById("restartBtn").onclick = () => {

    location.reload();

};
document.getElementById("reviewBtn").onclick = () => {

    document.getElementById("resultScreen")
    .classList.add("hidden");

    document.getElementById("reviewScreen")
    .classList.remove("hidden");

    let html = "";

    questions.forEach((q, i) => {

        html += `

<div class="reviewCard">

<h3>${i+1}. ${q.question}</h3>

<br>

<b>Your answer:</b>

${answers[i] ? q.options[answers[i].choice] : "Skipped"}

<br><br>

<b>Correct answer:</b>

${q.options[q.correctAnswer]}

<br><br>

<b>Explanation:</b>

<br><br>

${q.studyPoint.replaceAll("\n","<br><br>")}

</div>

`;

    });

    document.getElementById("reviewContainer")
    .innerHTML = html;

};
document.getElementById("backBtn").onclick = () => {

    document.getElementById("reviewScreen")
    .classList.add("hidden");

    document.getElementById("resultScreen")
    .classList.remove("hidden");

};
document.getElementById("reattemptWrongBtn").onclick = () => {

    questions = [...wrongQuestions];

    answers = Array(questions.length).fill(null);

    current = 0;

    score = 0;

    document.getElementById("resultScreen")
    .classList.add("hidden");

    document.getElementById("quizContainer")
    .classList.remove("hidden");

    showQuestion();

};
document.getElementById("reattemptAllBtn").onclick = () => {

    location.reload();

};
