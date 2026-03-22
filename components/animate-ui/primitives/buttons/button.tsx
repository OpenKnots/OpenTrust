'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

type ButtonProps = HTMLMotionProps<'button'> & {
  hoverScale?: number;
  tapScale?: number;
};

function Button({
  hoverScale = 1.05,
  tapScale = 0.95,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      {...props}
    />
  );
}

export { Button, type ButtonProps };
