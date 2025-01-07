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
    // Get all likes for a specific object
    getLikes: builder.query<LikeListResponse, { content_type: string; object_id: string; page?: number }>({
      query: ({ content_type, object_id, page = 1 }) => ({
        url: 'likes/',
        params: { content_type, object_id, page },
      }),
      transformResponse: (response: unknown) => {
        // Parse and validate the response
        const parsedResponse = likeListSchema.parse(response);
        return {
          count: parsedResponse.count,
          next: parsedResponse.next,
          previous: parsedResponse.previous,
          results: parsedResponse.results,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Like' as const, id })),
              { type: 'Like', id: 'LIST' },
            ]
          : [{ type: 'Like', id: 'LIST' }],
    }),

    // Get a specific like by the current user
    getUserLike: builder.query<Like | null, { content_type: string; object_id: string; userId: string }>({
      query: ({ content_type, object_id, userId }) => ({
        url: 'likes/',
        params: { content_type, object_id, user: userId },
      }),
      transformResponse: (response: unknown) => {
        // Parse and validate the response
        const parsedResponse = likeListSchema.parse(response);
        return parsedResponse.results[0] || null; // Return the first like or null
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Like', id: result.id },
              { type: 'Like', id: `USER_${result.content_type}_${result.object_id}` },
            ]
          : [{ type: 'Like', id: 'LIST' }],
    }),

    // Like an object
    likePost: builder.mutation<Like, CreateLikeRequest>({
      query: (data) => ({
        url: 'likes/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: unknown) => {
        // Parse and validate the response
        return createUpdateLikeSchema.parse(response);
      },
      invalidatesTags: [{ type: 'Like', id: 'LIST' }],
      async onQueryStarted({ content_type, object_id }, { dispatch, queryFulfilled }) {
        const userId = "4121ee66-153c-4200-906c-88337e53dea1"; // Replace with actual user ID
        const tempId = `temp-${Math.random()}`;

        // Optimistic update: Add a temporary like to the list
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
              created_at: new Date().toISOString(),
            });
            draft.count += 1;
          })
        );

        try {
          const { data } = await queryFulfilled;
          // Replace the temporary like with the actual like from the server
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
          patchResult.undo(); // Revert the optimistic update on error
        }
      },
    }),

    // Unlike an object
    unlikePost: builder.mutation<{ success: boolean; id: string }, UnlikeLikeRequest>({
      query: ({ id }) => ({
        url: `likes/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Like', id: result.id }] : []),
      async onQueryStarted({ id, content_type, object_id }, { dispatch, queryFulfilled }) {
        // Optimistic update: Remove the like from the list
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
          patchResult.undo(); // Revert the optimistic update on error
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