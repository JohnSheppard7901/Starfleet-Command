const shipsContainer = document.getElementById("shipsContainer");
const missionTableBody = document.getElementById("missionTableBody"); 
const missionsAmount = document.getElementById("missionsAmount");
const dispatchShipsModal = document.getElementById("dispatchShipsModal");

document.getElementById('addMissionBtn').addEventListener('click', function() {
    window.location.href = 'new-mission.html';
});

const searchMission = document.getElementById("searchMission");
const filterStatus = document.getElementById("filterStatus");
const filterDifficulty = document.getElementById("filterDifficulty");
const resetFilterBtn = document.getElementById("resetFilterBtn");


let ships = [];
let missions = [];
let filteredMissions = [];

loadShips();
loadMissions();


// SHIPS 
async function loadShips() {
    const response = await fetch("http://localhost:3001/ships");
    ships = await response.json();
    renderShips(ships);
}

function renderShips(ships){    
    const allCards = ships.map((ship) => {
        return `<div class="col-12 col-md-6 col-lg-3">
                <div class="card h-100" >
                    <img class="card-img-top" src="img/${ship.image}" alt="Card image cap">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h5 class="card-title">${ship.name}</h5>
                            <div>
                            Status: 
                                <span class="d-inline-block 
                                            rounded-circle
                                            statusSymbolSize
                                            ${ship.status === 'available' ? 'bg-success' : 'bg-danger'}">
                                </span> 
                            </div>                            
                        </div>
                        <p class="card-text">
                            Captain: ${ship.captain}
                        </p>
                        
                    </div>
                    <div class="card-footer d-flex justify-content-end">
                        <button class="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#shipDetailsModal"
                            data-ship-id="${ship.id}"
                        >
                            Details
                        </button>
                    </div>
                </div> <!-- /.card -->
            </div> <!-- /.col -->`;
    });
    shipsContainer.innerHTML = allCards.join("");    

    document.querySelectorAll("[data-ship-id]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const shipId = e.target.dataset.shipId;            
            let ship = ships.find((s) => s.id === shipId);
            queryAndSetDetailsModalElements(ship);            
        })
    });
}

function queryAndSetDetailsModalElements(ship){
    document.querySelectorAll(".detailsModalName").forEach(el => el.innerHTML = ship.name);
    document.getElementById("detailsModalDescription").innerHTML = ship.description;
    document.getElementById("detailsModalRegistry").innerHTML = ship.registry;
    document.getElementById("detailsModalClass").innerHTML = ship.class;
    document.getElementById("detailsModalCaptain").innerHTML = ship.captain;            
    document.getElementById("detailsModalCrewSize").innerHTML = ship.crewSize;
    document.getElementById("detailsModalCompletedMissions").innerHTML = ship.completedMissions;
    document.getElementById("detailsModalSector").innerHTML = ship.sector;
    document.getElementById("detailsModalMissionId").innerHTML = ship.missionId;

    document.getElementById("detailsModalPhaserArrays").innerHTML = ship.weapons.phaserArrays;
    document.getElementById("detailsModalPhotonTorpedos").innerHTML = ship.weapons.photonTorpedos;
    document.getElementById("detailsModalQuantumTorpedos").innerHTML = ship.weapons.quantumTorpedos;

    const statusElement = document.getElementById("detailsModalStatus");
    statusElement.innerHTML = ship.status;
    statusElement.classList.remove("text-bg-success", "text-bg-danger");
    statusElement.classList.add(ship.status === "available" ? 'text-bg-success' : 'text-bg-danger');
}


// MISSIONS
async function loadMissions() {
    const response = await fetch("http://localhost:3001/missions");
    missions = await response.json();
    filteredMissions = missions;
    getMissionsInProgressAmount(missions);
    renderMissions(filteredMissions);
}

async function renderMissions(missions){ 

    const allTableRows = await Promise.all(missions.map(async (mission) => {
        let status = mission.status;
        let icon;
        let statusColor;

        let assignedShip;
        let dispatchBtn;

        let difficultyColor;

        // set status icon and bg-color
        if(status === "in progress"){
            icon = "bi-arrow-repeat";
            statusColor = "text-bg-info";
        }else if(status === "completed"){
            icon = "bi-check2-circle";
            statusColor = "text-bg-success";
        }else{
            icon = "bi-hourglass-split";
            statusColor = "text-bg-secondary";
        }

        // set ship name or empty, create dispatch btn
        if(mission.shipId === null){
            assignedShip = "";
            dispatchBtn = `<button class="btn btn-sm btn-outline-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#dispatchShipsModal"
                                data-mission-id="${mission.id}"
                            >Dispatch</button>`;
        }else{
            assignedShip = await getShipById(mission.shipId);
            dispatchBtn = "";
        }

        // set difficulty colors
        if(mission.difficulty === "easy"){
            difficultyColor = "text-bg-success";
        } else if(mission.difficulty === "medium"){
            difficultyColor = "text-bg-warning";
        }else{
            difficultyColor = "text-bg-danger";
        }

        // create new row with data
        return `
            <tr>
                <td>${mission.name}</td>
                <td><span class="badge ${difficultyColor}">${mission.difficulty}</span></td>
                <td>
                    <span class="badge ${statusColor}">
                        <i class="bi ${icon} me-1"></i>
                        ${mission.status}
                    </span>
                </td>
                <td>${assignedShip}</td>
                <td>${dispatchBtn}</td>
            </tr>
        `;
    }));

    // add all created rows to table
    missionTableBody.innerHTML = allTableRows.join("");

    // add EventListener to every Dispatch btn, find corresponding mission, set modal
    document.querySelectorAll("[data-mission-id]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const missionId = e.target.dataset.missionId;
            const mission = missions.find(m => m.id === missionId);

            queryAndSetDispatchModalElements(mission);
        });
    });

}

