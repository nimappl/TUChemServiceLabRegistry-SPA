import {Component, Inject, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  Account, CustomerCandidate, Data, Discount, EduField, EduGroup, Filter,
  PersonGeneral, Service, Test, TestFee, TestPrep
} from "../../../model";
import {ServiceService} from "../../../services/service.service";
import swal from "sweetalert";
import {CustomFieldData} from "../../../custom-fields/custom-field-data";
import {OrganizationService} from "../../../services/organization.service";
import {PersonService} from "../../../services/person.service";
import {TestService} from "../../../services/test.service";
import {DiscountService} from "../../../services/discount.service";
import {CustomerType} from "../../../model/enums/customer-type";
import {EduGroupService} from "../../../services/edu-group.service";
import {EduFieldService} from "../../../services/edu-field.service";
import {AccountService} from "../../../services/account.service";
import {EduGroupFormComponent} from "../../edu-group/edu-group-form/edu-group-form.component";
import {EduFieldFormComponent} from "../../edu-field/edu-field-form/edu-field-form.component";

enum origin { user, code }

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  hasPrep: boolean = false;
  dateOptions: CustomFieldData = new CustomFieldData();
  genderOptions: CustomFieldData = new CustomFieldData();
  testOptions: CustomFieldData = new CustomFieldData();
  testFeeOptions: CustomFieldData = new CustomFieldData();
  hasPrepOptions: CustomFieldData = new CustomFieldData();
  personnelOptions: CustomFieldData = new CustomFieldData();
  customerOptions: CustomFieldData = new CustomFieldData();
  customerTypeOptions: CustomFieldData = new CustomFieldData();
  eduLevelOptions: CustomFieldData = new CustomFieldData();
  eduGroupOptions: CustomFieldData = new CustomFieldData();
  eduFieldOptions: CustomFieldData = new CustomFieldData();
  selectedCustomerIndex: number;
  customDiscount: boolean = false;
  discounts: Array<{included: boolean, discount: Discount}> = [];
  samplePreps: Array<{included: boolean, prep: TestPrep}> = [];
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<ServiceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Service,
    private serviceService: ServiceService,
    private personService: PersonService,
    private organizationService: OrganizationService,
    private testService: TestService,
    private discountService: DiscountService,
    private eduGroupService: EduGroupService,
    private eduGroupDialog: MatDialog,
    private eduFieldService: EduFieldService,
    private eduFieldDialog: MatDialog,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';
    this.genderOptions.label = 'جنسیت';
    this.genderOptions.options = [
      {value: 0, title: 'مرد'},
      {value: 1, title: 'زن'}
    ];
    this.personnelOptions.label = 'ارائه دهنده خدمت'
    this.dateOptions.label = 'تاریخ';
    this.customerOptions.label = 'جستجو متقاضی';
    this.testOptions.label = 'آزمون';
    this.testFeeOptions.label = 'تعرفه آزمون';
    this.hasPrepOptions.label = 'آماده سازی نمونه';
    this.hasPrepOptions.options = [
      {value: 0, title: 'ندارد'},
      {value: 1, title: 'دارد'}
    ];
    this.customerTypeOptions.label = 'نوع متقاضی';
    this.customerTypeOptions.options = [
      {value: CustomerType.person, title: 'شخص حقیقی'},
      {value: CustomerType.organization, title: 'شرکت/سازمان'}
    ];
    this.eduFieldOptions.label = 'رشته تحصیلی';
    this.eduGroupOptions.label = 'گروه آموزشی';
    this.eduLevelOptions.label = 'مقطع تحصیلی';
    this.eduLevelOptions.options = [
      {value: 0, title: 'کاردانی'},
      {value: 1, title: 'کارشناسی'},
      {value: 2, title: 'کارشناسی ارشد'},
      {value: 3, title: 'دکتری'}
    ];
    this.getTestOptions();
    this.getLabPersonnelOptions();
    this.getDiscounts();
    if (this.mode === 1) {
      if (this.data.testPreps?.length > 0) this.hasPrep = true;
      if (this.data.test.samplePreparations)
        this.data.test.samplePreparations.forEach(prep => this.samplePreps.push({included: false, prep: prep}));
      this.checkSamplePreps(origin.code);
      this.data.test.fees.forEach(f => {
        f = new TestFee(f);
        this.testFeeOptions.options.push({value: f.id, title: f.getTitle()});
      });
      if (this.data.discounts[0]?.type === 10) this.customDiscount = true;
    }
    this.getEduGroupOptions();
    this.getEduFieldOptions();
    this.checkSamplePreps(origin.code);
  }

  getTestOptions() {
    this.testOptions.loading = true;
    let options = new Data<Test>();
    options.pageSize = null;
    this.testService.get(options).subscribe(res => {
      this.testOptions.loading = false;
      res.records.forEach((t, i) => {
        this.testOptions.options.push({value: t.id, title: t.name, data: t});
        for (let j = 0; j < this.testOptions.options[i].data.fees.length; j++)
          this.testOptions.options[i].data.fees[j] = new TestFee(this.testOptions.options[i].data.fees[j]);
      });
    }, error => {
      this.testOptions.loading = false;
      this.testOptions.loadingFailed = true;
    });
  }

  getCustomerCandidateOptions() {
    this.customerOptions.loading = true;
    this.customerOptions.options = [];
    this.serviceService.getCustomerCandidates(this.customerOptions.searchText).subscribe(res => {
      this.customerOptions.loading = false;
      res.forEach(candidate =>
        this.customerOptions.options.push({
          value: candidate.id,
          title: candidate.name,
          fieldValue: candidate.name,
          data: candidate
        })
      );
    }, err => {
      this.customerOptions.loading = false;
      this.customerOptions.loadingFailed = true;
    });
  }

  getLabPersonnelOptions() {
    this.personnelOptions.options = [];
    let options = new Data<PersonGeneral>();
    options.filters.push(new Filter('PTypeLab', 1));
    options.pageSize = null;
    this.personnelOptions.loading = true;
    this.personService.get(options).subscribe(res => {
      this.personnelOptions.loading = false;
      res.records.forEach(lp => {
        lp = new PersonGeneral(lp);
        this.personnelOptions.options.push({
          value: lp.id,
          title: lp.firstName + ' ' + lp.lastName,
          data: lp.asLabPrsnl()
        });
      });
    }, err => {
      this.personnelOptions.loading = false;
      this.personnelOptions.loadingFailed = true;
    });
  }

  getEduGroupOptions() {
    this.eduGroupOptions.loading = true;
    let options = new Data<EduGroup>();
    options.pageSize = null;
    this.eduGroupService.get(options).subscribe(res => {
      this.eduGroupOptions.loading = false;
      res.records.forEach(eg => this.eduGroupOptions.options.push({value: eg.id, title: eg.name, data: eg}));
    }, err => {
      this.eduGroupOptions.loading = false;
      this.eduGroupOptions.loadingFailed = true;
    });
  }

  getEduFieldOptions() {
    this.eduFieldOptions.loading = true;
    let options = new Data<EduField>();
    options.pageSize = null;
    this.eduFieldService.get(options).subscribe(res => {
      this.eduFieldOptions.loading = false;
      res.records.forEach(ef => this.eduFieldOptions.options.push({value: ef.id, title: ef.name, data: ef}));
    }, err => {
      this.eduFieldOptions.loading = false;
      this.eduFieldOptions.loadingFailed = true;
    });
  }

  getPerson(id: number) {
    this.personService.getGeneralById(id).subscribe(res => {
      this.data.customerAccount.custPerson = res;
      this.accountService.exists(id, 1).subscribe(acc => {
        if (acc) this.data.customerAccount = acc;
      });
      this.setDiscounts();
    });
  }

  getOrganization(id: number) {
    this.organizationService.getById(id).subscribe(res => {
      this.data.customerAccount.custOrganization = res;
      this.accountService.exists(id, 2).subscribe(acc => {
        if (acc) this.data.customerAccount = acc;
      });
      this.setDiscounts();
    });
  }

  getDiscounts() {
    let options = new Data<Discount>();
    options.pageSize = null;
    this.discountService.get(options).subscribe(res => {
      res.records.forEach(d => this.discounts.push({included: false, discount: new Discount(d)}));
      this.checkDiscounts(origin.code);
    });
  }

  checkSamplePreps(mode: origin) {
    for (let i = 0; i < this.samplePreps.length; i++) {
      let isInList = false, j;
      for (j = 0; j < this.data.testPreps.length; j++) {
        if (this.samplePreps[i].prep.id === this.data.testPreps[j].id) {
          isInList = true;
          break;
        }
      }
      if (this.samplePreps[i].included && !isInList) {
        if (mode === origin.user) {
          this.data.testPreps.push(this.samplePreps[i].prep);
        } else {
          this.samplePreps[i].included = false;
          this.data.testPreps.splice(j, 1);
        }
      } else if (!this.samplePreps[i].included && isInList) {
        if (mode === origin.user) {
          this.data.testPreps.splice(j, 1);
        } else {
          this.samplePreps[i].included = true;
        }
      }
    }
    this.data.testPreps.forEach(servicePrep => {
      let inOptions = false;
      this.samplePreps.forEach(optPrep => {
        if (servicePrep.id  === optPrep.prep.id) inOptions = true;
      });
      if (!inOptions) this.samplePreps.push({included: true, prep: servicePrep});
    });
    this.data.calculateTotalPrice();
  }

  checkDiscounts(mode: origin) {
    for (let i = 0; i < this.discounts.length; i++) {
      let isInList = false, j;
      for (j = 0; j < this.data.discounts.length; j++) {
        if (this.discounts[i].discount.id === this.data.discounts[j].id) {
          isInList = true;
          break;
        }
      }
      if (this.discounts[i].included && !isInList) {
        if (mode === origin.user) {
          this.data.discounts.push(this.discounts[i].discount);
        } else {
          this.data.discounts.splice(j, 1);
          this.discounts[i].included = false;
        }
      } else if (!this.discounts[i].included && isInList) {
        if (mode === origin.user) {
          this.data.discounts.splice(j, 1);
        } else {
          this.discounts[i].included = true;
        }
      }
    }
    this.data.discounts.forEach(serviceDiscount => {
      let isInOptions = false;
      this.discounts.forEach(optDiscount => {
        if (serviceDiscount.id === optDiscount.discount.id) isInOptions = true;
      });
      if (!isInOptions && serviceDiscount.type !== 10)
        this.discounts.push({included: true, discount: new Discount(serviceDiscount)});
    });
    this.data.calculateTotalPrice();
  }

  setDiscounts() {
    if (this.data.discounts[0]?.type !== 10) {
      this.data.discounts = [];
      this.data.test.discounts.forEach(d => {
        if (this.data.customerAccount?.type === CustomerType.person) {
          let customer = this.data.customerAccount.custPerson;
          if (customer.typeStdn || customer.typeProf) {
            if (d.type === 0 && (customer.profEduGroup?.name === 'شیمی' || customer.stdnEduField?.eduGroup?.name === 'شیمی'))
              this.data.discounts.push(new Discount(d));
            else if (d.type === 1)
              this.data.discounts.push(new Discount(d));
          }
        } else {
          if (this.data.customerAccount.custOrganization.hasContract && d.type === 3)
            this.data.discounts.push(new Discount(d))
        }
        let d0 = false, d1 = false, d1Index;
        this.data.discounts.forEach((d, i) => {
          if (d.type === 0) d0 = true;
          else if (d.type === 1) {
            d1 = true;
            d1Index = i;
          }
        });
        if (d0 && d1) this.data.discounts.splice(d1Index, 1);
        if (d.minSamples && this.data.sampleQuantity > d.minSamples)
          this.data.discounts.push(new Discount(d));
      });
      this.checkDiscounts(origin.code);
    }
  }

  setCustomDiscount() {
    if (this.customDiscount) {
      this.data.discounts = [new Discount()];
      this.data.discounts[0].type = 10;
      this.data.discounts[0].percent = 0;
    } else {
      this.data.discounts = [];
    }
    this.checkDiscounts(origin.code);
  }

  getDiscountSum(): number {
    let total = 0;
    this.data.discounts.forEach(d => total += d.percent)
    return total
  }

  onSelectTest(index: number) {
    this.data.test = this.testOptions.options[index].data;
    this.testFeeOptions.options = [];
    this.data.test.fees.forEach(tf =>
      this.testFeeOptions.options.push({value: tf.id, title: tf.getTitle()}));
    this.data.testFeeId = this.data.test.fees[0].id;
    this.data.testFee = this.data.test.fees[0];
    this.hasPrep = false;
    this.samplePreps = [];
    this.testOptions.options[index].data.samplePreparations.forEach(prep =>
      this.samplePreps.push({included: false, prep: prep})
    );
    this.setDiscounts();
    this.data.calculateTotalPrice();
  }

  onSelectTestFee(index: number) {
    this.data.testFee = this.data.test.fees[index];
    this.data.calculateTotalPrice();
  }

  selectServingPersonnel(index: number) {
    this.data.servingPersonnel = this.personnelOptions.options[index].data
  }

  onSelectCustomer(index: number) {
    this.selectedCustomerIndex = index
    let customer: CustomerCandidate = this.customerOptions.options[index].data;
    this.data.customerAccount.type = customer.type;

    if (customer.type === CustomerType.person) {
      this.getPerson(this.customerOptions.selectedValue);
    } else {
      this.getOrganization(this.customerOptions.selectedValue);
    }
  }

  onSelectEduGroup(index: number) {
    this.data.customerAccount.custPerson.profEduGroup = this.eduGroupOptions.options[index].data;
    this.setDiscounts();
  }

  onSelectEduField(index: number) {
    this.data.customerAccount.custPerson.stdnEduField = this.eduFieldOptions.options[index].data;
    this.setDiscounts();
  }

  openEduGroupForm() {
    let data: EduGroup = new EduGroup();

    const dialogRef = this.eduGroupDialog.open(EduGroupFormComponent, {
      width: '650px',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(eg => {
      if(eg) {
        this.eduGroupOptions.options.push({value: eg.id, title: eg.name, data: eg});
        this.data.customerAccount.custPerson.profEduGroupId = eg.id;
        this.data.customerAccount.custPerson.profEduGroup = eg;
        this.setDiscounts();
      }
    });
  }

  openEduFieldForm() {
    let data: EduField = new EduField();

    const dialogRef = this.eduFieldDialog.open(EduFieldFormComponent, {
      width: '850px',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(ef => {
      if(ef) {
        this.eduFieldOptions.options.push({value: ef.id, title: ef.name, data: ef});
        this.data.customerAccount.custPerson.stdnEduFieldId = ef.id;
        this.data.customerAccount.custPerson.stdnEduField = ef;
        this.setDiscounts();
      }
    });
  }

  dropSelectedCustomer() {
    this.data.customerAccount = new Account();
    this.data.customerAccount.type = null;
    this.customerOptions.selectedValue = null;
    this.data.discounts = [];
    this.checkDiscounts(origin.code);
  }

  onSubmit() {
    console.log(this.data)
    if (this.form.valid) {this.submit()}
  }

  submit() {
    this.reachingOut = true;
    if (this.mode === 0) {
      this.serviceService.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `خدمت جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(this.submitted)
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    } else {
      this.serviceService.update(this.data).subscribe(res => {
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
