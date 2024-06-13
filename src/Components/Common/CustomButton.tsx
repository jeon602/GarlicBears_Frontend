import React from 'react';
import { Button } from '@chakra-ui/react';
import { CustomButtonProps } from '../../Types/common';

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'solid',
  text = '게임하기',
  width = 400,
  height = 80,
  onClick,
  colorScheme = 'customOrange',
}) => {
  return (
    <Button
      colorScheme={colorScheme}
      fontSize="1.5rem"
      variant={variant}
      width={{ base: '280px', md: `${width}px` }}
      height={`${height}px`}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default React.memo(CustomButton);