const canvas = document.querySelector('.canvas');
const clearBtn = document.querySelector('.options__clear-btn');
const eraserBtn = document.querySelector('.options__eraser-btn');
const rainbowBtn = document.querySelector('.options__rainbow-btn');
const colorInput = document.querySelector('.options__color-picker');
const sizeInput = document.querySelector('.options__size-picker');
const sizeText = document.querySelector('.options__size-text');

let tiles = document.querySelectorAll('.canvas__tile');
let canvasArray = [];
let canvasSize = 16;
let backgroundColor = 'white';
let currentColor = 'black';
let activeRainbow = false;
let brushSize = 1;


function randint(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function posIn2DArray(array, element){
    for (let x=0; x < canvasSize; x++){
        for (let y=0; y < canvasSize; y++){
            if (array[x][y]===element) {
                return [x,y];
            }
        }
    }
}

function updateCanvasSize(size) {
    /*
    Changes the grid size of the canvas
    Creates new tiles in the canvas
    Create listeners for the new tiles
    Updates the arrays with tiles
    */
    canvas.style.setProperty('--grid-rows', size);
    canvas.style.setProperty('--grid-cols', size);

    canvas.innerHTML = '';
    canvasArray = [];
    for (let i=0; i < size; i++){
        let column = [];
        for (let j=0; j < size; j++){
            let tile = document.createElement('div');
            tile.className = "canvas__tile";
            ['mouseover','mousedown'].forEach(
                evt => tile.addEventListener(evt, function(e) {
                    e.preventDefault()
                    colorTile(e);
                }));
            canvas.appendChild(tile)
            column.push(tile);
        }
        canvasArray.push(column);
    }
    tiles = document.querySelectorAll('.canvas__tile');
}

function getElementsInBrush(centerElement){
    let elements = []
    let center = posIn2DArray(canvasArray, centerElement);
    //find surrounding tiles and push to elements array
    elements.push(canvasArray[center[0]][center[1]]);

    return elements;
}

function colorTile(e) {
    if (!e.buttons==1) return;
    let elems = getElementsInBrush(e.target);
    for (let i=0, l=elems.length; i < l; i++){
        elems[i].style.backgroundColor = 
            activeRainbow ? `rgb(${randint(0,255)},${randint(0,255)},${randint(0,255)})` : currentColor;
    }
}

function clearCanvas() {
    tiles.forEach(n => n.style.backgroundColor = 'white')
}

function changeColor() {
    currentColor = colorInput.value;
}

function toggleEraser() {
    if (!eraserBtn.classList.contains('--active')) {
        currentColor = backgroundColor;
    } else {
        currentColor = colorInput.value;
    }
    eraserBtn.classList.toggle('--active');
}

function toggleRainbow() {
    activeRainbow = !activeRainbow;
    rainbowBtn.classList.toggle('--active');
}

function changeCanvas() {
    canvasSize = sizeInput.value;
    updateCanvasSize(canvasSize);
    changeSizeText();
}

function changeSizeText() {
    sizeText.textContent = `${sizeInput.value} x ${sizeInput.value}`
}

function resetButtons() {
    eraserBtn.classList.remove('--active');
    currentColor = colorInput.value;

    rainbowBtn.classList.remove('--active');
    activeRainbow = false;
}

updateCanvasSize(16);



clearBtn.onclick = () => clearCanvas();
eraserBtn.onclick = () => toggleEraser();
rainbowBtn.onclick = () => toggleRainbow();

// sizeInput.addEventListener('change', changeCanvas());
// colorInput.addEventListener('change', changeColor());


//if clicked outside the canvas, unselect the eraser
window.addEventListener('click', function(e){   
    if (!(canvas.contains(e.target) || e.target.tagName=="BUTTON")){
        resetButtons();
    }
  });
