import { apiSlice } from "@/redux/services/apiSlice";


interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
  profile:{
    avatar: string;
  }
}

interface SocialAuthArgs {
  provider: string;
  state: string;
  code: string;
}

interface CreateUserResponse {
  success: boolean;
  user: User;
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
    retrieveUser: builder.query<User, void>({
      query: () => '/users/me/',
    }),
    socialAuthenticate: builder.mutation<CreateUserResponse, SocialAuthArgs>({
      query: ({ provider, state, code }) => ({
        url: `/o/${provider}/?state=${encodeURIComponent(state)}&code=${encodeURIComponent(code)}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Social authentication error:', error);
        }
      },
    }),
    login: builder.mutation<{ access: string }, LoginArgs>({
      query: ({ email, password }) => ({
        url: '/jwt/create/',
        method: 'POST',
        body: { email, password },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    }),
    register: builder.mutation<void, RegisterArgs>({
      query: ({ email, password }) => ({
        url: '/users/',
        method: 'POST',
        body: { email, password, re_password: password },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Registration error:', error);
        }
      },
    }),
		verify: builder.mutation({
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
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
    }),
    activation: builder.mutation<void, ActivationArgs>({
      query: ({ uid, token }) => ({
        url: '/users/activation/',
        method: 'POST',
        body: { uid, token },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Activation error:', error);
        }
      },
    }),
    resetPassword: builder.mutation<void, ResetPasswordArgs>({
      query: ({ email }) => ({
        url: '/users/reset_password/',
        method: 'POST',
        body: { email },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Reset password error:', error);
        }
      },
    }),
    resetPasswordConfirm: builder.mutation<void, ResetPasswordConfirmArgs>({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: '/users/reset_password_confirm/',
        method: 'POST',
        body: { uid, token, new_password, re_new_password },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Reset password confirm error:', error);
        }
      },
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
