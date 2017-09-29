import { Column } from './column';
export class Row {
    columns : Array<Column>;
    constructor (public rowIndex, public columnCount, cells : any) {
        this.columns = [];
        for(let cellIdx = 0; cellIdx < this.columnCount; cellIdx++){
            if(cells[cellIdx])
            {
               this.columns.push(new Column(
               								cellIdx,
               								this.rowIndex,
               								cells[cellIdx].DISPLAYTEXT ? cells[cellIdx].DISPLAYTEXT : "",
               								cells[cellIdx].ISHEADER ? cells[cellIdx].ISHEADER : false, 
                              cells[cellIdx].ID ? cells[cellIdx].ID : "",
                              cells[cellIdx].COLSPAN ? cells[cellIdx].COLSPAN : "1",
                              cells[cellIdx].ROWSPAN ? cells[cellIdx].ROWSPAN : "1",
                              cells[cellIdx].CELLTYPE ? cells[cellIdx].CELLTYPE : "input",
                              cells[cellIdx].CONTENT ? cells[cellIdx].CONTENT : ""
              ));
            }
        }
    }
}
