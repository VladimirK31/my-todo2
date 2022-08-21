import { Dispatch } from 'redux'
import { authAPI } from '../api/todolists-api'
import { setIsLoggedInAC } from '../features/Login/authReduser'
import { handleServerNetworkError } from '../utils/error-utils'

const initialState: InitialStateType = {
  status: 'idle',
  error: null,
  isInitialize: false,
}

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return { ...state, status: action.status }
    case 'APP/SET-ERROR':
      return { ...state, error: action.error }
    case 'APP/SET-IS-INITIALIZE':
      return { ...state, isInitialize: action.isInitialize }
    default:
      return { ...state }
  }
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  isInitialize: boolean
}

export const setAppErrorAC = (error: string | null) =>
  ({ type: 'APP/SET-ERROR', error } as const)
export const setAppStatusAC = (status: RequestStatusType) =>
  ({ type: 'APP/SET-STATUS', status } as const)
export const setAppInitializeAC = (isInitialize: boolean) =>
  ({ type: 'APP/SET-IS-INITIALIZE', isInitialize } as const)

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppInitializeActionType = ReturnType<typeof setAppInitializeAC>

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setAppInitializeAC(true))
    })
}

type ActionsType =
  | SetAppErrorActionType
  | SetAppStatusActionType
  | SetAppInitializeActionType
