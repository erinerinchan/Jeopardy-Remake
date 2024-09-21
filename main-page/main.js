// Constants
const LOADING_TIME = 4000;
const TOTAL_QUESTIONS = 10;
const API_URL = "https://opentdb.com/api.php?amount=1&type=multiple";

// DOM Elements
const loadingElement = document.getElementById("loading");
const mainElement = document.getElementById("main");
const questionElement = document.querySelector(".question");
const categoryElement = document.querySelector(".category");
const choicesElement = document.querySelector(".choices");
const correctScoreElement = document.querySelector(".correct-score");
const totalQuestionElement = document.querySelector(".total-question");
const checkButton = document.querySelector(".check-answer");
const playAgainButton = document.querySelector(".play-again");
const resultElement = document.querySelector(".result");

// State Variables
let correctAnswer = "";
let correctScore = 0;
let askedCount = 0;

// Event Listeners
function addEventListeners() {
  checkButton.addEventListener("click", checkAnswer);
  playAgainButton.addEventListener("click", restartQuiz);
}

// Load Question
async function loadQuestion() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch question");
    const data = await response.json();
    showQuestion(data.results[0]);
  } catch (error) {
    console.error("Error:", error);
    resultElement.innerHTML = `<p><i class="fas fa-exclamation-triangle"></i>Failed to load question. Please try again later.</p>`;
  }
}

// Show Question
function showQuestion(data) {
  correctAnswer = data.correct_answer;
  const choices = [...data.incorrect_answers];
  choices.splice(Math.floor(Math.random() * (choices.length + 1)), 0, correctAnswer);

  questionElement.innerHTML = data.question;
  categoryElement.innerHTML = data.category;
  choicesElement.innerHTML = choices.map((choice, index) => `<li>${index + 1}. <span>${choice}</span></li>`).join("");

  selectChoice();
}

// Select Choice
function selectChoice() {
  choicesElement.querySelectorAll("li").forEach((choice) => {
    choice.addEventListener("click", () => {
      choicesElement.querySelectorAll("li").forEach((c) => {
        c.classList.remove("selected", "active");
      });
      choice.classList.add("selected", "active");
    });
  });
}

// Check Answer
function checkAnswer() {
  const selected = choicesElement.querySelector(".selected");
  if (selected) {
    const selectedAnswer = selected.querySelector("span").textContent;
    resultElement.innerHTML = selectedAnswer.trim() === HTMLDecode(correctAnswer)
      ? `<h4><i class="fas fa-check"></i>Correct Answer!</h4>`
      : `<h4><i class="fas fa-times"></i>Incorrect Answer!</h4> <h4><small><b>Correct Answer:</b> ${correctAnswer}</small></h4>`;

    if (selectedAnswer.trim() === HTMLDecode(correctAnswer)) correctScore++;
    checkCount();
  } else {
    resultElement.innerHTML = `<p><i class="fas fa-question"></i>Please select an option!</p>`;
  }
}

// HTML Decode
function HTMLDecode(textString) {
  const doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

// Check Count
function checkCount() {
  askedCount++;
  setCount();

  if (askedCount === TOTAL_QUESTIONS) {
    resultElement.innerHTML += `<p>Your score is ${correctScore}.</p>`;
    playAgainButton.style.display = "block";
    checkButton.style.display = "none";
  } else {
    setTimeout(loadQuestion, 300);
  }
}

// Set Count
function setCount() {
  totalQuestionElement.textContent = TOTAL_QUESTIONS;
  correctScoreElement.textContent = correctScore;
}

// Restart Quiz
function restartQuiz() {
  correctScore = askedCount = 0;
  playAgainButton.style.display = "none";
  checkButton.style.display = "block";
  setCount();
  loadQuestion();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  fadeIn();
  addEventListeners();
  loadQuestion();
});

// Fade In
function fadeIn() {
  setTimeout(() => {
    loadingElement.style.opacity = 0;
    loadingElement.style.display = "none";
    mainElement.style.display = "block";
    setTimeout(() => (mainElement.style.opacity = 1), 50);
  }, LOADING_TIME);
}
