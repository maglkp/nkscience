import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    private CELL_SIZE = 2;
    private ctx;
    private canvas;
    private cellsInRow;
    private rowCount;
    /* canvas coordinates standard, first value is column index, second is row index */
    private cellStates: number[][];
    private rule30: number[] = [0, 0, 0, 1, 1, 1, 1, 0];
    private rule110: number[] = [0, 1, 1, 0, 1, 1, 1, 0];
    private rule126: number[] = [1, 1, 1, 1, 1, 1, 1, 0];
    private rule: number[] = this.rule110;

    ngOnInit() {
        this.canvas = <HTMLCanvasElement>document.getElementById('play-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cellsInRow = this.canvas.width / this.CELL_SIZE;
        this.rowCount = this.canvas.height / this.CELL_SIZE;

        this.cellStates = [];
        for (let i = 0; i < this.cellsInRow; i++) {
            this.cellStates[i] = [];
            for (let j = 0; j < this.rowCount; j++) {
                this.cellStates[i][j] = 0;
            }
        }

        this.redrawCells();

        const canvas = document.querySelector('canvas');
        canvas.addEventListener('mousedown', e => this.onCanvasClick(canvas, e));

        this.cellStates[Math.floor(this.cellsInRow / 2)][0] = 1;

        this.updateAllRowsForRule();
        this.redrawCells();
    }

    updateAllRowsForRule() {
        for (let i = 1; i < this.rowCount; i++) {
            this.updateRowForRule(i);
        }
    }

    onCanvasClick(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // console.log('x: ' + x + ' y: ' + y);

        const xIndex = Math.floor(x / this.CELL_SIZE);
        const yIndex = Math.floor(y / this.CELL_SIZE);
        // console.log('xIndex: ' + xIndex + ' yIndex: ' + yIndex);
        if (this.cellStates[xIndex][yIndex] === 0) {
            this.cellStates[xIndex][yIndex] = 1;
        } else {
            this.cellStates[xIndex][yIndex] = 0;
        }

        this.updateAllRowsForRule();
        this.redrawCells();
    }

    redrawCells() {
        for (let i = 0; i < this.cellsInRow; i++) {
            for (let j = 0; j < this.rowCount; j++) {
                if (this.cellStates[i][j] === 0) {
                    this.ctx.fillStyle = 'rgb(200,200,200)';
                } else {
                    this.ctx.fillStyle = this.getRandomColor();
                }

                this.ctx.fillRect(i * this.CELL_SIZE, j * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
            }
        }
    }

    updateRowForRule(y) {
        for (let i = 0; i < this.cellsInRow; i++) {
            this.cellStates[i][y] = this.getNewCellValue(i, y);
        }
    }

    getNewCellValue(x, y) {
        const parentsValue = this.getCellParents(x, y);
        const ruleValueIndex = 4 * parentsValue[0] + 2 * parentsValue[1] + parentsValue[2];
        // reverse the rule array, last element represents zero, last but one represents one etc.
        return this.rule[7 - ruleValueIndex];

        //console.log('x ' + x + ' y ' + y);
        // console.log(parentsValue[0]);
        // console.log(parentsValue[1]);
        // console.log(parentsValue[2]);
        //console.log(ruleValueIndex);
        //console.log('\n');
    }

    getCellParents(x, y) {
        const prevRow = y - 1;
        if (x === 0) {
            return [0, this.cellStates[x][prevRow], this.cellStates[x + 1][prevRow]];
        } else if (x === (this.cellsInRow - 1)) {
            return [this.cellStates[x - 1][prevRow], this.cellStates[x][prevRow], 0];
        }

        return [this.cellStates[x - 1][prevRow], this.cellStates[x][prevRow], this.cellStates[x + 1][prevRow]];
    }

    getRandomColor() {
        const r = 75 * Math.random() | 0,
            g = 75 * Math.random() | 0,
            b = 75 * Math.random() | 0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
}

