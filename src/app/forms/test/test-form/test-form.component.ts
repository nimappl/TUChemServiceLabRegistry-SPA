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
import {TestFeeType} from "../../../model/enums/test-fee-type";

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
  discountTableConfig = new TableConfig(0);
  discountOptions = new CustomFieldData();
  selectedDiscount: Discount = null;
  selectedDiscountIndex: number;
  @ViewChild('f') form: NgForm;
  instrumentServiceability = Instrument.getServiceability;

  constructor(
    private dialogRef: MatDialogRef<TestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Test,
    private testApiSrv: TestService,
    private instrumentService: InstrumentService,
    private discountService: DiscountService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';

    if (!this.data.fees || this.data.fees.length == 0) this.data.fees = [new TestFee()];
    if (!this.data.samplePreparations) this.data.samplePreparations = [];
    if (!this.data.discounts) this.data.discounts = [];
    this.instOptions.label = 'دستگاه';
    this.statusOptions.label = 'فعال/غیرفعال';
    this.discountOptions.label = 'انتخاب تخفیف'
    this.statusOptions.options = [
      {value: 0, title: 'غیر فعال'},
      {value: 1, title: 'فعال'}
    ];
    this.data.fees.forEach(fee => {
      let options: CustomFieldData = new CustomFieldData();
      options.label = 'مبنای تعرفه';
      options.options = [
        {value: TestFeeType.perSample, title: 'تعداد نمونه'},
        {value: TestFeeType.perTestTime, title: 'زمان آزمون'}
      ];
      this.feeTypeOptions.push(options);
    });
    this.discountData.records = this.data.discounts;
    this.discountTableConfig.hasDelete = true;
    this.discountTableConfig.columns = [
      {for: 'getType', dbName: 'TDType', title: 'عنوان', sortable: false, hasSearch: false, isFunction: true},
      {for: 'percent', dbName: 'TDPercent', title: 'درصد', sortable: false, hasSearch: false}
    ];

    this.getInstrumentOptions();
    this.getDiscountOptions();
  }

  getInstrumentOptions() {
    this.instOptions.loading = true;
    let params: Data<Instrument> = new Data();
    params.pageSize = 100;
    this.instrumentService.get(params).subscribe(res => {
      this.instOptions.loading = false;
      res.records.forEach(instrument =>
        this.instOptions.options.push({
          value: instrument.id,
          title: instrument.name + (instrument.model ?  ' (مدل ' + instrument.model + ')' : '')
        })
      );
    }, err => {
      this.instOptions.loading = false;
      this.instOptions.loadingFailed = true;
    });
  }

  getDiscountOptions() {
    this.discountOptions.loading = true;
    let params: Data<Discount> = new Data();
    params.pageSize = null;
    this.discountService.get(params).subscribe(res => {
      this.discountOptions.loading = false;
      res.records.forEach(discnt => {
        discnt = new Discount(discnt);
        let isInList = false;
        for (let discntInList of this.data.discounts) {
          if (discntInList.id === discnt.id) {
            isInList = true;
            break;
          }
        }
        if (!isInList) {
          this.discountOptions.options.push({
            value: discnt.id,
            title: `${discnt.getType()}، ${discnt.percent} درصد`
          });
        }
      });
    }, err => {
      this.discountOptions.loading = false;
      this.discountOptions.loadingFailed = true;
    });
  }

  onAddFee() {
    let newFee = new TestFee();
    let options: CustomFieldData = new CustomFieldData();

    newFee.testId = this.data.id;
    options.label = 'مبنای تعرفه';
    options.options = [
      {value: TestFeeType.perSample, title: 'تعداد نمونه'},
      {value: TestFeeType.perTestTime, title: 'زمان آزمون'}
    ];
    this.data.fees.push(newFee);
    this.feeTypeOptions.push(options);
  }

  onAddPrep() {
    let newPrep = new TestPrep();
    newPrep.testId = this.data.id;
    this.data.samplePreparations.push(newPrep);
  }

  onSelectDiscount(index: number) {
    this.selectedDiscountIndex = index;
    this.discountService.getById(this.discountOptions.selectedValue).subscribe( res => {
      this.selectedDiscount = new Discount(res);
    });
  }

  onSelectInstrument() {
    this.instrumentService.getById(this.instOptions.selectedValue).subscribe(res => {
      this.data.instrument = res;
      this.data.tActive = res.serviceable;
    })
  }

  onAddDiscount() {
    this.discountOptions.options.splice(this.selectedDiscountIndex, 1);
    this.data.discounts.push(this.selectedDiscount);
    this.selectedDiscount = null;
    this.discountOptions.selectedValue = null;
    this.selectedDiscountIndex = null;
  }

  onRemoveFee(index: number) {
    this.feeTypeOptions.splice(index, 1);
    this.data.fees.splice(index, 1);
  }

  onRemovePrep(index: number) {
    this.data.samplePreparations.splice(index, 1);
  }

  onRemoveDiscount(index: number) {
    this.discountOptions.options.push({
      value: this.data.discounts[index].id,
      title: this.data.discounts[index].getType() + '، ' + this.data.discounts[index].percent + ' درصد'
    });
    this.data.discounts.splice(index, 1);
  }

  onSubmit() {
    console.log(this.data)
    if (this.form.valid && this.data.fees.length != 0) this.submit();
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
