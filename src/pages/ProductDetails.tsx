import * as React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { ProductForm as ProductFormController } from 'ordering-ui-native-release/themes/original';

interface Props {
  navigation: any;
  route: any;
}
const ProductDetails = (props: Props) => {
  const theme = useTheme()
  const productProps = {
    ...props,
    isCartProduct: props.route.params?.isCartProduct,
    isFromCheckout: props.route.params?.isFromCheckout,
    productCart: props.route.params?.productCart,
    product: props.route.params?.product,
    businessSlug: props.route.params?.businessSlug,
    businessId: props.route.params?.businessId,
    categoryId: props.route.params?.categoryId,
    productId: props.route.params?.productId,
    productAddedToCartLength: props.route.params?.productAddedToCartLength || 0,
    onSave: props?.navigation?.canGoBack()
      ? (props?.route?.params?.isRedirect === 'business' && !props?.route?.params?.alreadyInBusinessListing ? () => props?.navigation?.replace('Business', {
        store: props?.route?.params?.business?.store,
        header: props?.route?.params?.business?.header,
        logo: props?.route?.params?.business?.logo,
      }) : () => props?.navigation?.goBack())
      : () => props?.navigation?.navigate('BottomTab'),
  };
  const BusinessProductsListView = styled.SafeAreaView`
    flex: 1;
    background-color: ${theme.colors.backgroundPage};
  `;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BusinessProductsListView>
        <ProductFormController {...productProps} />
      </BusinessProductsListView>
    </KeyboardAvoidingView>
  );
};

export default ProductDetails;
