import React from 'react'
import { MultiCart as MultiCartController } from 'ordering-ui-native-release/themes/original'

const MultiCart = (props: any) => {

  const multiCheckoutProps = {
    ...props,
    handleOnRedirectMultiCheckout: (cartUuid: string) => {
      props.navigation.navigate('CheckoutNavigator', {
        screen: 'MultiCheckout',
        cartUuid: cartUuid
      })
    },
    handleOnRedirectCheckout: (cartUuid: string) => {
      props.navigation.navigate('CheckoutNavigator', {
        screen: 'CheckoutPage',
        cartUuid: cartUuid
      })
    },
    cartUuid: props.route?.params?.cartUuid,
    cartGroup: props.route?.params?.cartGroup
  }

  return (
    <>
      <MultiCartController {...multiCheckoutProps} />
    </>
  )
}

export default MultiCart
