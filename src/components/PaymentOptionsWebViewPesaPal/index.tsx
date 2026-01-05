import React, { useRef, useState } from 'react'
import { Alert, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
//import Icon from 'react-native-vector-icons/FontAwesome5';
import { WebView } from 'react-native-webview';
import { ActivityIndicator } from 'react-native-paper';

import {
    ToastType,
    useToast,
    useApi,
    useLanguage,
    useConfig
} from 'ordering-components-external/native';

import { OText } from 'ordering-ui-native-release/themes/original';

interface PaymentOptionsWebViewParams {
    onNavigationRedirect?: Function,
    uri?: any,
    user?: any,
    token?: any,
    cart?: any,
    currency?: any,
    webviewPaymethod?: any,
    setShowGateway?: any,
    setOpenOrderCreating?: any,
    locationId?: any,
    onNavigationStateChange?:any
}
export const PaymentOptionsWebViewPesaPal = (props: PaymentOptionsWebViewParams) => {
    const { 
        onNavigationRedirect,
        uri,
        user,
        token,
        cart,
        currency,
        webviewPaymethod,
        setShowGateway,
        setOpenOrderCreating,
        locationId,
		    onNavigationStateChange
    } = props

   const webviewRef = useRef<any>(null)
   const [, { showToast }] = useToast();
   const [ordering] = useApi()
   const [{ configs }] = useConfig();
   const [, t] = useLanguage();

   const [paystatus, setPaystatus] = useState(false);
   
   const [progClr, setProgClr] = useState('#424242');
   const [prog, setProg] = useState(true);

   const handleCloseWebview = () => {
    setProg(true);
    setShowGateway({ open: false, closedByUser: true })
  }

   const onMessage = (e: any) => {
	
	//console.log(e)
        if (e?.nativeEvent?.data && e?.nativeEvent?.data !== 'undefined') {
            let payment = JSON.parse(e.nativeEvent.data);

            if (payment === 'api error') {
                setShowGateway({ closedByUser: true, open: false })
                setProg(true);
            }

            if (payment) {
                if (payment.error) {
                showToast(ToastType.Error, payment.result)
                setOpenOrderCreating && setOpenOrderCreating(false)
                } else if (payment?.result?.order?.uuid) {
                showToast(ToastType.Success, t('ORDER_PLACED_SUCCESSfULLY', 'The order was placed successfully'))
                onNavigationRedirect && onNavigationRedirect('OrderDetails', { orderId: payment?.result?.order?.uuid, isFromCheckout: true})
                }
                setProg(true);
                setShowGateway({ closedByUser: false, open: false })
            }
        }
   }

   const onNavigationStateChange2 = (webViewState: { url: string; }) => { 
	  onNavigationStateChange(webViewState)
   }

   return (
    <View style={{ zIndex: 9999, height: '130%', width: '100%', position: 'absolute', backgroundColor: 'white' }}>
          <Icon
            name="x"
            size={15}
            style={{ backgroundColor: 'white', paddingTop: 50, paddingLeft: 10 }}
            onPress={handleCloseWebview}
          />
          <OText
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              color: '#00457C',
              marginBottom: 2,
              marginTop: 5
            }}>
           {webviewPaymethod?.gateway === 'greenpay' ? (t('GREENPAY', 'GreenPay')) : (t('GREENPAY', 'GreenPay'))}
          </OText>

          <View style={{ padding: 10, opacity: prog ? 1 : 0, backgroundColor: 'white' }}>
            <ActivityIndicator size={24} color={progClr} />
            {/* <OText
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              color: '#00457C',
              marginBottom: 5,
              marginTop: 10
            }}>
           { (t('PESAPAL_WAITING_MSG', 'Your payment is in process, and please don\'t close the windows....')) }
          </OText> */}
          </View>

          <WebView
            style={{ flex: 1, marginBottom: 200}}
            source={{ uri: uri }}
            onMessage={onMessage}
		      	onNavigationStateChange={onNavigationStateChange2.bind(this)}
            ref={webviewRef}
            javaScriptEnabled={true}
            javaScriptEnabledAndroid={true}
            cacheEnabled={false}
            cacheMode='LOAD_NO_CACHE'
            onShouldStartLoadWithRequest={() => true}
            onLoadStart={() => {
              setProg(true);
              setProgClr('#424242');
            }}
            onLoadProgress={() => {
              setProg(true);
              setProgClr('#00457C');
            }}
            onLoad={() => {
              setProg(true);
              setProgClr('#00457C');
            }}
            onLoadEnd={(e) => {
            const messageParams = locationId ? { locationId } : {}
              const message = {
                action: 'init',
                data: {
                  urlPlace: `${ordering.root}/carts/${cart?.uuid}/place`,
                  urlConfirm: `${ordering.root}/carts/${cart?.uuid}/confirm`,
                  payData: {
                    paymethod_id: webviewPaymethod?.id,
                    amount: cart?.balance ?? cart?.total,
                    delivery_zone_id: cart?.delivery_zone_id,
                    user_id: user?.id,
                    user_name: user?.name
                  },
                  currency: configs?.stripe_currency?.value || currency,
                  userToken: token,
                  clientId: webviewPaymethod?.credentials?.client_id,
                  ...messageParams
                }
              }
              setProg(false);
              webviewRef?.current?.postMessage?.(JSON.stringify(message))
            }}
          />
    </View>
)}