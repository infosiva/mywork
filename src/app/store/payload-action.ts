import { Action } from 'redux';

export interface IPayloadAction extends Action {
  payload?: string;
  error?: any;
}