import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
	useSession,
	useLanguage,
} from 'ordering-components-external/native';
import { PaymentOptionPaymentUsa as PaymentOptionPaymentUsaController } from '../PaymentOptionPaymentUsaController'

import { PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import { getIconCard } from '../../utils_ch';
import { OAlert, OIcon, OText } from 'ordering-ui-native-release/themes/original';

import { NotFoundSource } from 'ordering-ui-native-release/themes/original';

import {
	OSItem,
	OSItemContent,
	OSItemActions,
} from '../PaymentOptionStripe/styles';

const PaymentUSACardsListUI = (props: any) => {
	const {
		onSelectCard,
		redSysDeleteCardnew,
		cardSelected,
		cardsList,
		handleCardClick,
	} = props;

	//alert(1)
	const theme = useTheme();

	const [{ token }] = useSession();
	const [, t] = useLanguage();

	const handleCardSelected = (card: any) => {
		handleCardClick(card);
		onSelectCard(card);
	}
	//console.log("cardSelected==>"+JSON.stringify(cardSelected))

	return (
		<>
			{token && !cardsList.loading && cardsList.cards && cardsList.cards.length === 0 && (
				<OSItem style={{ justifyContent: 'center', paddingTop: 0 }}>
					<OText size={22}>
						{t('YOU_DONT_HAVE_CARDS', 'You don\'t have cards')}
					</OText>
				</OSItem>
			)}

			{token && cardsList.error && cardsList.error.length > 0 && (
				<NotFoundSource
					content={cardsList?.error[0]?.message || cardsList?.error[0]}
				/>
			)}

			{token && cardsList.loading && (
				<View style={{ width: '100%' }}>
					{[...Array(2)].map((_, i) => (
						<PlaceholderLine
							key={i}
							height={50}
							noMargin
							style={{ marginBottom: 20 }}
						/>
					))}
				</View>
			)}

			{token && cardsList.cards && cardsList.cards.length > 0 && (
				<ScrollView
					horizontal={false}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					nestedScrollEnabled={true}
					style={styles.cardsList}
				>
					{cardsList.cards.map((card: any) => (
						<OSItem key={card.id} isUnique={cardsList.cards.length}>
							<OSItemContent onPress={() => handleCardSelected(card)}>
								<View style={styles.viewStyle}>
									{card.id === cardSelected?.card_id ? (
										<OIcon
											src={theme.images.general.radio_act}
											width={16}
											color={theme.colors.primary}
										/>
									) : (
										<OIcon
											src={theme.images.general.radio_nor}
											width={16}
											color={theme.colors.disabled}
										/>
									)}
								</View>
								<View style={styles.viewStyle}>
									{getIconCard(card.brand, 20)}
								</View>
								<View style={styles.viewStyle}>
									<OText size={12} color={theme.colors.textNormal}>
										XXXX-XXXX-XXXX-{card.last4}
									</OText>
								</View>
							</OSItemContent>
							<OSItemActions>
								<OAlert
									title={t('CARD', 'Card')}
									message={t('QUESTION_DELETE_CARD', 'Are you sure that you want to delete the card?')}
									onAccept={() => redSysDeleteCardnew(card)}
								>
									<OIcon
										src={theme.images.general.trash}
										width={16}
										color={theme.colors.disabled}
									/>
								</OAlert>
							</OSItemActions>
						</OSItem>
					))}
				</ScrollView>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	viewStyle: {
		marginRight: 7
	},
	cardsList: {
		width: '100%',
		maxHeight: 130
	},
})

export const PaymentUSACardsList = (props: any) => {
	const PaymentUSACardsListProps = {
		...props,
		UIComponent: PaymentUSACardsListUI
	}
	return (
		<PaymentOptionPaymentUsaController {...PaymentUSACardsListProps} />
	)
}
