import React from 'react'
import { Promotions as PromotionsController } from 'ordering-ui-native-release/themes/original'
import { Platform } from 'react-native';
import styled from 'styled-components/native';

const Promotions = (props: any) => {
  const promotionsProps = {
    ...props
  }

  return (
    <PromotionsController {...promotionsProps} />
  )
}

export default Promotions
