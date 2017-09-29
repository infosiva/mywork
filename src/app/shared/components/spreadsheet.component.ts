import { Component, Input} from '@angular/core';
import { SpreadsheetModel } from '../models/spreadsheet.model';
import { HeaderRowService } from '../services/header-row.service';
import { SharedService }     from '../services/shared.service';
@Component({
    selector: 'spreadsheet',
    templateUrl: './spreadsheet.component.html',
    providers: [SharedService]
})
export class Spreadsheet {
    model:SpreadsheetModel;
    @Input() rows:Number;
    @Input() columns:Number;
    header = [];
    visibleRows = [];
    constructor(private sharedService: SharedService) {
        this.model = new SpreadsheetModel(10,4);
        this.header = HeaderRowService.createHeader(this.model.rows[0].columns.length);
        this.visibleRows = this.getVisibleRows();
    }
    getHeader() {
        return HeaderRowService.createHeader(this.model.rows[0].columns.length);
    }
    navigate($event) {
        this.model.navigate($event.keyCode);
        this.visibleRows = this.getVisibleRows();
    }
    getVisibleRows() {
        return this.model.rows.filter((row) => row.rowIndex >= this.model.start && row.rowIndex < this.model.end);
    }
    getActive(col) {
        if(col === this.model.current) {
            return 'active-cell';
        }
    }
    rightClickEvent(event: MouseEvent) {
        this.sharedService.setCellXCoOrdinate(event.clientX.toString());
        this.sharedService.setCellYCoOrdinate(event.clientY.toString());
        event.preventDefault();
    }
    outsideClick() {
        this.sharedService.disableContext();
    }
}
