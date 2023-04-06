const root = document.querySelector(':root');
const canvas = document.querySelector('.canvas');

const clearBtn = document.querySelector('.options__clear-btn');
const eraserBtn = document.querySelector('.options__eraser-btn');
const rainbowBtn = document.querySelector('.options__rainbow-btn');
const fillBtn = document.querySelector('.options__fill-btn');
const githubBtn = document.querySelector('.header__github');
const themeBtn = document.querySelector('.header__theme-btn');

const brushColorInput = document.querySelector('.options__brush-color-picker');
const canvasSizeInput = document.querySelector('.options__canvas-size-picker');
const canvasSizeText = document.querySelector('.options__canvas-size');
const brushSizeInput = document.querySelector('.options__brush-size-picker');
const brushSizeText = document.querySelector('.options__brush-size');

let tiles = document.querySelectorAll('.canvas__tile');
let canvasArray = [];
let canvasSize = 16;
let backgroundColor = 'white';
let brushColor = 'black';
let selectedTool = 'brush';
let brushSize = 1;
let darkModeActive = false;


function randint(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const sqrt2_2 = Math.sqrt(2)/2;

const clamp = (number, min, max) =>
   Math.max(min, Math.min(number, max));

const HEXtoRGB = (hex) => "rgb(" + hex.match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) }).join(", ") + ")";

const randomHEX = () => "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

/** Returns position of an element in a 2d array */
function posIn2DArray(array, element){
    for (let r=0; r < canvasSize; r++)
        for (let c=0; c < canvasSize; c++)
            if (array[r][c]===element) 
                return [r,c];
}

/** * - Updates: grid size of the canvas, arrays with tiles
    * - Creates: tiles in the canvas, listeners for tiles */
function updateCanvasSize() {
    canvasSize = canvasSizeInput.value;

    canvas.style.setProperty('--grid-rows', canvasSize);
    canvas.style.setProperty('--grid-cols', canvasSize);

    canvas.innerHTML = '';
    canvasArray = [];
    for (let i=0; i < canvasSize; i++){

        let row = [];
        for (let j=0; j < canvasSize; j++){

            let tile = document.createElement('div');
            tile.classList.add('canvas__tile');

            //listener for hover and press
            ['mouseover','mousedown'].forEach(
                evtName => tile.addEventListener(evtName, function(e) {
                    e.preventDefault()
                    clickedTile(e);
                }));

            canvas.appendChild(tile)
            row.push(tile);
        }
        canvasArray.push(row);
    }

    tiles = document.querySelectorAll('.canvas__tile');
}

/** Returns array with elements inside the brush */
function getElementsInBrush(centerElement) {
    let center = posIn2DArray(canvasArray, centerElement);
    let r = center[0];
    let c = center[1];
    let elements = [];

    //find surrounding tiles and push to elements array
    if (brushSize==2) { //special case > make 2px square
        elements.push(centerElement);
        elements.push(canvasArray[clamp(r-1, 0, canvasSize-1)][c]);
        elements.push(canvasArray[r][clamp(c-1, 0, canvasSize-1)]);
        elements.push(canvasArray[clamp(r-1, 0, canvasSize-1)][clamp(c-1, 0, canvasSize-1)]);
    } else
        elements = getElementsInRadius(center, (brushSize*sqrt2_2)- 0.9);

    return elements;
}

function getElementsInRadius(center, radius) {
    //fix
    let elements = []
    let radiusSq = radius * radius;

    //coordinates of the bounding box for the brush (for optimization)
    //only check if elements inside the bounding box are in radius
    let top = Math.max(Math.floor(center[0]-radius), 0);
    let bottom = Math.min(Math.ceil(center[0]+radius), canvasSize-1);
    let left = Math.max(Math.floor(center[1]-radius), 0);
    let right = Math.min(Math.ceil(center[1]+radius), canvasSize-1);

    for (let r=top, h=bottom+1, w=right+1; r < h; r++) {
        for (let c=left; c < w; c++) {
            if (((center[0] - r) ** 2) + ((center[1] - c) ** 2) < radiusSq) {
                elements.push(canvasArray[r][c]);
            }
        }
    }
    return elements;
}

