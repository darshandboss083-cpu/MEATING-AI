const meetingText = document.getElementById("meetingText");
const demoButton = document.getElementById("demoButton");
const analyzeButton = document.getElementById("analyzeButton");
const clearButton = document.getElementById("clearButton");
const loading = document.getElementById("loading");

const summaryResult = document.getElementById("summaryResult");
const decisionResult = document.getElementById("decisionResult");
const actionResult = document.getElementById("actionResult");
const deadlineResult = document.getElementById("deadlineResult");
const peopleResult = document.getElementById("peopleResult");
const notificationResult = document.getElementById("notificationResult");

const actionCount = document.getElementById("actionCount");
const deadlineCount = document.getElementById("deadlineCount");
const peopleCount = document.getElementById("peopleCount");
const decisionCount = document.getElementById("decisionCount");

const managerMessage = document.getElementById("managerMessage");
const followUpButton = document.getElementById("followUpButton");

const chatMessages = document.getElementById("chatMessages");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const quickButtons = document.querySelectorAll(".quick-button");

let meetingData = {
    summary: "",
    decisions: [],
    actions: [],
    deadlines: [],
    people: []
};

const demoTranscript = `The product development team held a meeting to review the progress of the new mobile application.
The team discussed the current development status and the remaining work.
The team decided to use React for the frontend and Node.js for the backend.
Rahul will develop the user login and registration module by Friday.
Priya will complete testing of the login module by Monday.
Arjun will prepare the project documentation by Wednesday.
The team discussed a few issues with the current application performance.
The developers agreed to optimize the API response time before the next review.
Rahul will also fix the authentication issue reported during testing.
Priya will prepare the test report after completing the testing.
The manager asked all team members to update their progress regularly.
The team agreed to demonstrate the updated application during the next review meeting.
The manager requested that all pending tasks be completed before the demonstration.
The next project review meeting will be held on Thursday.
The team agreed to share the final progress report before the review meeting.`;

demoButton.addEventListener("click", function () {
    meetingText.value = demoTranscript;
});

analyzeButton.addEventListener("click", function () {
    const text = meetingText.value.trim();

    if (text === "") {
        alert("Please enter a meeting transcript.");
        return;
    }

    loading.style.display = "block";

    setTimeout(function () {
        analyzeMeeting(text);
        loading.style.display = "none";
        document.getElementById("dashboard").scrollIntoView({
            behavior: "smooth"
        });
    }, 800);
});

clearButton.addEventListener("click", function () {
    meetingText.value = "";

    meetingData = {
        summary: "",
        decisions: [],
        actions: [],
        deadlines: [],
        people: []
    };

    summaryResult.textContent = "Analyze a meeting to see the summary.";
    decisionResult.textContent = "Decisions will appear here.";
    actionResult.textContent = "Action items will appear here.";
    deadlineResult.textContent = "Deadlines will appear here.";
    peopleResult.textContent = "Responsibilities will appear here.";
    notificationResult.textContent = "No notifications yet.";

    actionCount.textContent = "0";
    deadlineCount.textContent = "0";
    peopleCount.textContent = "0";
    decisionCount.textContent = "0";

    managerMessage.textContent =
        "Analyze a meeting to generate a follow-up message.";
});

function analyzeMeeting(text) {
    const sentences = text
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0);

    const decisions = [];
    const actions = [];
    const deadlines = [];
    const people = [];

    sentences.forEach(function (sentence) {

        if (/decided|decision|agreed|approved|finalized|selected/i.test(sentence)) {
            decisions.push(sentence);
        }

        if (/will|must|need to|should|assigned|prepare|develop|test|complete|submit|fix|optimize/i.test(sentence)) {
            actions.push(sentence);
        }

        if (/by|before|deadline|monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week/i.test(sentence)) {
            deadlines.push(sentence);
        }

        if (/will|assigned|responsible|must|need to/i.test(sentence)) {
            people.push(sentence);
        }
    });

    meetingData.summary = sentences.slice(0, 2).join(". ") + ".";
    meetingData.decisions = decisions;
    meetingData.actions = actions;
    meetingData.deadlines = deadlines;
    meetingData.people = people;

    showResults();
}

function showResults() {
    summaryResult.textContent = meetingData.summary;

    decisionResult.innerHTML = createList(
        meetingData.decisions,
        "No important decisions found."
    );

    actionResult.innerHTML = createList(
        meetingData.actions,
        "No action items found."
    );

    deadlineResult.innerHTML = createList(
        meetingData.deadlines,
        "No deadlines found."
    );

    peopleResult.innerHTML = createList(
        meetingData.people,
        "No responsibilities found."
    );

    notificationResult.innerHTML = createList(
        meetingData.deadlines,
        "No deadline notifications found."
    );

    actionCount.textContent = meetingData.actions.length;
    deadlineCount.textContent = meetingData.deadlines.length;
    peopleCount.textContent = meetingData.people.length;
    decisionCount.textContent = meetingData.decisions.length;

    managerMessage.textContent =
        "Please ensure the assigned development and testing tasks are completed before the mentioned deadlines. The team will review the progress in the next meeting.";
}

function createList(items, emptyMessage) {
    if (items.length === 0) {
        return `<p>${emptyMessage}</p>`;
    }

    return items.map(function (item) {
        return `<p>• ${item}</p>`;
    }).join("");
}

followUpButton.addEventListener("click", function () {
    if (meetingData.summary === "") {
        alert("Please analyze a meeting first.");
        return;
    }

    managerMessage.textContent =
        "Please ensure the assigned development and testing tasks are completed before the mentioned deadlines. The team will review the progress in the next meeting.";
});

askButton.addEventListener("click", function () {
    askQuestion();
});

questionInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        askQuestion();
    }
});

quickButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        questionInput.value = button.dataset.question;
        askQuestion();
    });
});

function askQuestion() {
    const question = questionInput.value.trim();

    if (question === "") {
        return;
    }

    if (meetingData.summary === "") {
        addMessage("Please analyze a meeting first.", "assistant");
        questionInput.value = "";
        return;
    }

    addMessage(question, "user");

    const lowerQuestion = question.toLowerCase();
    let answer = "";

    if (
        lowerQuestion.includes("summary") ||
        lowerQuestion.includes("about") ||
        lowerQuestion.includes("meeting")
    ) {
        answer = meetingData.summary;
    } else if (
        lowerQuestion.includes("decision")
    ) {
        answer = meetingData.decisions.join(" | ") || "No decisions found.";
    } else if (
        lowerQuestion.includes("action") ||
        lowerQuestion.includes("task") ||
        lowerQuestion.includes("work")
    ) {
        answer = meetingData.actions.join(" | ") || "No action items found.";
    } else if (
        lowerQuestion.includes("deadline") ||
        lowerQuestion.includes("when") ||
        lowerQuestion.includes("due")
    ) {
        answer = meetingData.deadlines.join(" | ") || "No deadlines found.";
    } else if (
        lowerQuestion.includes("people") ||
        lowerQuestion.includes("responsib") ||
        lowerQuestion.includes("who")
    ) {
        answer = meetingData.people.join(" | ") || "No responsibilities found.";
    } else {
        answer = "You can ask me about the summary, decisions, action items, deadlines, or responsibilities.";
    }

    addMessage(answer, "assistant");
    questionInput.value = "";
}

function addMessage(message, type) {
    const messageDiv = document.createElement("div");

    if (type === "user") {
        messageDiv.className = "user-message";
    } else {
        messageDiv.className = "assistant-message";
    }

    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}