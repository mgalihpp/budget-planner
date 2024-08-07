import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart';

interface Props {
  categoryList: CombinedCategoryList[];
}

type ValueType = number;
type SliceColorType = string;
export default function CircularChart(props: Props) {
  const widthAndHeight = 150;

  const [values, setValues] = useState<ValueType[]>([1]);
  const [sliceColor, setSliceColor] = useState<SliceColorType[]>([Colors.GRAY]);

  const [totalCalculatedEstimate, setTotalCalculatedEstimate] = useState(0);

  useEffect(() => {
    props.categoryList && updateCircularChart();
  }, [props.categoryList]);

  const updateCircularChart = () => {
    let totalEstimate = 0;
    let otherCost = 0;

    setValues([1]);
    setSliceColor([Colors.GRAY]);

    props.categoryList.forEach((item, index) => {
      if (index < 4) {
        let itemTotalCost = 0;

        item.items.forEach((item, index) => {
          itemTotalCost = itemTotalCost + item.cost;
          totalEstimate = totalEstimate + item.cost;
        });

        setSliceColor((sliceColor) => [
          ...sliceColor,
          Colors.COLOR_LIST[index],
        ]);
        setValues((values) => [...values, itemTotalCost]);
      } else {
        item.items.forEach((item) => {
          otherCost = otherCost + item.cost;
          totalEstimate = totalEstimate + item.cost;
        });
      }
    });

    setTotalCalculatedEstimate(totalEstimate);
    setSliceColor((sliceColor) => [...sliceColor, Colors.COLOR_LIST[4]]);
    setValues((values) => [...values, otherCost]);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          // fontFamily
        }}
      >
        Total Estimate :
        <Text
          style={{
            // fontFamily: 'monospace',
            fontWeight: 'bold',
          }}
        >
          ${totalCalculatedEstimate}
        </Text>
      </Text>
      <View style={styles.subContainer}>
        {props.categoryList.length > 0 && (
          <PieChart
            widthAndHeight={widthAndHeight}
            series={values}
            sliceColor={sliceColor}
            coverRadius={0.65}
            coverFill={Colors.WHITE}
          />
        )}
        {props.categoryList.length === 0 ? (
          <View style={styles.chartNameContainer}>
            <MaterialCommunityIcons
              name="checkbox-blank-circle"
              size={24}
              color={Colors.GRAY}
            />
            <Text>No data</Text>
          </View>
        ) : (
          <View>
            {props.categoryList.map(
              (category, index) =>
                index <= 4 && (
                  <View key={index} style={styles.chartNameContainer}>
                    <MaterialCommunityIcons
                      name="checkbox-blank-circle"
                      size={24}
                      color={Colors.COLOR_LIST[index]}
                    />
                    <Text>{index < 4 ? category.name : 'Others'}</Text>
                  </View>
                )
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 15,
    elevation: 1,
  },
  subContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 40,
  },
  chartNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
});
