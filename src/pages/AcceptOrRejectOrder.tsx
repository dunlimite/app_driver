import React from 'react';
import {
  AcceptOrRejectOrder as AcceptOrRejectOrderController,
  SafeAreaContainer,
} from '@ui';

const AcceptOrRejectOrder = ({ navigation, route }: any) => {
  return (
    <SafeAreaContainer>
      <AcceptOrRejectOrderController
        isPage
        navigation={navigation}
        route={route.params}
        notShowCustomerPhone={false}
        actions={{
          accept: 'acceptByDriver',
          reject: 'rejectByDriver',
          pickupFailed: 'pickupFailedByDriver',
          deliveryFailed: 'deliveryFailedByDriver',
          notReady: 'orderNotReady',
          forcePickUp: 'forcePickUp',
          forceDelivery: 'forceDelivery'
        }}
        orderTitle={{
          accept: { key: 'DELIVERY_TIME', text: 'Delivery time', btnKey: 'ACCEPT', btnText: 'Accept' },
          reject: { key: 'REJECT_ORDER', text: 'Reject Order', btnKey: 'REJECT', btnText: 'Reject' },
          pickupFailed: { key: 'PICKUP_FAILED', text: 'Pickup Failed', btnKey: 'PICKUP_FAILED', btnText: 'Pickup Failed' },
          deliveryFailed: { key: 'DELIVERY_FAILED', text: 'Delivery Failed', btnKey: 'DELIVERY_FAILED', btnText: 'Delivery Failed' },
          notReady: { key: 'ORDER_NOT_READY', text: 'Order not ready', btnKey: 'ORDER_NOT_READY', btnText: 'Order not ready' },
          forcePickUp: { key: 'FORCED_MARK_ORDER_AS_PICKUP', text: 'FORCED_MARK_ORDER_AS_PICKUP', btnKey: 'MOBILE_PICKUP_COMPLETE', btnText: 'PickUp Completed'},
          forceDelivery: { key: 'FORCED_MARK_ORDER_AS_DELIVERY', text: 'FORCED_MARK_ORDER_AS_DELIVERY', btnKey: 'MOBILE_DELIVERY_COMPLETE', btnText: 'Delivery Completed'}
        }}
        appTitle={{ key: 'DELIVERY_APP', text: 'Delivery app' }}
        action={route.params.action}
        customerCellphone={route.params?.order?.customer?.cellphone}
        orderId={route.params.ids?.[0]}
        handleUpdateOrder={async (param1: any, param2: any) => {
          const result = await route.params?.handleChangeOrderStatus &&
          await route.params?.handleChangeOrderStatus(param1, route.params?.ids, param2)
          result?.length === route.params?.ids?.length && navigation?.canGoBack() && navigation.goBack()
        }}
        closeModal={() => navigation?.canGoBack() && navigation.goBack()}
      />
    </SafeAreaContainer>
  );
};

export default AcceptOrRejectOrder;
