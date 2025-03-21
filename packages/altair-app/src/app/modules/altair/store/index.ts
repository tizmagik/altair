import { InjectionToken } from '@angular/core';
import { combineReducers, Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../../../environments/environment';

import * as fromLayout from './layout/layout.reducer';
import * as fromQuery from './query/query.reducer';
import * as fromHeaders from './headers/headers.reducer';
import * as fromVariables from './variables/variables.reducer';
import * as fromDialogs from './dialogs/dialogs.reducer';
import * as fromGqlSchema from './gql-schema/gql-schema.reducer';
import * as fromDocs from './docs/docs.reducer';
import * as fromWindows from './windows/windows.reducer';
import * as fromHistory from './history/history.reducer';
import * as fromWindowsMeta from './windows-meta/windows-meta.reducer';
import * as fromSettings from './settings/settings.reducer';
import * as fromDonation from './donation/donation.reducer';
import * as fromCollection from './collection/collection.reducer';
import * as fromEnvironments from './environments/environments.reducer';
import * as fromStream from './stream/stream.reducer';
import * as fromPreRequest from './pre-request/pre-request.reducer';
import * as fromPostRequest from './post-request/post-request.reducer';
import * as fromLocal from './local/local.reducer';
import { debug } from '../utils/logger';
import performantLocalStorage from '../utils/performant-local-storage';
import { getAltairConfig } from '../config';
import { TODO } from '../interfaces/shared';
import { AppInitAction } from './action';
import { asyncStorageSync } from './async-storage-sync';
import { localStorageSyncConfig } from './local-storage-sync-config';

export interface PerWindowState {
  layout: fromLayout.State;
  query: fromQuery.State;
  headers: fromHeaders.State;
  variables: fromVariables.State;
  dialogs: fromDialogs.State;
  schema: fromGqlSchema.State;
  docs: fromDocs.State;
  history: fromHistory.State;
  stream: fromStream.State;
  preRequest: fromPreRequest.State;
  postRequest: fromPostRequest.State;
  windowId: string; // Used by the window reducer
}
const getPerWindowReducer = () => {
  const perWindowReducers = {
    layout: fromLayout.layoutReducer,
    query: fromQuery.queryReducer,
    headers: fromHeaders.headerReducer,
    variables: fromVariables.variableReducer,
    dialogs: fromDialogs.dialogReducer,
    schema: fromGqlSchema.gqlSchemaReducer,
    docs: fromDocs.docsReducer,
    history: fromHistory.historyReducer,
    stream: fromStream.streamReducer,
    preRequest: fromPreRequest.preRequestReducer,
    postRequest: fromPostRequest.postRequestReducer,
  };

  return perWindowReducers;
};


export interface State {
  windows: fromWindows.State;
  windowsMeta: fromWindowsMeta.State;
  settings: fromSettings.State;
  donation: fromDonation.State;
  collection: fromCollection.State;
  environments: fromEnvironments.State;
  local: fromLocal.State;
}

// Meta reducer to log actions
export function log(_reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: State, action: Action) => {
    if (!environment.production || (window as any).__ENABLE_DEBUG_MODE__) {
      debug.log(action.type, action);
    }
    (window as any).__LAST_ACTION__ = (window as any).__LAST_ACTION__ || [];
    (window as any).__LAST_ACTION__.push(action.type);
    if (environment.production && (window as any).__LAST_ACTION__.length > 10) {
      (window as any).__LAST_ACTION__.shift();
    }

    return _reducer(state, action);
  };
}

export function localStorageSyncReducer(_reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync(localStorageSyncConfig)(_reducer);
}

export function asyncStorageSyncReducer(_reducer: ActionReducer<any>): ActionReducer<any> {
  return asyncStorageSync(localStorageSyncConfig)(_reducer);
}

export const metaReducers: MetaReducer<any>[] = [
  // localStorageSyncReducer,
  asyncStorageSyncReducer,
  // !environment.production ? storeFreeze : null,
  log
];

export const getReducer = (): ActionReducerMap<State> => {
  return {
    windows: fromWindows.windows(combineReducers(getPerWindowReducer())),
    windowsMeta: fromWindowsMeta.windowsMetaReducer,
    settings: fromSettings.settingsReducer,
    donation: fromDonation.donationReducer,
    collection: fromCollection.collectionReducer,
    environments: fromEnvironments.environmentsReducer,
    local: fromLocal.localReducer,
  }
};

export const reducerToken = new InjectionToken<ActionReducerMap<State>>('Registered Reducers');

export const reducerProvider = [
  { provide: reducerToken, useValue: getReducer() }
];

export const selectWindowState = (windowId: string) => (state: State) => state.windows[windowId];

export * from './query/selectors';
export * from './docs/selectors';
export * from './headers/selectors';
export * from './variables/selectors';
export * from './layout/selectors';
export * from './gql-schema/selectors';
export * from './collection/selectors';
export * from './pre-request/selectors';
export * from './post-request/selectors';
export * from './stream/selectors';
export * from './local/selectors';
