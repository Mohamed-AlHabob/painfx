import { StyleSheet,View } from 'react-native';
import WebView from 'react-native-webview';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: 'https://painfx.in' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
  },
});

