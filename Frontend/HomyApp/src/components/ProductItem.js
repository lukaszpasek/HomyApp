import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useDerivedValue,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

export const NOTIFICATION_HEIGHT = 80;

export default ProductItem = ({ data, index, listVisibility, scrollY, footerHeight }) => {
  const { height } = useWindowDimensions();
  const containerHeight = useDerivedValue(() => height - 250 - footerHeight.value);

  const startPosition = NOTIFICATION_HEIGHT * index;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  }
  const animatedStyle = useAnimatedStyle(() => {
    const pos1 = startPosition - containerHeight.value;
    const pos2 = startPosition + NOTIFICATION_HEIGHT - containerHeight.value;

    if (listVisibility.value >= 1) {
      return {
        opacity: interpolate(scrollY.value, [pos1, pos2], [0, 1]),
        transform: [
          {
            translateY: interpolate(
              scrollY.value,
              [pos1, pos2],
              [-NOTIFICATION_HEIGHT / 2, 0],
              Extrapolate.CLAMP
            ),
          },
          {
            scale: interpolate(
              scrollY.value,
              [pos1, pos2],
              [0.8, 1],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    } else {
      return {
        transform: [
          {
            translateY: interpolate(
              listVisibility.value,
              [0, 1],
              [containerHeight.value - startPosition, 0]
            ),
          },
          {
            scale: interpolate(listVisibility.value, [0, 1], [0.5, 1]),
          },
        ],
        opacity: listVisibility.value,
      };
    }
  });

  return (
    <Animated.View style={animatedStyle}>
      <BlurView intensity={100} tint="dark" style={styles.container}>
        <Image source={{ uri: data.icon }} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.subtitle}>DateTime: {formatDate(data.addDateTime)}</Text>
          <Text style={styles.subtitle}>Price: {data.price}[PLN]</Text>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: NOTIFICATION_HEIGHT - 10,
    margin: 5,
    marginHorizontal: 10,
    padding: 13,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    color: "white",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "white",
    lineHeight: 18,
    letterSpacing: 0.2,
  },
});


