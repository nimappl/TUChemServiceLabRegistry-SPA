import {Component, Inject} from '@angular/core';
import swal from "sweetalert";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PersonGeneral} from "../../../model";
import {PersonService} from "../../../services/person.service";

@Component({
  selector: 'app-delete-person-form',
  templateUrl: './delete-person-form.component.html',
  styleUrls: ['./delete-person-form.component.css']
})
export class DeletePersonFormComponent {
  submitted: boolean = false;
  reachingOut: boolean = false;
  all: boolean = false
  typeLab: boolean = false;
  typeProf: boolean = false;
  typeStdn: boolean = false;
  typeOrg: boolean = false;

  constructor(private dialogRef: MatDialogRef<DeletePersonFormComponent>,
              @Inject(MAT_DIALOG_DATA) public person: PersonGeneral,
              private personService: PersonService) {}

  onSelectAll() {
    this.typeLab = this.all;
    this.typeProf = this.all;
    this.typeStdn = this.all;
    this.typeOrg = this.all;
  }

  onSend() {
    swal({
      title: 'حذف',
      text: `آیا از حذف "${this.person.firstName} ${this.person.lastName}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.reachingOut = true;
        this.personService.delete(this.person.id, this.all, this.typeLab, this.typeProf, this.typeStdn, this.typeOrg).subscribe(res => {
          this.reachingOut = false;
          this.submitted = true;
          swal({title: 'موفق', text: `عملیات حذف انجام شد.`, icon: 'success'});
          this.dialogRef.close(this.submitted);
        }, err => {
          this.reachingOut = false;
          swal({title: 'ناموفق', icon: 'error'});
        });
      }
    });
  }
}
