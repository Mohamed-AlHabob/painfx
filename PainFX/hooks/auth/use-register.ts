import { useRegisterMutation } from '@/redux/services/auth/authApiSlice';
import { extractErrorMessage } from '@/utils/error-handling';
import { useNavigation } from '@react-navigation/native';

import { showMessage } from 'react-native-flash-message';

export default function useRegister() {
  const navigation = useNavigation();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const onRegisterUser = async (values: any) => {
    try {
      await registerUser(values).unwrap();
      showMessage({
        message: "Please check your email to verify your account.",
        type: "success",
      });
      navigation.navigate('SignIn');
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showMessage({
        message: errorMessage,
        type: "danger",
      });
    }
  };

  return {
    onRegisterUser,
    isLoading,
  };
}

