let questions=[];
let current=0;
let score=0;

fetch("questions.json")
.then(r=>r.json())
.then(data=>{
    questions=data;
    showQuestion();
});

function showQuestion(){

    let q=questions[current];

    document.getElementById("counter").innerHTML=
    `Question ${current+1}/${questions.length}`;

    document.getElementById("question").innerHTML=q.question;

    document.getElementById("result").innerHTML="";

    let percent=((current)/questions.length)*100;
    document.getElementById("progressBar").style.width=percent+"%";

    let optionsDiv=document.getElementById("options");

    optionsDiv.innerHTML="";

    for(let key in q.options){

        let btn=document.createElement("button");

        btn.className="option";

        btn.innerHTML=`${key}. ${q.options[key]}`;

        btn.onclick=()=>checkAnswer(key,btn);

        optionsDiv.appendChild(btn);

    }

}

function checkAnswer(choice,button){

    let q=questions[current];

    let buttons=document.querySelectorAll(".option");

    buttons.forEach(btn=>btn.disabled=true);

    if(choice===q.correctAnswer){

        score++;

        button.classList.add("correct");

        document.getElementById("result").innerHTML=
        "✅ Correct<br><br>"+q.studyPoint;

    }else{

        button.classList.add("wrong");

        buttons.forEach(btn=>{

            if(btn.innerHTML.startsWith(q.correctAnswer)){
                btn.classList.add("correct");
            }

        });

        document.getElementById("result").innerHTML=
        "❌ Wrong<br><br>"+q.studyPoint;

    }

    document.getElementById("scoreBox").innerHTML=
    `Score: ${score}`;

}

document.getElementById("nextBtn").onclick=()=>{

    current++;

    if(current>=questions.length){

        document.body.innerHTML=
        `<h1 style="text-align:center;margin-top:100px">
        🏆 Quiz Completed<br><br>
        Score ${score}/${questions.length}
        </h1>`;

    }else{

        showQuestion();

    }

};
