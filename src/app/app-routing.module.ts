import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstrumentComponent } from "./forms/instrument/instrument.component";
import {StudentComponent} from "./forms/student/student.component";
import {LabPersonnelComponent} from "./forms/lab-personnel/lab-personnel.component";
import {PersonComponent} from "./forms/person/person.component";
import {EduGroupComponent} from "./forms/edu-group/edu-group.component";
import {EduFieldComponent} from "./forms/edu-field/edu-field.component";
import {TestComponent} from "./forms/test/test.component";
import {DiscountComponent} from "./forms/discount/discount.component";
import {ProfessorComponent} from "./forms/professor/professor.component";
import {ProfessorGrantComponent} from "./forms/professor-grant/professor-grant.component";

const routes: Routes = [
  { path: 'instrument', component: InstrumentComponent },
  { path: 'student', component: StudentComponent },
  { path: 'lab-personnel', component: LabPersonnelComponent },
  { path: 'person', component: PersonComponent },
  { path: 'edu-group', component: EduGroupComponent },
  { path: 'edu-field', component: EduFieldComponent },
  { path: 'test', component: TestComponent },
  { path: 'discount', component: DiscountComponent },
  { path: 'professor', component: ProfessorComponent },
  { path: 'professor-grant', component: ProfessorGrantComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