function getMissionsInProgressAmount(missions){
    const amount = missions.filter(m => m.status === "in progress").length;
    missionsAmount.innerHTML = amount;
}

async function getShipById(shipId) {
    const response = await fetch(`http://localhost:3001/ships/${shipId}`);
    const ship = await response.json();
    return ship.name;
}

// set fields of Dispatch modal
function queryAndSetDispatchModalElements(mission){
    //set name and description
    document.getElementById("dispatchModalMissionName").value = mission.name;
    document.getElementById("dispatchModalMissionDescription").innerHTML = mission.description;

    //get html select element, filter ships and set every one as an option
    const dispatchModalSelect = document.getElementById("dispatchModalSelect");
    dispatchModalSelect.innerHTML = `<option value="">-- Select a ship --</option>`;
    const availableShips = ships.filter(s => s.status === "available");

    availableShips.forEach(s => {
        let option = document.createElement("option");
        option.value = s.id;
        option.innerText = s.name;

        dispatchModalSelect.appendChild(option);
    });

    //get btn to confirm dispatch and register an Event Listener to it
    const oldBtn = document.getElementById("modalConfirmDispatchBtn");
    const modalConfirmDispatchBtn = oldBtn.cloneNode(true);
    oldBtn.replaceWith(modalConfirmDispatchBtn);

    modalConfirmDispatchBtn.addEventListener("click", async (e) => {
        const shipId = document.getElementById("dispatchModalSelect").value;
        const missionId = mission.id;

        if(shipId === ""){
            await reloadDataAfterDispatch();
            return;
        }

        await Promise.all([
            patchMissionData(shipId, missionId),
            patchShipData(shipId, missionId)
        ]);        
        await reloadDataAfterDispatch();
    });
}

async function patchMissionData(shipId, missionId){  
    const response = await fetch(`http://localhost:3001/missions/${missionId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "in progress",
            shipId: shipId,
            dispatchedAt: Date.now()
        })
    });
    const updatedMission = await response.json();
}

async function patchShipData(shipId, missionId) {
    const response = await fetch(`http://localhost:3001/ships/${shipId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "mission",
            missionId: missionId
        })
    });

    const updatedShip = await response.json();
}

async function reloadDataAfterDispatch() {
    let modal = bootstrap.Modal.getInstance(dispatchShipsModal) || new bootstrap.Modal(dispatchShipsModal);
    modal.hide();

    await loadShips();
    await loadMissions();
    applyFilters();
}

//check for finished missions
function checkMissionsComplete(){
    let finishedMissions = missions.filter(m => m.status === "in progress");
    finishedMissions.forEach((m) => {

        if(Date.now() - m.dispatchedAt >= m.durationMinutes * 60 * 1000){
           console.log("Abgelaufene Mission: ", m.name); 
        }
        
    });

}

// Filter
filterStatus.addEventListener("input", () => { 
    applyFilters();
});

filterDifficulty.addEventListener("input", () => {
    applyFilters();
});

searchMission.addEventListener("input", () => {
    applyFilters();
});

function applyFilters() {
    let status = filterStatus.value;
    let difficulty = filterDifficulty.value;
    let searchValue = searchMission.value;

    let result = missions;

    if(status !== "")
        result = result.filter(m => m.status === status);

    if(difficulty !== "")
        result = result.filter(m => m.difficulty === difficulty);

    if(searchValue !== "" && searchValue !== " "){
        result = result.filter(m => m.name.toLowerCase().includes(searchValue.toLowerCase()));
    }
    filteredMissions = result;
    renderMissions(result);
}

// reset btn to reset all filters
resetFilterBtn.addEventListener("click", () => {
    filteredMissions = missions;
    filterStatus.value = "";
    filterDifficulty.value = "";
    searchMission.value = "";
    renderMissions(filteredMissions);
});