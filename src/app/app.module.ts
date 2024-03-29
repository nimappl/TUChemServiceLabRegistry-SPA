import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { JalaliDatePickerComponent } from './custom-fields/jalali-date-picker/jalali-date-picker.component';
import { SearchSelectComponent } from './custom-fields/search-select/search-select.component';
import { SelectComponent } from './custom-fields/select/select.component';
import { InstrumentComponent } from './forms/instrument/instrument.component';
import { LayoutComponent } from "./layout/layout.component";
import { SidebarComponent  } from "./layout/sidebar/sidebar.component";
import { HeaderComponent } from "./layout/header/header.component";
import { DataTableComponent } from "./data-table/data-table.component";
import { PaginationComponent } from "./data-table/pagination/pagination.component";
import { ProgressComponent } from './custom-fields/progress/progress.component';
import { LoadingSpinnerBarsComponent } from "./custom-fields/loading-spinner-bars/loading-spinner-bars.component";
import { InstrumentFormComponent } from './forms/instrument/instrument-form/instrument-form.component';
import { PersonComponent } from './forms/person/person.component';
import { PersonFormComponent } from './forms/person/person-form/person-form.component';
import { EduGroupComponent } from './forms/edu-group/edu-group.component';
import { EduFieldComponent } from './forms/edu-field/edu-field.component';
import { EduGroupFormComponent } from './forms/edu-group/edu-group-form/edu-group-form.component';
import { EduFieldFormComponent } from './forms/edu-field/edu-field-form/edu-field-form.component';
import { TestComponent } from './forms/test/test.component';
import { TestFormComponent } from './forms/test/test-form/test-form.component';
import { DiscountComponent } from './forms/discount/discount.component';
import { DiscountFormComponent } from './forms/discount/discount-form/discount-form.component';
import { ProfessorGrantComponent } from './forms/professor-grant/professor-grant.component';
import { ProfessorGrantFormComponent } from './forms/professor-grant/professor-grant-form/professor-grant-form.component';
import { UsedMaterialComponent } from './forms/used-material/used-material.component';
import { UsedMaterialFormComponent } from './forms/used-material/used-material-form/used-material-form.component';
import { OrganizationComponent } from './forms/organization/organization.component';
import { OrganizationFormComponent } from './forms/organization/organization-form/organization-form.component';
import { InstrumentMaintenanceFormComponent } from './forms/instrument/instrument-maintenance-form/instrument-maintenance-form.component';
import { DeletePersonFormComponent } from './forms/person/delete-person-form/delete-person-form.component';
import { ServiceComponent } from './forms/service/service.component';
import { ServiceFormComponent } from './forms/service/service-form/service-form.component';
import { PaymentComponent } from './forms/payment/payment.component';
import { PaymentFormComponent } from './forms/payment/payment-form/payment-form.component';
import { CustomerComponent } from './forms/customer/customer.component';

@NgModule({
  declarations: [
    AppComponent,
    JalaliDatePickerComponent,
    SearchSelectComponent,
    SelectComponent,
    ProgressComponent,
    LoadingSpinnerBarsComponent,
    LayoutComponent,
    DataTableComponent,
    PaginationComponent,
    SidebarComponent,
    HeaderComponent,
    LoginComponent,
    InstrumentComponent,
    InstrumentFormComponent,
    PersonComponent,
    PersonFormComponent,
    EduGroupComponent,
    EduFieldComponent,
    EduGroupFormComponent,
    EduFieldFormComponent,
    TestComponent,
    TestFormComponent,
    DiscountComponent,
    DiscountFormComponent,
    ProfessorGrantComponent,
    ProfessorGrantFormComponent,
    UsedMaterialComponent,
    UsedMaterialFormComponent,
    OrganizationComponent,
    OrganizationFormComponent,
    InstrumentMaintenanceFormComponent,
    DeletePersonFormComponent,
    ServiceComponent,
    ServiceFormComponent,
    PaymentComponent,
    PaymentFormComponent,
    CustomerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
