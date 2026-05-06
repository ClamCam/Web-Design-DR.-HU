// HW6 JavaScript file
// Global variable tracks currently selected topic for graph + quiz flow.
var currentTopic = null;
var isLoggedIn = false;
var backgroundColorIndex = 0;
var tipIndex = 0;
var backgroundColors = ["#d9ecff", "#dff7df", "#fff7bf", "#f5e1c8", "#f0ddff"];
var studyTips = [
  "Great job studying! Choose a unit and test yourself with graph + quiz practice.",
  "Math quote: Practice is the bridge between confusion and understanding.",
  "Math quote: Small daily progress in math adds up to big results."
];
var validCredentials = [
  { name: "Cameron", password: "linear1" },
  { name: "Student", password: "math123" }
];

// Central topic data keeps lesson content, graph, and quiz in sync.
var topics = [
  {
    key: "slope",
    title: "Slope",
    overview: "Slope measures rate of change: how much y changes when x increases by 1.",
    steps: "Use m = (y2 - y1) / (x2 - x1) to compare two points on a line.",
    problem: "Problem: Find the slope between points (2, 3) and (6, 11).",
    graphTip: "Graph tip: The slope is 2, so from any point move up 2 and right 1.",
    line: { m: 2, b: -1, equation: "y = 2x - 1" },
    quiz: {
      question: "For y = 2x - 1, what is the slope?",
      options: ["-1", "2", "1/2"],
      answerIndex: 1
    }
  },
  {
    key: "intercept",
    title: "Y-Intercept",
    overview: "The y-intercept is where the line crosses the y-axis.",
    steps: "In y = mx + b, the value b is always the y-intercept.",
    problem: "Problem: Identify the y-intercept in y = -3x + 5.",
    graphTip: "Graph tip: Plot (0, 5) first, then use slope -3 to find more points.",
    line: { m: -3, b: 5, equation: "y = -3x + 5" },
    quiz: {
      question: "What is the y-intercept of y = -3x + 5?",
      options: ["-3", "5", "0"],
      answerIndex: 1
    }
  },
  {
    key: "slopeIntercept",
    title: "Slope-Intercept Form",
    overview: "Slope-intercept form is y = mx + b and is easiest for quick graphing.",
    steps: "Identify m and b, plot b, then move using slope m.",
    problem: "Problem: Write equation in y = mx + b form for slope 4 and y-intercept -2.",
    graphTip: "Graph tip: y = 4x - 2 crosses at (0, -2) and rises 4 per 1 right.",
    line: { m: 4, b: -2, equation: "y = 4x - 2" },
    quiz: {
      question: "Which equation has slope 4 and y-intercept -2?",
      options: ["y = -2x + 4", "y = 4x - 2", "y = 2x - 4"],
      answerIndex: 1
    }
  },
  {
    key: "pointSlope",
    title: "Point-Slope Form",
    overview: "Point-slope form uses one known point and one slope: y - y1 = m(x - x1).",
    steps: "Substitute point (2, 1) and slope 3 into y - y1 = m(x - x1).",
    problem: "Problem: Write equation of a line with slope 3 through point (2, 1).",
    graphTip: "Graph tip: Equivalent slope-intercept form is y = 3x - 5.",
    line: { m: 3, b: -5, equation: "y = 3x - 5" },
    quiz: {
      question: "Which is point-slope form for slope 3 through (2, 1)?",
      options: ["y - 1 = 3(x - 2)", "y + 1 = 3(x + 2)", "y - 2 = 1(x - 3)"],
      answerIndex: 0
    }
  },
  {
    key: "standardForm",
    title: "Standard Form",
    overview: "Standard form is Ax + By = C with integer coefficients.",
    steps: "Move x and y terms to one side and constants to the other.",
    problem: "Problem: Convert y = 2x - 6 into standard form Ax + By = C.",
    graphTip: "Graph tip: Standard form 2x - y = 6 has intercepts (3, 0) and (0, -6).",
    line: { m: 2, b: -6, equation: "y = 2x - 6" },
    quiz: {
      question: "What is standard form of y = 2x - 6?",
      options: ["2x - y = 6", "2x + y = 6", "y - 2x = 6"],
      answerIndex: 0
    }
  },
  {
    key: "parallelPerpendicular",
    title: "Parallel and Perpendicular Lines",
    overview: "Parallel lines have equal slopes; perpendicular lines have negative reciprocal slopes.",
    steps: "If slope is 1/2, parallel is 1/2 and perpendicular is -2.",
    problem: "Problem: A line has slope 1/2. Find slopes of a parallel and perpendicular line.",
    graphTip: "Graph tip: Here we graph y = 0.5x + 1 as a reference line.",
    line: { m: 0.5, b: 1, equation: "y = 0.5x + 1" },
    quiz: {
      question: "If a line has slope 1/2, which slope is perpendicular?",
      options: ["1/2", "-2", "2"],
      answerIndex: 1
    }
  },
  {
    key: "systems",
    title: "Systems of Linear Equations",
    overview: "A system solution is the intersection point satisfying both equations.",
    steps: "Set equations equal to solve for x, then substitute to get y.",
    problem: "Problem: Solve y = x + 1 and y = -x + 5.",
    graphTip: "Graph tip: The lines intersect at (2, 3), the system solution.",
    line: { m: 1, b: 1, equation: "y = x + 1 (first line shown)" },
    quiz: {
      question: "What is the solution to y = x + 1 and y = -x + 5?",
      options: ["(3, 2)", "(2, 3)", "(1, 4)"],
      answerIndex: 1
    }
  },
  {
    key: "graphing",
    title: "Graphing Linear Functions",
    overview: "Graphing uses equation form, table values, and plotting points correctly.",
    steps: "For y = -x + 4, make a table and connect points in a straight line.",
    problem: "Problem: Graph y = -x + 4 using x = 0, 1, 2, 3.",
    graphTip: "Graph tip: Points are (0,4), (1,3), (2,2), (3,1).",
    line: { m: -1, b: 4, equation: "y = -x + 4" },
    quiz: {
      question: "Which point is on y = -x + 4?",
      options: ["(2, 2)", "(2, 4)", "(4, 4)"],
      answerIndex: 0
    }
  }
];

