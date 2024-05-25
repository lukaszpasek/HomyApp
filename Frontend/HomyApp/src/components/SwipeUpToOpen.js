import { Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from "react-native-reanimated";

const SwipeUpToOpen = () => {
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withRepeat(
          withSequence(
            withTiming(-15, { duration: 300 }),
            withDelay(1500, withTiming(0, { duration: 2000 })),
            withTiming(-15)
          ),
          -1
        ),
      },
    ],
    opacity: withRepeat(
      withSequence(
        withDelay(1500, withTiming(0)),
        withDelay(3000, withTiming(1))
      ),
      -1
    ),
  }));

  return (
    <Animated.Text
      style={[
        {
          color: "#6200ea",
          fontWeight: "600",
          alignSelf: "flex-end",
          letterSpacing: 0.5,
        },
        animatedStyles,
      ]}
    >
      Swipe up
    </Animated.Text>
  );
};

export default SwipeUpToOpen;
