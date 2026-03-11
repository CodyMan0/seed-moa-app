import * as React from 'react';
import { View } from 'react-native';
import { cn } from './lib/utils';

interface ProgressProps extends React.ComponentProps<typeof View> {
  value?: number;
  max?: number;
  indicatorClassName?: string;
}

function Progress({ className, value = 0, max = 100, indicatorClassName, ...props }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <View
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
      role="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}
      {...props}
    >
      <View
        className={cn('h-full rounded-full bg-primary', indicatorClassName)}
        style={{ width: `${percentage}%` }}
      />
    </View>
  );
}

export { Progress };
export type { ProgressProps };
