import { Actions } from './actions';
import { AppState } from './index'
import { IPayloadAction } from './payload-action'
export const INITIAL_STATE: AppState = { modelId : '', tableId : '', jsonPayload : '' };
export function appReducer(state: AppState = INITIAL_STATE, payloadAction: IPayloadAction) {
  switch (payloadAction.type) {
    case Actions.UPSERT_JSONPAYLOAD:      
      return  {
              modelId: state.modelId,
              tableId: state.tableId, 
              jsonPayload: payloadAction.payload
            };
    case Actions.UPSERT_MODELID:
      return {
              modelId: payloadAction.payload,
              tableId: state.tableId,
              jsonPayload: state.jsonPayload
              };
    case Actions.UPSERT_TABLEID:
      return {
              modelId: state.modelId,
              tableId: payloadAction.payload,
              jsonPayload: state.jsonPayload
              };
    default:
      return state;
  }
}
