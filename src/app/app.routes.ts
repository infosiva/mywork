import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyInternalValidationComponent } from '../app/companyInternal/company-internal-validation.component';
export const routes: Routes = [
	{path: '', pathMatch:'full', component: CompanyInternalValidationComponent}
]
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);