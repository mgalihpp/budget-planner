import { Colors } from '@/constants/Colors';
import { deleteCategory } from '@/lib/db';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  categoryData: CategoryDetail;
}

export default function CourseInfo(props: Props) {
  const db = useSQLiteContext();
  const [totalCost, setTotalCost] = useState(0);
  const [percTotal, setPercTotal] = useState(0);

  const router = useRouter();

  useEffect(() => {
    props.categoryData && calculateTotalPerc();
  });

  const calculateTotalPerc = () => {
    let total = 0;

    props.categoryData.items.forEach((item) => {
      total = total + item.cost;
    });
    setTotalCost(total);

    let perc = 0;

    if (props.categoryData.category) {
      (total / props.categoryData.category.assigned_budget) * 100;
    } else {
      perc = 0;
    }
    setPercTotal(perc);
  };

  const onDeleteCategory = () => {
    Alert.alert('Are you Sure', 'Do you really want to Delete?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          if (props.categoryData.category?.id) {
            await deleteCategory(props.categoryData.category?.id, db);
          } else {
            console.log('Category not found');
          }
          ToastAndroid.show('Category Deleted', ToastAndroid.SHORT);
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text
            style={[
              styles.textIcon,
              {
                backgroundColor: props.categoryData.category?.color,
              },
            ]}
          >
            {props.categoryData.category?.icon}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            marginLeft: 20,
          }}
        >
          <Text style={styles.categoryName}>
            {props.categoryData.category?.name}
          </Text>
          <Text style={styles.categoryItemText}>
            {props.categoryData.items.length} Item
          </Text>
        </View>
        <TouchableOpacity onPress={() => onDeleteCategory()}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.amountContainer}>
        <Text
        // style={{ fontFamily: 'outfit-bold' }}
        >
          ${totalCost}
        </Text>
        <Text
        // style={{ fontFamily: 'outfit' }}
        >
          Total Budget:{props.categoryData.category?.assigned_budget}
        </Text>
      </View>
      <View style={styles.progressBarMainContainer}>
        <View
          style={[styles.progressBarSubContainer, { width: `${percTotal}%` }]}
        ></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textIcon: {
    height: 90,
    width: 90,
    fontSize: 35,
    padding: 20,
    textAlign: 'center',
    borderRadius: 99,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  categoryName: {
    // fontFamily
    fontSize: 24,
  },
  categoryItemText: {
    // fontFamily
    fontSize: 16,
  },
  amountContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 15,
  },
  progressBarMainContainer: {
    width: '100%',
    height: 15,
    backgroundColor: Colors.GRAY,
    borderRadius: 99,
    marginTop: 7,
  },
  progressBarSubContainer: {
    width: '40%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    height: 15,
  },
});
