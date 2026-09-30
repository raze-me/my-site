const tiles = document.querySelectorAll(".nav-tile");

let currentScene = "landing";
let activeIndex = 0;
const backgrounds = {
    0: document.querySelector('#bg-layer-me'),
    1: document.querySelector('#bg-layer-projects'),
    2: document.querySelector('#bg-layer-hobbies')
};

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

function setActiveTile(){

    currentScene = "content";
    switchBackground(activeIndex);
    console.log(
        "Entered scene:",
        activeIndex
    );
}

document.addEventListener("keydown", (event) => {
    if(event.key === "Arrow.right"){
        event.preventDefault();
        activeIndex=(activeIndex+1)%tiles.length;
        updateActiveTile();
    }
    if(event.key === "ArrowLeft"){
        event.preventDefault();
        activeIndex = (activeIndex-1+tiles.length)%tiles.length;

        event.preventDefault();
        activeIndex = (activeIndex)
        updateActiveTile();
    }
    if(event.key === "Tab") {
        event.preventDefault();
    }
    if(event.key === "Escape"){
        event.preventDefault();

        if(currentScene !== "landing"){
            currentScene = "landing";

            document
                .querySelectorAll(".bg-layer")
                .forEach((layer) => {
                    layer.classList.remove("active");
                });
            document
                .querySelector("#bg-layer-landing")
                .classList.add("active");

            console.log("Returned to landing");
        }
    }
    
});
updateActiveTile();