// This function runs when the page loads (called by body onload).
function initializePage() {
  console.log("Page loaded. Initializing event listeners.");

  // Add event listeners to the three main buttons.
  var bgButton = document.getElementById("bgButton");
  var textButton = document.getElementById("textButton");
  var alertButton = document.getElementById("alertButton");
  bgButton.addEventListener("click", changeBackgroundColor);
  textButton.addEventListener("click", changeLessonText);
  alertButton.addEventListener("click", showStudyAlert);

  // Add event listener for form submission.
  var form = document.getElementById("studentForm");
  form.addEventListener("submit", validateAndSubmitForm);

  // Topic dropdown stays hidden in locked section until login succeeds.
  var topicSelect = document.getElementById("topicSelect");
  topicSelect.addEventListener("change", showTopicDetails);

  // Add event listeners to quiz buttons using class name.
  var quizButtons = document.getElementsByClassName("quiz-button");
  for (var i = 0; i < quizButtons.length; i++) {
    quizButtons[i].addEventListener("click", checkQuizAnswer);
  }

  // Example of using getElementsByTagName for debugging.
  var headings = document.getElementsByTagName("h2");
  console.log("Number of section headings found:", headings.length);

  drawEmptyGraph();
}

// Button function 1: changes the page background color.
function changeBackgroundColor() {
  var body = document.getElementsByTagName("body")[0];
  body.style.backgroundColor = backgroundColors[backgroundColorIndex];
  console.log("Background changed to:", backgroundColors[backgroundColorIndex]);
  backgroundColorIndex++;

  if (backgroundColorIndex >= backgroundColors.length) {
    backgroundColorIndex = 0;
  }
}

// Button function 2: updates educational text on the page.
function changeLessonText() {
  var paragraph = document.getElementById("changeableText");

  if (tipIndex < studyTips.length) {
    paragraph.textContent = studyTips[tipIndex];
    console.log("Displayed study tip number:", tipIndex + 1);
    tipIndex++;
  } else {
    paragraph.textContent = "That's all the tips i have for today! : )";
    console.log("No more study tips available.");
  }
}

