const tiles = document.querySelectorAll(".nav-tile");

let activeIndex = 0;

function updateActiveTile() {
    tiles.forEach((tile, index)=> {
        tile.classList.toggle("active-tile", index === activeIndex);
    });
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

        updateActiveTile();
    }
    if(event.key === "Tab") {
        event.preventDefault();
    }
});
updateActiveTile();



tile.addEventListener("click", ()=> {
    tile.classList.toggle("active-tile");
})
