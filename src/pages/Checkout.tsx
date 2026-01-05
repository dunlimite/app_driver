import React from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Checkout } from '../components/Checkout';
import { initStripe, useConfirmPayment } from '@stripe/stripe-react-native';

import {
  useOrder,
  useLanguage,
  ToastType,
  useToast,
  useSession,
  useConfig
} from 'ordering-components-external/native';

const stripePaymentOptions = ['stripe', 'stripe_direct', 'stripe_connect', 'google_pay', 'apple_pay'];
import settings from '../config.js'

export const CheckoutPage = (props: any) => {
  const { showToast } = useToast();
  const [, t] = useLanguage();
  const [{ user }] = useSession()
  const [{configs}] = useConfig()
  const [orderState, { confirmCart, changeMoment }] = useOrder();
  const { confirmPayment, loading: confirmPaymentLoading } = useConfirmPayment();
  const currentDate = new Date();
  const cateringTypes = [7, 8]
  const cateringTypeString = orderState?.options?.type === 7
  ? 'catering_delivery'
  : orderState?.options?.type === 8
  ? 'catering_pickup'
  : null
  const splitCateringValue = (configName : string) => Object.values(configs)?.find((config : any) => config.key === configName)?.value?.split('|')?.find((val : any) => val.includes(cateringTypeString))?.split(',')[1]
  const preorderMaximumDays = parseInt(splitCateringValue('preorder_maximum_days'))
  const limitDays = cateringTypes.includes(orderState?.options?.type) ? preorderMaximumDays ?? configs?.max_days_preorder?.value : configs?.max_days_preorder?.value;
  const time =
    limitDays > 1
      ? currentDate.getTime() + (limitDays - 1) * 24 * 60 * 60 * 1000
      : limitDays === 1
        ? currentDate.getTime()
        : currentDate.getTime() + 6 * 24 * 60 * 60 * 1000;

  currentDate.setTime(time);
  currentDate.setHours(23);
  currentDate.setMinutes(59);
  const checkoutProps = {
    ...props,
    cartUuid: props?.cartUuid || props.route?.params?.cartUuid,
    businessLogo: props.route?.params?.businessLogo,
    businessName: props.route?.params?.businessName,
    cartTotal: props.route?.params?.cartTotal,
    fromProductsList: props.route?.params?.fromProductsList,
    stripePaymentOptions,
    isFranchiseApp: !!settings?.franchiseSlug,
    merchantId: settings?.merchantId,
    urlscheme: settings?.app_scheme,
    androidAppId: settings.android_app_id,
    maxDate: currentDate,
    fromMulti: props.route?.params?.fromMulti,
    onPlaceOrderClick: async (data: any, paymethod: any, cart: any) => {
      if (cart?.order?.uuid) {
        if (orderState?.options?.moment) {
          changeMoment(null);
        }
        props.navigation.replace('OrderDetails', {
          orderId: cart.order?.uuid,
          isFromCheckout: true,
        });
        return;
      }

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
        } catch (error) {
          showToast(ToastType.Error, error?.toString() || error.message);
        }
        try {
          const paymentIntent = await confirmPayment(clientSecret, {
            paymentMethodType: 'Card',
            paymentMethodData: {
              paymentMethodId: paymentMethodId,
              billingDetails: {
                email: user?.email,
                ...data
              },
            },
          });
          if (paymentIntent.error) {
            showToast(ToastType.Error, paymentIntent.error.message);
          }

          props.handleIsRedirect && props.handleIsRedirect(true);
          try {
            const confirmCartRes = await confirmCart(cart?.uuid);
            if (confirmCartRes.error) {
              showToast(ToastType.Error, confirmCartRes.error.message);
            }
            if (confirmCartRes.result.order?.uuid) {
              props.navigation.replace('OrderDetails', {
                orderId: confirmCartRes.result.order.uuid,
                isFromCheckout: true,
              });
              return;
            }
          } catch (error) {
            showToast(ToastType.Error, error?.toString() || error.message);
          }
          return;
        } catch (error) {
          const e =
            error?.message?.toLowerCase() === 'failed'
              ? t('FAILED_PAYMENT', 'The payment has failed')
              : error?.toString() || error.message;
          showToast(ToastType.Error, e);
        }
      }
    },
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      props.navigation.navigate(page, params);
    },
  };
  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Checkout {...checkoutProps} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 70,
  },
});

export default CheckoutPage;