// Button function 3: shows an alert message.
function showStudyAlert() {
  var nameInput = document.getElementById("studentName").value.trim();
  var passwordInput = document.getElementById("studentPassword").value.trim();
  var displayName = nameInput === "" ? "Cameron" : nameInput;
  var displayPassword = passwordInput === "" ? "linear1" : passwordInput;

  alert(
    "Keep practicing! Linear equations become easier with repetition.\n\n" +
    "Name: " + displayName + "\n" +
    "Password: " + displayPassword
  );
  console.log("Study alert displayed with current login info.");
}

// Form validation and successful submission message.
function validateAndSubmitForm(event) {
  event.preventDefault();
  console.log("Form submit clicked. Starting validation.");

  // document.forms[] usage requirement.
  var form = document.forms["studentForm"];
  var nameValue = form["studentName"].value.trim();
  var passwordValue = form["studentPassword"].value.trim();
  var message = document.getElementById("formMessage");
  var practiceSection = document.getElementById("practiceSection");
  var quizSection = document.getElementById("quizSection");

  // Reset classes before showing a new message.
  message.classList.remove("success");
  message.classList.remove("error");

  if (nameValue === "") {
    isLoggedIn = false;
    practiceSection.classList.add("hidden");
    quizSection.classList.add("hidden");
    message.textContent = "Name cannot be empty.";
    message.classList.add("error");
    console.log("Validation failed: name is empty.");
  } else if (passwordValue.length < 6) {
    isLoggedIn = false;
    practiceSection.classList.add("hidden");
    quizSection.classList.add("hidden");
    message.textContent = "Password must be at least 6 characters.";
    message.classList.add("error");
    console.log("Validation failed: password too short.");
  } else if (!isValidLogin(nameValue, passwordValue)) {
    isLoggedIn = false;
    practiceSection.classList.add("hidden");
    quizSection.classList.add("hidden");
    message.textContent = "Incorrect login. Try Name: Cameron and Password: linear1";
    message.classList.add("error");
    console.log("Validation failed: incorrect name/password.");
  } else {
    isLoggedIn = true;
    message.textContent = "Welcome, " + nameValue + "! You are logged in. Pick a topic below.";
    message.classList.add("success");
    practiceSection.classList.remove("hidden");
    quizSection.classList.remove("hidden");
    console.log("Form submitted successfully for:", nameValue);
  }
}

// Checks credentials against allowed classroom login accounts.
function isValidLogin(nameValue, passwordValue) {
  for (var i = 0; i < validCredentials.length; i++) {
    if (
      validCredentials[i].name.toLowerCase() === nameValue.toLowerCase() &&
      validCredentials[i].password === passwordValue
    ) {
      return true;
    }
  }
  return false;
}

// Shows topic-specific lesson + graph + quiz after topic selection.
function showTopicDetails() {
  var topicSelect = document.getElementById("topicSelect");
  var selectedTopic = topicSelect.value;
  var topicTitle = document.getElementById("topicTitle");
  var topicOverview = document.getElementById("topicOverview");
  var topicSteps = document.getElementById("topicSteps");
  var topicProblem = document.getElementById("topicProblem");
  var topicGraph = document.getElementById("topicGraph");

  if (selectedTopic === "") {
    currentTopic = null;
    topicTitle.textContent = "Topic details will appear here.";
    topicOverview.textContent = "";
    topicSteps.textContent = "";
    topicProblem.textContent = "";
    topicGraph.textContent = "";
    setQuizPlaceholder();
    drawEmptyGraph();
    console.log("No topic selected yet.");
    return;
  }

  for (var i = 0; i < topics.length; i++) {
    if (topics[i].key === selectedTopic) {
      currentTopic = topics[i];
      topicTitle.textContent = currentTopic.title;
      topicOverview.textContent = "Overview: " + currentTopic.overview;
      topicSteps.textContent = "How to solve: " + currentTopic.steps;
      topicProblem.textContent = currentTopic.problem;
      topicGraph.textContent = currentTopic.graphTip;
      loadQuizForTopic(currentTopic);
      drawLineGraph(currentTopic.line.m, currentTopic.line.b, currentTopic.line.equation);
      console.log("Displayed topic:", currentTopic.title);
      break;
    }
  }
}

