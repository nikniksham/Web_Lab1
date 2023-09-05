let canvas = document.getElementById('drawLine');
// let canvas = $('drawLine');
console.log(canvas);
let ctx = canvas.getContext('2d');
ctx.font = "24px roboto";
ctx.lineWidth = "2";

class Grid {
    constructor(size_x, size_y, r) {
        this.size_x = size_x;
        this.size_y = size_y;
        this.r = r;
        this.raz = this.size_x / 60;
        this.need_cross = true;
        this.point_coords = [-this.raz, -this.raz, false];
        this.scale = 7;
    }

    draw(x, y) {
        this.stroke_panel();
        this.draw_primitives();
        this.draw_grid();
        if (this.need_cross) {
            this.drawCross(x, y);
        } else {
            this.drawPoint()
        }
    }

    drawPoint() {
        ctx.beginPath()
        ctx.fillStyle = "#f00";
        if (this.point_coords[2]) {
            ctx.fillStyle = "#0f0";
        }
        ctx.arc(this.point_coords[0], this.point_coords[1], this.raz / 2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.fillStyle = "#000";
    }

    drawCross(x, y) {
        ctx.beginPath()
        ctx.strokeStyle = "#ff0000";
        ctx.beginPath()
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.size_y);
        ctx.moveTo(0, y);
        ctx.lineTo(this.size_x, y);
        ctx.stroke();
        ctx.strokeStyle = "#000000";
    }

    draw_primitives() {
        let x, y, c = this.trans_coords(0, 0);
        x = c[0], y = c[0];

        // Четвертькруг
        ctx.beginPath()
        ctx.arc(x, y, this.size_x / this.scale / 2 * this.r, Math.PI, Math.PI / 2, true);
        ctx.fillStyle = "#15b3e8";
        ctx.lineTo(x, y)
        ctx.fill();

        // Прямоугольник
        ctx.beginPath()
        ctx.moveTo(x, y);
        c = this.trans_coords(0, -this.size_y / this.scale * this.r);
        ctx.lineTo(c[0], c[1]);
        c = this.trans_coords(-this.size_y / this.scale / 2 * this.r, -this.size_y / this.scale * this.r)
        ctx.lineTo(c[0], c[1]);
        c = this.trans_coords(-this.size_y / this.scale / 2 * this.r, 0)
        ctx.lineTo(c[0], c[1]);
        ctx.fill();

        // Треугольник
        ctx.beginPath()
        ctx.moveTo(x, y);
        c = this.trans_coords(this.size_x / this.scale * this.r, 0);
        ctx.lineTo(c[0], c[1]);
        c = this.trans_coords(0, this.size_y / this.scale / 2 * this.r);
        ctx.lineTo(c[0], c[1]);
        ctx.fill();

        ctx.fillStyle = "#000000";
    }

    draw_grid() {
        // Координатная сетка
        ctx.beginPath()
        ctx.fillText('Y', this.size_x / 2 + this.raz, 20);
        ctx.moveTo(this.size_x / 2, 0);
        ctx.lineTo(this.size_x / 2, this.size_y);
        ctx.fillText('X', this.size_x - 20, this.size_y / 2 - this.raz - 5);
        ctx.moveTo(0, this.size_y / 2);
        ctx.lineTo(this.size_x, this.size_y / 2);

        // Стрелочки сетки
        ctx.moveTo(this.size_x / 2, 0);
        ctx.lineTo(this.size_x / 2 - this.raz, this.raz * 2);
        ctx.moveTo(this.size_x / 2, 0);
        ctx.lineTo(this.size_x / 2 + this.raz, this.raz * 2);
        ctx.moveTo(this.size_x, this.size_y / 2);
        ctx.lineTo(this.size_x - this.raz * 2, this.size_y / 2 - this.raz);
        ctx.moveTo(this.size_x, this.size_y / 2);
        ctx.lineTo(this.size_x - this.raz * 2, this.size_y / 2 + this.raz);


        // Разметка сетки
        // Горизонтальная
        let c, x, y;
        for (let i = parseInt(-this.scale + 0.5); i < this.scale; i++) {
            if (i == 0) { continue; }
            c = this.trans_coords(this.size_x / this.scale * i / 2, 0);
            x = c[0];
            y = c[1];
            ctx.fillText(i / 2, x - String(i / 2).length*5, y - this.raz - 5);
            ctx.moveTo(x, y - this.raz);
            ctx.lineTo(x, y + this.raz);
        }

        // Вертикальная
        for (let i = parseInt(-this.scale + 0.5); i < this.scale; i++) {
            if (i == 0) { continue }
            c = this.trans_coords(0, this.size_y / this.scale * i / 2);
            x = c[0];
            y = c[1];
            ctx.fillText(i / 2, x + this.raz + 5, y + 5);
            ctx.moveTo(x - this.raz, y);
            ctx.lineTo(x + this.raz, y);
        }
        ctx.stroke();
    }

    trans_coords(x, y) {
        return [this.size_x / 2 + x, this.size_y / 2 + y];
    }

    stroke_panel() {
        ctx.beginPath()
        ctx.moveTo(0, 0);
        ctx.lineTo(this.size_x, 0);
        ctx.lineTo(this.size_x, this.size_y);
        ctx.lineTo(0, this.size_y);
        ctx.lineTo(0, 0);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.fillStyle = "#000000";
        ctx.stroke();
    }
}

function inPrimitive(x, y) {
    let res = false;
    // console.log(x, y);
    if ((x <= 0 && y <= 0 && 0.25 - x**2 - y**2 >= 0) || (x <= 0 && y >= 0 && x >= -0.5 && y <= 1) || (x >= 0 && y <= 0 && x <= 1 && y >= x/2-0.5)) {
        res = true;
    }
    return res;
}

canvas.onmousemove = function (evt) {
    evt = evt || window.event;
    var rect = this.getBoundingClientRect(), x = evt.clientX - rect.left, y = evt.clientY - rect.top;
    grid.draw(x, y);
}

canvas.onclick = function (evt) {
    // if (grid.need_cross) {
        var rect = this.getBoundingClientRect(), x = evt.clientX - rect.left, y = evt.clientY - rect.top;
        evt = evt || window.event;
        grid.need_cross = false;
        grid.point_coords = [x, y, inPrimitive((x - grid.size_x/2) / grid.size_x*grid.scale/grid.r, -(y - grid.size_y/2) / grid.size_y*grid.scale/grid.r)];
        grid.draw(0, 0);
    // }
}

canvas.onmouseleave = function (evt) {
    evt = evt || window.event;
    grid.draw(-10, -10);
}

let grid = new Grid(canvas.width, canvas.height, 3);
grid.draw(-10, -10);