import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ng2-bootstrap';
import { PopoverModule,  PopoverConfig } from 'ng2-bootstrap';
import { TooltipModule, TooltipConfig } from 'ng2-bootstrap';
import { CustomErrorHandler } from './shared/errorHandling/custom-error-handler';
import { AccordionModule, AccordionConfig } from 'ng2-bootstrap';
import { ComponentLoaderFactory} from 'ng2-bootstrap/component-loader';
import { CompanyInternalValidationComponent } from '../app/companyInternal/company-internal-validation.component';
import { BaseDataCollectionComponent } from '../app/shared/components/base-data-collection.component';
import { ContextMenuComponent } from '../app/shared/components/context-menu.component';
import { DataCollectionService } from '../app/shared/services/data-collection.service';
import { Spreadsheet } from '../app/shared/components/spreadsheet.component';
import { SharedService } from '../app/shared/services/shared.service';
import { NgReduxModule, DevToolsExtension } from '@angular-redux/store';
import { Actions } from '../app/store/actions';
import { routing } from './app.routes'
import { APP_BASE_HREF } from '@angular/common';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, CompanyInternalValidationComponent, ContextMenuComponent, Spreadsheet, BaseDataCollectionComponent],  
      imports: [
        routing,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
  //      NgbModule,
        ModalModule.forRoot(), 
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),  
        PopoverModule, 
        NgReduxModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/'}]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
