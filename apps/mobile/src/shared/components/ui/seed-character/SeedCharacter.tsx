import * as React from 'react';
import Svg, {
  Circle,
  Ellipse,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from 'react-native-svg';
import type { GrowthStage } from '../lib/growth';

interface SeedCharacterProps {
  stage: GrowthStage;
  size?: number;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

/** Shadow under the seed body for grounding */
function BodyShadow({ cy }: { cy: number }) {
  return (
    <Ellipse
      cx={50}
      cy={cy + 16}
      rx={18}
      ry={4}
      fill="rgba(80,50,20,0.12)"
    />
  );
}

/** Chubby gradient seed body */
function SeedBody({ cy }: { cy: number }) {
  return (
    <>
      {/* Base body */}
      <Ellipse cx={50} cy={cy} rx={23} ry={19} fill="url(#seedGrad)" />
      {/* Rim stroke for definition */}
      <Ellipse
        cx={50}
        cy={cy}
        rx={23}
        ry={19}
        fill="none"
        stroke="#A0673A"
        strokeWidth={1.2}
        strokeOpacity={0.5}
      />
      {/* Shine highlight — top-left */}
      <Ellipse
        cx={43}
        cy={cy - 7}
        rx={7}
        ry={4}
        fill="rgba(255,255,255,0.28)"
        transform={`rotate(-20, 43, ${cy - 7})`}
      />
    </>
  );
}

/** Tiny dot eyes with white sparkle — neutral */
function DotEyes({ cy }: { cy: number }) {
  return (
    <>
      {/* Left eye */}
      <Circle cx={43} cy={cy} r={3} fill="#3D2010" />
      <Circle cx={44.2} cy={cy - 1.2} r={1} fill="white" />
      {/* Right eye */}
      <Circle cx={57} cy={cy} r={3} fill="#3D2010" />
      <Circle cx={58.2} cy={cy - 1.2} r={1} fill="white" />
    </>
  );
}

/** Round blush cheeks */
function Blush({ cy }: { cy: number }) {
  return (
    <>
      <Circle cx={37} cy={cy + 4} r={4.5} fill="rgba(255,150,130,0.28)" />
      <Circle cx={63} cy={cy + 4} r={4.5} fill="rgba(255,150,130,0.28)" />
    </>
  );
}

/** Happy wide eyes with sparkle — for stages 3 & 4 */
function HappyDotEyes({ cy }: { cy: number }) {
  return (
    <>
      {/* Left eye */}
      <Circle cx={43} cy={cy} r={3.4} fill="#3D2010" />
      <Circle cx={44.4} cy={cy - 1.4} r={1.1} fill="white" />
      <Circle cx={42.2} cy={cy + 1.2} r={0.5} fill="rgba(255,255,255,0.6)" />
      {/* Right eye */}
      <Circle cx={57} cy={cy} r={3.4} fill="#3D2010" />
      <Circle cx={58.4} cy={cy - 1.4} r={1.1} fill="white" />
      <Circle cx={56.2} cy={cy + 1.2} r={0.5} fill="rgba(255,255,255,0.6)" />
    </>
  );
}

/** Beaming arch eyes (^^ shape) — for stage 5 */
function BeamingEyes({ cy }: { cy: number }) {
  return (
    <>
      <Path
        d={`M39,${cy + 1} Q43,${cy - 5} 47,${cy + 1}`}
        fill="none"
        stroke="#3D2010"
        strokeWidth={2.8}
        strokeLinecap="round"
      />
      <Path
        d={`M53,${cy + 1} Q57,${cy - 5} 61,${cy + 1}`}
        fill="none"
        stroke="#3D2010"
        strokeWidth={2.8}
        strokeLinecap="round"
      />
    </>
  );
}

/** Tiny curved smile */
function Smile({ cy, width = 1 }: { cy: number; width?: number }) {
  return (
    <Path
      d={`M46,${cy} Q50,${cy + 3 * width} 54,${cy}`}
      fill="none"
      stroke="#A0673A"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  );
}

/** Organic leaf with vein detail */
function Leaf({
  cx,
  cy,
  flip,
  gradient,
}: {
  cx: number;
  cy: number;
  flip?: boolean;
  gradient: string;
}) {
  const sign = flip ? -1 : 1;
  // Leaf tip extends outward from stem
  const tipX = cx + sign * 18;
  const tipY = cy - 6;
  const ctrl1X = cx + sign * 4;
  const ctrl1Y = cy - 16;
  const ctrl2X = cx + sign * 16;
  const ctrl2Y = cy - 16;
  const baseCtrlX = cx + sign * 2;
  const baseCtrlY = cy + 4;

  const leafPath = `M${cx},${cy} C${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${tipX},${tipY} C${ctrl2X},${cy - 2} ${baseCtrlX},${baseCtrlY} ${cx},${cy}`;
  const veinPath = `M${cx},${cy} Q${cx + sign * 10},${cy - 10} ${tipX},${tipY}`;

  return (
    <G>
      <Path d={leafPath} fill={`url(#${gradient})`} />
      <Path
        d={veinPath}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={0.8}
        strokeLinecap="round"
      />
    </G>
  );
}

/** Stem segment */
function Stem({ y1, y2 }: { y1: number; y2: number }) {
  return (
    <Path
      d={`M50,${y1} L50,${y2}`}
      stroke="url(#stemGrad)"
      strokeWidth={3.5}
      strokeLinecap="round"
    />
  );
}

/** Gradient bud */
function Bud({ cy }: { cy: number }) {
  return (
    <>
      {/* Sepal petals behind bud */}
      <Ellipse
        cx={50}
        cy={cy + 2}
        rx={4}
        ry={5}
        fill="url(#leafGradL)"
        transform={`rotate(-20, 50, ${cy + 2})`}
      />
      <Ellipse
        cx={50}
        cy={cy + 2}
        rx={4}
        ry={5}
        fill="url(#leafGradR)"
        transform={`rotate(20, 50, ${cy + 2})`}
      />
      {/* Main bud body */}
      <Ellipse cx={50} cy={cy} rx={6.5} ry={9} fill="url(#budGrad)" />
      {/* Bud shine */}
      <Ellipse
        cx={47.5}
        cy={cy - 3}
        rx={2}
        ry={2.5}
        fill="rgba(255,255,255,0.35)"
        transform={`rotate(-10, 47.5, ${cy - 3})`}
      />
    </>
  );
}

/** Full flower — layered petals with gradient + center */
function Flower({ cy }: { cy: number }) {
  const petalAngles = [0, 60, 120, 180, 240, 300];
  const innerAngles = [30, 90, 150, 210, 270, 330];

  return (
    <G>
      {/* Outer petals */}
      {petalAngles.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const px = 50 + Math.cos(rad) * 11;
        const py = cy + Math.sin(rad) * 11;
        return (
          <Ellipse
            key={`op-${angle}`}
            cx={px}
            cy={py}
            rx={5.5}
            ry={8}
            fill="url(#petalGrad)"
            transform={`rotate(${angle}, ${px}, ${py})`}
          />
        );
      })}
      {/* Inner petals (slightly different hue for depth) */}
      {innerAngles.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const px = 50 + Math.cos(rad) * 7;
        const py = cy + Math.sin(rad) * 7;
        return (
          <Ellipse
            key={`ip-${angle}`}
            cx={px}
            cy={py}
            rx={3.5}
            ry={5.5}
            fill="url(#petalInnerGrad)"
            transform={`rotate(${angle}, ${px}, ${py})`}
          />
        );
      })}
      {/* Center disc */}
      <Circle cx={50} cy={cy} r={6} fill="url(#centerGrad)" />
      {/* Center highlight */}
      <Circle cx={48.5} cy={cy - 2} r={2} fill="rgba(255,255,255,0.4)" />

      {/* Tiny sparkle top-left of flower */}
      <Path
        d={`M${50 - 16},${cy - 14} L${50 - 15},${cy - 16} L${50 - 14},${cy - 14} L${50 - 12},${cy - 13} L${50 - 14},${cy - 12} L${50 - 15},${cy - 10} L${50 - 16},${cy - 12} L${50 - 18},${cy - 13} Z`}
        fill="#FFD180"
        opacity={0.85}
      />
      {/* Tiny sparkle top-right */}
      <Path
        d={`M${50 + 15},${cy - 17} L${50 + 16},${cy - 19} L${50 + 17},${cy - 17} L${50 + 19},${cy - 16} L${50 + 17},${cy - 15} L${50 + 16},${cy - 13} L${50 + 15},${cy - 15} L${50 + 13},${cy - 16} Z`}
        fill="#FFD180"
        opacity={0.7}
      />
    </G>
  );
}

