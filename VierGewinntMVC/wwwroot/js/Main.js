//import { Spieler } from "https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js";
import "https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js";
//SignlarR Connection
const connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();
connection.start();

//Html-Elemente
const spielfeld = document.getElementById("spielfeld");
const canvas = document.getElementById("spielcanvas");
const roteSteine = document.getElementById("roteSteine");
const gelbeSteine = document.getElementById("gelbeSteine");
const slotgrid = document.getElementById("slotgrid");
const ctx = canvas.getContext("2d");
const announceActive = document.getElementById("announceActive");

//Eigenschaften
canvas.width = spielfeld.offsetWidth * 0.65;
canvas.height = spielfeld.offsetHeight;

//Variablen
let x;
let y;
let aktiverSpieler;
let lokalerSpieler;
const fieldWidth = Math.round(canvas.width / 7);
const fieldHeight = Math.round(canvas.height / 6);
let lastFrame;
let gameArray = [];
let animationColor = "red";
const jsConfetti = new JSConfetti();

//Funktionsaufrufe
CreateGameArry();
BuildGameField();
AddGamePieces("red");
AddGamePieces("yellow");
SpielfeldOverlayHinzufügen();

//Hub Funktionen
connection.on("ReceiveMove", (stateArray, spieler, coordinates, farbe) =>
{
    //alert("Zug erhalten");
    gameArray = stateArray; 
    x = coordinates[0];
    y = coordinates[1];
    aktiverSpieler = spieler;
    animationColor = farbe;
    announceActive.textContent = aktiverSpieler.name + " ist am Zug.";
    requestAnimationFrame(firstFrame)
    toggleDroppables();
});
connection.on("ReceiveUsername", (spieler) =>
{
    //alert("Name kommt an")
    lokalerSpieler = spieler;
});
connection.on("StartGame", (array, spieler) =>
{
    //alert("Spiel startet");
    gameArray = array;
    aktiverSpieler = spieler;
    announceActive.textContent = aktiverSpieler.name + " ist am Zug";
    toggleDroppables();
});
connection.on("Winner", (winner) =>
{
    announceActive.textContent = winner.name + " ist der Sieger."
    changeDraggable(roteSteine, "false");
    changeDraggable(gelbeStein, "false");
    jsConfetti.addConfetti({canvas});
})
connection.on("RemoveElement",(id) => {
    let element = document.getElementById(id);
    element.remove();
})
connection.on("Disconnect", (message) =>
{
    alert("Player Disconnected");
    announceActive.textContent = message;
});

//Eventfunktionen
function handleDragStart(event)
{
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";

}
function onDragEnd(event)
{
    let effect = event.dataTransfer.dropEffect;
    if (effect !== "none")
    {
        let eventId = event.target.id;
        connection.invoke("TargetElement", eventId);
    }
}
function onDragOver(e)
{
    //alert("Dragover klappt");
    e.preventDefault();
}
function onDrop(event)
{
    event.preventDefault();
    x = event.target.id[1];
    y = FindEmptySlot(x);
    let coordinates = event.target.id[1]+ FindEmptySlot(x);
    connection.invoke("SendMove", coordinates, aktiverSpieler.farbe)
    //requestAnimationFrame(firstFrame);
}


//Spielfeldfunktionen
function toggleDroppables()
{
    if (aktiverSpieler.token == 1 && lokalerSpieler.token == 1)
    {
        changeDraggable(roteSteine, "true");
        changeDraggable(gelbeSteine, "false");
    }
    else if (aktiverSpieler.token == 2 && lokalerSpieler.token == 2)
    {
        changeDraggable(gelbeSteine, "true");
        changeDraggable(roteSteine, "false");
    }
    else 
    {
        changeDraggable(roteSteine, "false");
        changeDraggable(gelbeSteine, "false");
    }
}
function changeDraggable(list, wert)
{
    for (let item of list.children)
    {
        item.setAttribute("draggable", wert);
    }
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
function AddGamePieces(color)
{
    for (let i = 0; i < 21; i++)
    {
        let image = document.createElement("img");
        image.id = color[0] + i;
        image.setAttribute("class", "spielstein");
        image.style.border = "1px solid black";
        image.setAttribute("draggable", "false");
        image.addEventListener("dragstart", handleDragStart);
        image.addEventListener("dragend", onDragEnd);
        image.width = fieldWidth - 15;

        if (color == "red")
        {
            image.src = "/images/RoterSteinSeitenansicht.png"
            roteSteine.appendChild(image);
        }
        else
        {

            image.src = "/images/GelberSteinSeitenansicht.png"
            gelbeSteine.appendChild(image);
        }


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
            //div.style.height = `${fieldHeight}px`;
            //div.style.width = `${fieldWidth - 1}px`;
            div.addEventListener("dragover", onDragOver);
            div.addEventListener("drop", onDrop);
            row.appendChild(div);

        }
    }
}
function BuildGameField()
{
    for (let i = 0; i < 7; i++)
    {
        for (let j = 0; j < 6; j++)
        {
            DrawField(i, j);
            if (gameArray[i][j] !== 0)
            {
                DrawCircle(i, j, gameArray[i][j]);
            }
        }
    }
}


//Canvasfunktionen
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
function firstFrame(timestamp)
{
    lastFrame = timestamp;
    DrawFallingPiece(timestamp);
}
function DrawCircle(i, j,token)
{
    let xCoord = fieldWidth / 2 + fieldWidth * i;
    let yCoord = fieldHeight * j + fieldHeight / 2;
    let radius = fieldHeight / 2 - 5;
    let startAngle = 0;
    let endAngle = 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(xCoord, yCoord, radius, startAngle, endAngle);
    ctx.stroke();
    if (token === 1)
    {
        ctx.fillStyle = "red";
    }
    else
    {
        ctx.fillStyle = "yellow";
    }
    ctx.fill();
}
function AnimateCircle(elapsed)
{
    let radius = fieldHeight / 2 - 5;
    let startAngle = 0;
    let endAngle = 2 * Math.PI;
    let xCoord = fieldWidth / 2 + fieldWidth * x;
    let yCoord = Math.min(50 + fieldHeight * 3 * elapsed / 1000, fieldHeight * y + fieldHeight / 2); 
    ctx.beginPath();
    ctx.arc(xCoord, yCoord, radius, startAngle, endAngle);
    ctx.stroke();
    ctx.fillStyle = animationColor;
    ctx.fill();


}
function DrawFallingPiece(timestamp)
{
    if (lastFrame == undefined)
    {
        lastFrame = timestamp;
    }
    ctx.globalCompositeOperation = "destination-over";
    let elapsed = timestamp - lastFrame;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    BuildGameField();
    AnimateCircle(elapsed);
    if (elapsed < y / 3 * 1000)
    {
        requestAnimationFrame(DrawFallingPiece);
    }
    else
    {
        gameArray[x][y] = aktiverSpieler.token;
        BuildGameField();
    }

}