import React, { useEffect, useState, useCallback } from 'react'
import { useSession, useApi, useWebsocket, ToastType, useToast, useLanguage, useEvent, useConfig } from '@components'
import { useFocusEffect } from '@react-navigation/native';
export const PayoutController = (props) => {
  const {
    UIComponent
  } = props


  const [ordering] = useApi()
  const socket = useWebsocket()
  const [session, { user }] = useSession()
  const [events] = useEvent()
  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const [{ configs }] = useConfig()
  const [openInstantPayOut, setOpenInstantPayOut] = useState(false)
  const [payAmount, setPayAmount] = useState(0);
  const [insPayDetails, setInsPayDetails] = useState({});
  const [bankDetails, setBankDetails] = useState([]);
  const [changeBankAccount, setChangeBankAccount] = useState(1)
  const userId = props?.route?.params?.userId ?? session?.user?.id
  console.log(userId)
  const [driverData, setDriverData] = useState({ data: [], loading: false, error: null })

  const loadPayoutdata = async () => {
    try {
      console.log('ddd' + userId)
      setDriverData({ ...driverData, loading: true })
      const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driver_earning/get_driver_payout_history.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          driver_id: userId
        })
      })
      const result = await res.json()
      console.log(result?.data)
      console.log(JSON.stringify(result?.data?.historydata))

      if (result.status) {
        setDriverData({
          data: result?.data,
          loading: false,
          error: null
        })
      } else {
        setDriverData({
          ...driverData,
          loading: false,
          error: result
        })
      }
    } catch (error) {
      setDriverData({ ...driverData, loading: false, error: [error.Messages] })
    }
  }


  const handelCheckPayout = async (amount) => {
      console.log('amount=>' + amount)
      try {
        const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driver_earning/instant_pay_stripe.php', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: JSON.stringify({
            driver_id: userId,
            amount: amount
          })
        })
        const result = await res.json()
        console.log('mmm')
        console.log(result)
        setInsPayDetails((prev) => ({
          ...prev,
          instantpayamount: result?.paymentdata?.instantpayamount,
          totalpayout: result?.paymentdata?.totalpayout,
          stripe_charge: result?.paymentdata?.stripe_charge,
        }));

      } catch (error) {
        console.log(error)
      }
  }

  const handelclickInsPay = async () => {
    try {
      const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driver_earning/instant_pay.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          driver_id: userId
        })
      })
      const result = await res.json()
      console.log(result)

      if (result?.instantpayamount > 0) {
        setPayAmount(result?.instantpayamount)
        setInsPayDetails(result)

        const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driverapp/driver_account_card.php', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: JSON.stringify({
            option: '0',
            driver_id: userId
          })
        })
        const resultbank = await res.json()
        console.log('resultbank')
        console.log(resultbank)
        if (resultbank.status) {
          setBankDetails(resultbank?.data)
          setOpenInstantPayOut(true)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handelAddAccount = async (holderName, accountNumber, routingNumber, bankName) => {
    try {
        console.log('handelAddAccount')
        const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driverapp/driver_account_card.php', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: JSON.stringify({
            option: '1',
            driver_id: userId,
            account_holder_name: holderName,
            account_no: accountNumber,
            routing_no: routingNumber,
            bank_name: bankName,
            driver_email: user?.email,
          })
        })
        const resultbank = await res.json()
        console.log('resultAddbank')
        console.log(resultbank)
        if (resultbank.status) {
          setBankDetails(resultbank?.data)
          setChangeBankAccount(2)
        }

    } catch (error) {
      console.log(error)
    }
  }

  const handelDeleteAccount = async (item) => {
    try {
        console.log('handelAddAccount')
        const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driverapp/driver_account_card.php', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: JSON.stringify({
            option: '3',
            id: item?.id,
            driver_id: userId,
          })
        })
        const resultbank = await res.json()
        console.log('resultdebank')
        console.log(resultbank)
        if (resultbank.status) {
          setBankDetails(resultbank?.data)
        }

    } catch (error) {
      console.log(error)
    }
  }

  const handelDriverPayout = async (payAmount, chooseBank) => {
    try {
      console.log(payAmount)
      console.log(chooseBank)
      console.log(insPayDetails)
        const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driver_earning/driver_payout.php', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: JSON.stringify({
            driver_id: userId,
            payout: insPayDetails?.totalpayout,
            stripe_charge: insPayDetails?.stripe_charge,
            bank_details: JSON.stringify(chooseBank)
          })
        })
        const result = await res.json()
        console.log('result')
        console.log(result)
        if (result.status) {
          setChangeBankAccount(4)
        }

    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log('Latest userId:', userId);
      loadPayoutdata();
    }, [userId])
  );

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          driverData={driverData}
          setOpenInstantPayOut={setOpenInstantPayOut}
          openInstantPayOut={openInstantPayOut}
          handelclickInsPay={handelclickInsPay}
          setPayAmount={setPayAmount}
          payAmount={payAmount}
          handelAddAccount={handelAddAccount}
          bankDetails={bankDetails}
          setChangeBankAccount={setChangeBankAccount}
          changeBankAccount={changeBankAccount}
          handelDriverPayout={handelDriverPayout}
          handelDeleteAccount={handelDeleteAccount}
          insPayDetails={insPayDetails}
          handelCheckPayout={handelCheckPayout}
        />
      )}
    </>
  )
}

const defaultProps = {
  orderBy: '-id',
  orderDirection: 'desc',
  isNetConnected: true,
  paginationSettings: { initialPage: 1, pageSize: 10, controlType: 'infinity' }
}
