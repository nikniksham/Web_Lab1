let canvas = document.getElementById('drawLine');
// let canvas = $('drawLine');
console.log(canvas);
let ctx = canvas.getContext('2d');
ctx.font = "24px roboto";
ctx.lineWidth = "2";
let min_x = -3, max_x = 5, min_y = -5, max_y = 3;

class Grid {
    constructor(size_x, size_y, r) {
        this.size_x = size_x;
        this.size_y = size_y;
        this.r = r;
        this.raz = this.size_x / 60;
        this.need_cross = true;
        this.point_coords = [-this.raz, -this.raz, false];
        this.scale = 7; // кол-во ступеней в сетке
        this.ssx = this.size_x / this.scale;
        this.ssy = this.size_y / this.scale;
        this.cursor_in_good_zone = false;
    }

    draw(x, y, mouse_on_canvas) {
        this.stroke_panel();
        this.draw_primitives();
        this.draw_grid();
        if (this.need_cross) {
            if (mouse_on_canvas) {
                this.drawCross(x, y);
            }
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

        let mini = this.trans_coords_to_canvas(min_x, min_y), maxi = this.trans_coords_to_canvas(max_x, max_y);
        ctx.moveTo(mini[0], mini[1]);
        ctx.lineTo(mini[0], maxi[1]);
        ctx.lineTo(maxi[0], maxi[1]);
        ctx.lineTo(maxi[0], mini[1]);
        ctx.lineTo(mini[0], mini[1]);

        if (x > mini[0] && x < maxi[0] && y > maxi[1] && y < mini[1]) {
            ctx.moveTo(Math.min(Math.max(x, mini[0]), maxi[0]), mini[1]);
            ctx.lineTo(Math.min(Math.max(x, mini[0]), maxi[0]), maxi[1]);
            ctx.moveTo(mini[0], Math.min(Math.max(y, maxi[1]), mini[1]));
            ctx.lineTo(maxi[0], Math.min(Math.max(y, maxi[1]), mini[1]));
            this.cursor_in_good_zone = true;
        } else {
            this.cursor_in_good_zone = false;
        }

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
            if (i == 0) {
                continue;
            }
            c = this.trans_coords(this.size_x / this.scale * i / 2, 0);
            x = c[0];
            y = c[1];
            ctx.fillText(i / 2, x - String(i / 2).length * 5, y - this.raz - 5);
            ctx.moveTo(x, y - this.raz);
            ctx.lineTo(x, y + this.raz);
        }

        // Вертикальная
        for (let i = parseInt(-this.scale + 0.5); i < this.scale; i++) {
            if (i == 0) {
                continue
            }
            c = this.trans_coords(0, this.size_y / this.scale * i / 2);
            x = c[0];
            y = c[1];
            ctx.fillText(i / 2, x + this.raz + 5, y + 5);
            ctx.moveTo(x - this.raz, y);
            ctx.lineTo(x + this.raz, y);
        }
        ctx.stroke();
    }

