const tiles = document.querySelectorAll(".nav-tile");
const stage = document.querySelector("#app-stage");
const dialogs = {
    0: document.querySelector("#dialog-me"),
    1: document.querySelector("#dialog-projects"),
    2: document.querySelector("#dialog-hobbies")
};
const backgrounds = {
    0: document.querySelector('#bg-layer-me'),
    1: document.querySelector('#bg-layer-projects'),
    2: document.querySelector('#bg-layer-hobbies')
};

const landingBackground = document.querySelector("#bg-layer-landing");
const recomendationModal = document.querySelector("bg-recomendation-modal");
const recomendationTitle = document.querySelector("#recomendation-title");
const recomendationDescription = document.querySelector("#recomendation-description");

let recomendation = [];


let activeIndex = 0;
let currentScene = "landing";

function updateActiveTile() {
    tiles.forEach((tile, index)=> {
        tile.classList.toggle("active-tile", index === activeIndex);
    });
}

function switchBackground(index){
    document
        .querySelectorAll(".bg-layer")
        .forEach((layer) => {
            layer.classList.remove("active");
        });
    const background = backgrounds[index];

    if(background){
        background.classList.add("active");
    }
}


function openDialog(index) {
    const dialog = dialogs[index];

    if(!dialog){
        return;
    }
    currentScene = "content";
    switchBackground(index);

    document
        .querySelectorAll(".content-dialog")
        .forEach((item)=>{
            item.classList.remove("active");
        });
    dialog.classList.add("active");
    stage.classList.add("in-dialog");
}

function closeDialog() {
    currentScene = "landing";
    document
        .querySelectorAll(".content-dialog")
        .forEach((dialog) =>{
            dialog.classList.remove("active");
        });
    stage.classList.remove(".in-dialog");
    document
        .querySelectorAll(".in-dialog")
        .forEach((layer)=>{
            layer.classList.remove("active");
        });
    document
        .querySelector("#bg-layer-handling")
        .classList.add("active");
}

function setActiveTile(){

    openDialog(activeIndex);
}

async function loadRecomendation() {
    try {
        const reponse = await fetch("data/recomendation.json");
        if(!Response.ok) {
            throw new Error("Failed to load recomendation");
        }
        recomendation = await Response.json()
    }catch(error){
        console.error(error);
        recomendation=[];
    }
}

function getRandomRecomendation(){
    if(!recomendation.length){
        recomendationDescription.textContent="No Recomendation";
        recomendationDescription.textContent="No recomendation data is available";
        return;
    }
    const randomIndex =Math.floor(Math.random() * recomendation.length);

    const recommendation =
        recommendations[randomIndex];

    recommendationTitle.textContent =
        recommendation.title || "Untitled";

    recommendationDescription.textContent =
        recommendation.description ||
        "No description available.";

}

function closeRecomendation() {
    currentScene = "landing";
    stage.classList.remove("recomendation-open");
    landingBackground.classList.add("active");
}


document.addEventListener("keydown", (event) => {

    if (event.key === "Tab") {
        event.preventDefault();
        return;
    }

    if (currentScene === "content") {

        if (event.key === "Escape") {
            event.preventDefault();
            closeDialog();
        }

        return;
    }

    if (currentScene === "recommendation") {

        if (
            event.key === "r" ||
            event.key === "R" ||
            event.key === "Enter"
        ) {
            event.preventDefault();
            getRandomRecommendation();
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeRecommendation();
            return;
        }

        return;
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();

        activeIndex =
            (activeIndex + 1) % tiles.length;

        updateActiveTile();

        return;
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();

        activeIndex =
            (activeIndex - 1 + tiles.length) %
            tiles.length;

        updateActiveTile();

        return;
    }

    if (event.key === "Enter") {
        event.preventDefault();

        openDialog(activeIndex);

        return;
    }

    if (
        event.key === "r" ||
        event.key === "R"
    ) {
        event.preventDefault();

        openRecommendation();

        return;
    }
});

updateActiveTile();
// loadRecommendations();


let cursorTimeout;

function showCursor(){
        document.body.classList.add("mouse-visible");

    clearTimeout(cursorTimeout);

    cursorTimeout = setTimeout(() => {
        document.body.classList.remove("mouse-visible");
    }, 2000);
}

document.addEventListener("mousedown", () =>{
    showCursor();
});

document.addEventListener("contextmenu", (event) =>{
    event.preventDefault();
});