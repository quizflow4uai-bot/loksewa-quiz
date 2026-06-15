let questions = [];
let current = 0;
let answers = [];
let score = 0;

fetch("questions.json")
.then(res => res.json())
.then(data => {

    questions = shuffle(data);

    answers = Array(questions.length).fill(null);

    showQuestion();

});

function shuffle(array){

    return [...array].sort(() => Math.random() - 0.5);

}

function calculateScore(){

    score = 0;

    answers.forEach((answer,index)=>{

        if(answer===null) return;

        if(answer===questions[index].correctAnswer){

            score += 1;

        }else{

            score -= 0.2;

        }

    });

    document.getElementById("score").innerHTML = score.toFixed(1);

}

function showQuestion(){

    let q = questions[current];

    document.getElementById("counter").innerHTML =
    `Question ${current+1} / ${questions.length}`;

    document.getElementById("question").innerHTML = q.question;

    let progress = ((current+1)/questions.length)*100;

    document.getElementById("progressBar").style.width =
    progress+"%";

    let optionsDiv = document.getElementById("options");

    optionsDiv.innerHTML = "";

    document.getElementById("result").innerHTML = "";

    for(let key in q.options){

        let btn = document.createElement("button");

        btn.className = "option";

        btn.innerHTML = `${key}. ${q.options[key]}`;

        btn.onclick = ()=>selectAnswer(key);

        if(answers[current]!==null){

            btn.disabled=true;

            if(key===q.correctAnswer){

                btn.classList.add("correct");

            }

            if(key===answers[current] &&
               answers[current]!==q.correctAnswer){

                btn.classList.add("wrong");

            }

        }

        optionsDiv.appendChild(btn);

    }

    if(answers[current]!==null){

        document.getElementById("result").innerHTML =

        `<b>📖 Explanation</b><br><br>${q.studyPoint}`;

    }

}

function selectAnswer(choice){

    if(answers[current]!==null) return;

    answers[current]=choice;

    calculateScore();

    showQuestion();

}

document.getElementById("nextBtn").onclick = ()=>{

    if(current<questions.length-1){

        current++;

        showQuestion();

    }else{

        showFinal();

    }

};

document.getElementById("prevBtn").onclick = ()=>{

    if(current>0){

        current--;

        showQuestion();

    }

};

function showFinal(){

    let correct = 0;

    let wrong = 0;

    let skipped = 0;

    answers.forEach((answer,index)=>{

        if(answer===null){

            skipped++;

        }
        else if(answer===questions[index].correctAnswer){

            correct++;

        }
        else{

            wrong++;

        }

    });

    let percentage =
    ((correct/questions.length)*100).toFixed(1);

    let badge = "📚 Need Practice";

    if(percentage>=90) badge="🥇 Legend";
    else if(percentage>=80) badge="🥈 Excellent";
    else if(percentage>=70) badge="🥉 Very Good";
    else if(percentage>=60) badge="👍 Good";

    document.body.innerHTML = `

    <div style="max-width:700px;margin:50px auto;
    background:white;padding:40px;border-radius:25px;
    text-align:center">

    <h1>🏆 Quiz Completed</h1>

    <br>

    <h2>${badge}</h2>

    <br>

    <h2>Final Score : ${score.toFixed(1)}</h2>

    <br>

    <p>✅ Correct : ${correct}</p>

    <p>❌ Wrong : ${wrong}</p>

    <p>⏭️ Skipped : ${skipped}</p>

    <br>

    <h2>${percentage}% Accuracy</h2>

    <br>

    <button onclick="location.reload()"
    style="padding:15px 25px;
    border:none;
    background:#2563eb;
    color:white;
    border-radius:15px;
    cursor:pointer">

    🔄 Start Again

    </button>

    </div>

    `;

}
