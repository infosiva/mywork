import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'ng2-bootstrap';
import { PopoverModule,  PopoverConfig } from 'ng2-bootstrap';
import { TooltipModule, TooltipConfig } from 'ng2-bootstrap';
//import { CustomErrorHandler } from './shared/errorHandling/custom-error-handler';
//import { AccordionModule, AccordionConfig } from 'ng2-bootstrap';
import { CompanyInternalValidationComponent } from '../app/companyInternal/company-internal-validation.component';
import { BaseDataCollectionComponent } from '../app/shared/components/base-data-collection.component';
import { ContextMenuComponent } from '../app/shared/components/context-menu.component';
import { DataCollectionService } from '../app/shared/services/data-collection.service';
import { Spreadsheet } from '../app/shared/components/spreadsheet.component';
import { SharedService } from '../app/shared/services/shared.service';
import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';
import { MODEL_API_URL } from '../app/shared/constants/shared.constants';
import { NgReduxModule } from 'ng2-redux';
import { Actions } from '../app/store/actions';
import { AppStore } from '../app/store/app.store';
//import { enableProdMode } from '@angular/core'
import { LocalStorageService } from '../app/shared/services/local-storage.service';
import { SessionStorageService } from '../app/shared/services/session-storage.service';
import { NotifyService } from '../app/shared/services/notify.service'; 

@NgModule({
  declarations: [ AppComponent, CompanyInternalValidationComponent, ContextMenuComponent, Spreadsheet, BaseDataCollectionComponent],  
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ModalModule.forRoot(), 
    TooltipModule.forRoot(),
    //AccordionModule.forRoot(),  
    PopoverModule, 
    NgReduxModule
  ],
  providers: 
            [
              SharedService, DataCollectionService, Actions, 
              PopoverConfig, TooltipConfig, //AccordionConfig,
              LocalStorageService, SessionStorageService,NotifyService,
              AppStore,
              { provide: APP_BASE_HREF, useValue: '/' },
              { provide: MODEL_API_URL, useValue: MODEL_API_URL }
              /*{
                 provide: ErrorHandler, 
                 useClass: CustomErrorHandler 
              }*/
            ],
  bootstrap: [ AppComponent ]
  })
export class AppModule { }
