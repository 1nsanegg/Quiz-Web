// TODO(you): Write the JavaScript necessary to complete the assignment.

// select 3 screen
const introduction = document.querySelector("#introduction");
const attempt_quiz = document.querySelector("#attempt-quiz");
const review_quiz = document.querySelector("#review-quiz");
// select 3 button
const btn_start = document.querySelector("#btn-start");
const btn_submit = document.querySelector("#btn-submit");
const btn_tryAgain = document.querySelector("#btn-try-again");
// select top page
const topPage = document.querySelector("body");

//hide screen 2 and 3
review_quiz.classList.add("hidden");
attempt_quiz.classList.add("hidden");

// click start quiz
function startQuiz() {
    introduction.classList.add("hidden");
    attempt_quiz.classList.remove("hidden");
    topPage.scrollIntoView({block: "start"});
}
btn_start.addEventListener("click", startQuiz);

// click submit
function submitAnswer() {
    attempt_quiz.classList.add("hidden");
    review_quiz.classList.remove("hidden");
    topPage.scrollIntoView({block: "start"});
}
btn_submit.addEventListener("click", submitAnswer);

// click try again

function tryAgain() {
    review_quiz.classList.add("hidden");
    introduction.classList.remove("hidden");
    topPage.scrollIntoView({block: "start"});
}
btn_tryAgain.addEventListener("click", tryAgain);


function select(event) {
    const selected = document.querySelector(".option-selected");
    if(selected) {
        selected.classList.remove("option-selected");
    }
    event.currentTarget.classList.add("option-selected");
}

const options = document.querySelectorAll(".option");

for (let option of options) {
    option.addEventListener("click", select);
}

