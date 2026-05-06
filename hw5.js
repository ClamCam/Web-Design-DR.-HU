// ---------------------------
// Mobile navigation behavior
// ---------------------------
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    navToggle.classList.add("pulse");
    setTimeout(() => navToggle.classList.remove("pulse"), 400);
  });

  // Close mobile menu after clicking a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

// --------------------------------------
// Smooth scrolling enhancement (JS side)
// --------------------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    const targetEl = document.querySelector(targetId);

    if (!targetEl) {
      return;
    }

    event.preventDefault();
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ---------------------------------
// Interactive equation generator
// ---------------------------------
const mInput = document.getElementById("m-value");
const bInput = document.getElementById("b-value");
const equationDisplay = document.getElementById("equation-display");
const valueTable = document.getElementById("value-table");

// Live graph DOM elements
const gridLinesGroup = document.getElementById("grid-lines");
const functionLine = document.getElementById("function-line");

// Graph setup constants
const VIEWBOX_SIZE = 400;
const HALF = VIEWBOX_SIZE / 2;
const UNITS_RANGE = 10; // from -10 to +10
const SCALE = HALF / UNITS_RANGE; // 20 pixels per unit

// Build readable equation text handling signs nicely
function formatEquation(m, b) {
  const mText = Number(m);
  const bText = Number(b);
  const sign = bText >= 0 ? "+" : "-";
  return `y = ${mText}x ${sign} ${Math.abs(bText)}`;
}

// Convert math coordinates (x,y) to SVG pixel coordinates
function toSvgPoint(x, y) {
  return {
    x: HALF + x * SCALE,
    y: HALF - y * SCALE,
  };
}

// Draw graph grid once
function drawGrid() {
  if (!gridLinesGroup) {
    return;
  }

  let lines = "";
  for (let i = -10; i <= 10; i += 1) {
    const vertical = toSvgPoint(i, 0).x;
    const horizontal = toSvgPoint(0, i).y;
    lines += `<line x1="${vertical}" y1="0" x2="${vertical}" y2="${VIEWBOX_SIZE}"></line>`;
    lines += `<line x1="0" y1="${horizontal}" x2="${VIEWBOX_SIZE}" y2="${horizontal}"></line>`;
  }
  gridLinesGroup.innerHTML = lines;
}

// Draw the current linear function y = mx + b
function updateGraphLine(m, b) {
  if (!functionLine) {
    return;
  }

  const mNum = Number(m);
  const bNum = Number(b);

  // Use two end x-values to define the line
  const leftX = -10;
  const rightX = 10;
  const leftY = mNum * leftX + bNum;
  const rightY = mNum * rightX + bNum;

  const p1 = toSvgPoint(leftX, leftY);
  const p2 = toSvgPoint(rightX, rightY);

  functionLine.setAttribute("x1", p1.x.toString());
  functionLine.setAttribute("y1", p1.y.toString());
  functionLine.setAttribute("x2", p2.x.toString());
  functionLine.setAttribute("y2", p2.y.toString());
}

// Show a mini x-y value table for quick graphing support
function renderValueTable(m, b) {
  const mNum = Number(m);
  const bNum = Number(b);

  let rows = '<div class="value-row"><strong>x</strong><strong>y</strong></div>';
  for (let x = -2; x <= 2; x += 1) {
    const y = mNum * x + bNum;
    rows += `<div class="value-row"><span>${x}</span><span>${y}</span></div>`;
  }
  valueTable.innerHTML = rows;
}

function updateEquation() {
  const m = mInput.value || 0;
  const b = bInput.value || 0;
  equationDisplay.textContent = formatEquation(m, b);
  renderValueTable(m, b);
  updateGraphLine(m, b);
}

if (mInput && bInput) {
  drawGrid();
  mInput.addEventListener("input", updateEquation);
  bInput.addEventListener("input", updateEquation);
  updateEquation();
}

// ----------------------------
// Practice quiz with scoring
// ----------------------------
const quizData = [
  {
    question: "In y = 3x + 5, what is the slope?",
    options: ["3", "5", "-3", "8"],
    answer: "3",
  },
  {
    question: "In y = -2x + 4, what is the y-intercept?",
    options: ["-2", "2", "4", "-4"],
    answer: "4",
  },
  {
    question: "Which equation is in slope-intercept form?",
    options: ["2x + y = 5", "y = mx + b", "Ax + By = C", "x = 7"],
    answer: "y = mx + b",
  },
  {
    question: "A line with positive slope will...",
    options: [
      "go down left to right",
      "go up left to right",
      "be horizontal only",
      "cross no axis",
    ],
    answer: "go up left to right",
  },
  {
    question: "If m = 0 in y = mx + b, the graph is...",
    options: ["vertical", "diagonal", "horizontal", "parabolic"],
    answer: "horizontal",
  },
];

const questionEl = document.getElementById("quiz-question");
const optionsEl = document.getElementById("quiz-options");
const feedbackEl = document.getElementById("quiz-feedback");
const scoreEl = document.getElementById("score-display");
const counterEl = document.getElementById("question-counter");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

let currentQuestion = 0;
let score = 0;
let answered = false;

function loadQuestion() {
  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  answered = false;
  nextBtn.disabled = true;
  counterEl.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;

  current.options.forEach((optionText) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = optionText;
    button.addEventListener("click", () => handleAnswer(button, optionText));
    optionsEl.appendChild(button);
  });
}

function handleAnswer(button, selected) {
  if (answered) {
    return;
  }

  answered = true;
  const correct = quizData[currentQuestion].answer;
  const allOptionButtons = optionsEl.querySelectorAll(".quiz-option");

  allOptionButtons.forEach((btn) => {
    if (btn.textContent === correct) {
      btn.classList.add("correct");
    }
  });

  if (selected === correct) {
    score += 1;
    button.classList.add("correct");
    feedbackEl.textContent = "Correct! Great work.";
  } else {
    button.classList.add("incorrect");
    feedbackEl.textContent = `Not quite. Correct answer: ${correct}`;
  }

  scoreEl.textContent = `Score: ${score}`;
  nextBtn.disabled = false;
}

function goToNextQuestion() {
  if (currentQuestion < quizData.length - 1) {
    currentQuestion += 1;
    loadQuestion();
  } else {
    questionEl.textContent = "Quiz complete!";
    optionsEl.innerHTML = "";
    feedbackEl.textContent = `Final Score: ${score}/${quizData.length}`;
    nextBtn.disabled = true;
  }
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  scoreEl.textContent = "Score: 0";
  loadQuestion();
}

if (nextBtn && restartBtn) {
  nextBtn.addEventListener("click", () => {
    nextBtn.classList.add("pulse");
    setTimeout(() => nextBtn.classList.remove("pulse"), 400);
    goToNextQuestion();
  });

  restartBtn.addEventListener("click", () => {
    restartBtn.classList.add("pulse");
    setTimeout(() => restartBtn.classList.remove("pulse"), 400);
    restartQuiz();
  });
}

// Initialize quiz on load
if (questionEl && optionsEl) {
  loadQuestion();
}
