import {Component, Inject, ViewChild} from '@angular/core';
import {CustomFieldData} from "../../../custom-fields/custom-field-data";
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Data, Discount, Instrument, Test, TestFee, TestPrep} from "../../../model";
import {TestService} from "../../../services/test.service";
import swal from "sweetalert";
import {InstrumentService} from "../../../services/instrument.service";
import {TableConfig} from "../../../data-table/table-config";
import {DiscountService} from "../../../services/discount.service";

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  statusOptions: CustomFieldData = new CustomFieldData();
  instOptions: CustomFieldData = new CustomFieldData();
  feeTypeOptions: Array<CustomFieldData> = [];
  discountData = new Data<Discount>();
  discountTableConfig = new TableConfig();
  discountOptions = new CustomFieldData();
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<TestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Test,
    private testApiSrv: TestService,
    private instrumentApiSrv: InstrumentService,
    private discountApiSrv: DiscountService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';

    this.instOptions.label = 'دستگاه';
    this.statusOptions.label = 'فعال/غیرفعال';
    this.discountOptions.label = 'انتخاب تخفیف'
    this.statusOptions.options = [
      {value: 0, title: 'غیر فعال'},
      {value: 1, title: 'فعال'}
    ];

    if (this.mode == 1) {
      this.data.fees.forEach(fee => {
        let options: CustomFieldData = new CustomFieldData();
        options.label = 'مبنای تعرفه';
        options.options = [
          {value: 0, title: 'تعداد نمونه'},
          {value: 1, title: 'زمان (دقیقه)'}
        ];
        this.feeTypeOptions.push(options);
      });
    }

    if (!this.data.discounts) this.data.discounts = [];
    this.discountData.records = this.data.discounts;
    this.discountTableConfig.sortable = true;
    this.discountTableConfig.hasDelete = true;
    this.discountTableConfig.hasEdit = false;
    this.discountTableConfig.hasActivationCol = false;
    this.discountTableConfig.hasPagination = false;
    this.discountTableConfig.showSearch = false;
    this.discountTableConfig.columns = [
      {for: 'name', dbName: 'TDName', title: 'عنوان', sortable: false, hasSearch: false},
      {for: 'percent', dbName: 'TDPercent', title: 'درصد', sortable: false, hasSearch: false},
      {for: 'minSamples', dbName: 'TDMinSamples', title: 'حداقل نمونه', sortable: false, hasSearch: false}
    ];

    this.getInstrumentOptions();
    this.getDiscountOptions();
  }

  getInstrumentOptions() {
    this.instOptions.loading = true;
    let params: Data<Instrument> = new Data();
    params.pageSize = 100;
    this.instrumentApiSrv.get(params).subscribe(res => {
      this.instOptions.loading = false;
      res.records.forEach(instrument =>
        this.instOptions.options.push({value: instrument.id, title: instrument.name})
      );
    }, err => {
      this.instOptions.loading = false;
      this.instOptions.loadingFailed = true;
    });
  }

  getDiscountOptions() {
    this.discountOptions.loading = true;
    let params: Data<Discount> = new Data();
    params.pageSize = 100;
    this.discountApiSrv.get(params).subscribe(res => {
      this.discountOptions.loading = false;
      res.records.forEach(discnt =>
        this.discountOptions.options.push({value: discnt.id, title: `${Discount.getType(discnt.type)}، ${discnt.name}، ${discnt.percent} درصد`})
      );
    }, err => {
      this.discountOptions.loading = false;
      this.discountOptions.loadingFailed = true;
    });
  }

  onAddFee() {
    if (!this.data.fees) this.data.fees = [];
    let newFee = new TestFee();
    let options: CustomFieldData = new CustomFieldData();

    newFee.testId = this.data.id;
    options.label = 'مبنای تعرفه';
    options.options = [
      {value: 0, title: 'تعداد نمونه'},
      {value: 1, title: 'زمان (دقیقه)'}
    ];
    this.data.fees.push(newFee);
    this.feeTypeOptions.push(options);
  }

  onAddPrep() {
    if (!this.data.samplePreparations) this.data.samplePreparations = [];
    let newPrep = new TestPrep();
    newPrep.testId = this.data.id;
    this.data.samplePreparations.push(newPrep);
  }

  onAddDiscount() {
    this.discountApiSrv.getById(this.discountOptions.selectedValue).subscribe(res => {
      this.data.discounts.push(res);
      this.discountOptions.selectedValue = null;
    }, error => {
      swal({title: 'ناموفق', icon: 'error'});
    });
  }

  onRemoveFee(index: number) {
    this.feeTypeOptions.splice(index, 1);
    this.data.fees.splice(index, 1);
  }

  onRemovePrep(index: number) {
    this.data.samplePreparations.splice(index, 1);
  }

  onRemoveDiscount(index: number) {
    this.data.discounts.splice(index, 1);
  }

  onSubmit() {
    this.submit();
  }

  submit() {
    this.reachingOut = true;
    if (this.mode === 0) {
      this.testApiSrv.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `آزمون جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(this.submitted)
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    } else {
      this.testApiSrv.update(this.data).subscribe(res => {
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
