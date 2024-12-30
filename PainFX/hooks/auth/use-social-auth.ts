import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { setAuth } from '@/redux/services/auth/authSlice';
import { extractErrorMessage } from '@/utils/error-handling';

export default function useSocialAuth(authenticate: any, provider: string) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const handleSocialAuth = async (params: any) => {
      try {
        await authenticate({ provider, ...params });
        dispatch(setAuth());
        showMessage({
          message: "Successfully logged in!",
          type: "success",
        });
        navigation.navigate('(tabs)');
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        showMessage({
          message: `Authentication failed: ${errorMessage}`,
          type: "danger",
        });
        navigation.navigate('SignIn');
      }
    };

    // You would need to implement a way to receive the auth params in React Native
    // This could be through deep linking or a custom OAuth flow
    // For now, we'll leave this as a placeholder
    // handleSocialAuth({ state: '...', code: '...' });
  }, [authenticate, provider, dispatch, navigation]);

  return {};
}

