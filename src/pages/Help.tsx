import React from 'react';
import {
  Help as HelpPage,
  Container,
} from 'ordering-ui-native-release/themes/original';
import { useBusiness } from 'ordering-components-external/native'
import settings from '../config.js'

const Help = (props: any) => {
  const [businessState] = useBusiness();

  const helpProps = {
    ...props,
    businessId: businessState?.business?.id,
    franchiseId: settings?.franchiseSlug,
  }
  return (
    <Container>
      <HelpPage {...helpProps} />
    </Container>
  );
};

export default Help;
