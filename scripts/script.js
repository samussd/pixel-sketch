const root = document.querySelector(':root');
const canvas = document.querySelector('.canvas');
const clearBtn = document.querySelector('.options__clear-btn');
const eraserBtn = document.querySelector('.options__eraser-btn');
const rainbowBtn = document.querySelector('.options__rainbow-btn');
const bgColorInput = document.querySelector('.options__bg-color-picker');
const brushColorInput = document.querySelector('.options__brush-color-picker');
const sizeInput = document.querySelector('.options__size-picker');
const sizeText = document.querySelector('.options__size-text');

let tiles = document.querySelectorAll('.canvas__tile');
let canvasArray = [];
let canvasSize = 16;
let backgroundColor = 'white';
let brushColor = 'black';
let activeRainbow = false;
let brushSize = 1;


function randint(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

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
                    colorTile(e);
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

/** Changes color of tile if mouse1 is pressed */
function colorTile(e) {
    if (e.buttons!==1) return;

    let elems = getElementsInBrush(e.target);
    for (let i=0, l=elems.length; i < l; i++){
        elems[i].classList.remove("--background")
        elems[i].style.backgroundColor = 
            activeRainbow ? `rgb(${randint(0,255)},${randint(0,255)},${randint(0,255)})` : brushColor;
    }
}

/** Clears canvas with background color */
function clearCanvas() {
    tiles.forEach(n => n.style.backgroundColor = backgroundColor)
}

/** Replaces the current brush color with the picker color */
function updateBrushColor() {
    brushColor = brushColorInput.value;
}

/** Replaces the current canvas bg color with the picker color */
function updateBackgroundColor() {
    root.style.setProperty('--canvas-bg-color', bgColorInput.value);
}

/** Toggles the eraser button */
function toggleEraser() {
    if (!eraserBtn.classList.contains('--active')) {
        brushColor = backgroundColor;
    } else {
        brushColor = brushColorInput.value;
    }
    eraserBtn.classList.toggle('--active');
}

/** Toggles the rainbow button */
function toggleRainbow() {
    activeRainbow = !activeRainbow;
    rainbowBtn.classList.toggle('--active');
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

/** Resets all buttons to their */
function resetButtons() {
    eraserBtn.classList.remove('--active');
    brushColor = brushColorInput.value;

    rainbowBtn.classList.remove('--active');
    activeRainbow = false;
}

updateCanvasSize(16);

clearBtn.onclick = () => clearCanvas();
eraserBtn.onclick = () => toggleEraser();
rainbowBtn.onclick = () => toggleRainbow();

// sizeInput.addEventListener('change', updateCanvas());
// colorInput.addEventListener('change', updateColor());


//if clicked outside the canvas, unselect the eraser
window.addEventListener('click', function(e){   
    if (!(canvas.contains(e.target) || e.target.tagName=="BUTTON")){
        resetButtons();
    }
  });
