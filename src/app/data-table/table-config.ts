export class TableConfig {
  sortable: boolean;
  hasDelete: boolean;
  hasEdit: boolean;
  hasActivationCol: boolean;
  activationColTitle: string;
  activeStatusKey: string;
  hasSearch: boolean;
  showSearch: boolean = false;
  hasPagination: boolean = true;
  columns: Array<{for: string, dbName: string, title: string, sortable: boolean, hasSearch: boolean, transform?: (value: any) => any}>;
  buttons: Array<{title: string, id: number, altText: string}>;
  buttonTitles: Array<string>;
  sorting: boolean = false;
  loading: boolean = false;
  loadingFailed: boolean = false;
}