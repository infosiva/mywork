import { Component, Input } from '@angular/core';
import { DataCollectionService } from '../services/data-collection.service';
import { SharedService } from '../services/shared.service';
import { Row } from '../models/row';
import { Column } from '../models/column';
import '../DOMExtensions/HTMLElementExtension';
import { utilities } from '../utilities/utilities';
import { constants } from '../constants/shared.constants';
@Component ({
    //moduleId: module.id,
    selector: 'base-data-collection',
    templateUrl: 'base-data-collection.component.html'
})
export class BaseDataCollectionComponent {
    @Input() validationMode: boolean = false;
    @Input() datafeedMode: boolean = false;
    @Input() designingMode: boolean = false;
    @Input('model') model: any;
    selectionStart: boolean = false;
    selectionStartCellIdx: string;
    selectionStartRowIdx: string;
    selectionEndCellIdx: string;
    selectionEndRowIdx: string;
    rows:Array<Row>;
    current:Column;
    start:number;
    end:number;
    visibleRows = [];
    columnCount: number;
    rowCount: number;
    header: any[];
    validationToolTipText: string;
    onmousedown: boolean = false;
    rowNumber : number;
   constructor(public dataCollectionService: DataCollectionService, public sharedService: SharedService) {     
      this.rows = [];
      this.header  = dataCollectionService.getSheetHeaders();
      this.current = dataCollectionService.getCurrentCell(); 
      this.rowNumber = 0;
  }
  markAsHeaderRowColumnsSelected(startingcellIdx,endingCellIdx,colSpan) {
    if(colSpan !== 1) {
      return false;
    }

      /*for (let i = 1; i <= this.model.rows.length; i++) {
         let eachCell = document.getElementById(i.toString() + '-' + (cellIdx ? cellIdx - 1 : 0));
         if (eachCell && eachCell.getAttribute('data-colSpan') && eachCell.getAttribute('data-colSpan') === '1') {
             if (eachCell.getAttribute('data-isHeader') !== 'TRUE') {
                this.sharedService.ApplyAsCellSelected(eachCell);
              }
           }
      } */
  }
  domLoaded(last : Boolean) {
    if(last==true) {
      SharedService.domLoaded = true;
    }
  }
  applyDimensions(cell,cellText,isHeader: boolean ,colIndex,rowIndex) {   
    if(!isHeader && this.model && this.model.useLineNumber && colIndex==0) {
       return (rowIndex.toString());
    }
    return utilities.applyDimensions(cell,cellText);
  }
  getVisibleRows() {
      return this.model.rows.filter((row) => row.rowIndex >= this.model.start && row.rowIndex < this.model.end);
  }
  selectColumn(col) {
      this.current = col;
  }
   setBackgroundColor(headerFlag : boolean, fontWeight, cell) {    
      if(headerFlag) {
         return headerFlag ? '#F2E85E' : 'white';
       }
       switch (cell.getAttribute('cellType')) {
         case  "CALC" :
           return "#E3ECFF";           
         case "INPUT":
           return "#FFFFE0";
         default:
           break;
       }             
  }
  setFontWeight(headerFlag : boolean) {
      return headerFlag ? 'bold' : 'normal';
  }  
 onCellMouseOver(cell, event) { 
   //return; 
 if (cell.getAttribute('data-isHeader') && cell.getAttribute('data-isHeader').toLowerCase() === 'true') {
      return;
    } 
    this.selectionEndRowIdx = cell.getAttribute('data-rowIndex');
    this.selectionEndCellIdx = cell.getAttribute('data-columnIndex');
    if (cell.getAttribute('data-isHeader') && cell.getAttribute('data-isHeader').toLowerCase() === 'true') {
      return;
    }
    this.onmousedown=event.ctrlKey;
    if(this.selectionStart && event.ctrlKey !== true) {

      Array.from(document.getElementsByClassName('cell-selected')).forEach((eachCell) => {
         this.sharedService.ApplyAsNotCellSelected(eachCell);
       });

      Array.from(document.querySelectorAll('label[cellType=INPUT]')).forEach((eachCell) => {
        var cellIdx = parseInt(eachCell.getAttribute('data-columnIndex'));       
        var rowIdx = parseInt(eachCell.getAttribute('data-rowIndex'));
        if(cellIdx>=parseInt(this.selectionStartCellIdx)) {
          if(cellIdx >= parseInt(this.selectionStartCellIdx) && cellIdx <= parseInt(this.selectionEndCellIdx) && 
            rowIdx <= parseInt(this.selectionEndRowIdx) && rowIdx>= parseInt(this.selectionStartRowIdx) && cell.getAttribute('data-isHeader').toLowerCase() === 'true')
          {
            this.sharedService.ApplyAsCellSelected(eachCell);
          }
        }
        if(
          ((cellIdx <= parseInt(this.selectionStartCellIdx) && cellIdx >= parseInt(this.selectionEndCellIdx))
            || (cellIdx >= parseInt(this.selectionStartCellIdx) && cellIdx <= parseInt(this.selectionEndCellIdx))
            ) 
          && ((rowIdx <= parseInt(this.selectionEndRowIdx) && rowIdx >= parseInt(this.selectionStartRowIdx)) 
            || (rowIdx >= parseInt(this.selectionEndRowIdx) && rowIdx <= parseInt(this.selectionStartRowIdx)))
          && eachCell.getAttribute('data-isHeader') !== 'TRUE')           
          {
            this.sharedService.ApplyAsCellSelected(eachCell);
          }                
      });

    }
    if (event && event.ctrlKey == true && this.onmousedown == true) {
      this.sharedService.ApplyAsCellSelected(cell);
     } //*/
  } 
  onCellMouseDown(cell, event) {
    if (cell.getAttribute('data-isHeader').toLowerCase() === 'true') {
      return;
    }    
    this.selectionStart = true;
    this.selectionStartCellIdx = cell.getAttribute('data-columnIndex');
    this.selectionStartRowIdx= cell.getAttribute('data-rowIndex');
    if (cell.getAttribute('data-isHeader') === 'TRUE') {
      return;
    }
    this.ApplyAsSelected(cell,event);    
  }
  onCellMouseUp(cell, event) {
    this.selectionStart = false;
    if (cell.getAttribute('data-isHeader').toLowerCase() === 'true') {
      return;
    }    
    this.selectionEndCellIdx = cell.getAttribute('data-columnIndex');
    this.selectionEndRowIdx= cell.getAttribute('data-rowIndex');
  }
  onCellClick(cell, event) {
     this.selectionStart = false;
    if (cell.getAttribute('data-isHeader').toLowerCase() === 'true') {
      return;
    }
    this.onmousedown=event.ctrlKey;
    this.current = new Column(parseInt(cell.getAttribute('data-columnIndex')),parseInt(cell.getAttribute('data-rowIndex')),cell.getAttribute('data-uniqueId'));
    if (event.ctrlKey !== true) {
        Array.from(document.getElementsByClassName('selected')).forEach((eachCellSelected) => {
             const eachSelected = document.getElementById(eachCellSelected.id);
             this.sharedService.ApplyAsNotSelected(eachSelected);
        });
        if (cell.classList.contains('cell-selected')) {
            this.sharedService.ApplyAsNotCellSelected(cell);
        } else {
            this.sharedService.ApplyAsSelected(cell);
        }
    }
  }
  adjustRowRangeUpward() {
      if (this.current.rowIndex < this.start) {
          this.shiftRowsBy(-1);
      }
  }
  adjustRowRangeDownward() {
      if (this.current.rowIndex === this.model.rows.length) {
          this.shiftRowsBy(1);
      }
  }
  shiftRowsBy(offset) {
      this.start = this.start + offset;
      this.end = this.model.rows.length + offset;
  }
  ensureRow() {
      if (this.current.rowIndex === this.model.rows.length) {
          return false;
      }
      return true;
  }
  ApplyAsSelected(cell, event) {
      cell.applyAsSelected(event);
  }
  navigate(cell, event) {   
    cell.navigateThrough(event,this);
  }
  getFormattedHTML(cell) {
      return utilities.getFormattedHTML(cell);
  }
  onValidationApply(arg) {
     utilities.onValidationApply(arg);
  }
  getValidationClass(parentCell,icon)
  {    
    if(parentCell) {
      let link = constants.companyInternalRightClickMenuOptions.filter(item=> item["CellType"] && item["CellType"]===parentCell.getAttribute('data-cellType'))[0];
      icon.style.color = link && link.iconColor ? link.iconColor : '';
      return link && link.icon ? link.icon : "";
    }
  }
}
