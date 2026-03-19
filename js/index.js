const shipsContainer = document.getElementById("shipsContainer");
const missionTableBody = document.getElementById("missionTableBody"); 
const missionsAmount = document.getElementById("missionsAmount");

loadShips();
loadMissions();


async function loadShips() {
    const response = await fetch("http://localhost:3001/ships");
    const ships = await response.json();
    renderShips(ships);
}

async function loadMissions() {
    const response = await fetch("http://localhost:3001/missions");
    const missions = await response.json();
    getMissionsInProgressAmount(missions);
    renderMissions(missions);
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
                                            ${ship.status === 'available' ? 'bg-success' : 'bg-danger'} ">
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
                        >
                            Details
                        </button>
                    </div>
                </div> <!-- /.card -->
            </div> <!-- /.col -->`;
    });
    shipsContainer.innerHTML = allCards.join("");    
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

        // set ship name or empty
        if(mission.shipId === null){
            assignedShip = "";
            dispatchBtn = `<button class="btn btn-sm btn-outline-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#dispatchShipsModal"
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
    missionTableBody.innerHTML = allTableRows.join("");
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