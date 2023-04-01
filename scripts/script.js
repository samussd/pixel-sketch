const root = document.querySelector(':root');
const canvas = document.querySelector('.canvas');
const clearBtn = document.querySelector('.options__clear-btn');
const eraserBtn = document.querySelector('.options__eraser-btn');
const rainbowBtn = document.querySelector('.options__rainbow-btn');
const fillBtn = document.querySelector('.options__fill-btn');
const bgColorInput = document.querySelector('.options__bg-color-picker');
const brushColorInput = document.querySelector('.options__brush-color-picker');
const sizeInput = document.querySelector('.options__size-picker');
const sizeText = document.querySelector('.options__size-text');

let tiles = document.querySelectorAll('.canvas__tile');
let canvasArray = [];
let canvasSize = 16;
let backgroundColor = 'white';
let brushColor = 'black';
let selectedTool = 'brush';
let brushSize = 1;


function randint(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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
function updateCanvasSize(size) {
    canvas.style.setProperty('--grid-rows', size);
    canvas.style.setProperty('--grid-cols', size);

    canvas.innerHTML = '';
    canvasArray = [];
    for (let i=0; i < size; i++){

        let row = [];
        for (let j=0; j < size; j++){

            let tile = document.createElement('div');
            tile.classList.add("canvas__tile", "--background");

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
function getElementsInBrush(centerElement){
    let elements = []
    let center = posIn2DArray(canvasArray, centerElement);
    //find surrounding tiles and push to elements array
    elements.push(canvasArray[center[0]][center[1]]);

    return elements;
}

/** Flood fills the array with the tiles */
function fill(r, c, newColor, current) {
    if (r<0 || c<0 || r>canvasSize-1 || c>canvasSize-1) return;

    if (canvasArray[r][c].style.backgroundColor !== current || canvasArray[r][c].style.backgroundColor === newColor) return;

    canvasArray[r][c].style.backgroundColor = newColor;
    canvasArray[r][c].classList.remove('--background');

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
        elems[i].classList.remove("--background")
        elems[i].style.backgroundColor = color;
        if (selectedTool=='eraser') elems[i].classList.add('--background');
    }
}

/** Clears canvas with background color */
function clearCanvas() {
    tiles.forEach(n => n.style.backgroundColor = backgroundColor)
}

/** Replaces the current brush color with the picker color */
function updateBrushColor() {
    brushColor = HEXtoRGB(brushColorInput.value);
}

/** Replaces the current canvas bg color with the picker color */
function updateBackgroundColor() {
    backgroundColor = bgColorInput.value;
    root.style.setProperty('--canvas-bg-color', backgroundColor);
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

/** Updates the canvas size and size variable */
function updateCanvas() {
    canvasSize = sizeInput.value;
    updateCanvasSize(canvasSize);
}

/** Updates the text above the slider with current size */
function updateSizeText() {
    sizeText.textContent = `${sizeInput.value} x ${sizeInput.value}`
}

updateCanvasSize(16);

clearBtn.addEventListener('click', () => clearCanvas());
eraserBtn.addEventListener('click', () => toggleTool(eraserBtn, 'eraser'));
rainbowBtn.addEventListener('click', () => toggleTool(rainbowBtn, 'rainbow'));
fillBtn.addEventListener('click', () => toggleTool(fillBtn, 'fill'));



