export { drawWinRatio }

function drawWinRatio(outcomes, width) {
    if (width === undefined) {
        width = 1080
    }
    var totalAmount = outcomes.wins + outcomes.loses + outcomes.draws;
    var percentages = {w: outcomes.wins/totalAmount, l: outcomes.loses/totalAmount, d: outcomes.draws/totalAmount}

    var canvas = document.getElementById("ratioBar");
    canvas.width  = width;
    canvas.height = 90;

    var winWidth = percentages.w*canvas.width 
    var loseWidth = percentages.l*canvas.width 
    var drawWidth = percentages.d*canvas.width

    var ctx = canvas.getContext("2d");
    var minimumWidth = canvas.width * 0.14
    //win percentage
    ctx.fillStyle = "#047e00";
    ctx.fillRect(0, 30, winWidth, 30);
    
    //draw percentage
    ctx.fillStyle = "#e2dc00";
    ctx.fillRect(winWidth, 30, drawWidth, 30);

    //lose precentage
    ctx.fillStyle = "#aa0000";
    ctx.fillRect(winWidth + drawWidth, 30, loseWidth, 30);
    
    ctx.font = '18px arial'
    ctx.fillStyle = "#FFFFFF";

    if (outcomes.wins > 0) {
        if (winWidth >= minimumWidth) {
            ctx.fillText(outcomes.wins + " wins (" + (percentages.w*100).toFixed(2) + " %)", 0, 50);
        } else {
           drawHelpLine(0, ctx)
            ctx.fillText(outcomes.wins + " wins (" + (percentages.w*100).toFixed(2) + " %)", 15, 85);
        }
    }
    if (outcomes.loses > 0) {
        if (loseWidth >= minimumWidth) {
            ctx.fillText(outcomes.loses + " loses (" + (percentages.l*100).toFixed(2) + " %)", canvas.width-(minimumWidth), 50);
        } else {
            drawHelpLine(winWidth+drawWidth, ctx)
            ctx.fillText(outcomes.loses + " loses", canvas.width-(minimumWidth)+52, 85);
        }
    }
    if (outcomes.draws > 0) {
        if (drawWidth >= minimumWidth) {
            ctx.fillText(outcomes.draws + " draws (" + (percentages.d*100).toFixed(2) + " %)", winWidth, 50);
            return
        }
        drawHelpLine(winWidth, ctx)
        ctx.fillText(outcomes.draws + " draws (" + (percentages.d*100).toFixed(2) + " %)", winWidth+15, 85);
    }
}

function drawHelpLine(width, ctx) {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(width, 60);
    ctx.lineTo(width, 80);
    ctx.lineTo(width+10, 80);
    ctx.stroke()
}