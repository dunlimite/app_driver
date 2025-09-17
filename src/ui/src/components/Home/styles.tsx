import { Platform } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  flex: 1;
  height: ${(props: any) =>
    props?.orientation === 'Portrait' && props?.height
      ? `${props.height}px`
      : 'auto'};
`;

export const LogoWrapper = styled.View`
  margin-vertical: 85px;
  align-items: center;
  justify-content: center;
`;

export const WrapperContainer = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  padding: 10px 22px;
  background-color:#ffffff
`

export const BackgroundImage = styled.ImageBackground`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

export const FormInput = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height:  ${Platform.OS === 'android' ?  60 : 50}px;
  min-height:  ${Platform.OS === 'android' ?  60 : 50}px;
`;
