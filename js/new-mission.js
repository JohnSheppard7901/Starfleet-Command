const resetBtn = document.getElementById("resetBtn");
const createMissionForm = document.getElementById("createMissionForm");

const missionName = document.getElementById("missionName");
const missionDescription = document.getElementById("missionDescription");
const missionSector = document.getElementById("missionSector");
const missionDifficulty = document.getElementById("missionDifficulty");
const missionDuration = document.getElementById("missionDuration");

const successAlert = document.getElementById("successAlert");
const newMissionsContainer = document.getElementById("newMissionsContainer");
let newMissions = [];

document.getElementById("navToMissionsOverview").addEventListener("click", () => {
    window.location.href = 'index.html';
});


resetBtn.addEventListener("click", () => {createMissionForm.reset()});

createMissionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let name = missionName.value;
    let description = missionDescription.value;
    let sector = missionSector.value;
    let difficulty = missionDifficulty.value;
    let durationMinutes = missionDuration.value;

    const response = await fetch("http://localhost:3001/missions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            description,
            sector,
            difficulty,
            status: "pending",
            shipId: null,
            durationMinutes
        })
    });

    const createdMission = await response.json();
    createMissionForm.reset();
    console.log(createdMission);

    showSuccess(createdMission);
});


function showSuccess(createdMission){
    successAlert.classList.remove("d-none");
    newMissions.push(createdMission);

    newMissionsContainer.classList.remove("d-none");
    const ul = newMissionsContainer.querySelector("ul");

    let li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between");
    let spanForText = document.createElement("span");
    spanForText.innerHTML = createdMission.name;
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-outline-danger");
    deleteBtn.innerHTML = `<i class="bi bi-trash3"></i>`;

    deleteBtn.addEventListener("click", () => deleteMission(createdMission.id, li));

    li.appendChild(spanForText);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
}

async function deleteMission(missionId, li){
    const response = await fetch(`http://localhost:3001/missions/${missionId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        li.remove();
    }
}