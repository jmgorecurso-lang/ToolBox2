/*==================================================
                    TOOLBOX 2.0
==================================================*/

let currentCategory = "diagnostico";
let currentTools = [];
let category = [];
let allTools = [];

/*==================================================
                    INICIO
==================================================*/

document.addEventListener("DOMContentLoaded", () => {
    init();
});
async function init() {
    initClock();
    initSearch();
    await loadCategories();
    await loadAllTools();
    loadCategory(currentCategory);

}

/*==================================================
                    RELOJ
==================================================*/

function initClock() {
    updateClock();
    setInterval(updateClock, 1000);

}

function updateClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;
    clock.textContent = new Date().toLocaleTimeString();

}
/*==================================================
                BUSCADOR
==================================================*/

function initSearch() {
    const input = document.getElementById("searchInput");
    input.addEventListener("input", (e) => {
        filterTools(e.target.value);

    });
}
function filterTools(text) {
    text = text.toLowerCase();
    const filtered = allTools.filter(tool => {
        return (
            tool.name.toLowerCase().includes(text) ||
            tool.description.toLowerCase().includes(text) ||
            tool.open.toLowerCase().includes(text) ||
            tool.tags.join(" ").toLowerCase().includes(text)

        );

    });

    createCards(filtered);
}

/*==================================================
                CARGAR CATEGORÍAS
==================================================*/

async function loadCategories() {
    try {
        const response = await fetch("data/categories.json");
        const categories = await response.json();
        createCategoryButtons(categories);
        document.getElementById("categoryCounter").textContent = categories.length;
    }
    catch (error) {
        console.error(error);
    }
}

/*==================================================
            CARGAR TODAS LAS HERRAMIENTAS
==================================================*/

async function loadAllTools() {
    try {
        allTools = [];
        const response = await fetch("data/categories.json");
        const categories = await response.json();
        for (const category of categories) {
            const file = await fetch(`data/${category.id}.json`);
            const tools = await file.json();
            tools.forEach(tool => {
                tool.categoryName = category.name;
                tool.categoryColor = category.color;
                allTools.push(tool);
            });
        }
        console.log("Herramientas cargadas:", allTools.length);
    }

    catch (error) {
        console.error(error);
    }

}

function createCategoryButtons(categories) {
    const menu = document.getElementById("categoryMenu");
    menu.innerHTML = "";
    categories.forEach(category => {
        menu.innerHTML += `
        <button
            class="category-btn"
            onclick="loadCategory('${category.id}')">
            <i class="bi ${category.icon}"></i>
            ${category.name}
        </button> `;
    });

}


/*==================================================
                CARGAR HERRAMIENTAS
==================================================*/

async function loadCategory(category) {
    currentCategory = category;
    try {
        const response = await fetch(`data/${category}.json`);
        const tools = await response.json();
        currentTools = tools;
        createCards(tools);
        updateDashboard(tools);
        document.getElementById("breadCategory").textContent = capitalize(category);
        const viewer = document.getElementById("viewer");
       viewer.style.backgroundImage = `url(assets/${category}.png)`;

    }
    catch (error) {
        console.error(error);
    }
}

/*==================================================
                CREAR TARJETAS
==================================================*/

function createCards(tools) {
    const grid = document.getElementById("toolGrid");
    grid.innerHTML = "";
    tools.forEach(tool => {
        const target = tool.target || "viewer";
        grid.innerHTML += `
        <a
            class="tool-card"
            href="${tool.url}"
            target="${target}"
            onclick="openTool(event,'${tool.name}','${tool.description}',${tool.open},${tool.target})">
            <div class="tool-icon">
                <img src="${tool.icon}" alt="${tool.name}">
            </div>
            <h4>${tool.name}</h4>
            <p>${tool.description}</p>
            <em>${tool.open}</em>
        </a>
        `;
    });

}

/*==================================================
                ABRIR HERRAMIENTA
==================================================*/

function openTool(event, title) {
    document.getElementById("viewerTitle").textContent = title;
    document.getElementById("breadTool").textContent = title;
    document.getElementById("statusMessage").textContent = "Abriendo " + title + "...";
    showToast(title + " abierto correctamente");
    const logo = document.getElementById("appLogo");
    if (logo) {
        logo.src = "assets/logo/openTB.png";
    }
}

/*==================================================
                DASHBOARD
==================================================*/
function updateDashboard(tools) {
    document.getElementById("toolsCounter").textContent = tools.length;
}

/*==================================================
                    TOAST
==================================================*/

function showToast(message) {
    const toast = document.getElementById("toast");
    const text = document.getElementById("toastText");
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

}
/*==================================================
                UTILIDADES
==================================================*/

function capitalize(text) {

    return text.charAt(0).toUpperCase() + text.slice(1);

}