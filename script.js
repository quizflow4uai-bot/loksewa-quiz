let questions = [];
let current = 0;
let score = 0;

fetch("questions.json")
.then(response => response.json())
.then(data => {
    questions = data;
    showQuestion();
});

function showQuestion(){

    document.getElementById("result").innerHTML = "";

    let q = questions[current];

    document.getElementById("question").innerHTML =
        `${current + 1}. ${q.question}`;

    let optionsDiv = document.getElementById("options");

    optionsDiv.innerHTML = "";

    for(let key in q.options){

        let btn = document.createElement("button");

        btn.className = "option";

        btn.innerHTML = `${key}. ${q.options[key]}`;

        btn.onclick = ()=>checkAnswer(key);

        optionsDiv.appendChild(btn);

    }

}

function checkAnswer(choice){

    let q = questions[current];

    if(choice===q.correctAnswer){

        score++;

        document.getElementById("result").innerHTML =
            "✅ Correct<br><br>"+q.studyPoint;

    }else{

        document.getElementById("result").innerHTML =
            "❌ Wrong<br><br>Correct Answer: "
            + q.correctAnswer
            + "<br><br>"
            + q.studyPoint;

    }

}

document.getElementById("nextBtn").onclick = ()=>{

    current++;

    if(current>=questions.length){

        document.body.innerHTML =
        `<h1>🏆 Score ${score}/${questions.length}</h1>`;

    }else{

        showQuestion();

    }

};
