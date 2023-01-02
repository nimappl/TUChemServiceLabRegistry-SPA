import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from "@angular/forms";

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
    InstrumentFormComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
