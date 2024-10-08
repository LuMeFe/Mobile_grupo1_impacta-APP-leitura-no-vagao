import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, Button, Image, ActivityIndicator } from 'react-native';
import { useAuthSignIn } from '../../hooks/auth';
import { styles } from './styles';
import { useUser } from "@clerk/clerk-expo";
import { signInGoogleService, checkUserExistsService } from '../../services/SignIn/SignInService';
import { saveUserService, updateIdAuthGoogle } from '../../services/SignUp/SignUpService';
import { User } from '../../types/User';

// Define a interface para o usuário
interface UserCreate {
  name: string;
  email: string;
  phone?: string; // Telefone é opcional
  password?: string; // Senha é opcional
  idAuthGoogle?: string; // ID de autenticação do Google
}

export function Home() {
  const { user } = useUser();
  const { signOutUser } = useAuthSignIn();
  const [loadingScreenHome, setLoadingScreenHome] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);

  const email = user?.emailAddresses?.[0]?.emailAddress || '';
  const idAuthGoogle = user?.id || '';

  const handleSignOut = async () => {
    await signOutUser();
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUserData = await SecureStore.getItemAsync('userData');

        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        } else {
          if (email) {
            console.log("Email:", email);
            const userExists = await checkUserExistsService(email);
            
            if (userExists.exists) {
              if (userExists.user.idauthgoogle === null) {
                await updateIdAuthGoogle(idAuthGoogle, email);
              }
              const getUserE = await signInGoogleService(email, idAuthGoogle);
              await SecureStore.setItemAsync('userToken', getUserE.data.token);
              await SecureStore.setItemAsync('userData', JSON.stringify(getUserE.data.user));
              setUserData(getUserE.data.user);
            } else {
              const newUser: UserCreate = {
                name: user?.fullName || '',
                email: email,
                phone: '',
                password: '',
                idAuthGoogle: idAuthGoogle
              };
              await saveUserService(newUser);
            }
          } else {
            throw new Error("Email do usuário não encontrado.");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar o token do usuário:", error);
        handleSignOut();
      } finally {
        setLoadingScreenHome(false);
      }
    };

    initialize();
  }, [user]);

  if (loadingScreenHome) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo à tela Home</Text>
      {user?.imageUrl && <Image source={{ uri: user.imageUrl }} style={styles.image} />}
      <Text style={styles.text}>Full Name: {userData?.name}</Text>
      <Text style={styles.text}>Email: {userData?.email}</Text>
      <Button title="Sair" onPress={handleSignOut} />
    </View>
  );
}
