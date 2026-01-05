import React from 'react';
import FastImage from 'react-native-fast-image'
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import {
	useOrder,
	useLanguage,
} from 'ordering-components-external/native';
import {
	AddressDetails as AddressDetailsController
} from './AddressDetails';
import { useTheme } from 'styled-components/native';

import { ADContainer, ADHeader, ADAddress, ADMap } from './styles';
import { OText } from 'ordering-ui-native-release/themes/original';
import { getTypesText } from '../../utils_ch';

const DeliveryAddressDetailsUI = (props: any) => {
	const {
		navigation,
		addressToShow,
		isCartPending,
		googleMapsUrl,
		apiKey,
		addressState,
		handleOpenAddressPop
	} = props;

	const theme = useTheme();
	const [orderState] = useOrder();
	const [{ options }] = useOrder();
	const [, t] = useLanguage();
	const { width } = useWindowDimensions();

	const orderTypeText = {
		key: getTypesText(options?.type || 1),
		value: t(getTypesText(options?.type || 1), 'Delivery')
	}

	const styles = StyleSheet.create({
		productStyle: {
			width,
			height: 151,
			marginVertical: 10
		}
	})

	return (
		<ADContainer>
			<ADHeader>
				{props.HeaderTitle ?? (
					<OText
						size={16}
						lineHeight={24}
						color={theme.colors.textNormal}
					>
						{t(`${orderTypeText.key}_ADDRESS`, `${orderTypeText.value} address`)}
					</OText>
				)}
			</ADHeader>
			{!!apiKey && googleMapsUrl && (
				<ADMap
					style={{ width, flex: 1, marginStart: -20, marginEnd: -20, }}>
					<FastImage
						style={styles.productStyle}
						source={{
							uri: googleMapsUrl,
							priority: FastImage.priority.normal,
						}}
						resizeMode={FastImage.resizeMode.cover}
					/>
				</ADMap>
			)}
			<ADAddress>
				<OText
					size={12}
					color={theme.colors.textNormal}
					numberOfLines={1}
					ellipsizeMode="tail"
					style={{ width: '85%' }}>
					{addressState?.address?.deliveryaddress}
				</OText>
				{orderState?.options?.type === 1 && !isCartPending && (
					<TouchableOpacity
						onPress={handleOpenAddressPop}>
						<OText
							size={12}
							color={theme.colors.primary}
							style={{ textDecorationLine: 'underline' }}>
							{t('CHANGE', 'Change')}
						</OText>
					</TouchableOpacity>
				)}
			</ADAddress>
		</ADContainer>
	);
};

export const DeliveryAddressDetails = (props: any) => {
	const deliveryAddressDetailsProps = {
		...props,
		UIComponent: DeliveryAddressDetailsUI,
	};
	return <AddressDetailsController {...deliveryAddressDetailsProps} />;
};