    reset_cross() {
        this.need_cross = true;
        this.point_coords = [-this.raz, -this.raz, false]
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

    trans_coords_to_canvas(x_coords, y_coords) {
        return [x_coords * this.ssx + this.size_x / 2, grid.size_y - (y_coords * this.ssy + grid.size_y / 2)];
    }

    trans_canvas_to_coords(x_canvas, y_canvas) {
        return [(x_canvas - this.size_x / 2) / this.ssx, -(y_canvas - this.size_y / 2) / this.ssy]
    }
}

function inPrimitive(x, y, r) {
    let res = false;
    // console.log(x, y);
    if ((x <= 0 && y <= 0 && (r / 2) ** 2 - x ** 2 - y ** 2 >= 0) || (x <= 0 && y >= 0 && x >= -r / 2 && y <= r) || (x >= 0 && y <= 0 && x <= r && y >= x / 2 - r / 2)) {
        res = true;
    }
    return res;
}

canvas.onmousemove = function (evt) {
    evt = evt || window.event;
    let rect = this.getBoundingClientRect(), x = evt.clientX - rect.left, y = evt.clientY - rect.top;
    grid.draw(x, y, true);
}

canvas.onclick = function (evt) {
    if (grid.need_cross && grid.cursor_in_good_zone) {
        let rect = this.getBoundingClientRect(), x = evt.clientX - rect.left, y = evt.clientY - rect.top;
        evt = evt || window.event;
        grid.need_cross = false;
        let res = grid.trans_canvas_to_coords(x, y);
        let x_coords = check_num_ogr(min_x, max_x, res[0]), y_coords = check_num_ogr(min_y, max_y, res[1])
        document.getElementById("x_coords").value = x_coords;
        document.getElementById("y_coords").value = y_coords;
        res = grid.trans_coords_to_canvas(x_coords, y_coords);
        let x_on_can = res[0], y_on_can = res[1];
        // console.log([x_coords, x_on_can, x], [y_coords, y_on_can, y]);
        grid.point_coords = [x_on_can, y_on_can, inPrimitive(x_coords, y_coords, grid.r)];
        grid.draw(0, 0, true);
    }
}

function reset() {
    grid.reset_cross();
    grid.draw(-10, -10, false);
}

function change_input_field(elem, min_value, max_value) {
    // console.log('qqqq', elem.value)
    elem.value = elem.value.replace(/[^(\.|\d|\-)]/g, '');
    // console.log("wwww", elem.value)
    if (elem.value.length>0) {
        if (!/\-?(\d+[\.]\d+|^\d+)/g.test(elem.value) || elem.value.match(/\./g) != null && elem.value.match(/\./g).length > 1 ||
            elem.value.match(/\-/g) != null && elem.value.match(/\-/g).length >= 1 || /^\-?(0{2,}|0+\d+)/g.test(elem.value)) {
            // console.log("1", elem.value)
            if (/^\-?(0{2,}|0+\d+)/g.test(elem.value)) {
                elem.value = parseFloat(elem.value);
            } else if (elem.value[0] === ".") {
                // console.log("2")
                elem.value = "0" + elem.value;
            } else if (elem.value.length > 1 && elem.value[1] === "." && elem.value[0] === "-") {
                // console.log("3")
                elem.value = elem.value.replace("-", "");
                elem.value = "-0" + elem.value;
            } else if (elem.value.match(/\./g) != null && elem.value.match(/\./g).length > 1) {
                // console.log("4")
                let loc = elem.value.split(".");
                elem.value = loc[0] + ".";
                delete loc[0];
                elem.value += loc.join("");
            } else if (elem.value.match(/\-/g) != null) {
                // console.log("5", elem.value)
                if (elem.value[0] !== "-") {
                    // console.log(elem.value, "!!!!!")
                    elem.value = elem.value.replace(/\-/g, "");
                } else if (elem.value.match(/\-/g).length > 1) {
                    // console.log(elem.value, "1_?????")
                    elem.value = "-" + elem.value.replace(/\-/g, "");
                    // console.log(elem.value, "2_?????")
                }
            }
        }
        elem.value = check_num_ogr(min_value, max_value, elem.value);
    }
}

function check_num_ogr(min_value, max_value, num) {
    if (num > max_value) {
        num = max_value;
    } else if (num < min_value) {
        num = min_value;
    }
    return num;
}

canvas.onmouseleave = function (evt) {
    evt = evt || window.event;
    grid.draw(-10, -10, false);
}

document.querySelector("select").addEventListener('change', function (e) {
    // console.log("Changed to: " + e.target.value)
    grid.r = parseFloat(e.target.value);
    grid.reset_cross();
    grid.draw(-10, -10, false);
})

let grid = new Grid(canvas.width, canvas.height, 3); // r - размер фигурки
grid.draw(-10, -10, false);