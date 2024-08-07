import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

export default function Header() {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
      }}
    >
      <Image
        source={{
          uri: 'https://avatars.githubusercontent.com/u/68680851?s=400&u=8cf89753c0c64bb69114d32628de854ff6e820ed&v=4',
        }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 99,
        }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '85%',
        }}
      >
        <View>
          <Text
            style={{
              color: Colors.WHITE,
              fontSize: 16,
            }}
          >
            Muhammad Galih Pratama Putra
          </Text>
        </View>
        <Ionicons name="notifications" size={24} color="white" />
      </View>
    </View>
  );
}
