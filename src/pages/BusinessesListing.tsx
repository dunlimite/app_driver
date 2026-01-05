import React from 'react';
import { BusinessesListing as BusinessListingController } from '../components/BusinessesListing';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View } from 'react-native'
import settings from '../config.js'
import { useBusiness } from 'ordering-components-external/native'

const BusinessesListing = (props: any) => {
  const theme = useTheme();
  const [businessState] = useBusiness();
  const insets = useSafeAreaInsets()

  const BusinessesListingProps = {
    ...props,
    isSearchByName: true,
    isSearchByDescription: true,
    franchiseId: settings?.franchiseSlug,
    businessId: businessState?.business?.id  ?? settings?.businessSlug,
    isGuestUser: props?.route?.params?.isGuestUser ?? null,
    propsToFetch: [
      'id',
      'name',
      'header',
      'logo',
      'location',
      'schedule',
      'open',
      'delivery_price',
      'distance',
      'ribbon',
      'delivery_time',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
      'address',
      'configs'
    ],
    paginationSettings: {
      initialPage: 1,
      pageSize: 50,
      controlType: 'infinity'
    },
    onBusinessClick: (business: any) => {
      props.navigation.navigate('Business', {
        store: props?.route?.params?.store || business.slug,
        header: business.header,
        logo: business.logo,
      });
    },
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: theme.colors.backgroundPage
      }}
    >
      <BusinessListingController {...BusinessesListingProps} />
    </View>
  );
};

export default BusinessesListing;
