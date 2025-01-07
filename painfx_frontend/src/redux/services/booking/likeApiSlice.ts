import { apiSlice } from '../../services/apiSlice';
import { likeListSchema, createUpdateLikeSchema, Like } from '../../../schemas/Social';

export interface LikeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Like[];
}

export interface CreateLikeRequest {
  content_type: string; // e.g., "post", "comment", "event"
  object_id: string; // ID of the object being liked
}

export interface UnlikeLikeRequest {
  id: string;
  content_type: string; // e.g., "post", "comment", "event"
  object_id: string; // ID of the object being unliked
}

export const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLikes: builder.query<LikeListResponse, { content_type: string; object_id: string; page?: number }>({
      query: ({ content_type, object_id, page = 1 }) => `likes/?content_type=${content_type}&object_id=${object_id}&page=${page}`,
      transformResponse: (response: LikeListResponse) => {
        likeListSchema.parse(response);
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Like' as const, id })),
              { type: 'Like', id: 'LIST' },
            ]
          : [{ type: 'Like', id: 'LIST' }],
    }),
    getUserLike: builder.query<Like | null, { content_type: string; object_id: string; userId: string }>({
      query: ({ content_type, object_id, userId }) => `likes/?content_type=${content_type}&object_id=${object_id}&user=${userId}`,
      transformResponse: (response: LikeListResponse) => {
        likeListSchema.parse(response);
        return response.results[0] || null;
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Like', id: result.id },
              { type: 'Like', id: `USER_${result.content_type}_${result.object_id}` },
            ]
          : [{ type: 'Like', id: 'LIST' }],
    }),
    likePost: builder.mutation<Like, CreateLikeRequest>({
      query: (data) => ({
        url: 'likes/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: Like) => {
        createUpdateLikeSchema.parse(response);
        return response;
      },
      invalidatesTags: [{ type: 'Like', id: 'LIST' }],
      async onQueryStarted({ content_type, object_id }, { dispatch, queryFulfilled }) {
        const userId = "4121ee66-153c-4200-906c-88337e53dea1";
        const tempId = `temp-${Math.random()}`;

        // Optimistic Update
        const patchResult = dispatch(
          likeApiSlice.util.updateQueryData('getLikes', { content_type, object_id, page: 1 }, (draft) => {
            draft.results.push({
              id: tempId,
              content_type,
              object_id,
              user: {
                id: userId,
                email: '',
              },
              createdAt: new Date().toISOString(),
            });
            draft.count += 1;
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            likeApiSlice.util.updateQueryData('getLikes', { content_type, object_id, page: 1 }, (draft) => {
              const index = draft.results.findIndex((like) => like.id === tempId);
              if (index !== -1) {
                draft.results[index] = data;
              }
            })
          );
        } catch (error) {
          console.error('Failed to update like:', error);
          patchResult.undo();
        }
      },
    }),
    unlikePost: builder.mutation<{ success: boolean; id: string }, UnlikeLikeRequest>({
      query: ({ id }) => ({
        url: `likes/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result) => result ? [{ type: 'Like', id: result.id }] : [],
      async onQueryStarted({ id, content_type, object_id }, { dispatch, queryFulfilled }) {
        // Optimistic Update
        const patchResult = dispatch(
          likeApiSlice.util.updateQueryData('getLikes', { content_type, object_id, page: 1 }, (draft) => {
            draft.results = draft.results.filter((like) => like.id !== id);
            draft.count -= 1;
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Failed to unlike post:', error);
          patchResult.undo();
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLikesQuery,
  useGetUserLikeQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} = likeApiSlice;