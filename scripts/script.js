const canvas = document.querySelector('.canvas');
const clearBtn = document.querySelector('.options__clear-btn');
const eraserBtn = document.querySelector('.options__eraser-btn');
const colorInput = document.querySelector('.options__color-picker');
const sizeInput = document.querySelector('.options__size-picker');
const sizeText = document.querySelector('.options__size-text');

let tiles = document.querySelectorAll('.canvas__tile');
let backgroundColor = 'white';
let currentColor = 'black';

function updateCanvasSize(rows, cols) {
    canvas.style.setProperty('--grid-rows', rows);
    canvas.style.setProperty('--grid-cols', cols);

    canvas.innerHTML = '';
    for (let c=0; c < (rows*cols); c++){
        let tile = document.createElement('div');
        canvas.appendChild(tile).className = "canvas__tile";
    }
    tiles = document.querySelectorAll('.canvas__tile');

    ['mouseover','mousedown'].forEach(evt => 
        tiles.forEach(n => n.addEventListener(evt, function(e) {
            e.preventDefault()
            colorTile(e);
        }))
    );
}

function colorTile(e) {
    if (e.buttons == 1) e.target.style.backgroundColor = currentColor;
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

function changeCanvas() {
    updateCanvasSize(sizeInput.value, sizeInput.value);
    changeSizeText();
}

function changeSizeText() {
    sizeText.textContent = `${sizeInput.value} x ${sizeInput.value}`
}

updateCanvasSize(16,16);



clearBtn.onclick = () => clearCanvas();
eraserBtn.onclick = () => toggleEraser();

// sizeInput.addEventListener('change', changeCanvas());
// colorInput.addEventListener('change', changeColor());


//if clicked outside the canvas, unselect the eraser
window.addEventListener('click', function(e){   
    if (!canvas.contains(e.target) && e.target!=eraserBtn){
        eraserBtn.classList.remove('--active');
        currentColor = colorInput.value;
    }
  });
