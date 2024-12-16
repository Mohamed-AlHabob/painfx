import { FormProps, SIGN_IN_FORM, SIGN_UP_FORM,REST_PASSWORD_FORM, DOCUMENT_FORM, PROFILE_FORM, PATIEN_FORM, DOCTOR_FORM, CLINIC_FORM } from "./forms"
import {
  AUTH_LANDING_PAGE_MENU,
  LANDING_PAGE_MENU,
  MODE_TOGGLE_MENU,
  MenuProps,
} from "./menus"

import {
  CREATE_AUTHEN_PLACEHOLDER,
  CreateAuthenPlaceholderProps,
} from "./placeholder"
import { REASONS_LIST, ReasonsListProps } from "./slider"

type ConstantsProps = {
  landingPageMenu: MenuProps[]
  authlandingPageMenu: MenuProps[]
  modetoggle: MenuProps[]
  signUpForm: FormProps[]
  signInForm: FormProps[]
  profileForm: FormProps[]
  patienForm: FormProps[]
  doctorForm: FormProps[]
  clinicForm: FormProps[]
  documentForm: FormProps[]
  resetPassword: FormProps[]
  reasonsList: ReasonsListProps[]
  createQistatPlaceholder: CreateAuthenPlaceholderProps[]
  
}

export const CONSTANTS: ConstantsProps = {
  resetPassword:REST_PASSWORD_FORM,
  landingPageMenu: AUTH_LANDING_PAGE_MENU,
  authlandingPageMenu: LANDING_PAGE_MENU,
  modetoggle: MODE_TOGGLE_MENU,
  signUpForm: SIGN_UP_FORM,
  signInForm: SIGN_IN_FORM,
  profileForm: PROFILE_FORM,
  patienForm:PATIEN_FORM,
  doctorForm:DOCTOR_FORM,
  clinicForm:CLINIC_FORM,
  documentForm: DOCUMENT_FORM,
  reasonsList: REASONS_LIST,
  createQistatPlaceholder: CREATE_AUTHEN_PLACEHOLDER,
}
