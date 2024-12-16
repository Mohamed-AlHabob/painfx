import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
  } from "@/redux/services/booking/CategoryApiSlice";
  
  import {
    useGetPaymentMethodsQuery,
    useCreatePaymentMethodMutation,
    useUpdatePaymentMethodMutation,
    useDeletePaymentMethodMutation,
  } from "@/redux/services/booking/PaymentMethodApiSlice";
  
  import {
    useGetPaymentsQuery,
    useCreatePaymentMutation,
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
  } from "@/redux/services/booking/PaymentApiSlice";
  
  import {
    useGetSubscriptionsQuery,
    useCreateSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useDeleteSubscriptionMutation,
  } from "@/redux/services/booking/SubscriptionApiSlice";
  
  const useSubscriptionsManager = () => {
    // Categories
    const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery("");
    const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation();
  
    // Payment Methods
    const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useGetPaymentMethodsQuery("");
    const [createPaymentMethod, { isLoading: isCreatingPaymentMethod }] = useCreatePaymentMethodMutation();
    const [updatePaymentMethod, { isLoading: isUpdatingPaymentMethod }] = useUpdatePaymentMethodMutation();
    const [deletePaymentMethod, { isLoading: isDeletingPaymentMethod }] = useDeletePaymentMethodMutation();
  
    // Payments
    const { data: payments, isLoading: isLoadingPayments } = useGetPaymentsQuery("");
    const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();
    const [updatePayment, { isLoading: isUpdatingPayment }] = useUpdatePaymentMutation();
    const [deletePayment, { isLoading: isDeletingPayment }] = useDeletePaymentMutation();
  
    // Subscriptions
    const { data: subscriptions, isLoading: isLoadingSubscriptions } = useGetSubscriptionsQuery("");
    const [createSubscription, { isLoading: isCreatingSubscription }] = useCreateSubscriptionMutation();
    const [updateSubscription, { isLoading: isUpdatingSubscription }] = useUpdateSubscriptionMutation();
    const [deleteSubscription, { isLoading: isDeletingSubscription }] = useDeleteSubscriptionMutation();
  
    // Return all data and operations in a structured format
    return {
      categories: {
        data: categories,
        isLoading: isLoadingCategories,
        create: createCategory,
        isCreating: isCreatingCategory,
        update: updateCategory,
        isUpdating: isUpdatingCategory,
        delete: deleteCategory,
        isDeleting: isDeletingCategory,
      },
      paymentMethods: {
        data: paymentMethods,
        isLoading: isLoadingPaymentMethods,
        create: createPaymentMethod,
        isCreating: isCreatingPaymentMethod,
        update: updatePaymentMethod,
        isUpdating: isUpdatingPaymentMethod,
        delete: deletePaymentMethod,
        isDeleting: isDeletingPaymentMethod,
      },
      payments: {
        data: payments,
        isLoading: isLoadingPayments,
        create: createPayment,
        isCreating: isCreatingPayment,
        update: updatePayment,
        isUpdating: isUpdatingPayment,
        delete: deletePayment,
        isDeleting: isDeletingPayment,
      },
      subscriptions: {
        data: subscriptions,
        isLoading: isLoadingSubscriptions,
        create: createSubscription,
        isCreating: isCreatingSubscription,
        update: updateSubscription,
        isUpdating: isUpdatingSubscription,
        delete: deleteSubscription,
        isDeleting: isDeletingSubscription,
      },
    };
  };
  
  export default useSubscriptionsManager;
  