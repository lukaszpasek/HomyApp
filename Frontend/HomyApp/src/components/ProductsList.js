import { FlatList, useWindowDimensions } from "react-native";
import React, { useState, useEffect } from 'react';
import ProductItem from "./ProductItem";
import Animated, {
  useAnimatedScrollHandler,
  withTiming,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserProducts } from '../components/api';

export default ProductsList = ({
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
      const token = await AsyncStorage.getItem('userToken');
      const data = await fetchUserProducts(token);
      setProductsList(data);
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
        <ProductItem
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


