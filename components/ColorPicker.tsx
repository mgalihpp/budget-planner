import { Colors } from '@/constants/Colors';
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

interface Props {
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
}

export default function ColorPicker(props: Props) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
      }}
    >
      {Colors.COLOR_LIST.map((color, index) => (
        <TouchableOpacity
          key={index}
          style={[
            {
              height: 30,
              width: 30,
              backgroundColor: color,
              borderRadius: 99,
            },
            props.selectedColor == color && {
              borderWidth: 4,
            },
          ]}
          onPress={() => props.setSelectedColor(color)}
        ></TouchableOpacity>
      ))}
    </View>
  );
}
