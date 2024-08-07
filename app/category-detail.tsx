import CourseInfo from '@/components/courseDetail/CourseInfo';
import CourseItemList from '@/components/courseDetail/CourseItemList';
import { Colors } from '@/constants/Colors';
import { getCategoryDetail } from '@/lib/db';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CategoryDetail() {
  const db = useSQLiteContext();
  const { categoryId } = useLocalSearchParams();
  const [categoryData, setCategoryData] = useState<CategoryDetail>();

  const router = useRouter();

  useEffect(() => {
    console.log(categoryId);
    categoryId &&
      getCategoryDetail(parseInt(categoryId as string), db).then((data) =>
        setCategoryData(data)
      );
  }, [categoryId]);

  if (!categoryData) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        padding: 20,
        marginTop: 20,
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Ionicons name="arrow-back-circle" size={44} color="black" />
        </TouchableOpacity>

        <CourseInfo categoryData={categoryData} />

        <CourseItemList
          items={categoryData.items}
          setUpdate={() =>
            getCategoryDetail(parseInt(categoryId as string), db)
          }
        />
      </ScrollView>

      <Link
        href={{
          pathname: '/add-new-category-item',
          params: {
            categoryId: categoryId,
          },
        }}
        style={styles.floatingBtn}
      >
        <Ionicons name="add-circle" size={60} color={Colors.GREEN} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
