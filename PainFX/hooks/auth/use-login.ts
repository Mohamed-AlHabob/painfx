import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { useLoginMutation } from '@/redux/services/auth/authApiSlice';
import { extractErrorMessage } from '@/utils/error-handling';
import { setAuth } from '@/redux/services/auth/authSlice';

export default function useLogin() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const onAuthenticateUser = async (values: { email: string; password: string }) => {
    try {
      await login(values).unwrap();
      dispatch(setAuth());
      showMessage({
        message: "Logged in successfully!",
        type: "success",
      });
      navigation.navigate('(tabs)');
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showMessage({
        message: errorMessage,
        type: "danger",
      });
    }
  };

  return {
    onAuthenticateUser,
    isLoading,
  };
}
