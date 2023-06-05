export class TableConfig {
  sortable: boolean;
  hasDelete: boolean;
  hasEdit: boolean;
  hasActivationCol: boolean;
  activationColTitle: string;
  activeStatusKey: string;
  hasSearch: boolean;
  showSearch: boolean = false;
  hasPagination: boolean;
  columns: Array<{for: string, dbName: string, title: string, sortable: boolean, hasSearch: boolean, transform?: (value: any) => any, transformWhole?: boolean, isFunction?: boolean}>;
  buttons: Array<{title: string, id: number, altText: string}>;
  buttonTitles: Array<string>;
  sorting: boolean = false;
  loading: boolean = false;
  loadingFailed: boolean = false;

  constructor(type?: number) {
    if (type) {
      if (type === 0) {
        this.hasPagination = false;
        this.hasActivationCol = false;
        this.hasEdit = false;
        this.hasSearch = false;
        this.hasDelete = true;
        this.sortable = false;
      } else if (type === 1) {
        this.hasPagination = true;
        this.sortable = true;
        this.hasDelete = true;
        this.hasEdit = true;
        this.hasActivationCol = false;
        this.buttonTitles = ['جزئیات'];
        this.buttons = [{title: 'مشاهده', id: 1, altText: ''}];
        this.hasSearch = true;
      }
    }
  }
}