// ─── All gradient definitions ──────────────────────────────────────────────────

function AllDefs() {
  return (
    <Defs>
      {/* Seed body — warm caramel radial */}
      <RadialGradient
        id="seedGrad"
        cx="40%"
        cy="35%"
        r="65%"
        fx="40%"
        fy="35%"
      >
        <Stop offset="0%" stopColor="#F0C28A" />
        <Stop offset="55%" stopColor="#D4904E" />
        <Stop offset="100%" stopColor="#A86030" />
      </RadialGradient>

      {/* Stem */}
      <LinearGradient id="stemGrad" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0%" stopColor="#6DB56A" />
        <Stop offset="50%" stopColor="#4A9647" />
        <Stop offset="100%" stopColor="#6DB56A" />
      </LinearGradient>

      {/* Leaf left-side (goes left from stem) */}
      <LinearGradient id="leafGradL" x1="1" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#7DC97A" />
        <Stop offset="100%" stopColor="#3E8A3B" />
      </LinearGradient>

      {/* Leaf right-side */}
      <LinearGradient id="leafGradR" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#7DC97A" />
        <Stop offset="100%" stopColor="#3E8A3B" />
      </LinearGradient>

      {/* Bud */}
      <LinearGradient id="budGrad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#FFA07A" />
        <Stop offset="60%" stopColor="#E8694A" />
        <Stop offset="100%" stopColor="#C04E30" />
      </LinearGradient>

      {/* Outer petal */}
      <RadialGradient
        id="petalGrad"
        cx="50%"
        cy="30%"
        r="70%"
        fx="50%"
        fy="30%"
      >
        <Stop offset="0%" stopColor="#FFB899" />
        <Stop offset="100%" stopColor="#E8663A" />
      </RadialGradient>

      {/* Inner petal */}
      <RadialGradient
        id="petalInnerGrad"
        cx="50%"
        cy="30%"
        r="70%"
        fx="50%"
        fy="30%"
      >
        <Stop offset="0%" stopColor="#FFCBA0" />
        <Stop offset="100%" stopColor="#F07840" />
      </RadialGradient>

      {/* Flower center disc */}
      <RadialGradient
        id="centerGrad"
        cx="40%"
        cy="35%"
        r="65%"
        fx="40%"
        fy="35%"
      >
        <Stop offset="0%" stopColor="#FFE08A" />
        <Stop offset="100%" stopColor="#E8A020" />
      </RadialGradient>

      {/* Tiny sprout leaf */}
      <LinearGradient id="sproutGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#90D08C" />
        <Stop offset="100%" stopColor="#4A9647" />
      </LinearGradient>
    </Defs>
  );
}

