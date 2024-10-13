import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Go to Sign In" onPress={() => navigation.navigate('SignIn')} />
      <Button title="Go to Password Reset" onPress={() => navigation.navigate('PasswordReset')} />
    </View>
  );
};

export default HomeScreen;
