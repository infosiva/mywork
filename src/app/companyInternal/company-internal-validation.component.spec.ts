import { CompanyInternalValidationComponent } from 'app/companyInternal/company-internal-validation.component';
import { BaseDataCollectionComponent } from 'app/shared/components/base-data-collection.component';
import { ModalModule } from 'ng2-bootstrap';
import { PopoverModule,  PopoverConfig } from 'ng2-bootstrap';
import { TooltipModule, TooltipConfig } from 'ng2-bootstrap';
import { AccordionModule, AccordionConfig } from 'ng2-bootstrap';
import { NgReduxModule, NgRedux } from 'ng2-redux';
import { ContextMenuComponent } from 'app/shared/components/context-menu.component';
import { DataCollectionService } from 'app/shared/services/data-collection.service';
import { Spreadsheet } from 'app/shared/components/spreadsheet.component';
import { SharedService } from 'app/shared/services/shared.service';
import { AppComponent } from 'app/app.component'
import { routing } from 'app/app.routes'
import { APP_BASE_HREF } from '@angular/common';
import { ReflectiveInjector } from '@angular/core';
import { MODEL_API_URL } from 'app/shared/constants/shared.constants';
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule, XHRBackend, BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppState, rootReducer  } from 'app/store/';
import { AppModule } from 'app/app.module'
import { Actions } from 'app/store/actions'
import { AppStore } from 'app/store/app.store'
describe('companyInternalComp', ()=> {
	beforeAll(()=> {
		console.log('before all')
	});

	beforeEach (() => {
		debugger;
		//const ngRedux: NgRedux<{}> = new NgRedux(null);
		//ngRedux.configureStore(rootReducer, {});

		TestBed.configureTestingModule({
			declarations: [ AppComponent, CompanyInternalValidationComponent, ContextMenuComponent, Spreadsheet, BaseDataCollectionComponent],  
			imports: [
			routing,
			ModalModule.forRoot(), 
    		TooltipModule.forRoot(),
    		AccordionModule.forRoot(),  
    		PopoverModule, 
    		NgReduxModule,
    		HttpModule,
    		],
    		providers: 
    		[
    			//{ provider: NgRedux, useValue: ngRedux },
    			AppStore,
    			{ provide: APP_BASE_HREF, useValue: '/' },
    			{ provide: MODEL_API_URL, useValue: MODEL_API_URL },
    			{ provide: XHRBackend, useClass: MockBackend },
    			SharedService,
    			DataCollectionService,
    			Actions
    		]
		})		
		TestBed.compileComponents();
	});

	it('company internal comp must create without any err',
		inject([MODEL_API_URL, XHRBackend], (MODEL_API_URL, mockBackEnd: MockBackend) => {
		//var mockbackend = new MockBackend();
		const mockResponse = 
				{
						"SECTION_DETAILS": 
						{
							"display": true,
							"code": "CODE_SECTION_1",
							"useLineNumber": true,
							"useItemCode": true,
							"useItemDescription": true,
							"useUnit": true,
							"useYearCode": true,
							"useConfidenceGrades": false,
							"allowGroupSelection": false,
							"sectionType": "testSectionType",
							"itemCodeColumn": null
						},
						"ROWS": [
						{
							"ID": 1,
							"ROWNUMBER": 1,
							"ISHEADER": true,
							"CELLS": [{
								"ID": 1,
								"DISPLAYTEXT": "",
								"ISHEADER": true,
								"SECTIONID": 1,
								"ROWID": 1,
								"STARTCOLUMNID": 1,
								"CELLTYPE": "input",
								"VALIDATIONS": null,
								"SPAN": 1,
								"CONTENT": ""
								}]
						},
						{
							"ID": 2,
							"ROWNUMBER": 2,
							"ISHEADER": false,
							"CELLS": [{
								"ID": 11,
								"DISPLAYTEXT": "",
								"ISHEADER": true,
								"SECTIONID": 1,
								"ROWID": 2,
								"STARTCOLUMNID": 1,
								"CELLTYPE": "input",
								"VALIDATIONS": null,
								"SPAN": 1,
								"CONTENT": ""
						}]
					}]
				}
			mockBackEnd.connections.subscribe(
			(connection : MockConnection) => 
				{		
					connection.mockRespond(new Response(new ResponseOptions({
						body: JSON.stringify(mockResponse)
				})))
		})
		debugger;
		let fixture = TestBed.createComponent(CompanyInternalValidationComponent);		
		fixture.autoDetectChanges(true);
		let instance = fixture.componentInstance;
		var nativeEle = fixture.debugElement.nativeElement;
		var componentRedf = fixture.debugElement.injector;
		

		expect(instance).toBeTruthy();
		expect(instance.model).not.toBeNull;
		// as we consider the first row of the model always for the header so we dont bind them in the actual
		expect(instance.model.rows.length).toEqual(1);
		expect(instance.model.rowCount).toEqual(2);
		expect(instance.model.columnCount).toEqual(1);
		expect(instance.header.length).toEqual(1);

	}));
});
