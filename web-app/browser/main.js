import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;

const next_columns = 3;
const next_rows = 2;

let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

document.documentElement.style.setProperty("--nextgrid-rows", next_rows);
document.documentElement.style.setProperty("--nextgrid-columns", next_columns);

const grid = document.getElementById("grid");
const next_tetromino = document.getElementById("current_tetromino");
const next_grid = document.getElementById("nextgrid");


const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const cells = range(grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const next_cells = range(next_rows).map(function () {
    const next_row = document.createElement("nextdiv");
    next_row.className = "next-row";

    const next_rows2 = range(next_columns).map(function () {
        const next_cell = document.createElement("nextdiv");
        next_cell.className = "next-cell";

        next_row.append(next_cell);

        return next_cell;
    });

    grid.append(next_row);
    return next_rows2;
});

const hold_cells = range(next_rows).map(function () {
    const hold_row = document.createElement("holddiv");
    hold_row.className = "hold-row";

    const hold_rows2 = range(next_columns).map(function () {
        const hold_cell = document.createElement("holddiv");
        hold_cell.className = "hold-cell";

        hold_row.append(hold_cell);

        return hold_cell;
    });

    grid.append(hold_row);
    return hold_rows2;
});

const update_grid = function () {
    game.field.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );
};

// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function () {
    key_locked = false;
};

document.body.onkeydown = function (event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    if (event.key === "c") {
        game = Tetris.hold(game);
    }
    update_grid();
};

const timer_function = function () {
    game = Tetris.next_turn(game);
    update_grid();
    setTimeout(timer_function, 500);
};

setTimeout(timer_function, 500);

update_grid();
