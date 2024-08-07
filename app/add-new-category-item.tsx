import ColorPicker from '@/components/ColorPicker';
import { Colors } from '@/constants/Colors';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddNewCategory() {
  const [selectedIcon, setSelectedIcon] = useState('IC');
  const [selectedColor, setSelectedColor] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [totalBudget, setTotalBudget] = useState('0');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onCreatingCategory = async () => {
    setLoading(true);

    await addCategory({
      name: categoryName,
      assigned_budget: parseInt(totalBudget),
      icon: selectedIcon,
      color: selectedColor,
      created_by: 'anonymous',
      created_at: new Date().toISOString(),
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
