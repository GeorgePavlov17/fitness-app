import { Action } from '@ngrx/store';
import { AuthActions, SET_AUTHENTICATED, SET_UNATHENTICATED } from './auth.actions';
import { UIActions } from '../shared/ui.actions';

export interface State {
  isAuthenticated: boolean;
}

const initialState: State = {
  isAuthenticated: false,
};

export function authReducer(state = initialState, action: AuthActions | UIActions) {
    switch (action.type) {
      case SET_AUTHENTICATED:
        return {
          isAuthenticated: true,
        };
      case SET_UNATHENTICATED:
        return {
          isAuthenticated: false,
        };
      default: {
        return state;
      }
    }
  }

export const getIsAuth = (state: State) => state.isAuthenticated;