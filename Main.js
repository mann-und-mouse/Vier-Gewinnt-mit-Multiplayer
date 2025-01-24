//Elemente
const spielfeld = document.getElementById("spielfeld");
const canvas = document.getElementById("spielcanvas");
const spielsteinsektion = document.getElementById("spielsteinsektion");
const slotgrid = document.getElementById("slotgrid");
const ctx = canvas.getContext("2d");
//let steinVonOben = document.createElement("img");
//steinVonOben.src = "RoterSpielsteinVonOben.png";
//steinVonOben.width = fieldWidth;
//steinVonOben.height = fieldHeight;

//Eigenschaften
canvas.width = spielfeld.offsetWidth * 0.65;
canvas.height = spielfeld.offsetHeight;

//Variablen
const fieldWidth = Math.round(canvas.width / 7);
const fieldHeight = Math.round(canvas.height / 6);
let start;
let gameArray = [];
CreateGameArry();
//gameArray[0][0] = 1;
//gameArray[1][1] = 1;
//gameArray[2][2] = 1;
//gameArray[3][3] = 1;
//gameArray[4][5] = 1;
//gameArray[6][5] = 1;

//Funktionen
BuildGameField();
AddGamePieces();
SpielfeldOverlayHinzufügen();
//window.requestAnimationFrame(DrawFallingPiece);



function onDragOver(e)
{
    e.preventDefault();
}
function onDrop(event)
{
    event.preventDefault();
    var x = event.target.id[1];
    var y = FindEmptySlot(x);
    gameArr[x][y] = 1
    requestAnimationFrame(DrawFallingPiece);
}


function FindEmptySlot(x)
{
    return gameArray[x].findLastIndex(y => y == 0);
}
function CreateGameArry()
{
    for (let i = 0; i < 7; i++)
    {
        let row = [0, 0, 0, 0, 0, 0];
        gameArray.push(row);

    }
}

function DrawField(x, y)
{
    ctx.beginPath();
    ctx.arc(fieldWidth * x + fieldWidth / 2, fieldHeight * y + fieldHeight / 2, fieldHeight / 2 - 10, 0, 360 * (Math.PI / 180), true);
    ctx.stroke();
    ctx.rect(x * fieldWidth, y * fieldHeight, fieldWidth, fieldHeight);
    ctx.stroke();
    ctx.fillStyle = "DodgerBlue";
    ctx.fill();
}

function AddGamePieces()
{
    for (let i = 0; i < 21; i++)
    {
        let image = document.createElement("img");
        image.src = "RoterSteinSeitenansicht.png"
        image.id = "r" + i;
        image.setAttribute("draggable", "true");
        image.width = fieldWidth - 15;
        image.style.border = "1px solid black";
        spielsteinsektion.appendChild(image);

    }
}

function SpielfeldOverlayHinzufügen()
{
    for (let j = 0; j < 6; j++)
    {
        let newRow = document.createElement("div");
        newRow.setAttribute("class", "row");
        newRow.id = "gamerow" + j;
        newRow.style.height = fieldHeight;
        slotgrid.appendChild(newRow);
        for (let i = 0; i < 7; i++)
        {
            let div = document.createElement("div");
            let row = document.getElementById("gamerow" + j)
            div.id = j + `${i}`;
            div.setAttribute("class", "slot");
            div.style.height = `${fieldHeight}px`;
            div.style.width = `${fieldWidth-1}px`;
            div.addEventListener("dragover", onDragOver);
            div.addEventListener("dragend", onDrop);
            row.appendChild(div);

        }
    }
}

//function DrawFallingPiece(timestamp)
//{
//    ctx.globalCompositeOperation = "destination-over";
//    ctx.clearRect(0, 0, canvas.width, canvas.height);
//    BuildGameField();
//    ctx.drawImage(steinVonOben, 0, Math.min(timestamp / 1000 * 30, 200));
//    requestAnimationFrame(DrawFallingPiece);
//    //ctx.restore();

//}

function DrawFallingPiece(timestamp)
{
 if (start == undefined)
    {
        start = timestamp;
    }
    ctx.globalCompositeOperation = "destination-over";
    let elapsed = timestamp - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    BuildGameField();
    DrawCircle(elapsed);

        requestAnimationFrame(DrawFallingPiece);

}
function BuildGameField()
{
    for (let i = 0; i < 7; i++)
    {
        for (let j = 0; j < 6; j++)
        {
            DrawField(i, j);
            if (gameArray[i][j] == 1)
            {
                DrawCircle(i, j);
            }
        }
    }
}
function DrawCircle(x,y,elapsed)
{
    let xCoord = fieldWidth / 2 + fieldWidth * x;
    let yCoord = fieldHeight * y + fieldHeight / 2;
    let radius = fieldHeight / 2 - 5;
    let startAngle = 0;
    let endAngle = 2 * Math.PI;

    if (elapsed != undefined)
    {
        yCoord = Math.min(50 + 400 * elapsed / 1000, fieldHeight * y - fieldHeight / 2); //Draw animated Circle
    }
    ctx.beginPath();
    ctx.arc(xCoord, yCoord, radius, startAngle, endAngle);
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
}
