import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useOrder } from 'ordering-components-external/native'
import { useConfig } from 'ordering-components-external/native'
import { useApi } from 'ordering-components-external/native'
import { useSession } from 'ordering-components-external/native'
import { useToast, ToastType } from 'ordering-components-external/native'
import { useLanguage } from 'ordering-components-external/native'
import { useWebsocket } from 'ordering-components-external/native'

/**
 * Component to manage Checkout page behavior without UI component
 */
export const Checkout = (props) => {
  const {
    cartState,
    propsToFetch,
    actionsBeforePlace,
    handleCustomClick,
    onPlaceOrderClick,
    UIComponent,
    isApp,
    isKiosk,
    isCustomerMode
  } = props

  const [ordering] = useApi()
  const socket = useWebsocket()
  const [{ options }, { refreshOrderOptions }] = useOrder()
  const [{ configs }, { refreshConfigs }] = useConfig()

  const [placing, setPlacing] = useState(false)
  const [errors, setErrors] = useState(null)
  const [alseaCheckPriceError, setAlseaCheckpriceError] = useState(null)
	const [navigateToGreenPayCS, setNavigateToGreenPayCS] = useState('')
	const [openGreenPayCS, setOpenGreenPayCS] = useState(false)
  const [placeOrderGreenPayV2card, setPlaceOrderGreenPayV2card] = useState(false)
  /**
   * Language context
   */
  const [, t] = useLanguage()
  /**
   * Order context
   */
  const [orderState, { placeCart }] = useOrder()
  /**
   * Session content
   */
  const [{ token, user }] = useSession()
  /**
   * Toast state
   */
  const [, { showToast }] = useToast()
  /**
   * Delivery Instructions options
   */
  const [instructionsOptions, setInstructionsOptions] = useState({ loading: false, result: [{ id: null, enabled: true, name: t('EITHER_WAY', 'Either way') }], error: null })
  /**
   * Delivery instructions selected
   */
  const [addressState, setAddressState] = useState({ loading: false, error: null, address: {} })
  const [deliveryOptionSelected, setDeliveryOptionSelected] = useState(undefined)
  /**
 * Comment state
 */
  const [commentState, setCommentState] = useState({ loading: false, result: null, error: null })
  /**
   * Object to save an object with business information
   */
  const [businessDetails, setBusinessDetails] = useState({ business: null, loading: true, error: null })
  /**
   * This must be contains an object with info about paymente selected
   */
  const [paymethodSelected, setPaymethodSelected] = useState(null)
  /**
   * Loyalty plans state
   */
  const [loyaltyPlansState, setLoyaltyPlansState] = useState({ loading: true, error: null, result: [] })

  const [checkoutFieldsState, setCheckoutFieldsState] = useState({ fields: [], loading: false, error: null })

  const businessId = props.uuid
    ? Object.values(orderState.carts).find(_cart => _cart?.uuid === props.uuid)?.business_id ?? {}
    : props.businessId
  /**
   * Current cart
   */
  const cart = businessId && typeof businessId === 'number' ? orderState.carts?.[`businessId:${businessId}`] : orderState.carts?.['businessId:null']
  /**
   * Place spot state from chackout
   */
  const [placeSpotNumber, setPlaceSpotNumber] = useState(cartState?.cart?.spot_number ?? cart?.spot_number)
  /**
   * Timeout for update cart comment
   */
  let timeout = null
  /**
   * Cart comment stagged
   */
  let previousComment
  /**
   * order types delivery
   */
  const orderTypesDelivery = [1, 7]
  /**
   * Method to get business from API
   */

  const [loadingCustom, setLoadingCustom] = useState(null)
  const [customLoadingCtrl, setCustomLoadingCtrl] = useState(false)



  const paymethodsWithoutSaveCard = ['credomatic']

  const loadAddress = async (userId, addressId) => {
    try {
	  refreshOrderOptions()
      setAddressState({ ...addressState, loading: true })
      const source = {}
      //requestsState.address = source
      const { content } = await ordering.users(userId).addresses(addressId).get({ token, cancelToken: source })

      setAddressState({
        loading: false,
        error: content.error ? content.result : null,
        address: content.error ? {} : content.result
      })	  
    } catch (err) {
      if (err.constructor.name !== 'Cancel') {
        setAddressState({
          loading: false,
          error: [err.message],
          address: {}
        })
      }
    }
  }
  const getBusiness = async () => {
    refreshConfigs()
    try {
      const parameters = {
        type: orderState.options?.type
      }

      const { content: { result, error } } = await ordering.businesses(businessId).select(propsToFetch).parameters(parameters).get()
      if (!error && cartState.cart?.paymethod_id) {
        const paymethodSelected = result?.paymethods?.find(paymethod => paymethod?.paymethod_id === cartState.cart?.paymethod_id)
        if (paymethodSelected?.paymethod?.id) {
          handlePaymethodChange({
            paymethodId: paymethodSelected?.paymethod?.id,
            gateway: paymethodSelected?.paymethod?.gateway,
            paymethod: {
              ...paymethodSelected?.paymethod,
              credentials: {
                ...paymethodSelected?.data
              }
            },
            data: cart?.paymethod_data,
            id: paymethodSelected?.paymethod?.id
          })
        }
      }
      setBusinessDetails({
        ...businessDetails,
        loading: false,
        business: result,
        error
      })
    } catch (error) {
      setBusinessDetails({
        ...businessDetails,
        loading: false,
        error
      })
    }
  }

  /**
   * Method to handle click on Place order
   */
  const generateTransactionId = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 10; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  const handlerClickPlaceOrder = async (paymentOptions, payloadProps, confirmPayment, dismissPlatformPay) => {
    
    let paymethodData = paymethodSelected?.data
    if (paymethodSelected?.paymethod && ['stripe', 'stripe_connect', 'stripe_direct'].includes(paymethodSelected?.paymethod?.gateway)) {
      paymethodData = {
        source_id: paymethodSelected?.data?.id
      }
    }
    let payload = {
      amount: cart?.balance ?? cart?.total
    }

    if (cart?.offer_id) payload.offer_id = cart?.offer_id

    let curOrderCodegreenplugin =''
    
    if (paymethodSelected?.paymethod) {
      if(paymethodSelected?.paymethod?.gateway === 'greenpay_plugin'){
        curOrderCodegreenplugin = cart?.business_id+generateTransactionId().toUpperCase();
        //console.log(curOrderCodegreenplugin)
        //setGreenpay_plugin_code(curOrderCodegreenplugin)
        //console.log(greenpay_plugin_code)
        payload = {
          ...payload,
          paymethod_id: paymethodSelected?.paymethodId,
          paymethod_data: paymethodSelected?.data,
          pay_green_plugin: curOrderCodegreenplugin
        }
      }
      else{
        payload = {
          ...payload,
          paymethod_id: paymethodSelected?.paymethodId,
          paymethod_data: paymethodSelected?.data
        }
      }
      
    }

    if (orderTypesDelivery.includes(orderState?.options?.type)) {
      payload = {
        ...payload,
        delivery_zone_id: cart?.business_id ? cart.delivery_zone_id : 0
      }
    }

	if (addressState?.address?.deliveryaddress) {
      payload = {
        ...payload,
        deliveryaddress: addressState?.address?.deliveryaddress,
		deliverylocation: JSON.stringify(addressState?.address?.deliverylocation),
		pickupdate: addressState?.address?.pickupdate,
		pickuptime: addressState?.address?.pickuptime,
		courier_additional_comments: addressState?.address?.courier_additional_comments,
		courier_instru_driver: addressState?.address?.courier_instru_driver
      }
    }

    if (handleCustomClick) {
      handleCustomClick(payload, paymethodSelected, cart)
      return
    }
    if (!cart) return
    payload = {
      ...payload,
      ...payloadProps,
      paymethod_data: {
        ...paymethodData,
        ...paymentOptions
      }
    }

    setPlacing(true)
    await onChangeSpot()
    if (paymethodsWithoutSaveCard.includes(paymethodSelected?.paymethod?.gateway)) {
      delete payload.paymethod_data
    }
    const result = await placeCart(cart.uuid, payload)
    if (result?.error || !result) {
      setErrors(result?.result)
      if (dismissPlatformPay && paymethodSelected?.paymethod?.gateway === 'apple_pay') {
        await dismissPlatformPay()
      }
      refreshOrderOptions()
      setPlacing(false)
      return
    }else{
      if(paymethodSelected?.paymethod?.gateway == 'greenpay_v2' && result.result.original.balance > 0){
        
        const curOrderCode = cart?.business_id+generateTransactionId().toUpperCase();
        const total1 = cart?.balance ?? cart?.total
        const userCustomer = user
        const userfName = userCustomer.name;
        const userlName = userCustomer.lastname;
        const userEmail = userCustomer.email;
        //const currURL = window.location.href;
        //const str1 = currURL.split("?");
        const business_id = cart?.business_id;
        const user_id = cart.user_id;
        const cart_id = cart.uuid;
        const email = userCustomer?.email;
        
        const fname = userfName;
        const lname = userlName;
        const address = userCustomer?.address;
        const cellphone = userCustomer?.cellphone;
        const allproducts = JSON.stringify(cart?.products) 

        //const current_url= str1[0];
        const web_app = 'app'
        setLoadingCustom(false)
        setNavigateToGreenPayCS('')
        setOpenGreenPayCS(false)
        var sandbox_type = '';
        if(paymethodSelected?.paymethod?.paymethod?.paymethod?.sandbox == true){
          sandbox_type = 'sand';
        }else{
          sandbox_type = 'prod';
        }

        const greenPayv2Url = 'https://plugins-development.ordering.co/vanvidelivery/greenpay_v2_dev/create_order.php?business_id='+business_id+'&web_app='+web_app+'&code='+curOrderCode+'&user_id='+user_id+'&cart_id='+cart_id+'&email='+email+'&total='+total1+'&fname='+fname+'&lname='+lname+'&address='+address+'&cellphone='+cellphone+'&allproducts='+allproducts;
        console.log('Go To: '+greenPayv2Url);  
        setLoadingCustom(true)
        setNavigateToGreenPayCS(greenPayv2Url)
        setOpenGreenPayCS(true)
     } 
    if(paymethodSelected?.paymethod?.gateway == 'greenpay_v2_card' && result.result.original.balance > 0){
        
        console.log('payloadProps: ' + JSON.stringify(paymethodSelected))
        const token = paymethodSelected?.data.id
        console.log('token: ' + token)
        setCustomLoadingCtrl(true)
        const curOrderCode = cart?.business_id+''+cart.user_id+''+generateTransactionId().toUpperCase();
        const userCustomer = user
        const total1 = cart?.balance ?? cart?.total
        
        const userfName = userCustomer.name;
        const userlName = userCustomer.lastname;
        const userEmail = userCustomer.email;
        const cart_id = cart.uuid;
        const web_app = 'app';
         const requestPaymentSession = {
          method: 'POST',
          body: JSON.stringify({
            reference: curOrderCode,
            amount: total1,
            name: userfName,
            lastname: userlName,
            email: userEmail,
            user_id: cart.user_id,
            web_app: 'App',
            curr_url: '',
            business_id: cart?.business_id,
            cart_id: cart?.uuid,
            token : token
          })
        }
        console.log('requestOptionsSession: ' + JSON.stringify(requestPaymentSession))
        const functionPaymentSession = `https://plugins-development.ordering.co/vanvidelivery/greenpay_v2_dev/token_payment.php`
        const responsePaymentSession = await fetch(functionPaymentSession, requestPaymentSession)
        const paymentSession = await responsePaymentSession.json()
        console.log('Session API response: ' + JSON.stringify(paymentSession))
        if(paymentSession.status == true){
          //setTimeout(() => {
            console.log('1111111111111111111111111')
            setCustomLoadingCtrl(false)
            setPlaceOrderGreenPayV2card(true)
          //}, 3000); // 3 seconds
          //onNavigationRedirect('OrderDetails', { orderId: cart?.uuid, isFromCheckout: true })
        }
        else{
          setCustomLoadingCtrl(false)
          showToast(ToastType.Error, t('PAYMENT_FAILED', 'Payment failed'))
        }  
     }
     /*if(paymethodSelected?.paymethod?.gateway == 'greenpay_v2' && result.result.original.balance > 0){
        
        //const curOrderCode = cart?.business_id+generateTransactionId().toUpperCase();
        const total1 = cart?.balance ?? cart?.total
        const userCustomer = user
        const userfName = userCustomer.name;
        const userlName = userCustomer.lastname;
        const userEmail = userCustomer.email;
        //const currURL = window.location.href;
        //const str1 = currURL.split("?");
        const business_id = cart?.business_id;
        const user_id = cart.user_id;
        const cart_id = cart.uuid;
        const email = userCustomer?.email;
        
        const fname = userfName;
        const lname = userlName;
        const address = userCustomer?.address;
        const cellphone = userCustomer?.cellphone; 
        const allproducts = JSON.stringify(cart?.products)
        //const current_url= str1[0];
        const web_app = 'app'
        setLoadingCustom(false)
        setNavigateToGreenPayCS('')
        setOpenGreenPayCS(false)
        var sandbox_type = '';
        if(paymethodSelected?.paymethod?.paymethod?.paymethod?.sandbox == true){
          sandbox_type = 'sand';
        }else{
          sandbox_type = 'prod';
        }
        const codedata = curOrderCodegreenplugin
        const greenPayv2Url = 'https://plugins-development.ordering.co/vanvidelivery/greenpay_v2_dev/create_order.php?business_id='+business_id+'&web_app='+web_app+'&code='+curOrderCode+'&user_id='+user_id+'&cart_id='+cart_id+'&email='+email+'&total='+total1+'&fname='+fname+'&lname='+lname+'&address='+address+'&cellphone='+cellphone+'&allproducts='+allproducts;
        console.log('Go To: '+greenPayv2Url);  
        setLoadingCustom(true)
        setNavigateToGreenPayCS(greenPayv2Url)
        setOpenGreenPayCS(true)
        
     }*/
     if(paymethodSelected?.paymethod?.gateway == 'greenpay_plugin' && result.result.original.balance > 0){
        
        //const curOrderCode = cart?.business_id+generateTransactionId().toUpperCase();
        const total1 = cart?.balance ?? cart?.total
        const userCustomer = user
        const userfName = userCustomer.name;
        const userlName = userCustomer.lastname;
        const userEmail = userCustomer.email;
        //const currURL = window.location.href;
        //const str1 = currURL.split("?");
        const business_id = cart?.business_id;
        const user_id = cart.user_id;
        const cart_id = cart.uuid;
        const email = userCustomer?.email;
        
        const fname = userfName;
        const lname = userlName;
        const address = userCustomer?.address;
        const cellphone = userCustomer?.cellphone; 
        const allproducts = JSON.stringify(cart?.products)
        //const current_url= str1[0];
        const web_app = 'app'
        setLoadingCustom(false)
        setNavigateToGreenPayCS('')
        setOpenGreenPayCS(false)
        var sandbox_type = '';
        if(paymethodSelected?.paymethod?.paymethod?.paymethod?.sandbox == true){
          sandbox_type = 'sand';
        }else{
          sandbox_type = 'prod';
        }
        const codedata = curOrderCodegreenplugin
        const greenPayv2Url = 'https://plugins-development.ordering.co/greenpayv2/api/create_order.php?business_id='+business_id+'&web_app='+web_app+'&code='+codedata+'&user_id='+user_id+'&cart_id='+cart_id+'&email='+email+'&total='+total1+'&fname='+fname+'&lname='+lname+'&address='+address+'&cellphone='+cellphone+'&allproducts='+allproducts+'&projectname='+ordering.project;
        console.log('Go To: '+greenPayv2Url);  
        setLoadingCustom(true)
        setNavigateToGreenPayCS(greenPayv2Url)
        setOpenGreenPayCS(true)
        
     }
      if(paymethodSelected?.paymethod?.gateway == 'greenpay' && result.result.original.balance > 0){
        
        console.log('payloadProps: ' + JSON.stringify(payloadProps))
        setCustomLoadingCtrl(true)
        const curOrderCode = cart?.business_id+''+cart.user_id+''+generateTransactionId().toUpperCase();
        const userCustomer = user
        const total1 = cart?.balance ?? cart?.total
        
        const userfName = userCustomer.name;
        const userlName = userCustomer.lastname;
        const userEmail = userCustomer.email;
        setLoadingCustom(false)
          setNavigateToGreenPayCS('')
          setOpenGreenPayCS(false)
        const kountSession = '';
        var sandbox_type = '';
        if(paymethodSelected?.paymethod?.paymethod?.paymethod?.sandbox == true){
          sandbox_type = 'sand';
        }else{
          sandbox_type = 'prod';
        }

        //start service call create session
        const requestOptionsSession = {
          method: 'POST',
          body: JSON.stringify({
            reference: curOrderCode,
            amount: total1,
            name: userfName,
            lastname: userlName,
            email: userEmail,
            user_id: cart.user_id,
            sandbox: 'true',
            web_app: 'App',
            curr_url: '',
            business_id: cart?.business_id,
            cart_id: cart.uuid
          })
        }
        console.log('requestOptionsSession: ' + JSON.stringify(requestOptionsSession))
        const functionFetchSession = `https://plugins-development.ordering.co/vanvidelivery/greenpay/session.php`
        const responseSession = await fetch(functionFetchSession, requestOptionsSession)
        const contentSession = await responseSession.json()
        console.log('Session API response: ' + JSON.stringify(contentSession))


        if(contentSession.status == true){
          setCustomLoadingCtrl(false)
          //const body = {}
          const green_p_session = contentSession.session
          const green_p_token = contentSession.token
          const green_p_code = curOrderCode

         if(green_p_token != undefined){
          const greenPayUrl = "https://plugins-development.ordering.co/vanvidelivery/greenpay/generate_kount.php?paymentSession="+green_p_session+"&paymentToken="+green_p_token+"&business_id="+cart?.business_id+"&code="+green_p_code+"&sandbox="+paymethodSelected?.paymethod?.paymethod?.sandbox+"&cardToken="+paymethodSelected?.data?.id+"&kountSession="+kountSession+"&sandbox_type="+sandbox_type;
          console.log('Go To: '+greenPayUrl);  
          setLoadingCustom(true)
          setNavigateToGreenPayCS(greenPayUrl)
          setOpenGreenPayCS(true)
          
           }else{
          setCustomLoadingCtrl(false)
          /*setCustomLoading(false)
          setAlertState1({
            open: true,
            content: t('SESSION_GENERATION_FAILED', 'Session generation failed')
          })  */           
           }//end if 

        
        // const green_p_session = payloadProps.green_p_session
        // const green_p_token = payloadProps.green_p_token
        // const green_p_code = payloadProps.green_p_code
        // console.log('green_p_session: ' +  green_p_session + ' green_p_token: ' +green_p_token)        
        // console.log('from Ctrl page card id: ' + paymethodSelected?.data?.id)   
        // //console.log('paymethodSelected: ' + JSON.stringify(paymethodSelected)) 
        // setNavigateToGreenPayCS('')
        // setOpenGreenPayCS(false)

        // var sandbox_type = '';

        // if(paymethodSelected?.paymethod?.paymethod?.sandbox == true){
        //   sandbox_type = 'sand';
        // }else{
        //   sandbox_type = 'prod';
        // }
        
        // if(green_p_token != undefined){
        //   const greenPayUrl = "https://plugins-development.ordering.co/vanvidelivery/greenpay/generate_kount.php?paymentSession="+green_p_session+"&paymentToken="+green_p_token+"&business_id="+cart?.business_id+"&code="+green_p_code+"&sandbox="+paymethodSelected?.paymethod?.paymethod?.sandbox+"&cardToken="+paymethodSelected?.data?.id+"&kountSession="+kountSession+"&sandbox_type="+sandbox_type;
        //   console.log('Go To: '+greenPayUrl);  
        //   setLoadingCustom(true)
        //   setNavigateToGreenPayCS(greenPayUrl)
        //   setOpenGreenPayCS(true)
         
        // }//end if        
      }//end if
     }
    }

    const cartResult = result?.result

    if (cartResult?.paymethod_data?.status === 2 && actionsBeforePlace) {
      await actionsBeforePlace(paymethodSelected, result.result)
    }
    if (confirmPayment && result?.result?.paymethod_data?.gateway === 'apple_pay') {
      const { error: confirmApplePayError } = await confirmPayment(result?.result?.paymethod_data?.result?.client_secret)
      if (confirmApplePayError) {
        setErrors(confirmApplePayError)
      }
    }
    if (paymethodsWithoutSaveCard.includes(cartResult?.paymethod_data?.gateway) &&
      cartResult?.paymethod_data?.result?.hash &&
      cartResult?.paymethod_data?.status === 2 &&
      !payloadProps.isNative
    ) {
      handleConfirmCredomaticPage(cartResult, paymethodSelected)
    }
    setPlacing(false)
    onPlaceOrderClick && onPlaceOrderClick(payload, paymethodSelected, cartResult)
  }

  const handlePaymethodChange = (paymethod) => {
    setPaymethodSelected(paymethod)
  }

  const onRemoveSpotNumber = (businessSlug) => {
    const spotNumberFromStorage = window.localStorage.getItem('table_number')
    if (!spotNumberFromStorage) return
    const slug = JSON.parse(spotNumberFromStorage)?.slug
    if (businessSlug === slug) {
      window.localStorage.removeItem('table_number')
    }
  }

  /**
   * change place spot from checkout
   */
  const handleChangeSpot = async ({ isCheckout = true, bodyToSend }) => {
    try {
      const id = isCheckout ? cart?.uuid : cart?.id
      const endpointToFetch = isCheckout
        ? ordering.setAccessToken(token).carts(id).set(bodyToSend)
        : ordering.setAccessToken(token).orders(id).save(bodyToSend)

      const { content: { error, result } } = await endpointToFetch

      if (!error && !isApp) {
        onRemoveSpotNumber && onRemoveSpotNumber(cart?.business?.slug)
      }

      showToast(
        error ? ToastType.Error : ToastType.Success,
        error
          ? t('ERROR', result[0])
          : t('SPOT_CHANGE_SUCCESS_CONTENT', 'Changes applied correctly')
      )
    } catch (err) {
      console.log(err)
    }
  }

  const onChangeSpot = async () => {
    if (options.type === 3 && (!cartState?.cart?.spot_number && !cart?.spot_number)) {
      const bodyToSend = {}
      placeSpotNumber && (bodyToSend.spot_number = placeSpotNumber)

      if (Object.keys(bodyToSend).length) {
        handleChangeSpot({ bodyToSend })
      }
    }
  }

  /**
   * change comment for cart
   */
  const handleChangeComment = (value) => {
    try {
      if (previousComment !== value) {
        clearTimeout(timeout)
        timeout = setTimeout(async function () {
          setCommentState({ ...commentState, loading: true })
          const uuid = cart?.uuid
          const response = await fetch(`${ordering.root}/carts/${uuid}`, {
            'Content-Type': 'application/json',
            method: 'PUT',
            body: JSON.stringify({
              comment: value
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              'X-App-X': ordering.appId,
              'X-Socket-Id-X': socket?.getId()
            }
          })
          const { result, error } = await response.json()
          if (error) {
            setCommentState({ ...commentState, loading: false, error: true, result })
            showToast(ToastType.Error, result)
            return
          }
          setCommentState({ ...commentState, loading: false, error: null, result })
        }, 750)
      }
      previousComment = value
    } catch (err) {
      setCommentState({ ...commentState, loading: false, error: true, result: err.message })
      showToast(ToastType.Error, err.message)
    }
  }

  const getDeliveryOptions = async () => {
    try {
      const response = await fetch(`${ordering.root}/delivery_options`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
          'X-App-X': ordering.appId,
          'X-Socket-Id-X': socket?.getId()
        }
      })
      const { result, error } = await response.json()
      if (!error) {
        setInstructionsOptions({ loading: false, result: [...instructionsOptions.result, ...result] })
        return
      }
      setInstructionsOptions({ loading: false, error: true, result })
      showToast(ToastType.Error, result)
    } catch (err) {
      setInstructionsOptions({ loading: false, error: true, result: err.message })
      showToast(ToastType.Error, err.message)
    }
  }

  const handleChangeDeliveryOption = async (value) => {
    try {
      const response = await fetch(`${ordering.root}/carts/${cart?.uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
          'X-App-X': ordering.appId,
          'X-Socket-Id-X': socket?.getId()
        },
        body: JSON.stringify({
          delivery_option_id: value
        })
      })
      const { result, error } = await response.json()
      setDeliveryOptionSelected(result?.delivery_option_id)
      if (error) {
        showToast(ToastType.Error, result)
      }
    } catch (err) {
      showToast(ToastType.Error, err.message)
    }
  }

  const getLoyaltyPlans = async () => {
    try {
      const req = await fetch(`${ordering.root}/loyalty_plans`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-App-X': ordering.appId,
            'X-Socket-Id-X': socket?.getId()
          }
        }
      )
      const { error, result } = await req.json()
      setLoyaltyPlansState({
        ...loyaltyPlansState,
        loading: false,
        result: error ? [] : result
      })
    } catch (error) {
      setLoyaltyPlansState({
        ...loyaltyPlansState,
        loading: false,
        result: []
      })
    }
  }

  const handleConfirmCredomaticPage = async (cart, paymethodSelected) => {
    const isSandbox = configs?.credomatic_integration_sandbox?.value === '1'
    const keyId = isSandbox ? configs?.credomatic_integration_public_sandbox_key?.value : configs?.credomatic_integration_public_production_key?.value
    const processorId = configs?.credomatic_integration_processor_id?.value
    try {
      const cartUuid = cart?.uuid
      const data = {
        type: 'auth',
        key_id: keyId,
        hash: cart?.paymethod_data?.result?.hash,
        time: cart?.paymethod_data?.result?.time,
        amount: cart?.total,
        orderid: cartUuid,
        ccnumber: paymethodSelected?.data?.ccnumber,
        cvv: paymethodSelected?.data?.cvv,
        ccexp: paymethodSelected?.data?.ccexp,
        redirect: window.location.href.replace(window.location.search, '')
      }
      if (processorId) {
        data.processor_id = processorId
      }
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://credomatic.compassmerchantsolutions.com/api/transact.php'
      form.style.display = 'none'
      // eslint-disable-next-line no-unused-expressions
      Object.keys(data)?.map(key => {
        const formInputName = document.createElement('input')
        formInputName.name = key
        formInputName.value = data[key]
        form.appendChild(formInputName)
      })
      document.body.appendChild(form)
      form.submit()
    } catch (err) {
      showToast(ToastType.Error, err.message)
    }
  }

  const getValidationFieldOrderTypes = async () => {
    try {
      setCheckoutFieldsState({ ...checkoutFieldsState, loading: true })

      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      const response = await fetch(`${ordering.root}/validation_field_order_types`, requestOptions)
      const content = await response.json()
      if (!content?.error) {
        setCheckoutFieldsState({ fields: content?.result, loading: false })
      } else {
        setCheckoutFieldsState({ ...checkoutFieldsState, loading: false, error: content?.result })
      }
    } catch (err) {
      setCheckoutFieldsState({ ...checkoutFieldsState, loading: false, error: [err.message] })
    }
  }

  useEffect(() => {
    if (businessId && typeof businessId === 'number') {
      getBusiness()
    }
  }, [businessId, orderState.options?.type])
	  
	  
	  

  /**
   * Update carts from sockets
   */
  useEffect(() => {
    if (cart && cart.status === 1) {
      const data = {
        paymethod_id: paymethodSelected.paymethodId,
        paymethod_data: paymethodSelected?.data,
        delivery_zone_id: cart.delivery_zone_id,
        amount: cart?.balance ?? cart?.total
      }
      if (cart?.offer_id) payload.offer_id = cart?.offer_id
      onPlaceOrderClick && onPlaceOrderClick(data, paymethodSelected, cart)
    }
  }, [cart])

  useEffect(() => {
    if (deliveryOptionSelected === undefined) {
      setDeliveryOptionSelected(cart?.delivery_option_id)
    }
  }, [cart?.delivery_option_id])

  useEffect(() => {
    if (!isKiosk) {
      Promise.all(
        [getDeliveryOptions(), getLoyaltyPlans()].map(promise => {
          return promise.then(
            value => Promise.reject(value),
            error => Promise.resolve(error)
          )
        })
      )
    }
    getValidationFieldOrderTypes()
  }, [])

  useEffect(() => {
    const alseaProjects = ['alsea', 'alsea-staging']
    const amount = cart?.balance ?? cart?.total
    if (!(alseaProjects.includes(ordering.project) && amount && isCustomerMode)) return
    const handleAlseaCheckPrice = async () => {
      try {
        const customerFromLocalStorage = await window.localStorage.getItem('user-customer', true)
        const apiCheckprice = ordering.project === 'alsea' ? 'https://alsea-plugins.ordering.co/alseaplatform/api_checkprice.php' : 'https://alsea-plugins-staging.ordering.co/alseaplatform/api_checkprice.php'
        const response = await fetch(apiCheckprice, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-App-X': ordering.appId,
            Authorization: `bearer ${token}`
          },
          body: JSON.stringify({
            amount: amount,
            user_id: customerFromLocalStorage?.id || user.id,
            uuid: cart.uuid
          })
        })
        const result = await response.json()
        if (result.error) {
          setAlseaCheckpriceError(t(result?.result))
        } else {
          setAlseaCheckpriceError(null)
        }
      } catch (err) {
        setAlseaCheckpriceError(err?.message)
      }
    }
    handleAlseaCheckPrice()
  }, [isCustomerMode, cart?.balance, cart?.total])

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          cart={cart}
          placing={placing}
          errors={errors}
          loyaltyPlansState={loyaltyPlansState}
          orderOptions={orderState.options}
          paymethodSelected={paymethodSelected}
          businessDetails={businessDetails}
          commentState={commentState}
          placeSpotNumber={placeSpotNumber}
          setPlaceSpotNumber={setPlaceSpotNumber}
          instructionsOptions={instructionsOptions}
          deliveryOptionSelected={deliveryOptionSelected}
          handlePaymethodChange={handlePaymethodChange}
          handlerClickPlaceOrder={handlerClickPlaceOrder}
          handleChangeComment={handleChangeComment}
          handleChangeSpot={handleChangeSpot}
          onChangeSpot={onChangeSpot}
          handleChangeDeliveryOption={handleChangeDeliveryOption}
          handleConfirmCredomaticPage={handleConfirmCredomaticPage}
          checkoutFieldsState={checkoutFieldsState}
          alseaCheckPriceError={alseaCheckPriceError}
          openGreenPayCS={openGreenPayCS}
          navigateToGreenPayCS={navigateToGreenPayCS}   
          setLoadingCustom={setLoadingCustom}
		      loadingCustom={loadingCustom} 
          customLoadingCtrl={customLoadingCtrl}
		addressState={addressState}
		loadAddress={loadAddress}
    placeOrderGreenPayV2card={placeOrderGreenPayV2card}
        />
      )}
    </>
  )
}

Checkout.propTypes = {
  /**
   * UI Component, this must be containt all graphic elements and use parent props
   */
  UIComponent: PropTypes.elementType,
  /**
   * Custom method to receive props from checkout page
   */
  handleCustomClick: PropTypes.func,
  /**
   * onPlaceOrderClick, function to get click event and return business object after default behavior
   */
  onPlaceOrderClick: PropTypes.func,
  // /**
  //  * handler values from other components
  //  */
  // handlerValues: PropTypes.func,
  /**
   * Components types before Checkout
   * Array of type components, the parent props will pass to these components
   */
  beforeComponents: PropTypes.arrayOf(PropTypes.elementType),
  /**
   * Components types after Checkout
   * Array of type components, the parent props will pass to these components
   */
  afterComponents: PropTypes.arrayOf(PropTypes.elementType),
  /**
   * Elements before Checkout
   * Array of HTML/Components elements, these components will not get the parent props
   */
  beforeElements: PropTypes.arrayOf(PropTypes.element),
  /**
   * Elements after Checkout
   * Array of HTML/Components elements, these components will not get the parent props
   */
  afterElements: PropTypes.arrayOf(PropTypes.element)
}

Checkout.defaultProps = {
  beforeComponents: [],
  afterComponents: [],
  beforeElements: [],
  afterElements: [],
  propsToFetch: ['id', 'name', 'email', 'cellphone', 'address', 'address_notes', 'paymethods', 'logo', 'location', 'configs','metadata']
}
