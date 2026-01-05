import React from 'react';
import {
  HelpOptions as HelpOptionsPage,
  Container,
} from 'ordering-ui-native-release/themes/original';

const HelpOptions = (props: any) => {
  const helpProps = {
    ...props,
    ...props.route?.params,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack()
  }

  return (
    <Container>
      <HelpOptionsPage {...helpProps} />
    </Container>
  );
};

export default HelpOptions;
