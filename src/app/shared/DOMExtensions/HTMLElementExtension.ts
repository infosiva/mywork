import { SharedService }  from '../services/shared.service';
import { ReflectiveInjector } from  '@angular/core';
import { Column } from '../models/column';
import { KeyMap } from '../models/key-map';
import { utilities } from '../utilities/utilities'
declare global {
	interface HTMLElement{
		setStyles() : void
		applyAsSelected(event: MouseEvent) : void
    setBackgroundColor(headerFlag) : void
    setFontWeight(headerFlag)
    navigateThrough(event : MouseEvent,caller: any)
    showToolTip(cell: any)
    setToolTipPostition(cell: any)
    isHeader() : void
	}
  interface HTMLTableCellElement{
    showToolTip(cell: any)
    setToolTipPostition(cell: any)
  }
}
/* Lambda expressions do not have a this binding, so using function based expression to access this */

HTMLElement.prototype.isHeader = function() {
    return (this.getAttribute('data-isHeader') === 'TRUE')
}
HTMLElement.prototype.applyAsSelected = function(event) {
      if (this.getAttribute('data-isHeader') === 'TRUE') {
          return;
      }
      if (event.type === 'mousedown' && event.ctrlKey === true) {
          if (this.classList.contains('cell-selected') && event.ctrlKey === true) {
              this.classList.remove('cell-selected');
              this.style.backgroundColor = '';
          }
          if (!this.classList.contains('cell-selected')) {
            /* Manual injection */
            let injector = ReflectiveInjector.resolveAndCreate([SharedService]);
            let sharedService = injector.get(SharedService);
            sharedService.ApplyAsCellSelected(this);
          }
      }      
  }
  HTMLElement.prototype.setBackgroundColor = function(headerFlag) {    
      return headerFlag === 'FALSE' ? 'white' : 'yellow';
  }
  HTMLElement.prototype.setFontWeight= function(headerFlag) {
      return headerFlag === 'FALSE' ? '' : 'bold';
  }
  HTMLElement.prototype.navigateThrough = function(event: any, caller: any) {  
      const keyCode = event.keyCode;
      let navigate = false;
      const navDirection = KeyMap.getNavigationDirection(keyCode);
      if (navDirection.down) {
          if (!caller.current.rowIndex === caller.model.rows.length) {
            return;
            }
          caller.current = new Column(caller.current.columnIndex, caller.current.rowIndex + 1);
          caller.adjustRowRangeDownward();
          navigate = true;
      }
      if (navDirection.up) {
          // if (!this.ensureRow()) return;
          if (caller.current.rowIndex === 0) {
              return;
          }
          caller.current = new Column(caller.current.columnIndex, caller.current.rowIndex - 1);
          caller.adjustRowRangeUpward();
          navigate = true;
      }
      if (navDirection.left) {
         // if (!this.ensureRow()) return;
          if (caller.current.columnIndex === 0) {
              return;
          }
          navigate = true;
          caller.current = new Column(caller.current.columnIndex - 1, caller.current.rowIndex);
      }
      if (navDirection.right) {
        // if (!this.ensureRow()) return;
          if (caller.current.columnIndex === caller.model.columnCount - 1) {
              return;
          }
          caller.current = new Column(caller.current.columnIndex + 1 , caller.current.rowIndex);
          navigate = true;
      }
      if (navDirection.tab) {
      if (caller.current.columnIndex === caller.model.columnCount - 1) {
              //caller.ensureRow();
              caller.current = caller.model.rows[caller.current.rowIndex + 1].columns[0];
              caller.adjustRowRangeDownward();
          } else {
              caller.current = caller.model.rows[caller.current.rowIndex].columns[caller.current.columnIndex + 1];
          }
      }
      if (caller.current && navigate) {
          if (event.srcElement.getAttribute('data-isHeader') !== 'TRUE') {
            utilities.clearCellSelected();
          }
      const cell = document.getElementById(caller.current.rowIndex + '-' + caller.current.columnIndex);
      if (!cell.classList.contains('cell-selected') && cell.getAttribute('data-isHeader') !== 'TRUE') {
              caller.sharedService.ApplyAsSelected(cell);
        }
      cell.focus();
      }
    }
  HTMLElement.prototype.showToolTip = function(cell) {
      if (cell.getAttribute('data-isHeader') === 'true') {
          return false;
      }
      if (cell.getAttribute('data-cellType') && cell.getAttribute('data-cellType').length >= 0) {
          this.validationToolTipText = (utilities.safelyParseJSON(cell.getAttribute('data-tooltipText')));
          return true;
      }
      /* else if (cell.getAttribute('data-isReadonly') || cell.getAttribute('data-noDisplay') || cell.getAttribute('data-calculated')) {
          this.validationToolTipText = cell.getAttribute('data-tooltipText') ? cell.getAttribute('data-tooltipText') : '';
          return true;
      } */
      return false;
  }
 
  HTMLElement.prototype.setToolTipPostition= function(cell) {
         const cellPosition = cell.getBoundingClientRect();
         if (cellPosition.left > 515) {
              return 'left';
          }
          if (cellPosition.left < 515) {
              return 'right';
          }
          if (cellPosition.top < 110) {
              return 'bottom';
          }
          return 'top';
  }  
  export { }
