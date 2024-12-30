import { useCreateClinicMutation } from "./ClinicApiSlice";
import { useCreateDoctorMutation } from "./DoctorApiSlice";
import { useCreatePatientMutation } from "./PatientApiSlice";
import { useCreateUserProfileMutation } from "./UserProfileApiSlice";

export{
    useCreateUserProfileMutation,
    useCreatePatientMutation,
    useCreateDoctorMutation,
    useCreateClinicMutation,
}