const parentdiv = document.getElementById("test");
const canvas = document.getElementById("cnv");
const ctx = canvas.getContext("2d");
//fillContainer();
parentdiv.style.width = "300px";
parentdiv.style.height = "300px";
canvas.style.position = "absolute";
canvas.height = parentdiv.offsetHeight;
let start;
//canvas.style.zIndex = "1";
//animateCircle();
//const time = new Date();
//let tS = time.getSeconds();
//let tMs = time.getMilliseconds();
//setInterval(animateCircle, 100 );
window.onload = () =>
{
requestAnimationFrame(animateCircle);
}

//function firstStep()
//{

//}
function animateCircle(timestamp)
{
    if (start == undefined)
    {
        start = timestamp;
    }
    let elapsed = timestamp - start;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 300, 300);
    ctx.translate(50, 50);
    ctx.beginPath();
    //ctx.arc(50, Math.min(50 + 450* elapsed / 1000, 200), 30, 0, 2 * Math.PI);
    ctx.arc(50, 50 +  Math.sin(elapsed * 0.01) * 50, 30, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
    requestAnimationFrame(animateCircle);

}

function fillContainer()
{
    for (let i = 0; i < 6; i++)
    {
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "row");
        newDiv.id = "row" + i;
        // newDiv.style.position = "absolute";
        parentdiv.appendChild(newDiv);
        for (let j = 0; j < 7; j++)
        {
            let newField = document.createElement("div");
            let parentElement = document.getElementById("row" + i);
            newField.style.width = "30px";
            newField.style.height = "30px";
            newField.style.backgroundColor = "red";
            //newField.style.position ="relative"
            //newField.setAttribute("class", "col-xs-1");
            parentElement.appendChild(newField);
        }
    }
}
