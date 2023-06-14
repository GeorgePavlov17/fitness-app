import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { State as AuthState } from './auth/auth.reducer';

import * as fromUi from './shared/ui.reducer';
import * as fromAuth from  './auth/auth.reducer';
import { UIActions } from './shared/ui.actions';
import { AuthActions } from './auth/auth.actions'; // Import the AuthActions type

export interface State {
    ui: fromUi.State;
    auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State, UIActions | AuthActions> = {
    ui: fromUi.uiReducer,
    auth: fromAuth.authReducer
};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);