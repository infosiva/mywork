import { SharedService }  from '../services/shared.service';
import { constants } from '../constants/shared.constants';
import { ReflectiveInjector } from  '@angular/core';
export module utilities {
  /* Manual injection */ 
  export let companySharingselectedMenuOption = ""; 
  let injector = ReflectiveInjector.resolveAndCreate([SharedService]);
  let sharedService = injector.get(SharedService);  
  export function applyDimensions(cell, cellText) {
        if(cell && cell.getAttribute('cellType')==='CALC') {
          cell.innerHTML = "0.000";  
        }
        else {
          cell.innerHTML = cellText;
        }        
        cell.style.minWidth = '25px';
        //cell.style.minHeight = '1em';
        cell.style.width = '100%'; //((cellText.length + 1) * 10)  + 'px';
        //cell.style.height = '100%' //cell.scrollHeight + 'px';
        cell.style.resize = 'none';
        cell.style.overflow = 'hidden';
        return cellText;
     }  
  export function getFormattedHTML(cell) {
        if (document.getElementById(cell.id)) {
                if (document.getElementById(cell.id).getAttribute('data-formattedHTML')) {
                  const bootstrapToolTip = cell.parentElement.getElementsByTagName('bs-tooltip-container')[0];
                  bootstrapToolTip.getElementsByTagName('div')[1].className = 'tooltip-inner-modified';                
                  return document.getElementById(cell.id).getAttribute('data-formattedHTML');
                }
        }
    }
  export function onValidationApply(arg) {
      let selectedOption = companySharingselectedMenuOption;
      let link = constants.companyInternalRightClickMenuOptions.filter(item=> item.DisplayText===selectedOption)[0];
      if(link['MethodToExecute']) {
        let callbackFn = utilities[link['MethodToExecute']];
        callbackFn();
        return;     
      }
      let tempHTML = `<div class='panel panel-primary'>
                      <div class='panel-heading'>
                          <h1 class='panel-title'>Applied validations...</h3>
                      </div>
                          <ul class='list-group'>
                              validationtext
                          </ul>
                  </div>`;    
      const parsedJSON = utilities.safelyParseJSON(arg,link.DisplayText);
      let tempstr = '';
      let validationsMetaData = parsedJSON;
      /*if(typeof(parsedJSON) == 'Array' ||typeof(parsedJSON) =='object') {
        validationsMetaData = JSON.stringify(parsedJSON);
        parsedJSON.forEach(validation => {           
           if(validation.key.length>0) {
             tempstr+= `<li class='list-group-item list-group-item-success'>${validation.key} - ${validation.value.split(':')[0]}</li>`;
           }
           else {             
              tempstr+= `<li class='list-group-item list-group-item-success'>${validation.value.split(':')[0]}</li>`;
           }
        });
      }
      else {           
           tempstr+= `<li class='list-group-item list-group-item-success'>${parsedJSON}</li>`;
      }*/
      tempHTML = tempHTML.replace('validationtext', tempstr);
      Array.from(document.querySelectorAll('.cell-selected, .selected')).forEach((eachCellSelected) => {

           const cell = document.getElementById(eachCellSelected.id);
           sharedService.ResetCellDataAttributes(cell);
           cell.setAttribute('data-validationsMetadata', validationsMetaData);
           cell.setAttribute('data-tooltipText', arg);
           tempHTML = tempHTML.replace('validationtext', `<li class ='list-group-item list-group-item-success'>${arg}</li>")`);
           cell.setAttribute('data-formattedHTML', tempHTML);           
           cell.style['backgroundColor'] = link.CellColor;
           if(link["CellType"]) {
             cell.setAttribute('data-cellType',link["CellType"]);
           }
      });
      return;
  }
  export function clearCellSelected(deleteDataAttr=false) {
        Array.from(document.querySelectorAll('.cell-selected, .selected')).forEach((eachCellSelected) => {
             const cell = document.getElementById(eachCellSelected.id);
             if (cell.getAttribute('data-isHeader') !== 'TRUE') {
                 if(deleteDataAttr) {
                   sharedService.ResetCellDataAttributes(cell);
                 }
                   cell.classList.remove('cell-selected');
                   cell.classList.remove('selected');
                }
        });
        sharedService.disableContext();
    }
  export function adjustRowRangeUpward() {
      if (this.current.rowIndex < this.start) {
          this.shiftRowsBy(-1);
      }
  }
  export function adjustRowRangeDownward() {
      if (this.current.rowIndex === this.model.rows.length) {
          this.shiftRowsBy(1);
      }
  }
  export function shiftRowsBy(offset) {
      this.start = this.start + offset;
      this.end = this.model.rows.length + offset;
  }
  export function ensureRow() {
      if (this.current.rowIndex === this.model.rows.length) {
          return false;
      }
      return true;
  }
  export function safelyParseJSON(json, defaultTextIfNotValid ?: string)
  {
     try {
       return JSON.parse(json);
     }
     catch (e) {
         return defaultTextIfNotValid ? defaultTextIfNotValid : "";
     }
  }
  export function deleteAppliedRules()
  {
      clearCellSelected(true);
  }
  export function resetSelections()
  {
      clearCellSelected();
  }
}