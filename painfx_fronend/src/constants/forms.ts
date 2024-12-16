export type FormProps = {
  id: string
  name: string;
  label?: string;
  type?: "text" | "email" |"textarea" | "password" | "number" | "date" | "select";
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
}
export const SIGN_UP_FORM: FormProps[] = [
  {
    id: "1",
    type: "email",
    placeholder: "Email",
    name: "email",
  },
  {
    id: "2",
    type: "password",
    placeholder: "Password",
    name: "password",
  }
]

export const SIGN_IN_FORM: FormProps[] = [
  {
    id: "1",
    type: "email",
    placeholder: "Email",
    name: "email",
  },
  {
    id: "2",
    type: "password",
    placeholder: "Password",
    name: "password",
  },
]

export const PROFILE_FORM: FormProps[] = [
  {
    id: "1",
    type: "text",
    placeholder: "Phone Number",
    name: "phone_number",
  },
  {
    id: "2",
    type: "text",
    placeholder: "Address",
    name: "address",
  },
  {
    id: "3",
    type: "text",
    placeholder: "Address",
    name: "address",
  },
]
export const PATIEN_FORM: FormProps[] = [
  {
    id: "1",
    label: "Medical History",
    type: "textarea",
    placeholder: "Medical History",
    name: "medical_history",
  },
]

export const DOCTOR_FORM: FormProps[] = [
  {
    id: "1",
    label: "Specialization",
    placeholder: "Specialization",
    name: "specialization",
    type: "select",
    options: [
      {
        value: "cardiologist",
        label: "Cardiologist",
      },
    ]
  },
  {
    id: "2",
    label: "License Number",
    type: "number",
    placeholder: "License Number",
    name: "license_number",
  },
  {
    id: "3",
    label: "License Expiry Date",
    type: "date",
    placeholder: "License Expiry Date",
    name: "license_expiry_date",
  },
]

export const CLINIC_FORM: FormProps[] = [
  {
    id: "1",
    label: "name",
    placeholder: "Clinic Name",
    name: "name",
    type: "text",
  },
  {
    id: "2",
    label: "address",
    placeholder: "Clinic Address",
    name: "address",
    type: "text",
  },
  {
    id: "3",
    label: "Specialization",
    placeholder: "Specialization",
    name: "specialization",
    type: "select",
    options: [
      {
        value: "cardiologist",
        label: "Cardiologist",
      },
    ]
  },
  {
    id: "4",
    label: "tags",
    placeholder: "Sports, Food and Health",
    name: "tags",
    type: "select",
    options: [
      {
        value: "cardiologist",
        label: "Cardiologist",
      },
    ]
  },
  {
    id: "5",
    label: "License Number",
    type: "number",
    placeholder: "License Number",
    name: "license_number",
  },
  {
    id: "6",
    label: "License Expiry Date",
    type: "date",
    placeholder: "License Expiry Date",
    name: "license_expiry_date",
  },
  {
    id: "7",
    type: "textarea",
    label: "description",
    placeholder: "Very specialized",
    name: "description",
  },
]

export const REST_PASSWORD_FORM: FormProps[] = [
  {
    id: "1",
    type: "password",
    placeholder: "New Password",
    name: "new_password",
  },
  {
    id: "2",
    type: "password",
    placeholder: "Confirm Password",
    name: "re_new_password",
  },
]


export const DOCUMENT_FORM: FormProps[] = [
  {
    id: "1",
    placeholder: "Title",
    name: "title",
    type: "text",
  },
  {
    id: "2",
    placeholder: "file",
    name: "file",
  },
]