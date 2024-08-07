import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function TabProfile() {
  const router = useRouter();

  let user = false;

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  });

  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
}
