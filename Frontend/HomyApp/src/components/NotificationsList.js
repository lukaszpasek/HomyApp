import { FlatList, useWindowDimensions } from "react-native";
import React, { useState, useEffect } from 'react';
import NotificationItem from "./NotificationItem";
import Animated, {
  useAnimatedScrollHandler,
  withTiming,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

const NotificationsList = ({
  footerVisibility,
  footerHeight,
  ...flatListProps
}) => {
  const { height } = useWindowDimensions();
  const listVisibility = useSharedValue(1);
  const scrollY = useSharedValue(0);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.37:5000/api/products');
        const data = await response.json();
        setProductsList(data);
      } catch (error) {
        console.error('Error when loading data:', error);
      }
    };

    fetchData();
  }, []);


  const handler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      scrollY.value = y;
      if (y < 10) {
        // here we should have the footer opened
        footerVisibility.value = withTiming(1);
      } else {
        // close the footer
        footerVisibility.value = withTiming(0);
      }
    },
    onBeginDrag: (event) => {
      if (listVisibility.value < 1) {
        listVisibility.value = withSpring(1);
      }
    },
    onEndDrag: (event) => {
      if (event.contentOffset.y < 0) {
        listVisibility.value = withTiming(0);
      }
    },
  });

  return (
    <Animated.FlatList
      data={productsList}
      renderItem={({ item, index }) => (
        <NotificationItem
          data={item}
          index={index}
          listVisibility={listVisibility}
          scrollY={scrollY}
          footerHeight={footerHeight}
        />
      )}
      {...flatListProps}
      onScroll={handler}
      scrollEventThrottle={16}
    />
  );
};

export default NotificationsList;
