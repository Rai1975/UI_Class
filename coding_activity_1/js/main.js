console.log("Hello!  This is your javascript file.");

// Leaving a starter one in here
let info = [{
    image: 'assets/adamsandler.jpg',
    text: "Hell yeah! Achieved my weight loss goal on my birthday",
    sleep: '8',
    feelings: ['Happy', 'Excited'],
    date: new Date().toLocaleString()
}];

const feelingIcons = {
    "Happy": "assets/greenstar.svg",
    "Excited": "assets/flame.png",
    "Anxious": "assets/redflag.png"
};


document.addEventListener("DOMContentLoaded", () => {
    renderEntries();
    const saveBtn = document.getElementById('card-btn');

    saveBtn.addEventListener("click", () => {
        const fileInput = document.getElementById('entry-image')
        const textInput = document.getElementById('entry-text')
        const sleepInput = document.getElementById('entry-sleep')

        const feelings = [];
        if (document.getElementById('feeling-anxious').checked) feelings.push("Anxious");
        if (document.getElementById('feeling-happy').checked) feelings.push("Happy");
        if (document.getElementById('feeling-excited').checked) feelings.push("Excited");

        const entry = {
            image: fileInput.value,
            text: textInput.value,
            sleep: sleepInput.value,
            feelings: feelings,
            date: new Date().toLocaleString()
        };

        info.push(entry)
        console.log('info', info)
        renderEntries()
    })

    function renderEntries() {
        entriesContainer.innerHTML = "";

        const template = document.getElementById("entry-template");

        info.forEach(entry => {
            const clone = template.content.cloneNode(true);

            if (entry.image) {
                clone.querySelector(".card-img").src = entry.image;
            } else {
                clone.querySelector(".card-img").remove();
            }

            clone.querySelector(".card-date").textContent = entry.date;
            clone.querySelector(".card-emotion").innerHTML = entry.feelings.map(f => `
                <div class="feeling-item">
                    <img src="${feelingIcons[f]}"
                        alt="${f}"
                        class="card-feelings">
                    <span>${f}</span>
                </div>
            `).join("");
            clone.querySelector(".card-description").innerHTML = `${entry.text}<br><strong>Hours slept:</strong> ${entry.sleep}`;

            entriesContainer.appendChild(clone);
        });
    }

})