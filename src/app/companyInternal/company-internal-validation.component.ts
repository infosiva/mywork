import { Component, Input, HostListener, ViewChild, NgZone } from '@angular/core';
import { DataCollectionService } from '../shared/services/data-collection.service';
import { SharedService } from '../shared/services/shared.service';
import { SpreadsheetModel } from '../shared/models/spreadsheet.model';
import { BaseDataCollectionComponent } from '../shared/components/base-data-collection.component'
import { Subscription } from 'rxjs/Subscription'
import { ActivatedRoute, Params } from '@angular/router';
import { Actions } from '../../app/store/actions';
import { AppStore } from '../../app/store/app.store';
import { LocalStorageService } from '../../app/shared/services/local-storage.service';
import { SessionStorageService } from '../../app/shared/services/session-storage.service';
import { storageConstants } from '../../app/shared/constants/shared.constants';
import { NotifyService } from '../../app/shared/services/notify.service'; 

@Component ({
    //moduleId: module.id,
    selector: 'company-internal-validation',
    templateUrl: 'company-internal-validation.component.html',
    styles: ['.modal-lg { width: 100%;height: 100%; margin-top: 0px !important; margin-left: 5px !important; }'],
    providers: [ Actions ]
})
export class CompanyInternalValidationComponent extends BaseDataCollectionComponent  {
  @Input('model') model = new SpreadsheetModel();
  modelSubscription : Subscription;
  validationSubscription: Subscription;
  tableName: string;
  redirectUrl: string;
  show: boolean = true;  
  showJson : boolean = false; 
  jsonData : string
  @ViewChild("pageModal") pageModal;
  connection;
  messages = [];
    message;
  constructor(dataCollectionService: DataCollectionService, sharedService: SharedService, 
     private localStorageService : LocalStorageService ,
     private sessionStorageService : SessionStorageService ,
     private appstore: AppStore,
     actions: Actions , 
     private activatedRoute : ActivatedRoute,
     private notifyService : NotifyService,
     private ngZone: NgZone)
   {
    super(dataCollectionService, sharedService);
    this.modelSubscription = dataCollectionService.readonlyDataModel.subscribe(model => {
      this.model = model;
      let unalteredModel = dataCollectionService.unalteredReadonlymodel;
      this.appstore.ngRedux.dispatch({type: Actions.UPSERT_JSONPAYLOAD, payload: JSON.stringify(unalteredModel)});        
      //this.tableName = unalteredModel.METADATA.NAME;
      this.activatedRoute.queryParams.subscribe((params: Params) => {        
        this.appstore.ngRedux.dispatch({type: Actions.UPSERT_MODELID, payload: JSON.stringify(params['modelId'])});  
        this.appstore.ngRedux.dispatch({type: Actions.UPSERT_TABLEID, payload: JSON.stringify(params['tableId'])});         
        this.redirectUrl = params['redirectUrl'];      
      }); 
    });
    this.connection = this.notifyService.getMessages().subscribe(message => {
      this.messages.push(message);
      //alert('new update on server');
      //this.ngZone.run(() => {
        const self = this.sessionStorageService.getItem('self');
        if(!self && confirm('data changed on the server - do you want to refresh?')) {
         this.instantUIUpdate(this.localStorageService.getItem(storageConstants.validationModeStorageKey));         
        }        
      //});
      })
    this.validationSubscription = this.sharedService.onValidationApply.subscribe(appliedData => this.onValidationApply(appliedData));
  }
  ngDoCheck() {
    try {

      if(SharedService.domLoaded && !SharedService.compProcessed) {    
        debugger;
      if(this.pageModal!==undefined) {
        this.pageModal.show();
    // reloaded from local storage if there is any unsubmitted data's.
      let localStoragejsonPayload = this.localStorageService.getItem(storageConstants.validationModeStorageKey);
      if(localStoragejsonPayload) {
          this.instantUIUpdate(localStoragejsonPayload);
      }
      SharedService.compProcessed=true;    
      }
    }
    }
    catch(ex) {
      SharedService.compProcessed=true;     
    }    
  }
  @HostListener('document:click',['$event']) handleClick() {
        this.outsideClick();
  }
  @HostListener('contextmenu',['$event']) handleRightClick(mouseEvent: MouseEvent) {
      this.rightClickEvent(mouseEvent);
  }
  rightClickEvent(event: MouseEvent) {
    this.sharedService.setCellXCoOrdinate((event.clientX - 50).toString());
    this.sharedService.setCellYCoOrdinate((event.clientY - 50).toString());
    event.preventDefault();
  }
  outsideClick() {
    this.sharedService.disableContext();
  }  
  ngOnDestroy() {
    this.modelSubscription.unsubscribe();
    this.validationSubscription.unsubscribe();
    this.connection.unsubscribe();
  }
  onValidationApply(arg) {    
    super.onValidationApply(arg);
    this.updateAppStore();
    this.sessionStorageService.setItem('self','true');
    //this.notifyService.sendMessage(this.message);
  }
  onSubmit(flag)
  {   
      if(flag) {   
        this.updateAppStore();
      }
      if(this.redirectUrl) {
        window.location.href = this.redirectUrl;
      }
        //this.chatService.sendMessage(this.message);
        this.message = '';
        alert('submitted...');
        /* TODO:clear local storage items */
        //this.localStorageService.removeItem(storageConstants.validationModeStorageKey);
        this.notifyService.sendMessage(this.message);
  }
  onModalOpen(event) {
     //event._element.nativeElement.width ='100px';
  }
  updateAppStore() {
      let jsonPayload = (<any>this.appstore.ngRedux.getState()).state.jsonPayload;
      this.updateJSON(jsonPayload);
      this.sharedService.updateChanges();
  } 
  instantUIUpdate(jsonData)
  {
    let parsedData = JSON.parse(jsonData);
    let res = [];
    let temp = this.filterJSON(parsedData.TABLE.SECTIONS, res);
    let hasJSONmodified: Boolean = false;
     Array.from(res).forEach((cell) => {
           var eachCellSelected = <HTMLElement> (document.querySelector(`label[data-uniqueid='${cell.ID}']`));
           //const cell = document.getElementById(eachCellSelected.ID);
           //const cellUniqueId = cell.getAttribute('data-uniqueId');
                if(eachCellSelected) {
                //hasJSONmodified = true;
                eachCellSelected.setAttribute('data-validationsMetadata',cell.VALIDATIONS);
                //storing extra cell value for maintaining the state for unsubmitted data's on the next visit.
                eachCellSelected.setAttribute('data-cellType',cell.cellType);
                eachCellSelected.style.backgroundColor = cell.backgroundColor;
                eachCellSelected.setAttribute('data-formattedHTML', cell.formattedHTML);
                eachCellSelected.setAttribute('data-tooltipText', cell.tooltipText);
               }           
  });
}

filterJSON(json,res) {
  json.filter(function(sections){
      sections.ROWS.filter(function(rows){
        rows.CELLS.filter(function(cells){
            if(cells.VALIDATIONS!==null) {
               res.push(cells);  
            };
          })
      })
  })
}

