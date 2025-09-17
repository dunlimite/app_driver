import React from 'react'
import { useTheme } from 'styled-components/native';
import { Pickup } from './styles';
import { StyleSheet, View } from 'react-native';

import { OrderContentComponent } from './OrderContentComponent'
import { useLanguage } from '@components'
import { OButton } from '@ui';

export const OrderDetailsInformation = (props: any) => {
  const {
    order,
    isOrderGroup,
    lastOrder,
    logisticOrderStatus,
    deliveryTypes,
    handleChangeOrderStatus,
    disabledActionsByInternet,
    loadingOrder,
    isGrantedPermissions,
    goToPermissionPage,
    arrivedCustomerStatusses,
    handleViewActionOrder,
    isHideRejectButtons,
    isEnabledOrderNotReady
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  const styles = StyleSheet.create({
    btnPickUp: {
      borderWidth: 0,
      backgroundColor: theme.colors.btnBGWhite,
      borderRadius: 8,
    },
  });

  return (
    <>
      <OrderContentComponent
        order={order}
        logisticOrderStatus={logisticOrderStatus}
        isOrderGroup={isOrderGroup}
        lastOrder={lastOrder}
      />
      {(order?.status === 8 || order?.status === 18) && deliveryTypes?.includes(order?.delivery_type) && !props.order?.loading && (
        <Pickup>
          <OButton
            style={styles.btnPickUp}
            textStyle={{ color: theme.colors.primary }}
            text={t('ARRIVED_TO_BUSINESS', 'Arrived to bussiness')}
            isDisabled={props.order?.loading || disabledActionsByInternet || loadingOrder}
            onClick={() =>
              isGrantedPermissions ? handleChangeOrderStatus(3) : goToPermissionPage()
            }
            imgLeftStyle={{ tintColor: theme.colors.backArrow }}
          />
        </Pickup>
      )}
      {arrivedCustomerStatusses.includes(order?.status) && deliveryTypes?.includes(order?.delivery_type) && !props.order?.loading && (
        <View style={{ paddingVertical: 20, marginBottom: 20 }}>
          <OButton
            style={styles.btnPickUp}
            textStyle={{ color: theme.colors.primary }}
            text={t('ARRIVED_TO_CUSTOMER', 'Arrived to customer')}
            isDisabled={props.order?.loading || disabledActionsByInternet || loadingOrder}
            onClick={() =>
              isGrantedPermissions ? handleChangeOrderStatus(26) : goToPermissionPage()
            }
            imgLeftStyle={{ tintColor: theme.colors.backArrow }}
          />
        </View>
      )}
      {order?.status === 3 && deliveryTypes?.includes(order?.delivery_type) && !isHideRejectButtons && isEnabledOrderNotReady && !props.order?.loading && (
        <View style={{ paddingVertical: 20, marginBottom: 20 }}>
          <OButton
            style={styles.btnPickUp}
            textStyle={{ color: theme.colors.white }}
            text={t('ORDER_NOT_READY', 'Order not ready')}
            onClick={() =>
              handleViewActionOrder && handleViewActionOrder('notReady')
            }
            imgLeftStyle={{ tintColor: theme.colors.backArrow }}
            bgColor={theme.colors.red}
          />
        </View>
      )}
      <View
        style={{
          height:
            order?.status === 8 && deliveryTypes?.includes(order?.delivery_type) ? 50 : 35,
        }}
      />
    </>
  )
}
