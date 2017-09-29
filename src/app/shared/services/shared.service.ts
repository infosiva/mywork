import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as constants from '../constants/shared.constants';
import {SessionStorageService} from './session-storage.service';
@Injectable()
export class SharedService {
  public static reloadedLocalContent = false;
  public static domLoaded = false;
  public static compProcessed = false;
  public showContext: boolean = false;
  public cellXCoordinateSource = new Subject <string>();
  public cellYCoordinateSource = new Subject <string>();  
  public cellXCoordinate : BehaviorSubject<string> = new BehaviorSubject("");
  public cellYCoordinate : BehaviorSubject<string> = new BehaviorSubject("");     
  public onValidationApply = new Subject<string>();
  cellXCoordinate$ = this.cellXCoordinateSource.asObservable();
  cellYCoordinate$ = this.cellYCoordinateSource.asObservable();
  public showHomePage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public subscribeNewUpdates = new BehaviorSubject<string>("");
  public saveChanges = new Subject<Boolean>();
  // Service message commands
  setCellXCoOrdinate(axisVal: string) {
    this.showContext = true;
    this.cellXCoordinate = new BehaviorSubject(axisVal);
    this.cellXCoordinateSource.next(axisVal);
  }
  setCellYCoOrdinate(axisVal: string) {
    this.cellYCoordinate = new BehaviorSubject(axisVal);
    this.cellYCoordinateSource.next(axisVal);
  }
  setHomePageVisible(val: boolean){
    this.showHomePage.next(val);
  }
  disableContext() {
    this.showContext = false;
    this.cellYCoordinateSource.next("");
  }
  setValidation(data: string) {
    this.onValidationApply.next(data);
  }
  ApplyAsCellSelected(cell) {
    if(!cell.classList.contains('cell-selected')) {
      cell.classList.add("cell-selected");
    }
  }
  ApplyAsNotCellSelected(cell) {
    if(cell.classList.contains('cell-selected')) {
      cell.classList.remove("cell-selected");
    }
  }  
  ApplyAsSelected(cell) {
    if(!cell.classList.contains('selected')) {
      cell.classList.add("selected");
    }
  }
  ApplyAsNotSelected(cell) {
    if(cell.classList.contains('selected')) {
      cell.classList.remove("selected");
    }
  }
  ResetCellDataAttributes(cell) {
    cell.classList.remove("cell-selected");
    cell.setAttribute("data-cellType","");
    cell.setAttribute("data-validationsMetadata","");    
    cell.setAttribute("data-formattedHTML","");
    cell.setAttribute("data-tooltipText","");
    cell.style["borderColor"] ="";
    cell.style.border ="";
    cell.style.backgroundColor ="";
    cell.style.backgroundColor  = this.resetToDefaultCellColor(cell);
  }
  static get constants() {
    return constants;
  }
  resetToDefaultCellColor(cell) {
     switch (cell.getAttribute('cellType')) {
         case  "CALC" :
           return "#E3ECFF";                      
         case "INPUT":
           return "#FFFFE0";           
         default:
           break;
       }             
  }
  updateChanges()
  {
      this.saveChanges.next(true);
  }
  registerSubscription(tableName) {
      var sessionStore = new SessionStorageService();
      var activeTablesForSubscription = sessionStore.getItem('activeTables');
      sessionStore.setItem('activeTables',activeTablesForSubscription + `;${tableName}`);
  }
}
