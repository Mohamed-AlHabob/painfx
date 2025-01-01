import { apiSlice } from "@/redux/services/apiSlice";
import { UserProfile } from "@/schemas";

interface SocialAuthArgs {
  provider: string;
  state: string;
  code: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

interface RegisterArgs {
  email: string;
  password: string;
}

interface ActivationArgs {
  uid: string;
  token: string;
}

interface ResetPasswordArgs {
  email: string;
}

interface ResetPasswordConfirmArgs {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
}

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    retrieveUser: builder.query<UserProfile, void>({
      query: () => '/users/me/',
      providesTags: ['User'],
    }),
    socialAuthenticate: builder.mutation<{ access: string }, SocialAuthArgs>({
      query: ({ provider, state, code }) => ({
        url: `/o/${provider}/?state=${encodeURIComponent(state)}&code=${encodeURIComponent(code)}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    }),
    login: builder.mutation<{ access: string }, LoginArgs>({
      query: ({ email, password }) => ({
        url: '/jwt/create/',
        method: 'POST',
        body: { email, password,platform="web" },
      }),
    }),
    register: builder.mutation<void, RegisterArgs>({
      query: ({ email, password }) => ({
        url: '/users/',
        method: 'POST',
        body: { email, password, re_password: password },
      }),
    }),
    verify: builder.mutation<void, void>({
      query: () => ({
        url: '/jwt/verify/',
        method: 'POST',
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout/',
        method: 'POST',
      }),
    }),
    activation: builder.mutation<void, ActivationArgs>({
      query: ({ uid, token }) => ({
        url: '/users/activation/',
        method: 'POST',
        body: { uid, token },
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordArgs>({
      query: ({ email }) => ({
        url: '/users/reset_password/',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPasswordConfirm: builder.mutation<void, ResetPasswordConfirmArgs>({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: '/users/reset_password_confirm/',
        method: 'POST',
        body: { uid, token, new_password, re_new_password },
      }),
    }),
  }),
});

export const {
  useRetrieveUserQuery,
  useSocialAuthenticateMutation,
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLogoutMutation,
  useActivationMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
} = authApiSlice;