// ─── Tiny sprout used in stage 2 ──────────────────────────────────────────────

function TinySprout({ tipY }: { tipY: number }) {
  // A single small organic leaf curving to the right
  return (
    <G>
      <Path
        d={`M50,${tipY + 2} C52,${tipY - 6} 60,${tipY - 4} 58,${tipY + 4} C55,${tipY + 8} 50,${tipY + 2} 50,${tipY + 2}`}
        fill="url(#sproutGrad)"
      />
      <Path
        d={`M50,${tipY + 2} Q54,${tipY} 58,${tipY + 4}`}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={0.7}
        strokeLinecap="round"
      />
    </G>
  );
}

// ─── Stage components ──────────────────────────────────────────────────────────

/** Stage 1: Bare cute seed */
function Stage1() {
  const bodyY = 56;
  return (
    <G>
      <AllDefs />
      <BodyShadow cy={bodyY} />
      <SeedBody cy={bodyY} />
      <DotEyes cy={bodyY - 2} />
      <Blush cy={bodyY - 2} />
      <Smile cy={bodyY + 5} width={0.8} />
    </G>
  );
}

/** Stage 2: Seed + small sprout */
function Stage2() {
  const bodyY = 57;
  const stemTop = 38;
  return (
    <G>
      <AllDefs />
      <Stem y1={bodyY - 19} y2={stemTop} />
      <TinySprout tipY={stemTop} />
      <BodyShadow cy={bodyY} />
      <SeedBody cy={bodyY} />
      <DotEyes cy={bodyY - 2} />
      <Blush cy={bodyY - 2} />
      <Smile cy={bodyY + 5} width={1.0} />
    </G>
  );
}

