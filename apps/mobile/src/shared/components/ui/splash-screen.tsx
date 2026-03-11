import * as React from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import { Text } from '@/shared/components/ui/text'
import { SeedCharacter } from '@/shared/components/ui/seed-character'

interface AppSplashScreenProps {
  onFinish: () => void
}

export function AppSplashScreen({ onFinish }: AppSplashScreenProps) {
  // Seed entrance: scale bounce from 0 → overshoot → settle
  const seedScale = useSharedValue(0)
  const seedRotate = useSharedValue(-15)

  // Seed idle bounce (up and down)
  const seedTranslateY = useSharedValue(0)

  // Title fade + slide
  const titleOpacity = useSharedValue(0)
  const titleTranslateY = useSharedValue(20)

  // Subtitle fade
  const subtitleOpacity = useSharedValue(0)

  // Small seed particles
  const particle1Opacity = useSharedValue(0)
  const particle2Opacity = useSharedValue(0)
  const particle3Opacity = useSharedValue(0)
  const particle1Y = useSharedValue(0)
  const particle2Y = useSharedValue(0)
  const particle3Y = useSharedValue(0)
  const particle1X = useSharedValue(-30)
  const particle2X = useSharedValue(35)
  const particle3X = useSharedValue(-20)

  React.useEffect(() => {
    // 1. Seed pops in with spring (0 → 1.15 → 1.0)
    seedScale.value = withSpring(1, {
      damping: 8,
      stiffness: 120,
      mass: 0.8,
    })

    // Seed rotation settles
    seedRotate.value = withSpring(0, {
      damping: 10,
      stiffness: 80,
    })

    // 2. After entrance, idle bounce
    seedTranslateY.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    )

    // 3. Particles pop out
    const particleDelay = 300
    // Particle 1 - top left
    particle1Opacity.value = withDelay(particleDelay, withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(800, withTiming(0, { duration: 300 })),
    ))
    particle1Y.value = withDelay(particleDelay, withTiming(-40, { duration: 500, easing: Easing.out(Easing.ease) }))
    particle1X.value = withDelay(particleDelay, withTiming(-50, { duration: 500, easing: Easing.out(Easing.ease) }))

    // Particle 2 - top right
    particle2Opacity.value = withDelay(particleDelay + 150, withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(700, withTiming(0, { duration: 300 })),
    ))
    particle2Y.value = withDelay(particleDelay + 150, withTiming(-35, { duration: 500, easing: Easing.out(Easing.ease) }))
    particle2X.value = withDelay(particleDelay + 150, withTiming(55, { duration: 500, easing: Easing.out(Easing.ease) }))

    // Particle 3 - left
    particle3Opacity.value = withDelay(particleDelay + 300, withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(600, withTiming(0, { duration: 300 })),
    ))
    particle3Y.value = withDelay(particleDelay + 300, withTiming(-25, { duration: 500, easing: Easing.out(Easing.ease) }))
    particle3X.value = withDelay(particleDelay + 300, withTiming(-45, { duration: 500, easing: Easing.out(Easing.ease) }))

    // 4. Title slides up + fades in
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 500 }))
    titleTranslateY.value = withDelay(500, withSpring(0, { damping: 12, stiffness: 100 }))

    // 5. Subtitle fades in
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 500 }))

    // 6. Exit after 2.5s
    const timer = setTimeout(() => {
      runOnJS(onFinish)()
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const seedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: seedScale.value },
      { rotate: `${seedRotate.value}deg` },
      { translateY: seedTranslateY.value },
    ],
  }))

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }))

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }))

  const particle1Style = useAnimatedStyle(() => ({
    opacity: particle1Opacity.value,
    transform: [
      { translateX: particle1X.value },
      { translateY: particle1Y.value },
      { scale: 0.4 },
    ],
  }))

  const particle2Style = useAnimatedStyle(() => ({
    opacity: particle2Opacity.value,
    transform: [
      { translateX: particle2X.value },
      { translateY: particle2Y.value },
      { scale: 0.3 },
    ],
  }))

  const particle3Style = useAnimatedStyle(() => ({
    opacity: particle3Opacity.value,
    transform: [
      { translateX: particle3X.value },
      { translateY: particle3Y.value },
      { scale: 0.25 },
    ],
  }))

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <View className="items-center">
        {/* Seed with particles */}
        <View className="items-center justify-center" style={{ width: 200, height: 200 }}>
          {/* Particles - tiny seeds flying out */}
          <Animated.View style={[{ position: 'absolute' }, particle1Style]}>
            <SeedCharacter stage={1} size={40} />
          </Animated.View>
          <Animated.View style={[{ position: 'absolute' }, particle2Style]}>
            <SeedCharacter stage={1} size={40} />
          </Animated.View>
          <Animated.View style={[{ position: 'absolute' }, particle3Style]}>
            <SeedCharacter stage={1} size={40} />
          </Animated.View>

          {/* Main seed character - big and bouncy */}
          <Animated.View style={seedAnimatedStyle}>
            <SeedCharacter stage={1} size={160} />
          </Animated.View>
        </View>

        {/* Title */}
        <Animated.View style={[{ marginTop: 16 }, titleAnimatedStyle]}>
          <Text style={{ fontFamily: 'Pretendard-Bold' }} className="text-4xl text-foreground">
            씨앗모아
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={[{ marginTop: 8 }, subtitleAnimatedStyle]}>
          <Text variant="muted" className="text-base">
            마음 밭에 말씀을 심어보세요
          </Text>
        </Animated.View>
      </View>
    </View>
  )
}
