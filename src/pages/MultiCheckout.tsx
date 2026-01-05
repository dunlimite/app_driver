import React from 'react'
import { Platform, KeyboardAvoidingView, StyleSheet } from 'react-native'
import { StackActions } from '@react-navigation/native';
import { MultiCheckout as MultiCheckoutController } from 'ordering-ui-native-release/themes/original'
import { initStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import {
  useOrder,
  useLanguage,
  ToastType,
  useToast,
} from 'ordering-components-external/native';
import settings from '../config';

const MultiCheckout = (props: any) => {

  const { showToast } = useToast();
  const [, t] = useLanguage();
  const [, { confirmMultiCarts }] = useOrder();
  const { confirmPayment } = useConfirmPayment();

  const stripePaymentOptions = ['stripe', 'stripe_connect', 'stripe_direct', 'google_pay', 'apple_pay']

  const multiCheckoutProps = {
    ...props,
    onPlaceOrderClick: (order: any) => {
      props.navigation.replace('MultiOrdersDetails', { orderId: order?.id, isFromMultiCheckout: true })
    },
    actionsBeforePlace: async (paymethod : any, cart : any) => {
      if (
        cart?.status === 2 &&
        stripePaymentOptions.includes(paymethod?.gateway)
      ) {
        const clientSecret = cart?.paymethod_data?.result?.client_secret;
        const paymentMethodId =
          paymethod?.gateway === 'stripe_connect'
            ? cart.paymethod_data?.result?.payment_method_id
            : cart.paymethod_data?.data?.source_id;
        const stripeAccountId = paymethod?.paymethod?.credentials?.user;
        const publicKey = paymethod.paymethod?.credentials?.publishable || paymethod?.paymethod?.credentials?.publishable_key;

        try {
          const stripeParams = stripeAccountId
            ? {
                publishableKey: publicKey,
                stripeAccountId: stripeAccountId,
              }
            : { publishableKey: publicKey };
          initStripe(stripeParams);
        } catch (error : any) {
          showToast(ToastType.Error, error?.toString() || error.message);
        }

        try {
          const { paymentIntent, error } = await confirmPayment(clientSecret, {
            type: 'Card',
            paymentMethodId,
          });

          if (error) {
            showToast(ToastType.Error, error.message);
          }

          props.handleIsRedirect && props.handleIsRedirect(true);
          try {
            const confirmCartRes = await confirmMultiCarts(props.route?.params?.cartUuid);
            if (confirmCartRes.error) {
              showToast(ToastType.Error, confirmCartRes.error.message);
            }
            if (confirmCartRes.result.order?.id) {
              props.navigation.replace('MultiOrdersDetails', {
                orderId: confirmCartRes.result.order.id,
                isFromCheckout: true,
              });
              return;
            }
          } catch (error : any) {
            showToast(ToastType.Error, error?.toString() || error.message);
          }
          return;
        } catch (error : any) {
          const e =
            error?.message?.toLowerCase() === 'failed'
              ? t('FAILED_PAYMENT', 'The payment has failed')
              : error?.toString() || error.message;
          showToast(ToastType.Error, e);
        }
      }
    },
    onNavigationRedirectReplace: (route: string, params: any) => {
      props.navigation.dispatch(StackActions.replace(route, params))
    },
    cartUuid: props?.cartUuid || props.route?.params?.cartUuid,
    merchantId: settings?.merchantId,
  }

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <MultiCheckoutController {...multiCheckoutProps} />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 70,
  },
});

export default MultiCheckout
