```javascript
// ===== STATE =====

let questions = [];
let answers = [];
let current = 0;
let score = 0;

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
.then(res => res.json())
.then(data => {

    questions = data.sort(() => Math.random() - 0.5);

    totalEl.innerText = questions.length;

    answers = Array(questions.length).fill(null);

    showQuestion();

});


// ===== SHOW QUESTION =====

function showQuestion(){

    let q = questions[current];

    currentEl.innerText = current + 1;

    questionEl.innerHTML = q.question;

    progressFill.style.width =
    ((current+1)/questions.length)*100+"%";

    scoreEl.innerText = score.toFixed(1);

    optionsEl.innerHTML = "";

    for(let key in q.options){

        let option = document.createElement("div");

        option.className = "option";

        if(answers[current] &&
           answers[current].choice === key){

            option.classList.add("selected");

        }

        option.innerHTML = `

        <div class="circle"></div>

        <div>

        ${q.options[key]}

        </div>

        `;

        option.onclick = ()=>selectAnswer(key);

        optionsEl.appendChild(option);

    }


    // Restore explanation

    if(answers[current]){

        showFeedback();

    }
    else{

        feedbackCard.classList.add("hidden");

    }

}



// ===== SELECT ANSWER =====

function selectAnswer(choice){

    if(answers[current]) return;

    let q = questions[current];

    let correct = choice === q.correctAnswer;

    answers[current] = {

        choice:choice,

        correct:correct

    };

    if(correct){

        score += 1;

    }
    else{

        score -= 0.2;

    }

    scoreEl.innerText = score.toFixed(1);

    showFeedback();

}



// ===== FEEDBACK =====

function showFeedback(){

    let q = questions[current];

    let userAnswer = answers[current];

    feedbackCard.classList.remove("hidden");

    if(userAnswer.correct){

        answerStatus.innerHTML =

        "✅ Correct";

    }
    else{

        answerStatus.innerHTML =

        "❌ Wrong";

    }

    correctAnswerBox.innerHTML =

    `
    Correct Answer

    <br><br>

    <b>

    ${q.correctAnswer}.
    ${q.options[q.correctAnswer]}

    </b>
    `;

    fullExplanation.innerHTML =

    q.studyPoint;

}



// ===== NEXT =====

document.getElementById("nextBtn")
.onclick = ()=>{

    if(current < questions.length-1){

        current++;

        showQuestion();

    }
    else{

        showResult();

    }

};


// ===== PREVIOUS =====

document.getElementById("prevBtn")
.onclick = ()=>{

    if(current>0){

        current--;

        showQuestion();

    }

};



// ===== RESULT =====

function showResult(){

    document.getElementById("quizContainer")
    .classList.add("hidden");

    document.getElementById("resultScreen")
    .classList.remove("hidden");


    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    answers.forEach(a=>{

        if(a===null){

            skipped++;

        }

        else if(a.correct){

            correct++;

        }

        else{

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
    ((correct/questions.length)*100)
    .toFixed(1);

    document.getElementById("accuracy")
    .innerText = accuracy+"%";


    let quote = "";

    if(accuracy>=90){

        quote =

        "Consistency has turned knowledge into confidence.";

    }

    else if(accuracy>=80){

        quote =

        "You're building strong habits.";

    }

    else if(accuracy>=60){

        quote =

        "A little revision today creates big results tomorrow.";

    }

    else{

        quote =

        "Every mistake today becomes experience tomorrow.";

    }

    document.getElementById("quote")
    .innerText = quote;

}



// ===== RESTART =====

document.getElementById("restartBtn")
.onclick = ()=>{

    location.reload();

};
```