/** Stage 3: Taller stem + 2 organic leaves */
function Stage3() {
  const bodyY = 57;
  const stemTop = 22;
  return (
    <G>
      <AllDefs />
      <Stem y1={bodyY - 19} y2={stemTop} />
      {/* Lower leaf going right */}
      <Leaf cx={50} cy={38} gradient="leafGradR" />
      {/* Upper leaf going left */}
      <Leaf cx={50} cy={29} flip gradient="leafGradL" />
      <BodyShadow cy={bodyY} />
      <SeedBody cy={bodyY} />
      <HappyDotEyes cy={bodyY - 2} />
      <Blush cy={bodyY - 2} />
      <Smile cy={bodyY + 5} width={1.2} />
    </G>
  );
}

/** Stage 4: Stem + leaves + forming bud */
function Stage4() {
  const bodyY = 57;
  const stemTop = 18;
  return (
    <G>
      <AllDefs />
      <Stem y1={bodyY - 19} y2={stemTop + 10} />
      {/* Lower leaf going right */}
      <Leaf cx={50} cy={40} gradient="leafGradR" />
      {/* Upper leaf going left */}
      <Leaf cx={50} cy={31} flip gradient="leafGradL" />
      <Bud cy={stemTop} />
      <BodyShadow cy={bodyY} />
      <SeedBody cy={bodyY} />
      <HappyDotEyes cy={bodyY - 2} />
      <Blush cy={bodyY - 2} />
      <Smile cy={bodyY + 5} width={1.4} />
    </G>
  );
}

/** Stage 5: Full gorgeous flower + beaming eyes + sparkles */
function Stage5() {
  const bodyY = 57;
  const stemTop = 22;
  const flowerCY = 13;
  return (
    <G>
      <AllDefs />
      <Stem y1={bodyY - 19} y2={stemTop} />
      {/* Lower leaf going right */}
      <Leaf cx={50} cy={38} gradient="leafGradR" />
      {/* Upper leaf going left */}
      <Leaf cx={50} cy={30} flip gradient="leafGradL" />
      <Flower cy={flowerCY} />
      <BodyShadow cy={bodyY} />
      <SeedBody cy={bodyY} />
      <BeamingEyes cy={bodyY - 2} />
      <Blush cy={bodyY - 2} />
      <Smile cy={bodyY + 6} width={1.6} />
    </G>
  );
}

// ─── Public component ──────────────────────────────────────────────────────────

/**
 * A visual seed/growth character representing memorization progress.
 * Renders an SVG seed that grows through 5 stages from seed to flower.
 */
export function SeedCharacter({ stage, size = 80 }: SeedCharacterProps) {
  const StageComponent = {
    1: Stage1,
    2: Stage2,
    3: Stage3,
    4: Stage4,
    5: Stage5,
  }[stage];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 80">
      <StageComponent />
    </Svg>
  );
}
