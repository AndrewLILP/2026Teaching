const dialogue = [
    { name: "Liam", side: "left", text: "You finished maths already?" },
    { name: "Maya", side: "right", text: "Yeah. It was surprisingly easy." },
    { name: "Liam", side: "left", text: "No way. Question 5 was brutal." },
    { name: "Maya", side: "right", text: "Only if you forgot the formula." },
    { name: "Liam", side: "left", text: "I definitely forgot the formula." },
    { name: "Maya", side: "right", text: "I can help you study later… if you bring snacks." },
    { name: "Liam", side: "left", text: "Deal. But I’m choosing the snacks." },
    { name: "Maya", side: "right", text: "That feels dangerous." }
];

let currentLine = 0;
let typing = false;
let fullText = "";
let charIndex = 0;
let typingSpeed = 35;

function handleClick() {
    if (typing) {
        // If text is still typing, finish instantly
        document.getElementById("text").textContent = fullText;
        typing = false;
        return;
    }

    if (currentLine < dialogue.length) {
        showLine();
    }
}

function showLine() {
    const line = dialogue[currentLine];

    document.getElementById("name").textContent = line.name;

    const leftChar = document.getElementById("charLeft");
    const rightChar = document.getElementById("charRight");

    if (line.side === "left") {
        leftChar.style.opacity = "1";
        rightChar.style.opacity = "0.3";
    } else {
        rightChar.style.opacity = "1";
        leftChar.style.opacity = "0.3";
    }

    fullText = line.text;
    charIndex = 0;
    document.getElementById("text").textContent = "";
    typing = true;

    typeWriter();

    currentLine++;
}

function typeWriter() {
    if (charIndex < fullText.length) {
        document.getElementById("text").textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, typingSpeed);
    } else {
        typing = false;
    }
}

// Start first line
showLine();