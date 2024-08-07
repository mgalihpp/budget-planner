import ColorPicker from '@/components/ColorPicker';
import { Colors } from '@/constants/Colors';
import { addCategory } from '@/lib/db';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddNewCategory() {
  const db = useSQLiteContext();
  const [selectedIcon, setSelectedIcon] = useState('IC');
  const [selectedColor, setSelectedColor] = useState('#4F75FE');
  const [categoryName, setCategoryName] = useState('');
  const [totalBudget, setTotalBudget] = useState('0');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onCreatingCategory = async () => {
    setLoading(true);

    const newCategoryData: Category = {
      name: categoryName,
      assigned_budget: parseInt(totalBudget),
      icon: selectedIcon,
      color: selectedColor,
      created_by: 'anonymous',
      created_at: new Date().toISOString(),
    };

    await addCategory(newCategoryData, db)
      .then((data) => {
        setLoading(false);

        if (!data) {
          ToastAndroid.show('Error creating category', ToastAndroid.SHORT);
        }

        ToastAndroid.show('Category Created!', ToastAndroid.SHORT);

        router.replace({
          pathname: '/category-detail',
          params: {
            categoryId: data?.id,
          },
        });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TextInput
          style={[
            styles.iconInput,
            {
              backgroundColor: selectedColor,
            },
          ]}
          maxLength={2}
          onChangeText={(value) => setSelectedIcon(value)}
          value={selectedIcon}
        />
        <ColorPicker
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </View>

      {/* Category Name */}

      <View style={styles.inputView}>
        <MaterialIcons name="local-offer" size={24} color={Colors.GRAY} />
        <TextInput
          placeholder="Category Name"
          onChangeText={(value) => setCategoryName(value)}
          style={{
            width: '100%',
            fontSize: 17,
          }}
        />
      </View>

      <View style={styles.inputView}>
        <FontAwesome6 name="dollar-sign" size={24} color={Colors.GRAY} />
        <TextInput
          placeholder="Total Budget"
          keyboardType="numeric"
          autoComplete="off"
          onChangeText={(value) => setTotalBudget(value)}
          style={{ width: '100%', fontSize: 17 }}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        disabled={!categoryName || !totalBudget || loading}
        onPress={() => onCreatingCategory()}
      >
        {loading ? (
          <ActivityIndicator color={Colors.WHITE} />
        ) : (
          <Text
            style={{ textAlign: 'center', fontSize: 16, color: Colors.WHITE }}
          >
            Create
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
  },
  iconInput: {
    textAlign: 'center',
    fontSize: 30,
    padding: 20,
    borderRadius: 99,
    paddingHorizontal: 28,
    color: Colors.WHITE,
  },
  inputView: {
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    padding: 14,
    borderRadius: 10,
    borderColor: Colors.GRAY,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
});
