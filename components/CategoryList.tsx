import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  categoryList: CombinedCategoryList[];
}

export default function CategoryList(props: Props) {
  const router = useRouter();

  const onCategoryClick = (categoryId: number) => {
    router.push({
      pathname: '/category-detail',
      params: {
        categoryId,
      },
    });
  };

  const calculateTotalCost = (categoryItems: CategoryItem[]) => {
    let totalCost = 0;

    categoryItems.forEach((item) => (totalCost = totalCost + item.cost));

    return totalCost;
  };

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text
        style={{
          // fontFamily:
          fontSize: 25,
          marginBottom: 10,
        }}
      >
        Latest Budget
      </Text>
      {props.categoryList &&
        props.categoryList.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.container}
            onPress={() => onCategoryClick(category.id)}
          >
            <View style={styles.iconContainer}>
              <Text style={[styles.iconText, {backgroundColor: category.color}]}>{category.icon}</Text>
            </View>
            <View style={styles.subContainer}>
              <View>
                <Text style={styles.categoryText}>{category.name}</Text>
                <Text style={styles.itemCount}>
                  {category.items.length} Items
                </Text>
                <Text style={styles.totalAmountText}>
                  ${calculateTotalCost(category.items)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 15,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 35,
    padding: 16,
    borderRadius: 15,
    width: 80,
    textAlign: 'center',
  },
  categoryText: {
    // fontFamily
    fontSize: 20,
  },
  itemCount: {
    // fontFamily
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
  },
  totalAmountText: {
    // fontFamily
    fontSize: 17,
  },
});
