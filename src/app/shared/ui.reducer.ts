import { Action } from '@ngrx/store';
import { UIActions, START_LOADING, STOP_LOADING } from './ui.actions';
import { AuthActions } from '../auth/auth.actions';

export interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading: false,
};

export function uiReducer(state = initialState, action: UIActions | AuthActions) {
  switch (action.type) {
    case START_LOADING:
      return {
        isLoading: true,
      };
    case STOP_LOADING:
      return {
        isLoading: false,
      };
    default: {
      return state;
    }
  }
}

export const getIsLoading = (state: State) => state.isLoading