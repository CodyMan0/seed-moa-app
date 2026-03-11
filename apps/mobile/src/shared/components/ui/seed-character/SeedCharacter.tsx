import * as React from 'react';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import type { GrowthStage } from '../lib/growth';

interface SeedCharacterProps {
  stage: GrowthStage;
  size?: number;
}

const SEED_COLOR = '#D4A574';
const SEED_DARK = '#B8895A';
const SPROUT_COLOR = '#4CAF50';
const SPROUT_LIGHT = '#81C784';
const BLOOM_COLOR = '#FF8F50';
const BLOOM_LIGHT = '#FFB085';
const EYE_COLOR = '#3D2E1C';

function SeedBody({ cy }: { cy: number }) {
  return (
    <>
      <Ellipse cx={50} cy={cy} rx={22} ry={18} fill={SEED_COLOR} />
      <Ellipse
        cx={50}
        cy={cy}
        rx={22}
        ry={18}
        fill="none"
        stroke={SEED_DARK}
        strokeWidth={1.5}
      />
    </>
  );
}

function DotEyes({ cy }: { cy: number }) {
  return (
    <>
      <Circle cx={43} cy={cy} r={2.5} fill={EYE_COLOR} />
      <Circle cx={57} cy={cy} r={2.5} fill={EYE_COLOR} />
    </>
  );
}

function HappyEyes({ cy }: { cy: number }) {
  return (
    <>
      <Path
        d={`M40,${cy} Q43,${cy - 4} 46,${cy}`}
        fill="none"
        stroke={EYE_COLOR}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Path
        d={`M54,${cy} Q57,${cy - 4} 60,${cy}`}
        fill="none"
        stroke={EYE_COLOR}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </>
  );
}

function SmallLeaf({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  const scaleX = flip ? -1 : 1;
  return (
    <G transform={`translate(${x}, ${y}) scale(${scaleX}, 1)`}>
      <Path
        d="M0,0 Q8,-12 4,-18 Q-2,-10 0,0"
        fill={SPROUT_COLOR}
        stroke={SPROUT_LIGHT}
        strokeWidth={0.8}
      />
    </G>
  );
}

/** Stage 1: bare seed */
function Stage1() {
  return (
    <G>
      <SeedBody cy={60} />
      <DotEyes cy={58} />
    </G>
  );
}

/** Stage 2: seed + small sprout leaf */
function Stage2() {
  return (
    <G>
      <Path
        d="M50,42 L50,34"
        stroke={SPROUT_COLOR}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <SmallLeaf x={50} y={34} />
      <SeedBody cy={60} />
      <DotEyes cy={58} />
    </G>
  );
}

/** Stage 3: taller stem + 2 leaves */
function Stage3() {
  return (
    <G>
      <Path
        d="M50,42 L50,22"
        stroke={SPROUT_COLOR}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <SmallLeaf x={50} y={28} />
      <SmallLeaf x={50} y={36} flip />
      <SeedBody cy={60} />
      <DotEyes cy={58} />
    </G>
  );
}

/** Stage 4: stem + leaves + orange bud */
function Stage4() {
  return (
    <G>
      <Path
        d="M50,42 L50,18"
        stroke={SPROUT_COLOR}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <SmallLeaf x={50} y={28} />
      <SmallLeaf x={50} y={36} flip />
      <Ellipse cx={50} cy={14} rx={6} ry={8} fill={BLOOM_LIGHT} />
      <Ellipse
        cx={50}
        cy={14}
        rx={6}
        ry={8}
        fill="none"
        stroke={BLOOM_COLOR}
        strokeWidth={1}
      />
      <SeedBody cy={60} />
      <DotEyes cy={58} />
    </G>
  );
}

/** Stage 5: full flower with petals + happy eyes */
function Stage5() {
  const petalAngles = [0, 60, 120, 180, 240, 300];
  const centerY = 14;
  const petalR = 8;

  return (
    <G>
      <Path
        d="M50,42 L50,22"
        stroke={SPROUT_COLOR}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <SmallLeaf x={50} y={30} />
      <SmallLeaf x={50} y={36} flip />
      {petalAngles.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const px = 50 + Math.cos(rad) * petalR;
        const py = centerY + Math.sin(rad) * petalR;
        return (
          <Ellipse
            key={angle}
            cx={px}
            cy={py}
            rx={5}
            ry={7}
            fill={BLOOM_COLOR}
            transform={`rotate(${angle}, ${px}, ${py})`}
          />
        );
      })}
      <Circle cx={50} cy={centerY} r={5} fill={BLOOM_LIGHT} />
      <Circle
        cx={50}
        cy={centerY}
        r={5}
        fill="none"
        stroke={BLOOM_COLOR}
        strokeWidth={1}
      />
      <SeedBody cy={60} />
      <HappyEyes cy={58} />
    </G>
  );
}

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
