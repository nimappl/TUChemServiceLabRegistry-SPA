import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import swal from "sweetalert";
import { InstrumentService } from "../../../services/instrument.service";
import {Data, Instrument, InstrumentOperator} from "../../../model";
import {CustomFieldData} from "../../../custom-fields/custom-field-data";
import {NgForm} from "@angular/forms";
import {TableConfig} from "../../../data-table/table-config";
import {DateConvertor} from "../../../custom-fields/jalali-date-picker/date-convertor";
import {PersonService} from "../../../services/person.service";

@Component({
  selector: 'app-instrument-form',
  templateUrl: './instrument-form.component.html',
  styleUrls: ['./instrument-form.component.css']
})
export class InstrumentFormComponent implements OnInit{
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  statusOptions: CustomFieldData = new CustomFieldData();
  genderOptions: CustomFieldData = new CustomFieldData();
  operatorTypeOptions: CustomFieldData = new CustomFieldData();
  dateOptions: CustomFieldData = new CustomFieldData();
  operatorSearchOptions: CustomFieldData = new CustomFieldData();
  operatorTableConfig: TableConfig = new TableConfig(0);
  operatorTableData: Data<InstrumentOperator> = new Data<InstrumentOperator>();
  pendingOperator: InstrumentOperator = new InstrumentOperator();
  operatorSelectedFromDB: boolean = false;
  showOperatorForm: boolean = false;
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<InstrumentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Instrument,
    private instrumentService: InstrumentService,
    private personService: PersonService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';

    this.statusOptions.label = 'وضعیت سرویس دهی';
    this.statusOptions.options = [
        {value: 0, title: 'غیرقابل استفاده'},
        {value: 1, title: 'آماده سرویس'}
    ];
    this.genderOptions.label = 'جنسیت';
    this.genderOptions.options = [
      {value: 0, title: 'مرد'},
      {value: 1, title: 'زن'}
    ];
    this.operatorSearchOptions.label = 'نام اپراتور';
    this.dateOptions.label = 'تاریخ تخصیص اپراتوری';
    this.operatorTypeOptions.label = 'نوع همکاری';
    this.operatorTypeOptions.options = [
      {value: 0, title: 'دائمی'},
      {value: 1, title: 'موقتی'}
    ];
    if (!this.data.operators) this.data.operators = [];
    this.operatorTableData.records = this.data.operators;
    this.operatorTableConfig.hasDelete = true;
    this.operatorTableConfig.columns = [
      {for: 'nationalNumber', title: 'کد ملی', dbName: 'PNationalNumber', hasSearch: false, sortable: false},
      {for: 'firstName', title: 'نام', dbName: 'PFirstName', hasSearch: false, sortable: false},
      {for: 'lastName', title: 'نام خانوادگی', dbName: 'PLastName', hasSearch: false, sortable: false},
      {for: 'designationDate', title: 'اپراتوری دستگاه از تاریخ', dbName: 'DesignationDate', hasSearch: false, sortable: false, transform: d => DateConvertor.dateStringToJalali(d)},
      {for: 'type', title: 'نوع همکاری', dbName: 'IOperatorType', hasSearch: false, sortable: false, transform: t => InstrumentOperator.getType(t)}
    ];
  }

  onSearchOperator() {
    this.operatorSearchOptions.options = [];
    this.operatorSearchOptions.loadingFailed = false;
    this.operatorSearchOptions.loading = true;
    this.instrumentService.getCandidateOperators(this.operatorSearchOptions.searchText).subscribe(res => {
      this.operatorSearchOptions.loading = false;
      res.forEach(candidate => {
        this.operatorSearchOptions.options.push({value: candidate.id, title: `${candidate.firstName} ${candidate.lastName}`, fieldValue: candidate.firstName});
      });
    }, err => {
      this.operatorSearchOptions.loading = false;
      this.operatorSearchOptions.loadingFailed = true;
    });
  }

  onSelectOperator() {
    this.personService.getById(this.operatorSearchOptions.selectedValue).subscribe(res => {
      this.pendingOperator.setPersonInfo(res);
    });
  }

  onAddOperator() {
    this.data.operators.push(this.pendingOperator);
    this.clearOperatorForm();
    this.showOperatorForm = false;
  }

  onRemoveOperator(index: number) {
    this.data.operators.splice(index, 1);
  }

  clearOperatorForm() {
    this.pendingOperator = new InstrumentOperator();
    this.operatorSearchOptions.selectedValue = null;
  }

  onSubmit() {
    if (this.form.valid) this.submit();
  }

  submit() {
    this.reachingOut = true;
    if (this.mode === 0) {
      this.instrumentService.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `دستگاه جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(this.submitted)
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    } else {
      this.instrumentService.update(this.data).subscribe(res => {
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
