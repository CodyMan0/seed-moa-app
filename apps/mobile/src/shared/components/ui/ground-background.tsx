import { StyleSheet, useWindowDimensions, View } from 'react-native'
import Svg, { Path, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg'

export function GroundBackground() {
  const { width } = useWindowDimensions()
  const h = 260
  return (
    <View style={[StyleSheet.absoluteFill, { top: 'auto', height: h }]} pointerEvents="none">
      <Svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
        <Defs>
          <SvgLinearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#C4A882" stopOpacity="0.15" />
            <Stop offset="0.4" stopColor="#A08060" stopOpacity="0.25" />
            <Stop offset="1" stopColor="#7A5C3E" stopOpacity="0.35" />
          </SvgLinearGradient>
          <SvgLinearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#8BA87A" stopOpacity="0.2" />
            <Stop offset="1" stopColor="#6B8A5A" stopOpacity="0.1" />
          </SvgLinearGradient>
        </Defs>
        <Path
          d={`M0 80 Q${width * 0.12} 40 ${width * 0.28} 65 Q${width * 0.45} 95 ${width * 0.62} 55 Q${width * 0.8} 30 ${width} 70 L${width} ${h} L0 ${h} Z`}
          fill="url(#soil)"
        />
        <Path
          d={`M0 75 Q${width * 0.08} 50 ${width * 0.2} 60 Q${width * 0.35} 78 ${width * 0.5} 52 Q${width * 0.68} 32 ${width * 0.85} 58 Q${width * 0.95} 68 ${width} 65 L${width} 90 Q${width * 0.85} 72 ${width * 0.65} 50 Q${width * 0.5} 70 ${width * 0.3} 80 Q${width * 0.15} 65 0 85 Z`}
          fill="url(#grass)"
        />
      </Svg>
    </View>
  )
}
