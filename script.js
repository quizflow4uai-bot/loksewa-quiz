let questions = [];
let current = 0;
let score = 0;
let answers = [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const currentEl = document.getElementById("current");
const totalEl = document.getElementById("total");
const scoreEl = document.getElementById("score");
const progressFill = document.getElementById("progressFill");
const explanationEl = document.getElementById("explanation");

fetch("questions.json")
.then(res => res.json())
.then(data => {

    questions = data.sort(() => Math.random() - 0.5);

    totalEl.innerText = questions.length;

    answers = Array(questions.length).fill(null);

    showQuestion();

});

function showQuestion() {

    let q = questions[current];

    currentEl.innerText = current + 1;

    questionEl.innerText = q.question;

    progressFill.style.width =
        ((current + 1) / questions.length) * 100 + "%";

    optionsEl.innerHTML = "";

    for (let key in q.options) {

        let div = document.createElement("div");

        div.className = "option";

        if (answers[current] === key) {
            div.classList.add("selected");
        }

        div.innerHTML = `
        <div class="circle"></div>
        <div>${q.options[key]}</div>
        `;

        div.onclick = () => selectAnswer(key);

        optionsEl.appendChild(div);
    }

    if (answers[current]) {

        explanationEl.style.display = "block";

        explanationEl.innerHTML = `
        <b>Explanation</b>
        <br><br>
        ${q.studyPoint}
        `;

    }
    else {

        explanationEl.style.display = "none";

    }

    scoreEl.innerText = score.toFixed(1);

}

function selectAnswer(choice) {

    if (answers[current]) return;

    answers[current] = choice;

    let q = questions[current];

    if (choice === q.correctAnswer) {

        score += 1;

    } else {

        score -= 0.2;

    }

    showQuestion();

}

document.getElementById("nextBtn").onclick = () => {

    if (current < questions.length - 1) {

        current++;

        showQuestion();

    }
    else {

        showResult();

    }

};

document.getElementById("prevBtn").onclick = () => {

    if (current > 0) {

        current--;

        showQuestion();

    }

};

function showResult() {

    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach((q, i) => {

        if (answers[i] === null) {

            skipped++;

        }
        else if (answers[i] === q.correctAnswer) {

            correct++;

        }
        else {

            wrong++;

        }

    });

    let accuracy =
        ((correct / questions.length) * 100).toFixed(1);

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

    document.querySelector(".container").innerHTML = `

<div class="resultCard">

<h1>🏆 Finished</h1>

<h2>${score.toFixed(1)}</h2>

<br>

<p>Correct : ${correct}</p>

<br>

<p>Wrong : ${wrong}</p>

<br>

<p>Skipped : ${skipped}</p>

<br>

<p>Accuracy : ${accuracy}%</p>

<div class="quote">

${quote}

</div>

</div>

`;

}
