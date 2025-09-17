import React, { useEffect, useRef, useState } from "react";
import { useConfig, useLanguage, useToast, ToastType, useApi } from '@components'

export const DriverSignup = (props) => {
  let {
    UIComponent
  } = props
  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [formstate, setformstaste] = useState(1)
  const [otp, setOtp] = useState(['', '', '', ''])
  const otpref = useRef([])
  const [reCaptchaValue, setReCaptchaValue] = useState(null)
  const [, { showToast }] = useToast();

  const [isloading, setIsloading] = useState(false)
  const [isReCaptchaEnable, setIsReCaptchaEnable] = useState(false)

  const [{ configs }] = useConfig()

  const [signupAccDetails, sersignupaccDetails] = useState(
    {
      email: '',
      password: '',
      phone: '',
      otp: ''
    }
  )

  const [userphone, userPhone] = useState('')

  useEffect(() => {
    setIsReCaptchaEnable(props.isRecaptchaEnable && configs &&
      Object.keys(configs).length > 0 &&
      configs?.security_recaptcha_auth?.value === '1')
  }, [configs])

  const handlechangesInput = (inputname, value) => {
    if (inputname == 'email') {
      sersignupaccDetails(prev => {
        return {
          ...prev,
          email: value
        }
      })
    } else if (inputname == 'password') {
      sersignupaccDetails(prev => {
        return {
          ...prev,
          password: value
        }
      })
    } else if (inputname == 'phone') {
      sersignupaccDetails(prev => {
        return {
          ...prev,
          phone: value
        }
      })
    }
  }

  const handlesignupClick = async () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const password = /^(?=.*[A-Z]).{8,}$/
    if (!emailRegex.test(signupAccDetails?.email)) {
      showToast(ToastType.Error, "Invalid email address");
      return
    } else if (!password.test(signupAccDetails?.password)) {
      showToast(ToastType.Error, "The Password must be at least 8 characters and 1 Capital letter");
      return
    }
    setIsloading(true)
    const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driverapp/signup_email.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        email: signupAccDetails.email,
        password: signupAccDetails?.password
      })
    })
    console.log(signupAccDetails.email, signupAccDetails?.password)
    const result = await res.json()
    console.log(result, 'resul')
    if (!result?.status) {
      showToast(ToastType.Error, result?.message);
      setIsloading(false)
      return
    } else if (result?.status) {
      setformstaste(formstate + 1)
      setIsloading(false)
    }
  }

  const handlesendotp = async () => {
    setIsloading(true)
    const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driverapp/otp.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        phone: signupAccDetails.phone,

      })
    })
    const result = await res.json()
    if (result?.status) {
      showToast(ToastType.Success, t('OTP', ` OTP is ${result?.otp}`));
      sersignupaccDetails(prev => {
        return {
          ...prev,
          otp: result?.otp
        }
      })
      // setOtp(result?.otp)
      setformstaste(3)
      setIsloading(false)

    }else if(!result?.status){
      showToast(ToastType.Error, t('MOBILE_CHECK', ` ${result?.message}`));
      setIsloading(false)

    }
    // console.log(result, 'httprese')
  }

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    if (value && index < otp.length - 1) {
      otpref.current[index + 1]?.focus()
    }
    else if (!value && index > 0) {
      otpref.current[index - 1]?.focus()
    }
  };
  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          formstep={formstate}
          otpref={otpref}
          otpvalue={otp}
          enableReCaptcha={isReCaptchaEnable}
          handleReCaptcha={setReCaptchaValue}
          reCaptchaValue={reCaptchaValue}
          formstate={signupAccDetails}
          handleinputchanges={handlechangesInput}
          setformstatep={setformstaste}
          handlesignupclick={handlesignupClick}
          handlesendotp={handlesendotp}
          handleOtpchange={handleOtpChange}
          loadingState={isloading}
        />
      )}
    </>
  )
}
