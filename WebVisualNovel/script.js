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

function nextLine() {
    if (currentLine >= dialogue.length) return;

    const line = dialogue[currentLine];

    document.getElementById("name").textContent = line.name;
    document.getElementById("text").textContent = line.text;

    const leftChar = document.getElementById("charLeft");
    const rightChar = document.getElementById("charRight");

    if (line.side === "left") {
        leftChar.style.opacity = "1";
        rightChar.style.opacity = "0.4";
    } else {
        rightChar.style.opacity = "1";
        leftChar.style.opacity = "0.4";
    }

    currentLine++;
}

// Start first line automatically
nextLine();