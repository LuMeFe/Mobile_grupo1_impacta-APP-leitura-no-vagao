import React from 'react';
import { View, Text, Button } from 'react-native';

const PasswordResetScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Password Reset Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go to Sign In" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
};

export default PasswordResetScreen;
