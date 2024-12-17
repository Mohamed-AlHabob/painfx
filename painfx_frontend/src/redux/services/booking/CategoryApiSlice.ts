import { apiSlice } from "@/redux/services/apiSlice";
import { categorySchema, createUpdateCategorySchema } from "@/schemas/Payment";


export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => 'categories/',
      transformResponse: (response) => {
        categorySchema.parse(response);
        return response;
      },
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: 'categories/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateCategorySchema.parse(data);
        await queryFulfilled;
      },
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `categories/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({ ...data }, { queryFulfilled }) {
        createUpdateCategorySchema.parse(data);
        await queryFulfilled;
      },
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `categories/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;
