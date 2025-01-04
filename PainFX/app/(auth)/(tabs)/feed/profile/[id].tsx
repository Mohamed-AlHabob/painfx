import { useLocalSearchParams } from 'expo-router';
import Profile from '@/components/Profile';


const Page = () => {
  const { id } = useLocalSearchParams();

  return <Profile userId={id as string } showBackButton />;
};
export default Page;
