import { Box } from '@material-ui/core';
import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/social-fever.json';

const Empty: React.FunctionComponent = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Box alignItems="center">
      <Lottie options={defaultOptions} height={200} width={200} />
    </Box>
  );
};

export default Empty;
