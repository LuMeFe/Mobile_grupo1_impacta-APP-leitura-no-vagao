import React from 'react';
import { View, Text, Button } from 'react-native';

const SignInScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Sign In Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go to Password Reset" onPress={() => navigation.navigate('PasswordReset')} />
    </View>
  );
};

export default SignInScreen;
