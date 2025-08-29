console.log("Hello!  This is your javascript file.");

// Leaving a starter one in here
let info = [{
    image: 'assets/adamsandler.jpg',
    text: "Hell yeah! Achieved my weight loss goal on my birthday",
    sleep: '8',
    feelings: ['Happy', 'Excited'],
    date: new Date().toLocaleString()
    },
    {
     image: 'assets/adamsandlerperf.jpeg',
     text: "Performed at the SNL today. Felt a little nervous but overall great experience",
     sleep: '10',
     feelings: ['Anxious', 'Excited'],
     date: new Date().toLocaleString()
    }];

const feelingIcons = {
    "Happy": "assets/greenstar.svg",
    "Excited": "assets/flame.png",
    "Anxious": "assets/redflag.png"
};


document.addEventListener("DOMContentLoaded", () => {
    renderEntries();
    updateStats();
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

        const file = fileInput.files[0];
        if (file) {
            entry.image = URL.createObjectURL(file);
        }
        info.push(entry)
        console.log('info', info)
        renderEntries()
        updateStats();
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


    function getAverages() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        let totalSleep = 0;
        let countSleep = 0;
        const feelingCounts = {};

        info.forEach(entry => {
            const entryDate = new Date(entry.date);

            if (entryDate >= oneWeekAgo) {
                // Sleep
                const sleepHours = parseFloat(entry.sleep);
                if (!isNaN(sleepHours)) {
                    totalSleep += sleepHours;
                    countSleep++;
                }

                // Feelings
                entry.feelings.forEach(f => {
                    feelingCounts[f] = (feelingCounts[f] || 0) + 1;
                });
            }
        });

        const avgSleep = countSleep > 0 ? (totalSleep / countSleep).toFixed(1) : 0;

        return {
            averageSleep: avgSleep,
            feelings: feelingCounts
        };
    }

    function updateStats() {
        const stats = getAverages();
        const statsContainer = document.getElementById("stats-container");
        const avgSleep = document.getElementById("avg-sleep");
        const avgFeelings = document.getElementById("avg-feelings");
        const template = document.getElementById("feeling-count-template");

        // Update average sleep
        avgSleep.textContent = `Average Sleep: ${stats.averageSleep} hrs`;

        // Clear old feelings
        avgFeelings.innerHTML = "";

        // Fill in feelings counts
        Object.keys(stats.feelings).forEach(feeling => {
            const clone = template.content.cloneNode(true);
            clone.querySelector(".card-feelings").src = feelingIcons[feeling];
            clone.querySelector(".card-feelings").alt = feeling;
            clone.querySelector(".feeling-text").textContent =
                `${feeling}: ${stats.feelings[feeling]}x`;
            avgFeelings.appendChild(clone);
        });
    }



})