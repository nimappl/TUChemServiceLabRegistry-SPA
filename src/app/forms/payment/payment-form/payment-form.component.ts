import {Component, Inject, ViewChild} from '@angular/core';
import {CustomFieldData} from "../../../custom-fields/custom-field-data";
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Account, Data, Filter, Payment, TUProfessor} from "../../../model";
import {PaymentService} from "../../../services/payment.service";
import swal from "sweetalert";
import {AccountService} from "../../../services/account.service";
import {ProfessorService} from "../../../services/professor.service";

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  typeOptions: CustomFieldData = new CustomFieldData();
  cashTypeOptions: CustomFieldData = new CustomFieldData();
  dateOptions: CustomFieldData = new CustomFieldData();
  profOptions: CustomFieldData = new CustomFieldData();
  accountOptions: CustomFieldData = new CustomFieldData();
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<PaymentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Payment,
    private paymentService: PaymentService,
    private professorService: ProfessorService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.mode = (!this.data.id ? 0 : 1);
    this.title = (!this.data.id ? 'جدید' : 'ویرایش');

    this.dateOptions.label = 'تاریخ';
    this.cashTypeOptions.label = 'نوع پرداخت نقدی';
    this.typeOptions.label = 'نوع';
    this.profOptions.label = 'گرنت';
    this.accountOptions.label = 'متقاضی';
    this.typeOptions.options = [
      {value: 0, title: 'نقدی'},
      {value: 1, title: 'گرنت اساتید'},
      {value: 2, title: 'اعتبار شبکه آزمایشگاهی'}
    ];
    this.cashTypeOptions.options = [
      {value: 0, title: 'کارت اعتباری'},
      {value: 1, title: 'آنلاین'},
      {value: 2, title: 'نقد'},
      {value: 3, title: 'چک'}
    ];
    if (this.mode === 1) {
      setTimeout(() => this.accountOptions.searchText = this.data.account.getCustomerName(), 200);
      if (this.data.type === 1)
        setTimeout(() =>
          this.profOptions.searchText = this.data.grantProfessor.firstName + ' ' + this.data.grantProfessor.lastName,
          200);
    }
  }

  getProfOptions() {
    let options = new Data<TUProfessor>();
    this.profOptions.options = [];
    options.pageSize = null;
    options.filters.push(new Filter('PLastName', this.profOptions.searchText));
    console.log(options)
    this.profOptions.loading = true;
    this.profOptions.loadingFailed = false;
    this.professorService.get(options).subscribe(res => {
      this.profOptions.loading = false;
      res.records.forEach(prof => {
        this.profOptions.options.push({
          value: prof.id,
          title: `${prof.firstName} ${prof.lastName}, گروه ${prof.eduGroup.name}`,
          fieldValue: `${prof.firstName} ${prof.lastName}`,
          data: prof
        });
      })
    }, err => {
      this.profOptions.loading = false;
      this.profOptions.loadingFailed = true;
    });
  }

  getAccountOptions() {
    console.log(this.accountOptions)
    this.accountOptions.options = [];
    this.accountOptions.loading = true;
    this.accountOptions.loadingFailed = false
    this.accountService.getOptions(this.accountOptions.searchText).subscribe(res => {
      this.accountOptions.loading = false;
      res.forEach(acc => {
        this.accountOptions.options.push({
          value: acc.id,
          title: acc.customerName + (acc.nationalNumber ? '، کد ملی: ' + acc.nationalNumber : ''),
          fieldValue: acc.customerName,
          data: acc
        });
      });
    }, err => {
      this.accountOptions.loading = false;
      this.accountOptions.loadingFailed = true;
    });
  }

  onSubmit() {
    console.log(this.data);
    if (this.form.valid) this.submit();
  }

  submit() {
    this.reachingOut = true;
    if (this.mode === 0) {
      this.paymentService.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `پرداخت جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(this.submitted)
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    } else {
      this.paymentService.update(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `عملیات بروزرسانی با موفقیت انجام شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(this.submitted)
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    }
  }
}
