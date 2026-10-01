const tiles = document.querySelectorAll(".nav-tile");
const stage = document.querySelector("#app-stage");
const dialogStage = document.querySelector("#dialog-stage");

const dialogs = {
    0: document.querySelector("#dialog-me"),
    1: document.querySelector("#dialog-projects"),
    2: document.querySelector("#dialog-hobbies")
};

const backgrounds = {
    0: document.querySelector("#bg-layer-me"),
    1: document.querySelector("#bg-layer-projects"),
    2: document.querySelector("#bg-layer-hobbies")
};

const landingBackground = document.querySelector("#bg-layer-landing");

const recommendationModal =
    document.querySelector("#recommendation-modal");

const recommendationTitle =
    document.querySelector("#recommendation-title");

const recommendationDescription =
    document.querySelector("#recommendation-description");

let recommendations = [];
let activeIndex = 0;
let currentScene = "landing";
let cursorTimeout;


function updateActiveTile() {
    tiles.forEach((tile, index) => {
        tile.classList.toggle(
            "active-tile",
            index === activeIndex
        );
    });
}


function switchBackground(index) {
    document.querySelectorAll(".bg-layer").forEach((layer) => {
        layer.classList.remove("active");
    });

    const background = backgrounds[index];

    if (background) {
        background.classList.add("active");
    }
}


function showLandingBackground() {
    document.querySelectorAll(".bg-layer").forEach((layer) => {
        layer.classList.remove("active");
    });

    landingBackground.classList.add("active");
}


function openDialog(index) {
    const dialog = dialogs[index];

    if (!dialog) {
        return;
    }

    currentScene = "content";

    switchBackground(index);

    document
        .querySelectorAll(".content-dialog")
        .forEach((item) => {
            item.classList.remove("active");
            item.setAttribute("aria-hidden", "true");
        });

    dialog.classList.add("active");
    dialog.setAttribute("aria-hidden", "false");

    dialogStage.setAttribute("aria-hidden", "false");
    stage.classList.add("in-dialog");
}


function closeDialog() {
    currentScene = "landing";

    document
        .querySelectorAll(".content-dialog")
        .forEach((dialog) => {
            dialog.classList.remove("active");
            dialog.setAttribute("aria-hidden", "true");
        });

    dialogStage.setAttribute("aria-hidden", "true");
    stage.classList.remove("in-dialog");

    showLandingBackground();
}


async function loadRecommendations() {
    try {
        const response = await fetch(
            "data/recommendations.json"
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load recommendations"
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "Recommendation data must be an array"
            );
        }

        recommendations = data.filter((item) => {
            return (
                item &&
                typeof item.title === "string" &&
                typeof item.description === "string"
            );
        });

    } catch (error) {
        console.error(error);
        recommendations = [];
    }
}


function getRandomRecommendation() {
    if (!recommendations.length) {
        recommendationTitle.textContent =
            "NO RECOMMENDATION";

        recommendationDescription.textContent =
            "No recommendation data is available.";

        return;
    }

    const randomIndex =
        Math.floor(
            Math.random() * recommendations.length
        );

    const recommendation =
        recommendations[randomIndex];

    recommendationTitle.textContent =
        recommendation.title;

    recommendationDescription.textContent =
        recommendation.description;
}


function openRecommendation() {
    if (currentScene !== "landing") {
        return;
    }

    currentScene = "recommendation";

    getRandomRecommendation();

    stage.classList.add("recommendation-open");

    recommendationModal.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeRecommendation() {
    currentScene = "landing";

    stage.classList.remove(
        "recommendation-open"
    );

    recommendationModal.setAttribute(
        "aria-hidden",
        "true"
    );

    showLandingBackground();
}


function showCursor() {
    document.body.classList.add(
        "mouse-visible"
    );

    clearTimeout(cursorTimeout);

    cursorTimeout = setTimeout(() => {
        document.body.classList.remove(
            "mouse-visible"
        );
    }, 2000);
}


document.addEventListener("mousedown", () => {
    showCursor();
});


document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});


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

    if (event.key === "Escape") {
        event.preventDefault();

        if (currentScene !== "landing") {
            closeDialog();
            closeRecommendation();
        }
    }
});


updateActiveTile();
loadRecommendations();