  updateJSON(jsonData)
  {    
    let parsedData = JSON.parse(jsonData);
    let hasJSONmodified: Boolean = false;
     Array.from(document.querySelectorAll('label[data-validationsMetadata]')).forEach((eachCellSelected) => {
           const cell = document.getElementById(eachCellSelected.id);
           const cellUniqueId = cell.getAttribute('data-uniqueId');
           parsedData.TABLE.SECTIONS.forEach(eachsection =>
           eachsection.ROWS.filter(function(eachRow, idx) {
              eachRow.CELLS.filter(function(eachCell){
                  if(eachCell.ID.toString() === cellUniqueId.toString()) {
                    if(cell.getAttribute("data-validationsMetadata")) {
                        hasJSONmodified = true;
                        eachCell.VALIDATIONS= cell.getAttribute("data-validationsMetadata");
                        //storing extra cell value for maintaining the state for unsubmitted data's on the next visit.
                        eachCell.cellType = cell.getAttribute("data-cellType");
                        eachCell.backgroundColor = cell.style.backgroundColor;
                        eachCell.formattedHTML = cell.getAttribute('data-formattedHTML');
                        eachCell.tooltipText = cell.getAttribute('data-tooltipText');
                    }
                  }
              })
           }));
    });
    //if(hasJSONmodified)
    //{
      this.appstore.ngRedux.dispatch({type: Actions.UPSERT_JSONPAYLOAD, payload: JSON.stringify(parsedData)});  
      this.jsonData = (<any>this.appstore.ngRedux.getState()).state.jsonPayload;
      this.localStorageService.setItem(storageConstants.validationModeStorageKey,this.jsonData);
    //}
  }
}
