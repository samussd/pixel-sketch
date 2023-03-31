const canvas = document.querySelector('.canvas');
const clearBtn = document.querySelector('.options__clear-btn')

let tiles = document.querySelectorAll('.canvas__tile');
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
}

function colorTile(e) {
    if (e.buttons == 1) e.target.style.backgroundColor = currentColor;
}

function clearCanvas() {
    tiles.forEach(n => n.style.backgroundColor = 'white')
}

updateCanvasSize(16,16);

clearBtn.onclick = () => clearCanvas();

['mouseover','mousedown'].forEach(evt => 
    tiles.forEach(n => n.addEventListener(evt, e => colorTile(e)))
);
