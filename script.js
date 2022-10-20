// TODO(you): Write the JavaScript necessary to complete the assignment.



// select 3 screen
const introduction = document.querySelector("#introduction");
const attempt_quiz = document.querySelector("#attempt-quiz");
const review_quiz = document.querySelector("#review-quiz");
const questionContainer = document.querySelector("#question-container")
const reviewQuestionContainer = document.querySelector("#review-question-container")
// select 3 button
const btn_start = document.querySelector("#btn-start");
const btn_submit = document.querySelector("#btn-submit");
const btn_tryAgain = document.querySelector("#btn-try-again");
// select top page
const topPage = document.querySelector("body");

//hide screen 2 and 3
review_quiz.classList.add("hidden");
attempt_quiz.classList.add("hidden");

let attemptId;
// click start quiz
function startQuiz() {
    introduction.classList.add("hidden");
    attempt_quiz.classList.remove("hidden");
    topPage.scrollIntoView({ block: "start" });
    fetch('https://wpr-quiz-api.herokuapp.com/attempts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(json => {
            console.log("Data: ");
            console.log(json);
            attemptId = json._id

            const questionArr = json.questions;
            questionArr.forEach((question, index) => {

                const id = question._id
                const answerArr = question.answers
                const text = question.text

                const divContainer = document.createElement("div")
                const h2 = document.createElement("h2")
                h2.classList.add("question-index")
                h2.textContent = `Question ${index + 1} of 10`

                const questionText = document.createElement("div")
                questionText.classList.add("question-text")
                questionText.textContent = text

                const form = document.createElement("form")
                form.classList.add("form")
                // add labels to form
                answerArr.forEach((answer, index) => {
                    // a answer
                    const label = document.createElement("label")
                    label.classList.add("option")

                    const input = document.createElement("input")
                    input.type = 'radio'
                    input.name = id
                    input.value = index

                    const p = document.createElement("p")
                    p.classList.add("text")
                    p.textContent = answer

                    label.appendChild(input)
                    label.appendChild(p)
                    form.appendChild(label)
                })


                divContainer.appendChild(h2)
                divContainer.appendChild(questionText)
                divContainer.appendChild(form)
                questionContainer.appendChild(divContainer)


                const answersInForm = form.querySelectorAll(".option")
                answersInForm.forEach(answer => {
                    answer.addEventListener("click", e => {
                        const checkedSibling = form.querySelector(".option-selected")
                        if (checkedSibling) {
                            checkedSibling.classList.remove("option-selected")
                        }
                        e.currentTarget.classList.add("option-selected")
                    })
                })


            })
        })
}

btn_start.addEventListener("click", startQuiz);

// click submit
function submitAnswer() {
    if (confirm("Are you sure about that???")) {
        attempt_quiz.classList.add("hidden");
        review_quiz.classList.remove("hidden");
        topPage.scrollIntoView({ block: "start" });

        const result = {
            userAnswers: {
                
            }
        }

        const selectLabels = document.querySelectorAll(".option-selected")
        selectLabels.forEach(label => {
            const inputTag = label.querySelector("input")
            const questionId = inputTag.name
            const answerIndex = inputTag.value

            result.userAnswers[questionId] = answerIndex
        })

        
        fetch(`https://wpr-quiz-api.herokuapp.com/attempts/${attemptId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        })
        .then(res => res.json())
        .then(json => {
            console.log("received from server: ");
            console.log(json);

            const userAnswers = json.userAnswers || {}
            const correctAnswers = json.correctAnswers
            const score = json.score
            const scoreText = json.scoreText
            
            const questionArr = json.questions;
            questionArr.forEach((question, index) => {

                const questionId = question._id
                const answerArr = question.answers
                const text = question.text

                const divContainer = document.createElement("div")
                const h2 = document.createElement("h2")
                h2.classList.add("question-index")
                h2.textContent = `Question ${index + 1} of 10`

                const questionText = document.createElement("div")
                questionText.classList.add("question-text")
                questionText.textContent = text

                const form = document.createElement("form")
                form.classList.add("form")
                // add labels to form
                answerArr.forEach((answer, index) => {
                    // a answer
                    const userLabel = document.createElement("label")
                    userLabel.classList.add("option")

                    const input = document.createElement("input")
                    input.type = 'radio'
                    input.name = questionId
                    input.value = index

                    const p = document.createElement("p")
                    p.classList.add("text")
                    p.textContent = answer

                    userLabel.appendChild(input)
                    userLabel.appendChild(p)
                    form.appendChild(userLabel)
                    
                    if (userAnswers[questionId] == index) {
                        input.checked = true
                    }
                })

                const positionOfCorrectAnswer = correctAnswers[questionId]
                const labelWithCorrectAnswer = form.childNodes[positionOfCorrectAnswer]
                const correctConfirmAnswer = createConfirmAnswer("Correct answer")
                labelWithCorrectAnswer.appendChild(correctConfirmAnswer)


                if (userAnswers[questionId]) {
            
                    const positionOfUserAnswer = userAnswers[questionId]
                    const userLabel = form.childNodes[positionOfUserAnswer]
                    if (userAnswers[questionId] == correctAnswers[questionId]) {
                        // green only
                        // label == labelWithCorrectAnswer
                        userLabel.classList.add("correct-answer")


                    } else {
                        // red and green
                        // label != labelWithCorrectAnswer
                        userLabel.classList.add("wrong-answer")
                        const wrongConfirmAnswer = createConfirmAnswer("Your answer")
                        userLabel.appendChild(wrongConfirmAnswer)

                        labelWithCorrectAnswer.classList.add("correct-answer")
                    

                    }

                } else {
                    // gray
                    labelWithCorrectAnswer.classList.add("option-correct")

                }
                    
                

            divContainer.appendChild(h2)
            divContainer.appendChild(questionText)
            divContainer.appendChild(form)
            reviewQuestionContainer.appendChild(divContainer)

            })

            document.querySelector("#box-result .score").textContent = `${score}/10`
            document.querySelector("#box-result p strong").textContent = `${score*100/10}%`
            document.querySelector("#box-result #scoreText").textContent = scoreText
            
        })
    }

}

btn_submit.addEventListener("click", submitAnswer);

function createConfirmAnswer(message) {
    const confirmAnswer = document.createElement("label")
    confirmAnswer.classList.add("confirm-answer")
    confirmAnswer.textContent = message
    return confirmAnswer;
}
// click try again

function tryAgain() {
    location.reload()
    // review_quiz.classList.add("hidden");
    // introduction.classList.remove("hidden");
    // topPage.scrollIntoView({ block: "start" });
}

btn_tryAgain.addEventListener("click", tryAgain);

