import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '@/lib/db';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider
      databaseName="budget_planner.db"
      onInit={initializeDatabase}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-new-category"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Add New Category',
          }}
        />
        <Stack.Screen
          name="add-new-category-item"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Add New Item',
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar backgroundColor={Colors.PRIMARY} />
    </SQLiteProvider>
  );
}
