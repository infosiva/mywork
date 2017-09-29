import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { rootReducer } from '../../app/store'
import { AppState } from '../../app/store';
@Injectable()
export class AppStore {
	constructor(public ngRedux : NgRedux<AppState>) {
		ngRedux.configureStore(rootReducer,{});
	}
}