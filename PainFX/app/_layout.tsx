import { Slot, useNavigationContainerRef, useSegments } from 'expo-router';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { AppProvider } from '@/constants/providers/AppProvider';
import Provider from '@/redux/provider';
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';
import { useAppSelector } from '@/redux/hooks';

SplashScreen.preventAutoHideAsync();

// Initialize Sentry
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  attachScreenshot: true,
  debug: false,
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      enableNativeFramesTracking: true,
    }),
    Sentry.mobileReplayIntegration(),
  ],
});

const InitialLayout = () => {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const segments = useSegments();
  const router = useRouter();
  const { data: user } = useRetrieveUserQuery();

  // Hide splash screen after fonts load
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Handle authentication-based routing
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/(tabs)/feed');
    } else if (!isAuthenticated && inAuthGroup) {
      router.replace('/(public)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Set Sentry user
  useEffect(() => {
    if (user) {
      Sentry.setUser({ email: user.email, id: user.id });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  return <Slot />;
};

const RootLayoutNav = () => {
  const ref = useNavigationContainerRef();

  // Register navigation container with Sentry
  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <Provider>
      <AppProvider>
        <InitialLayout />
      </AppProvider>
    </Provider>
  );
};

export default Sentry.wrap(RootLayoutNav);
