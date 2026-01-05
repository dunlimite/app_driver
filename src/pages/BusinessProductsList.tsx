import React from 'react';
import { View } from 'react-native'
import { StackActions } from '@react-navigation/native';
import { useApi } from 'ordering-components-external/native';
import { BusinessProductsListing as BusinessProductsListController } from '../components/BusinessProductsListing';
import { useTheme } from 'styled-components/native';
import settings from '../config';

const BusinessProductsList = (props: any) => {
  const theme = useTheme();
  const [ordering] = useApi();
  const store =
  settings?.businessSlug || (props.route.params?.store ?? props.route.params?.productLogin?.store_slug);
  const header = props.route.params?.header;
  const logo = props.route.params?.logo;
  const product = props.route.params?.productId ? {
    categoryId: props.route?.params?.categoryId,
    businessId: parseInt(props.route?.params?.store),
    id: props.route?.params?.productId
  } : props.route.params?.productLogin;

  const fromMulti = props.route.params?.fromMulti
  const businessProductsProps = {
    ...props,
    ordering,
    isSearchByName: true,
    isSearchByDescription: true,
    slug: store,
    businessSingleId: settings?.businessSlug,
    businessProps: [
      'id',
      'name',
      'header',
      'logo',
      'name',
      'open',
      'about',
      'ribbon',
      'description',
      'address',
      'address_notes',
      'location',
      'timezone',
      'schedule',
      'service_fee',
      'delivery_price',
      'distance',
      'delivery_time',
      'gallery',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
      'products',
      'zones',
      'professionals',
      'facebook_profile',
      'instagram_profile',
      'tiktok_profile',
      'pinterest_profile',
      'whatsapp_number',
      'snapchat_profile',
      'city',
      'city_id',
      'previously_products',
      'types',
      'metadata',
      'available_products_count',
      'today',
      'lazy_load_products_recommended',
      'minimum',
      'valid_service'
    ],
    handleSearchRedirect: () => {
      props.navigation.navigate('BusinessList');
    },
    onProductRedirect: ({ slug, category, product }: any) => { },
    onCheckoutRedirect: (cartUuid: any) => { },
    onNavigationRedirect: (route: string, params: any, replace: boolean) => {
      if (replace) {
        props.navigation.dispatch(StackActions.replace(route, params))
        return
      }
      props.navigation.navigate(route, params)
    },
    onBusinessClick: (business: any) => {
      props.navigation.navigate('Business', {
        store: business.slug,
        header: business.header,
        logo: business.logo,
      });
    },
    logo,
    header,
    product,
    fromMulti
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.backgroundPage,
      }}
    >
      <BusinessProductsListController {...businessProductsProps} />
    </View>
  );
};

export default BusinessProductsList;