/** Flood fills the array with the tiles */
function fill(r, c, newColor, current) {
    if (r<0 || c<0 || r>canvasSize-1 || c>canvasSize-1) return;

    if (canvasArray[r][c].style.backgroundColor !== current || canvasArray[r][c].style.backgroundColor === newColor) return;

    canvasArray[r][c].style.backgroundColor = newColor;

    //Fill in all four directions
    fill(r - 1, c, newColor, current);
    fill(r + 1, c, newColor, current);
    fill(r, c - 1, newColor, current);
    fill(r, c + 1, newColor, current);
}

/** Performs an action on the canvas/tile depending on the current tool */
function clickedTile(e) {
    if (e.buttons!==1) return;

    if (selectedTool=='fill') {
        let elementPos = posIn2DArray(canvasArray, e.target);
        fill(elementPos[0], elementPos[1], brushColor, e.target.style.backgroundColor);
    }
    else colorTile(e);
}

/** Changes color of tile */
function colorTile(e) {
    let color;
    switch (selectedTool) {
        case 'brush':
            color = brushColor;
            break;
        case 'eraser':
            color = backgroundColor;
            break;
        case 'rainbow':
            color = `rgb(${randint(0,255)},${randint(0,255)},${randint(0,255)})`;
            break;
    }

    let elems = getElementsInBrush(e.target);
    for (let i=0, l=elems.length; i < l; i++){
        elems[i].style.backgroundColor = color;
    }
}

/** Clears canvas with background color */
function clearCanvas() {
    tiles.forEach(n => n.style.backgroundColor = backgroundColor);
}

/** Replaces the current brush color with the picker color */
function updateBrushColor() {
    brushColor = HEXtoRGB(brushColorInput.value);
}

/** Toggles a tool button and changes*/
function toggleTool(selectedBtn, toolName) {
    resetTools(selectedBtn);

    if (selectedBtn.classList.contains('--active')) {
        selectedBtn.classList.remove('--active');
        selectedTool = 'brush';
    }
    else {
        selectedBtn.classList.add('--active');
        selectedTool = toolName;
    }
}

/** Resets all tools, except the clicked one */
function resetTools(selectedBtn) {
    let buttons = [eraserBtn,rainbowBtn,fillBtn];
    buttons.forEach(btn => {
        if (btn !== selectedBtn)
            btn.classList.remove('--active');
    })
}

function updateBrushSize() {
    brushSize = brushSizeInput.value;
}

/** Updates the text above the slider with current size */
function updateCanvasSizeText() {
    canvasSizeText.textContent = `${canvasSizeInput.value} x ${canvasSizeInput.value}`
}

function updateBrushSizeText() {
    brushSizeText.textContent = `${brushSizeInput.value} x ${brushSizeInput.value}`
}

updateCanvasSize();
updateBrushSizeText();
updateCanvasSizeText();

clearBtn.addEventListener('click', () => clearCanvas());
eraserBtn.addEventListener('click', () => toggleTool(eraserBtn, 'eraser'));
rainbowBtn.addEventListener('click', () => toggleTool(rainbowBtn, 'rainbow'));
fillBtn.addEventListener('click', () => toggleTool(fillBtn, 'fill'));

//change theme color
document.querySelector('.header__theme-btn').onclick = function() {
    darkModeActive = !darkModeActive;

    if (darkModeActive) {
        root.style.setProperty('--bg-color1', '#19191c');
        root.style.setProperty('--bg-color2', '#2e2e34');
        root.style.setProperty('--font-color1', 'white');
        root.style.setProperty('--font-color2', '#151515');
        root.style.setProperty('--btn-color1', 'brown');
        root.style.setProperty('--btn-color2', '#151515');
        themeBtn.style.filter = 'invert(0)';
        themeBtn.style.background = "transparent url('images/light-theme.png') no-repeat";
        themeBtn.style.backgroundSize = "100%";
        githubBtn.style.filter = 'invert(0)';
        
    } else {
        root.style.setProperty('--bg-color1', 'whitesmoke');
        root.style.setProperty('--bg-color2', 'gainsboro');
        root.style.setProperty('--font-color1', 'black');
        root.style.setProperty('--font-color2', 'white');
        root.style.setProperty('--btn-color1', 'orange');
        root.style.setProperty('--btn-color2', 'brown');
        themeBtn.style.filter = 'invert(1)';
        themeBtn.style.background = "transparent url('images/dark-theme.png') no-repeat";
        themeBtn.style.backgroundSize = "100%";
        githubBtn.style.filter = 'invert(1)';
    }
}


