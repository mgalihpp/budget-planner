import { Colors } from '@/constants/Colors';
import { EvilIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  items: CategoryItem[];
  setUpdate: () => unknown;
}

export default function CourseItemList(props: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Item List</Text>

      <View
        style={{
          marginTop: 15,
        }}
      >
        {props.items.length > 0 ? (
          props.items.map((item, index) => (
            <List item={item} props={props} key={index} />
          ))
        ) : (
          <Text style={styles.noItemText}>No Item Found</Text>
        )}
      </View>
    </View>
  );
}

const List = ({ item, props }: { item: CategoryItem; props: Props }) => {
  const [expanded, setExpanded] = React.useState(0);

  const onDeleteItem = async (id: number) => {};

  const openUrl = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => setExpanded(item.id)}
        style={styles.itemContainer}
      >
        <Image
          source={{
            uri: item.image,
          }}
          style={styles.image}
        />
        <View
          style={{
            flex: 1,
            marginLeft: 10,
          }}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.url} numberOfLines={2}>
            {item.url}
          </Text>
        </View>
        <Text style={styles.cost}>${item.cost}</Text>
      </TouchableOpacity>
      {expanded === item.id && (
        <View style={styles.actionItemContainer}>
          <TouchableOpacity onPress={() => onDeleteItem(item.id)}>
            <EvilIcons name="trash" size={34} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openUrl(item.url)}>
            <EvilIcons name="external-link" size={34} color="blue" />
          </TouchableOpacity>
        </View>
      )}
      {props.items.length - 1 != 0 && (
        <View
          style={{
            borderWidth: 0.5,
            marginTop: 10,
            borderColor: Colors.GRAY,
          }}
        ></View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  heading: {
    // fontFamily:'outfit-bold',
    fontSize: 20,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    // fontFamily:'outfit-bold'
  },
  url: {
    // fontFamily:'outfit',
    color: Colors.GRAY,
  },
  cost: {
    fontSize: 17,
    marginLeft: 10,
    // fontFamily:'outfit-bold'
  },
  noItemText: {
    // fontFamily:'outfit-bold',
    fontSize: 25,
    color: Colors.GRAY,
  },
  actionItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
});
