import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstrumentComponent } from "./forms/instrument/instrument.component";
import {PersonComponent} from "./forms/person/person.component";
import {EduGroupComponent} from "./forms/edu-group/edu-group.component";
import {EduFieldComponent} from "./forms/edu-field/edu-field.component";
import {TestComponent} from "./forms/test/test.component";
import {DiscountComponent} from "./forms/discount/discount.component";
import {ProfessorGrantComponent} from "./forms/professor-grant/professor-grant.component";
import {UsedMaterialComponent} from "./forms/used-material/used-material.component";
import {OrganizationComponent} from "./forms/organization/organization.component";
import {ServiceComponent} from "./forms/service/service.component";
import {PaymentComponent} from "./forms/payment/payment.component";

const routes: Routes = [
  { path: 'instrument', component: InstrumentComponent },
  { path: 'used-material', component: UsedMaterialComponent },
  { path: 'person', component: PersonComponent },
  { path: 'organization', component: OrganizationComponent },
  { path: 'edu-group', component: EduGroupComponent },
  { path: 'edu-field', component: EduFieldComponent },
  { path: 'test', component: TestComponent },
  { path: 'discount', component: DiscountComponent },
  { path: 'professor-grant', component: ProfessorGrantComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'payment', component: PaymentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
