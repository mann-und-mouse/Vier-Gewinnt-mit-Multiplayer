//Variablendefinitionen
const canvas = document.getElementById("spielfeld");
const spielfeldrahmen = document.getElementById("spielfeldrahmen");
const ctx = canvas.getContext("2d");
const spielsteincontainer = document.getElementById("spielsteincontainer");
const spielsteine = document.getElementsByClassName("stein");
const columncontainer = document.getElementById("columnrahmen");

//Elementmodifikationen

canvas.width = spielfeldrahmen.offsetWidth;
canvas.height = spielfeldrahmen.offsetHeight;
//canvas.style.position = "absolute";
//canvas.style.zIndex = "1";
const fieldWidth = canvas.width / 7;
const fieldHeight = canvas.height / 6;

//Spielfeldaufbau
AddGamePieces();
SpielfeldOverlayHinzufügen();

//Auf Spielfeldelemente zugreifen
const stein1 = document.getElementById("r20");


//EventListener
stein1.addEventListener("dragstart", onDragStart);
spielfeldrahmen.addEventListener("dragend", onDragEnd);

for (let i = 0; i < 7; i++)
{
    for (let j = 0; j < 6; j++)
    {
        DrawField(i, j);
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
    ctx.closePath();
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
        spielsteincontainer.appendChild(image);

    }
}

function onDragStart(e)
{
    e.dataTransfer.setData("text/plain", e.target.id);
    //e.dataTransfer.setData("application/x-moz-node", e.target);
    //RemoveGamePiece(e.target);
    //e.target.hidden = "true";
    //e.dataTransfer.setData("img")
    //alert("Dragging");
}
function onDragEnd(e)
{

    alert("Success");
}

function RemoveGamePiece(node)
{
    spielsteincontainer.removeChild(node);
}
function SpielfeldOverlayHinzufügen()
{
    for (let j = 0; j < 6; j++)
    {
        let newRow = document.createElement("div");
        newRow.setAttribute("class", "row");
        newRow.id = "gamerow" + j;
        spielfeldrahmen.appendChild(newRow);
        for (let i = 0; i < 7; i++)
        {
            let div = document.createElement("div");
            let row = document.getElementById("gamerow"+j)
            div.style.height = fieldHeight;
            div.style.width = fieldWidth;
            div.style.backgroundColor = "red";
            div.id = "slot" + j + i;
            //div.className = "col-xs-1";
            row.appendChild(div);

        }
    }
}
