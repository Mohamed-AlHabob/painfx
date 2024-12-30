import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const GoogleAuthButton: React.FC = () => {
  const handleGoogleAuth = () => {
    // Implement Google Auth logic here
    console.log('Google Auth button pressed');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleGoogleAuth}>
      <Image
        source={'../assets/images/adaptive-icon.png'}
        style={styles.logo}
      />
      <Text style={styles.buttonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoogleAuthButton;

