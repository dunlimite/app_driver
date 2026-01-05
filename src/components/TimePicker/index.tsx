import React from 'react';
import DatePicker from 'react-native-date-picker'
import { DateContainer } from './styles';
import { useLanguage } from 'ordering-components-external/native';

export const TimePickerUI = (props: any) => {
	const {
		pickuptime,
		onConfirm,
		onCancel,
		open,
	} = props;

	const [, t] = useLanguage();

	return (
		<DateContainer>
			<DatePicker
				modal
				mode="time"
				open={open}
				title={t('SELECT_A_TIME', 'Select a time')}
				confirmText={t('CONFIRM', 'Confirm')}
				cancelText={t('CANCEL', 'Cancel')}
				date={pickuptime ? new Date(pickuptime) : new Date()}
				onConfirm={date => onConfirm(date)}
				onCancel={onCancel}
			/>
		</DateContainer>
	);
};

