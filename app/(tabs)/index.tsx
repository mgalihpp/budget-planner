import {
  StyleSheet,
  View,
  RefreshControl,
  ScrollView,
  Text,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// import serviceStorage from '@/lib/serviceStorage';
import { useEffect, useState } from 'react';
import { getAllCategory } from '@/lib/db';
import { useSQLiteContext } from 'expo-sqlite';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const router = useRouter();

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    checkUserAuth();
    getAllCategory(db).then((data) => {
      setCategoryList(data);
    });
  }, []);

  /**
   * Used to check user Is already auth or not
   */
  const checkUserAuth = async () => {
    // const result = await serviceStorage.getData('login');
    // if (result !== 'true') {
    //   router.replace('/login');
    // }
  };

  return (
    <View
      style={{
        marginTop: 0,
        flex: 1,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={() => {}} refreshing={false} />
        }
      >
        <View
          style={{
            paddingTop: 40,
            paddingHorizontal: 20,
            backgroundColor: Colors.PRIMARY,
            height: 150,
          }}
        >
          <Header />
        </View>
        <View
          style={{
            padding: 20,
            marginTop: -75,
          }}
        >
          <Text>Categories</Text>
          {categoryList.map((item) => (
            <Link
              key={item.id}
              href={{
                pathname: '/category-detail',
                params: {
                  categoryId: item.id,
                },
              }}
              style={styles.text}
            >
              {item.name}
            </Link>
          ))}
        </View>
      </ScrollView>
      <Link href={'/add-new-category'} style={styles.adBtnContainer}>
        <Ionicons name="add-circle" size={64} color={Colors.PRIMARY} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
  adBtnContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
