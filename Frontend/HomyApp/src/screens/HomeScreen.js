import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ImageBackground,
  useWindowDimensions,
  TextInput,
  Button,
} from 'react-native';
import wallpaper from "../../assets/images/wallpaper.webp";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { AppContext } from '../context/AppContext';
import { useTheme } from 'react-native-paper';
import { BlurView } from "expo-blur";
import Animated, {
  SlideInDown,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useDerivedValue,
  useAnimatedGestureHandler,
  withTiming,
  Easing,
  useAnimatedProps,
} from "react-native-reanimated";
import ScannerScreen from "../components/Scanner";
import home2 from "../../assets/images/home2.jpg";
import ProductsList from "../components/ProductsList";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGeminiResponse } from '../services/openaiService'; // Import the service

const App = ({ navigation }) => {
  const [showScanner, setShowScanner] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const { height } = useWindowDimensions();
  const { colors } = useTheme();
  const { t } = React.useContext(AppContext)
  const y = useSharedValue(height);

  const footerVisibility = useSharedValue(1);
  const footerHeight = useDerivedValue(() =>
    interpolate(footerVisibility.value, [0, 1], [0, 85])
  );

  const toggleScanner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      setShowScanner(!showScanner);
    } else {
      Alert.alert(
        'Brak dostępu',
        'Musisz się najpierw zalogować.',
        [{ text: 'OK' }]
      );
    }
  };

  const animatedFooterStyle = useAnimatedStyle(() => ({
    marginTop: interpolate(footerVisibility.value, [0, 1], [-85, 0]),
    opacity: footerVisibility.value,
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(y.value - height, {
          duration: 5,
          easing: Easing.linear,
        }),
      },
    ],
  }));

  const homeScreenBlur = useAnimatedProps(() => ({
    intensity: interpolate(y.value, [0, height], [0, 100]),
  }));

  const lockScreenBlur = useAnimatedProps(() => ({
    intensity: interpolate(y.value, [0, height], [100, 0]),
  }));

  const Header = useMemo(() => (
    <Animated.View entering={SlideInUp} style={styles.header}>
      <Ionicons size={20} color="white" />
      <Text style={colors.title}>{t('my-products')}</Text>
    </Animated.View>
  ), [colors.title, t]);

  const handleChatSubmit = async () => {
    try {
      const response = await getGeminiResponse(chatInput);
      setChatResponse(response);
    } catch (error) {
      Alert.alert('Error', 'There was an error getting the response from ChatGPT');
    }
  };

  return (
    <>
      {/* Home Screen */}
      <ImageBackground
        source={home2}
        style={{ width: "100%", height: "100%", ...StyleSheet.absoluteFill }}
      ></ImageBackground>
      {/* Lock Screen */}
      <AnimatedBlurView
        animatedProps={homeScreenBlur}
        style={{ width: "100%", height: "100%", ...StyleSheet.absoluteFill }}
      />
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <ImageBackground source={wallpaper} style={styles.container}>
          <AnimatedBlurView
            animatedProps={lockScreenBlur}
            style={{
              width: "100%",
              height: "100%",
              ...StyleSheet.absoluteFill,
            }}
          />
          <View style={styles.container}>
            {showScanner ? (<ScannerScreen />) :
              (
                <ProductsList
                  footerVisibility={footerVisibility}
                  footerHeight={footerHeight}
                  ListHeaderComponent={Header}
                />
              )}
          </View>
          <View style={styles.chatContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask ChatGPT"
              value={chatInput}
              onChangeText={setChatInput}
            />
            <Button title="Send" onPress={handleChatSubmit} />
            {chatResponse ? (
              <Text style={styles.chatResponse}>{chatResponse}</Text>
            ) : null}
          </View>
          <Animated.View
            entering={SlideInDown}
            style={[styles.footer, animatedFooterStyle]}
          >
            <View style={styles.icon}>
              <MaterialCommunityIcons
                name={showScanner ? "list-status" : "line-scan"}
                size={24}
                color="white"
                onPress={toggleScanner}
              />
            </View>

            <View style={styles.icon}>
              <AntDesign name="upcircle" size={24} color="black" />
            </View>
          </Animated.View>
        </ImageBackground>
      </Animated.View>
    </>
  );
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    height: 250,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    color: "red",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    height: 75,
  },
  icon: {
    backgroundColor: "#00000050",
    width: 50,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 10,
  },
  panGestureContainerUnlock: {
    position: "absolute",
    width: "100%",
    height: 200,
    bottom: 0,
    left: 0,
    transform: [
      {
        translateY: 100,
      },
    ],
  },
  chatContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    margin: 10,
  },
  chatInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  chatResponse: {
    color: 'white',
    marginTop: 10,
  },
});

export default App;
