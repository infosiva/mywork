import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { AppState } from '../store';
@Injectable()
export class Actions {
  constructor (private ngRedux: NgRedux<AppState>) {}
  static UPSERT_JSONPAYLOAD: string = 'UPSERT_JSONPAYLOAD';
  static UPSERT_MODELID: string = 'UPSERT_MODELID';
  static UPSERT_TABLEID: string = 'UPSERT_TABLEID';
  upsertJSON(jsonData): void {
    this.ngRedux.dispatch({ type: Actions.UPSERT_JSONPAYLOAD , payload: jsonData });
  }
  upsertModelId(modelId): void {
    this.ngRedux.dispatch({ type: Actions.UPSERT_MODELID, payload: modelId });
  }
  upsertTableId(tableId): void {
    this.ngRedux.dispatch({ type: Actions.UPSERT_TABLEID , payload: tableId });
  }
 }
