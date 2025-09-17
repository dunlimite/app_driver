import React from "react";
import { Container, LoginForm, DriverEarnings } from '@ui';
import styled, { useTheme } from 'styled-components/native';

const DriverEarning = (props: any) => {
  const theme = useTheme();

  return (
    <>
      {/* <Container style={{ backgroundColor: theme.colors.white }}> */}
        <DriverEarnings {...props} />
      {/* </Container> */}
    </>
  )
}

export default DriverEarning;
