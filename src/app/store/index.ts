import { combineReducers } from 'redux';
import { appReducer } from './app.reducer';

export class AppState {
  modelId?: string;
  tableId?: string;
  jsonPayload?: string;
};

export const rootReducer = combineReducers<AppState>({
  state: appReducer
});
