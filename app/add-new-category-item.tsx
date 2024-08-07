import { Colors } from '@/constants/Colors';
import * as ImagePick from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { addCategoryItem } from '@/lib/db';
import { useSQLiteContext } from 'expo-sqlite';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const placeholder =
  'https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg';

export default function AddNewCategory() {
  const db = useSQLiteContext();
  const [image, setImage] = useState<string | null | undefined>(placeholder);
  const [previewImage, setPreviewImage] = useState(placeholder);
  const { categoryId } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [cost, setCost] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const OnImagePick = async () => {
    let result = await ImagePick.launchImageLibraryAsync({
      mediaTypes: ImagePick.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setPreviewImage(result.assets[0].uri);
      setImage(result.assets[0].base64);
    }
  };

  const onClickAdd = async () => {
    setLoading(true);

    const newCategoryItemData: Omit<CategoryItem, 'id'> = {
      name: name,
      url: url,
      cost: parseInt(cost),
      image: image!,
      note: note,
      category_id: parseInt(categoryId as string),
    };

    const fileName = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
    await FileSystem.writeAsStringAsync(fileName, image!, {
      encoding: FileSystem.EncodingType.Base64,
    })
      .then(() => {
        ToastAndroid.show('Image saved', ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show('Image not saved', ToastAndroid.SHORT);
      });

    await addCategoryItem(newCategoryItemData, db).then((data) => {
      if (data) {
        setLoading(false);
        ToastAndroid.show('Item added', ToastAndroid.SHORT);
        router.replace({
          pathname: '/category-detail',
          params: {
            categoryId,
          },
        });
      } else {
        ToastAndroid.show('Item not added', ToastAndroid.SHORT);
        setLoading(false);
      }
    });
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView style={{ padding: 20, backgroundColor: Colors.WHITE }}>
        <TouchableOpacity
          onPress={() => OnImagePick()}
          style={styles.imageContainer}
        >
          <Image source={{ uri: previewImage }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.textInputContainer}>
          <Ionicons name="pricetag" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder="Item name"
            style={styles.input}
            onChangeText={(value) => setName(value)}
          />
        </View>
        <View style={styles.textInputContainer}>
          <FontAwesome name="dollar" size={24} color={Colors.GRAY} />
          <TextInput
            keyboardType="number-pad"
            autoComplete='off'
            placeholder="Cost"
            style={styles.input}
            onChangeText={(value) => setCost(value)}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Ionicons name="link" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder="Url"
            style={styles.input}
            onChangeText={(value) => setUrl(value)}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Ionicons name="pencil" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder=" Note"
            onChangeText={(value) => setNote(value)}
            style={styles.input}
            numberOfLines={3}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={!name || !cost || loading}
          onPress={() => onClickAdd()}
        >
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                // fontFamily: 'outfit-bold',
                color: Colors.WHITE,
              }}
            >
              Add
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    backgroundColor: Colors.GRAY,
    borderRadius: 15,
  },
  textInputContainer: {
    padding: 10,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.GRAY,
    marginTop: 10,
  },
  input: {
    fontSize: 17,
    width: '100%',
  },
  button: {
    padding: 17,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    marginTop: 25,
  },
});
