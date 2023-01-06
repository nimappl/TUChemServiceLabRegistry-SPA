export class TableConfig {
  sortable: boolean;
  hasDelete: boolean;
  hasEdit: boolean;
  hasActivationCol: boolean;
  activationColTitle: string;
  activeStatusKeyProperty: string;
  hasPagination: boolean;
  columns: Array<{name: string, title: string, sortable: boolean, hasSearch: boolean}>;
  buttons: Array<{title: string, id: number}>;
  fieldsToAvoidOnTable: Array<string>;
}