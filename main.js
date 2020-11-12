let N;
let M;
let Field;

function createModel(n, m) {
   N = n;
   M = m;
   Field = [];
   for (let i = 0; i < n; i++) {
       let line = [];
       for (let j = 0; j < n; j++) {
           line.push(0);
       }
       Field.push(line);
   } 
}

function who() {
    // define who: 1 or 2
    let xs = 0;
    let os = 0;
    let result = 1;
    for (row of Field) {
        for (ceil of row) {
            switch(ceil) {
                case 1:
                    xs++;
                    break;
                case 2:
                    os++;
                    break;
            }
        }
    }
    if (xs > os) {
        result = 2;
    }
    return result;
}

function step (r, c) {
    // do step
    if (Field[r][c] == 0) {
        Field[r][c] = who();
        draw();
        winner();
        return true;
    } else {
        draw();
        return false;
    }
}

function winner() {
    let vertical = checkLine('v');
    let horisontal = checkLine('h');
    let mainDiag = checkDiagonal('main');
    let sideDiag = checkDiagonal('side');
    if (vertical) {
        setTimeout(() => {announceWinner(vertical)}, 0);
    } else if (horisontal) {
        setTimeout(() => {announceWinner(horisontal)}, 0);
    } else if (mainDiag) {
        setTimeout(() => {announceWinner(mainDiag)}, 0);
    } else if (sideDiag) {
        setTimeout(() => {announceWinner(sideDiag)}, 0);
    }
}

function checkLine(mode) {
    for (let x = 0; x < Field.length; x++) {
        let xcounter = 0;
        let ocounter = 0;
        for (let y = 0; y < Field[x].length; y++) {
            let ceil = Field[x][y];
            if (mode == 'v') ceil = Field[y][x];
            if (ceil == 1) {
                ocounter = 0;
                xcounter++;
            } else if (ceil == 2) {
                xcounter = 0;
                ocounter++;
            } else if (ceil == 0){
                xcounter = 0;
                ocounter = 0;
            }

            if (xcounter == M) {
                return 1;
            } else if (ocounter == M) {
                return 2;
            }
        }
    }
    return false;
}

function checkDiagonal(mode) {
    for (let x = 0; x < Field.length; x++) {
        let xcounter = 0;
        let ocounter = 0;
        for (let y = 0; y <= x; y++) {
            let z = x - y;
            let ceil = Field[z][y];
            if (mode == "side") ceil = Field[Field.length - z - 1][y];
            if (ceil == 1) {
                ocounter = 0;
                xcounter++;
            } else if (ceil == 2) {
                xcounter = 0;
                ocounter++;
            } else if (ceil == 0){
                xcounter = 0;
                ocounter = 0;
            }
            if (xcounter == M) {
                return 1;
            } else if (ocounter == M) {
                return 2;
            }
        }
    }
    for (let x = Field.length - 2; x >= 0; x--) {
        let xcounter = 0;
        let ocounter = 0;
        for (let y = 0; y <= x; y++) {
            let z = x - y;
            let ceil = Field[Field.length - y - 1][Field.length - z - 1];
            if (mode == "side") ceil = Field[z][Field.length - y - 1];
            if (ceil == 1) {
                ocounter = 0;
                xcounter++;
            } else if (ceil == 2) {
                xcounter = 0;
                ocounter++;
            } else if (ceil == 0){
                xcounter = 0;
                ocounter = 0;
            }
            if (xcounter == M) {
                return 1;
            } else if (ocounter == M) {
                return 2;
            }
        }
    }
    return false;
}

function restart() {
    window.location.reload();
}

function initialize() {
    draw();
    initSettings();
    let info = document.getElementById("info");
    let resetBtn = document.getElementById("reset");
    resetBtn.onclick = restart;
    info.style.width = document.getElementById("field").offsetWidth + "px";   
}

function initSettings() {
    let settings = document.getElementById("settings");
    settings.innerHTML = `
        <div><b>${N}х${N}</b></div>
        <br><br>
        <div>Собрать: <b>${M}</b></div>
    `;
}

function announceWinner(num) {
    switch(num) {
        case 1:
            alert("Blue is the winner!");
            break;
        case 2:
            alert("Red is the winner!");
            break;
    }
    restart();
}

function draw() {
    let fieldObj = document.getElementById("field");
    fieldObj.innerHTML = "";
    for (let rowN = 0; rowN < Field.length; rowN++) {
        let rowObj = document.createElement("div");

        rowObj.setAttribute("class", "row");

        for (let ceilN = 0; ceilN < Field[rowN].length; ceilN++) {
            let ceilObj = document.createElement("div");

            setCeilStyle(ceilObj, rowN, ceilN);

            rowObj.append(ceilObj);
        }
        fieldObj.append(rowObj);
    }
    updateInfo(who());
}

function setCeilStyle(ceilObj, row, ceil) {
    ceilObj.setAttribute("class", "ceil");
    ceilObj.setAttribute("row", row);
    ceilObj.setAttribute("ceil", ceil);
    let inner = Field[row][ceil];
    switch(inner) {
        case 0:
            ceilObj.setAttribute("class", `${ceilObj.className} ceil-empty`);
            break;
        case 1:
            ceilObj.setAttribute("class", `${ceilObj.className} ceil-x`);
            break;
        case 2:
            ceilObj.setAttribute("class", `${ceilObj.className} ceil-o`);
            break;
    }
    ceilObj.onclick = ceilClickHandler;
    ceilObj.onmousedown = ceilMousedownHandler;
}

function ceilClickHandler(event) {
    let row = event.target.getAttribute("row");
    let ceil = event.target.getAttribute("ceil")
    step(row, ceil);
}

function ceilMousedownHandler(event) {
    let ceilObj = event.target;
    
    ceilObj.setAttribute("class", `${ceilObj.className} ceil-clicked`);

    ceilObj.onmouseup = function() {
        let prevClass = ceilObj.className.replace(" ceil-clicked", '');
        ceilObj.setAttribute("class", `${prevClass}`);
        ceilObj.onmousedown = null;
        ceilObj.onmouseup = null;
    }
}

function updateInfo(who) {
    let info = document.getElementById("info");
    if (who == 1) {
        info.innerHTML = "ХОДИТ СИНИЙ"
    } else {
        info.innerHTML = "ХОДИТ КРАСНЫЙ"
    }
    return who;
}

/////////////////////// Tests //////////////////////
createModel(5, 3);
initialize();
/*
console.log(Field);
console.log(Field, step(1, 0));
console.log(Field, step(2, 2));
*/

