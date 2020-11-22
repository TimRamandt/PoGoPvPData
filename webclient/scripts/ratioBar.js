export { drawWinRatio }

function drawWinRatio() {
    var canvas = document.getElementById("ratioBar");
    canvas.width  = 1080;
    canvas.height = 60;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(0, 30, 648, 30);
    
    ctx.fillStyle = 'rgba(0, 200, 0)';
    ctx.fillRect(648, 30, 432, 30);
    
    ctx.font = '18px arial'
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText('60%', 0, 50);
    ctx.fillText('40%', 648, 50);
}