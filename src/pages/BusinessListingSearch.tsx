import React from 'react'
import { useTheme } from 'styled-components/native';
import { HeaderTitle, Container, OButton } from 'ordering-ui-native-release/themes/original';
import { BusinessListingSearch as BusinessListingSearchController } from '../components/BusinessListingSearch';
import { useLanguage } from 'ordering-components-external/native';
import settings from '../config.json';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BusinessListingSearch = (props: any) => {
	const [, t] = useLanguage()
	const theme = useTheme()
	const insets = useSafeAreaInsets()

	const BusinessesListingSearchProps = {
		...props,
		onBusinessClick: (business: any) => {
			props.navigation.navigate('Business', {
				store: props?.route?.params?.store || business.slug,
				header: business.header,
				logo: business.logo,
			});
		},
		businessTypes: props?.route?.params?.businessTypes || [],
		defaultTerm: props?.route?.params?.defaultTerm || '',
		onNavigationRedirect: (page: string, params: any) => {
			if (!page) {
				return;
			}
			props.navigation.navigate(page, params);
		},
		brandId: settings.franchiseSlug,
		isIos: Platform.OS === 'ios'
	};

	const isChewLayout = theme?.header?.components?.layout?.type === 'chew'
	const hideBrowse = theme?.bar_menu?.components?.browse?.hidden

	return (
		<View
			style={{
				flex: 1,
				paddingTop: insets.top,
				backgroundColor: theme.colors.backgroundPage
			}}
		>
			<BusinessListingSearchController {...BusinessesListingSearchProps} />
		</View>
	)
}

export default BusinessListingSearch
