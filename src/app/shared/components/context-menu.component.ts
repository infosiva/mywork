import { Component, EventEmitter,Output, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { SharedService } from '../services/shared.service';
import { utilities } from '../utilities/utilities';
import { constants } from '../constants/shared.constants'
@Component ({
	//moduleId: module.id,
	templateUrl: 'context-menu.component.html',
	selector : 'context-menu',
	styles: [
				'.context-menu {  padding: 12px 0; background-color: #fff;  border: solid 1px #dfdfdf;  box-shadow: 1px 1px 2px #cfcfcf;}',
				'.context-menu__items {  list-style: none;  margin: 0;  padding: 0;}',
				'.context-menu__item {  display: block;  margin-bottom: 4px;}',
				'.context-menu__item:last-child {  margin-bottom: 0;}',
				'.context-menu__link {  display: block;  padding: 4px 12px;  color: #0066aa;  text-decoration: none;}',
				'.context-menu__link:hover {  color: #fff;  background-color: #0066aa;}',
				'.context-menu--active {  display: block;}'
			]
})
export class ContextMenuComponent implements OnDestroy {
	contextMenuOptions = constants.companyInternalRightClickMenuOptions	
	public isVisible: boolean = false;
	subscription: Subscription;
	private mouseLocation : {left: number, top: number} = {left:0, top:0};
	@Output('OnValidationApply') onApply = new EventEmitter<string>();
	validationDataJSON = "";
	rightClickevent;
	@ViewChild("lgModal") lgModal;
	@ViewChild("txtItem") txtItem;
	public isAllowVisible= true;
	public isDefaultTextVisible= false;
	public isDataVisible= false;
	public isMinVisible= false;
	public isMaxVisible= false;
	public isNumbericVisible=false;
	public isCustomListVisible=false;
	customLists = [];
	constructor(private sharedService: SharedService, public elementRef : ElementRef) {		
		 this.subscription = sharedService.cellYCoordinate$.subscribe (
	      mission => {      			
	      	if(mission) {  				
	      		this.mouseLocation.left	= parseInt(sharedService.cellXCoordinate.value);
				this.mouseLocation.top	= parseInt(sharedService.cellYCoordinate.value);
	        	this.validationDataJSON = "";
	    	}
	        this.isVisible = sharedService.showContext;
	    });
	}
	@HostListener('contextmenu',['$event']) handleRightClick(mouseEvent: MouseEvent) {
		event.stopPropagation();
  	}
	menuClick(link)	{		
			utilities.companySharingselectedMenuOption = link.DisplayText;
			if(link.DisplayText && link.DisplayModal) {				
				this.lgModal.show();
			}
			else {
				this.sharedService.setValidation(link.DisplayText);
			}
	}
	get locationCss() { 
	    return {
			 'position':'fixed',
			 'display': 'block',
			 'left': this.mouseLocation.left + 'px',
			 'top': this.mouseLocation.top + 'px',
			 'z-index': '1000',
			 'float': 'left',
			 'width': 'auto',
			 'padding':'5px 0',
			 'margin': '2px 0 0'
	    };
  	}
  	showMenu(event)	{
  		this.mouseLocation = {
  			left: event.clientX,
  			top: event.clientY
  		}
  	}
	initModal() {
		this.validationDataJSON = "";
	}	 
	fieldChange(ele, field, isInputField = false)	{
		switch (field) {
			case "allow":
				if(["WN","DE","DA"].indexOf(ele.selectedOptions[0].value)>=0) {
					this.isDefaultTextVisible = false;
					this.isDataVisible = true;
				} else if(ele.selectedOptions[0].value === "FT") {
					this.isDefaultTextVisible = true;
					this.isDataVisible = false;
					this.isNumbericVisible = false;
					this.isMinVisible = false;
					this.isMaxVisible = false;
					this.isCustomListVisible = false;
				} else if(ele.selectedOptions[0].value=="CL")
				{
					this.customLists = [];
					this.isDefaultTextVisible = false;
					this.isDataVisible = false;
					this.isNumbericVisible = false;
					this.isMinVisible = false;
					this.isMaxVisible = false;		
					this.isCustomListVisible = true;					
				} else {
					this.isDefaultTextVisible = false;
					this.isDataVisible = false;
					this.isNumbericVisible = false;
					this.isMinVisible = false;
					this.isMaxVisible = false;		
					this.isCustomListVisible = false;
				}
				break;
			case "data":
				if(["BE","NB"].indexOf(ele.selectedOptions[0].value) >= 0) {				
					this.isMinVisible = true;
					this.isMaxVisible = true;
					this.isNumbericVisible = false;
					this.isNumbericVisible = false;
					this.isCustomListVisible = false;
				} else if(ele.selectedOptions[0].value.length > 0) {
					this.isNumbericVisible = true;
					this.isMinVisible = false;
					this.isMaxVisible = false;
					this.isCustomListVisible = false;
				} else {
					this.isNumbericVisible = false;
					this.isMinVisible = false;
					this.isMaxVisible = false;
					this.isCustomListVisible = false;
				}
				break;
			default:
				break;
		}
	}
	closeModal(lgModal) {
		lgModal.hide();
		this.sharedService.disableContext();
	}
	onModalOpen(event) {
		/* (only for new ) */
		this.isMinVisible = false;
		this.isMaxVisible = false;
		this.isNumbericVisible = false;
		this.isDefaultTextVisible = false;
		this.isDataVisible = false;
		this.isCustomListVisible = false;
		this.customLists=[];		
		const elements = this.elementRef.nativeElement.querySelectorAll("select,input");
		for(let item of elements) {
			item.value = "";				
		}
	}
	Apply(lgModal) {
		let objArr = [];
		let tempObj = {};
		let elements = this.elementRef.nativeElement.querySelectorAll("input, select");
		for(let item of elements) {
				if(item.type === "checkbox" || item.type === "text" || item.type === "number") 
				{
					if(item.id=="txtItem")
					{
						if(this.customLists.length > 0) {
							tempObj = {};
							tempObj["key"]= item.name.toUpperCase();
							tempObj["value"] = this.customLists.toString().split(',').join('</br>');	
						}
					}
					else {
						if(item.type != "checkbox" && item.value.length === 0) 
						{ 
							continue;
						}
						tempObj = {};
						tempObj["key"]= item.name.toUpperCase();
						tempObj["value"] = item.type != "checkbox" ? item.value : item.checked.toString();
					}
				} 
				else 
				{
					if(item.value.length === 0) {
					 	continue;
					}
					tempObj = {};
					tempObj["key"] = item.name.toUpperCase();
					tempObj["value"] = item.selectedOptions[0].innerText + " : " + item.selectedOptions[0].value;
				}
				let isKeyExists = false;
				objArr.forEach((eachItem) => 
					{
						if (eachItem.key === item.name.toUpperCase())
						{
							isKeyExists = true;
							return;
						}
					});				
				if(!isKeyExists)
				{
					objArr.push(tempObj);
				}
		}
		if(objArr.length > 0)	{
			this.validationDataJSON = JSON.stringify(objArr);
			this.sharedService.setValidation(this.validationDataJSON);
			this.sharedService.disableContext();
		}
		lgModal.hide();
	}
	addCustomList(input) {
		if(this.customLists.indexOf(input.value) < 0) {
			this.customLists.push(input.value);
			input.value = '';
			input.focus();
		}
	}
	removeItem(item)
	{
		this.customLists.splice(this.customLists.indexOf(item),1);
	}
	ngOnDestroy() {
    this.subscription.unsubscribe();    
  }  
}
