import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useApi, useConfig, useLanguage } from '@components'

/**
 * Component to manage forgot password behavior without UI component
 */
export const ForgotPasswordForm = (props) => {
  const {
    UIComponent,
    navigation,
    defaultEmail,
    handleButtonForgotPasswordClick,
    handleSuccessForgotPassword,
    handleCustomForgotPasswordClick
  } = props

  const [ordering] = useApi()
  const [{ configs }] = useConfig()
  const [formState, setFormState] = useState({ loading: false, result: { error: false } })
  const [formData, setFormData] = useState({ email: defaultEmail || '' })
  const [reCaptchaValue, setReCaptchaValue] = useState(null)
  const [isReCaptchaEnable, setIsReCaptchaEnable] = useState(false)
  const [forgotStep, setForgotStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [emailSent, setEmailSent] = useState(null);
  const [sendOtp, setSendOtp] = useState(null);
  const [, t] = useLanguage()

  /**
   * Default fuction for forgot password workflow
   */
  const handleForgotPasswordMail = async (data) => {
    console.log(emailSent)
    const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/forgot_password_mail.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        email: emailSent ?? data
      })
    })
    const result = await res.json()
    if (!result.error) {
      setForgotStep(2)
      setSendOtp(result.message)
    }
  }
  const handleSubmitOtp = () => {
    setForgotStep(3)
  }
  const handleSavePassword = async () => {
    const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/update_user_password.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        newPassword: newPassword,
        email: emailSent
      })
    })
    const result = await res.json()
    if (!result.error) {
      navigation?.canGoBack() && navigation.goBack()
    }
  }
  const handleForgotPasswordClick = async (data) => {
    if (isReCaptchaEnable) {
      if (reCaptchaValue === null) {
        setFormState({
          result: {
            error: true,
            result: t('RECAPTCHA_VALIDATION_IS_REQUIRED', 'The captcha validation is required')
          },
          loading: false
        })
        return
      }
    }
    if (handleCustomForgotPasswordClick) {
      const values = data || formData
      return handleCustomForgotPasswordClick(values)
    }
    try {
      setFormState({ ...formState, loading: true })
      const values = data || formData
      const response = await ordering.users().forgotPassword(values)
      setFormState({
        result: response.content,
        loading: false
      })
      if (isReCaptchaEnable && window?.grecaptcha) {
        window.grecaptcha.reset()
        setReCaptchaValue(null)
      }
      if (!response.content.error) {
        if (handleSuccessForgotPassword) {
          handleSuccessForgotPassword(formData.email)
        }
      }
    } catch (err) {
      setFormState({
        result: {
          error: true,
          result: err.message
        },
        loading: false
      })
    }
  }

  /**
   * Update form data data
   * @param {EventTarget} e Related HTML event
   */
  const hanldeChangeInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    setIsReCaptchaEnable(props.isRecaptchaEnable && configs &&
      Object.keys(configs).length > 0 &&
      configs?.security_recaptcha_auth?.value === '1')
  }, [configs])

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          formState={formState}
          formData={formData}
          hanldeChangeInput={hanldeChangeInput}
          enableReCaptcha={isReCaptchaEnable}
          handleReCaptcha={setReCaptchaValue}
          reCaptchaValue={reCaptchaValue}
          handleForgotPasswordMail={handleForgotPasswordMail}
          forgotStep={forgotStep}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          handleSubmitOtp={handleSubmitOtp}
          setNewPassword={setNewPassword}
          newPassword={newPassword}
          handleSavePassword={handleSavePassword}
          emailSent={emailSent}
          setEmailSent={setEmailSent}
          sendOtp={sendOtp}
          handleButtonForgotPasswordClick={handleButtonForgotPasswordClick || handleForgotPasswordClick}
        />
      )}
    </>
  )
}

ForgotPasswordForm.propTypes = {
  /**
   * UI Component, this must be containt all graphic elements and use parent props
   */
  UIComponent: PropTypes.elementType,
  /**
   * Function to change default forgot password behavior
   */
  handleButtonForgotPasswordClick: PropTypes.func,
  /**
   * Function to get forgot password success event
   * @param {string} email Email to which it was sent
   */
  handleSuccessForgotPassword: PropTypes.func,
  /**
   * Default email to forgot password form
   */
  defaultEmail: PropTypes.string,
  /**
   * @param {form_data} data
   * handleCustomClick, function to get click event and return data without default behavior
   */
  handleCustomForgotPasswordClick: PropTypes.func,
  /**
   * Url to signup page
   * Url to create element link to signup page
   */
  linkToSignup: PropTypes.string,
  /**
   * Url to login page
   * Url to create element link to login
   */
  linkToLogin: PropTypes.string,
  /**
   * Element to custom link to signup
   * You can provide de link element as react router Link or your custom Anchor to signup page
   */
  elementLinkToSignup: PropTypes.element,
  /**
   * Element to custo link to Login
   * You can provide de link element as react router Link or your custom Anchor to login page
   */
  elementLinkToLogin: PropTypes.element
}
