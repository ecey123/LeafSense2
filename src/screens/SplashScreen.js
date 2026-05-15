import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import colors from "../constants/colors";

const letters = "LeafSense".split("");

export default function SplashScreen({ onFinish }) {
  const logoMove = useRef(new Animated.Value(0)).current;
  const letterAnims = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(500),

      Animated.timing(logoMove, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),

      Animated.stagger(
        60,
        letterAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 240,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  const logoTranslateX = logoMove.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  return (
    <View style={styles.splashContainer}>
      <View style={styles.splashContent}>
        <Animated.Image
          source={require("../../assets/logo.png")}
          style={[
            styles.logoImage,
            {
              transform: [{ translateX: logoTranslateX }],
            },
          ]}
          resizeMode="contain"
        />

        <View style={styles.letterWrapper}>
          {letters.map((letter, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.splashLetter,
                {
                  opacity: letterAnims[index],
                  transform: [
                    {
                      translateX: letterAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {letter}
            </Animated.Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  splashContent: {
    width: 330,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 78,
    height: 78,
    position: "absolute",
    zIndex: 2,
  },
  letterWrapper: {
    flexDirection: "row",
    marginLeft: 70,
  },
  splashLetter: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.primary,
  },
});