// Loads quiz question/options that match the selected topic.
function loadQuizForTopic(topic) {
  var quizQuestion = document.getElementById("quizQuestion");
  var quizResult = document.getElementById("quizResult");
  var quizButtons = document.getElementsByClassName("quiz-button");
  var options = topic.quiz.options;

  quizQuestion.textContent = topic.quiz.question;
  quizResult.textContent = "";
  quizResult.classList.remove("success");
  quizResult.classList.remove("error");

  for (var i = 0; i < quizButtons.length; i++) {
    quizButtons[i].textContent = options[i];
  }
}

// Placeholder state for quiz when no topic is selected.
function setQuizPlaceholder() {
  var quizQuestion = document.getElementById("quizQuestion");
  var quizResult = document.getElementById("quizResult");
  var quizButtons = document.getElementsByClassName("quiz-button");

  quizQuestion.textContent = "Pick a topic first to load a mini quiz.";
  quizResult.textContent = "";
  quizResult.classList.remove("success");
  quizResult.classList.remove("error");

  for (var i = 0; i < quizButtons.length; i++) {
    quizButtons[i].textContent = "Option " + String.fromCharCode(65 + i);
  }
}

// Interactive quiz logic tied to selected topic.
function checkQuizAnswer(event) {
  var quizResult = document.getElementById("quizResult");
  var optionIndex = Number(event.target.getAttribute("data-index"));

  if (!currentTopic) {
    quizResult.textContent = "Please select a topic first.";
    quizResult.classList.remove("success");
    quizResult.classList.add("error");
    console.log("Quiz blocked: no topic selected.");
    return;
  }

  if (optionIndex === currentTopic.quiz.answerIndex) {
    quizResult.textContent = "Correct for " + currentTopic.title + "!";
    quizResult.classList.remove("error");
    quizResult.classList.add("success");
    console.log("Quiz answered correctly for topic:", currentTopic.key);
  } else {
    quizResult.textContent = "Not quite for " + currentTopic.title + ". Try again.";
    quizResult.classList.remove("success");
    quizResult.classList.add("error");
    console.log("Quiz answered incorrectly for topic:", currentTopic.key);
  }
}

// Draws blank graph axes before a topic is selected.
function drawEmptyGraph() {
  drawLineGraph(0, 0, "Select a topic to draw its line");
}

// Draws a coordinate grid and one linear function using SVG.
function drawLineGraph(m, b, equationText) {
  var svg = document.getElementById("graphSvg");
  var equationLabel = document.getElementById("graphEquation");
  var size = 320;
  var center = 160;
  var scale = 24;
  var html = "";

  equationLabel.textContent = "Equation shown: " + equationText;

  // Build light grid.
  for (var i = 0; i <= size; i += scale) {
    html += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="' + size + '" stroke="#e7eefc" stroke-width="1"></line>';
    html += '<line x1="0" y1="' + i + '" x2="' + size + '" y2="' + i + '" stroke="#e7eefc" stroke-width="1"></line>';
  }

  // Axes.
  html += '<line x1="0" y1="' + center + '" x2="' + size + '" y2="' + center + '" stroke="#7389b8" stroke-width="2"></line>';
  html += '<line x1="' + center + '" y1="0" x2="' + center + '" y2="' + size + '" stroke="#7389b8" stroke-width="2"></line>';

  // Two points for y = mx + b: x=-6 and x=6.
  var x1 = -6;
  var y1 = m * x1 + b;
  var x2 = 6;
  var y2 = m * x2 + b;

  var svgX1 = center + x1 * scale;
  var svgY1 = center - y1 * scale;
  var svgX2 = center + x2 * scale;
  var svgY2 = center - y2 * scale;

  html += '<line x1="' + svgX1 + '" y1="' + svgY1 + '" x2="' + svgX2 + '" y2="' + svgY2 + '" stroke="#2f6fed" stroke-width="3"></line>';
  html += '<circle cx="' + svgX1 + '" cy="' + svgY1 + '" r="4" fill="#1f56c2"></circle>';
  html += '<circle cx="' + svgX2 + '" cy="' + svgY2 + '" r="4" fill="#1f56c2"></circle>';

  svg.innerHTML = html;
  console.log("Graph redrawn for equation:", equationText);
}
