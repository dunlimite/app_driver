import React, { useState, useEffect, useCallback } from "react";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { useApi } from '@components'
export const SignupUserDetails = (props) => {
  let {
    UIComponent,
    oncheckingProgressModal
  } = props
  const [ordering] = useApi()

  const [userSignupData, setuserSignupData] = useState({
    first_name: '',
    last_name: '',
    address: {
      street_address: '',
      city: '',
      state: '',
      zip: '',
      apt: ''
    },
    driver_license: {
      lisencenumber: '',
      state: '',
      date: new Date(),
      image: ''
    },
    driverinsurance: {
      insuranceNumber: '',
      companyName: '',
      state: '',
      date: new Date(),
      image: ''
    },
    userprofileimage: '',
    userCredentialEData: null,
    deliveryType: '',
    backgroundCheck: {
      social_securitynumber: '',
      date: new Date()
    }

  })

  const [driverLicenseImage, setDriverlicenseImage] = useState('')
  const [driverInsurnceImagePath, setDriverInsuranceImagePath] = useState('')

  const [issignupComplete, setIssignupComplete] = useState(false)
  const [submitloading, setsubmitloading] = useState(false)
  const [submitComplete, issubmitComplete] = useState(false)
  const [submitinComplete, issubmitinComplete] = useState(false)

  const [stateDetails, setStateDetails] = useState([])
  const handlechnagesInput = (inputName, data) => {
    switch (inputName) {
      case 'first_name':
        setuserSignupData(prev => {
          return {
            ...prev,
            first_name: data
          }
        })
        break;
      case 'last_name':
        setuserSignupData(prev => {
          return {
            ...prev,
            last_name: data
          }
        })
        break;
      case 'street_address':
        setuserSignupData(prev => {
          return {
            ...prev,
            address: {
              ...prev?.address,
              street_address: data
            }
          }
        })
        break;
      case 'state':
        setuserSignupData(prev => {
          return {
            ...prev,
            address: {
              ...prev?.address,
              state: data
            }
          }
        })
        break;
      case 'zip':
        setuserSignupData(prev => {
          return {
            ...prev,
            address: {
              ...prev?.address,
              zip: data
            }
          }
        })
        break;
      case 'city':
        setuserSignupData(prev => {
          return {
            ...prev,
            address: {
              ...prev?.address,
              city: data
            }
          }
        })
        break;
      case 'appartment':
        setuserSignupData(prev => {
          return {
            ...prev,
            address: {
              ...prev?.address,
              apt: data
            }
          }
        })
        break;

      default:
        break;
    }
  }

  const drivcerlisence = (inputname, data) => {
    switch (inputname) {
      case 'lisence_number':
        setuserSignupData(prev => {
          return {
            ...prev,
            driver_license: {
              ...prev?.driver_license,
              lisencenumber: data
            }
          }
        })
        break;
      case 'state':
        setuserSignupData(prev => {
          return {
            ...prev,
            driver_license: {
              ...prev?.driver_license,
              state: data
            }
          }
        })
        break;
      case 'date':
        setuserSignupData(prev => {
          return {
            ...prev,
            driver_license: {
              ...prev?.driver_license,
              date: data
            }
          }
        })
        break;

      default:
        break;
    }
  }


  const backgroundCheck = (inputname, data) => {
    switch (inputname) {
      case 'social_number':
        setuserSignupData(prev => {
          return {
            ...prev,
            backgroundCheck: {
              ...prev?.backgroundCheck,
              social_securitynumber: data
            }
          }
        })
        break;
      case 'date':
        setuserSignupData(prev => {
          return {
            ...prev,
            backgroundCheck: {
              ...prev?.backgroundCheck,
              date: data
            }
          }
        })
        break;

        setuserSignupData(prev => {
          return {
            ...prev,
            driver_license: {
              ...prev?.driver_license,
              date: data
            }
          }
        })
        break;

      default:
        break;
    }
  }
  const updateDelivryType = (data) => {
    setuserSignupData(prev => {
      return {
        ...prev,
        deliveryType: data
      }
    })
  }
  const driverinsurance = (inputname, data) => {
    switch (inputname) {
      case 'lisence_number':
        setuserSignupData(prev => {
          return {
            ...prev,
            driverinsurance: {
              ...prev?.driverinsurance,
              insuranceNumber: data
            }
          }
        })
        break;
      case 'company_name':
        setuserSignupData(prev => {
          return {
            ...prev,
            driverinsurance: {
              ...prev?.driverinsurance,
              companyName: data
            }
          }
        })
        break;
      case 'state':
        setuserSignupData(prev => {
          return {
            ...prev,
            driverinsurance: {
              ...prev?.driverinsurance,
              state: data
            }
          }
        })
        break;
      case 'date':
        setuserSignupData(prev => {
          return {
            ...prev,
            driverinsurance: {
              ...prev?.driverinsurance,
              date: data
            }
          }
        })
        break;

      default:
        break;
    }
  }

  const handleDriverlicenseImage = () => {
    launchCamera(
      {
        mediaType: 'photo',
        maxHeight: 170,
        maxWidth: 400,
        includeBase64: true,
      },
      async (response) => {
        if (response.didCancel) {

          console.log('User cancelled image picker');
        } else if (response.errorMessage) {

          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          if (response?.assets?.length > 0) {
            setsubmitloading(true)

            // console.log(images,response,'images/// dat')
            try {
              // Prepare an array of base64 image URLs
              const images = response.assets.map((image) => {
                return `data:${image.type};base64,${image.base64}`;
              });
              console.log(JSON.stringify({ image: images[0] }), 'image  base64 format/./..s')
              // const base64Image = response.assets[0].base64;
              // console.log(base64Image, 'bae64 imafsedfff')
              // let formdata = new FormData()
              // formdata.append('image', images[0])
              // console.log(images[0], 'image uploadf ofksofk')
              const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driverapp/image_upload.php', {
                method: 'post',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'

                },
                body: JSON.stringify({
                  image: images[0]
                })

              })
              // console.log(res.json(), 'ersdsdsd')
              const result = await res.json()

              if (result?.status) {
                setuserSignupData(prev => {
                  return {
                    ...prev,
                    driver_license: {
                      ...prev?.driver_license,
                      image: result?.img_url
                    }
                  }
                })
                setsubmitloading(false)
              }
              console.log(result, 'image upload result//... ')
              // console.log(result)
              // if(!result.error){

              // showToast(
              // 	ToastType.Success,
              // 	t('UPLOAD_SUCCESSFULLY', 'Upload successfully'),
              // );
              // }
            } catch (error) {
              console.error('Error uploading image:', error);
              setsubmitloading(false)

            }
          } else {
            setsubmitloading(false)

            console.log('Image not found');
          }
        }
      },
    );
  }
  const handleDriverinsurneImage = () => {

    launchCamera(
      {
        mediaType: 'photo',
        maxHeight: 170,
        maxWidth: 400,
        includeBase64: true,
      },
      async (response) => {
        if (response.didCancel) {

          console.log('User cancelled image picker');
        } else if (response.errorMessage) {

          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          if (response?.assets?.length > 0) {

            setsubmitloading(true)
            // console.log(images,response,'images/// dat')
            try {
              // Prepare an array of base64 image URLs
              const images = response.assets.map((image) => {
                return `data:${image.type};base64,${image.base64}`;
              });
              // console.log(JSON.stringify({ image: images[0] }), 'image  base64 format/./..s')
              // const base64Image = response.assets[0].base64;
              // console.log(base64Image, 'bae64 imafsedfff')
              // let formdata = new FormData()
              // formdata.append('image', images[0])
              // console.log(images[0], 'image uploadf ofksofk')
              const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driverapp/image_upload.php', {
                method: 'post',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'

                },
                body: JSON.stringify({
                  image: images[0]
                })

              })
              // console.log(res.json(), 'ersdsdsd')
              const result = await res.json()

              if (result?.status) {
                setuserSignupData(prev => {
                  return {
                    ...prev,
                    driverinsurance: {
                      ...prev?.driverinsurance,
                      image: result?.img_url
                    }
                  }
                })
                setsubmitloading(false)
              }
              // console.log(result, 'image upload result//... ')
              // console.log(result)
              // if(!result.error){

              // showToast(
              // 	ToastType.Success,
              // 	t('UPLOAD_SUCCESSFULLY', 'Upload successfully'),
              // );
              // }
            } catch (error) {
              setsubmitloading(false)
              console.error('Error uploading image:', error);
            }
          } else {
            setsubmitloading(false)

            console.log('Image not found');
          }
        }
      },
    );
  }

  const hndledriverusrprofielImage = () => {

    launchCamera(
      {
        mediaType: 'photo',
        maxHeight: 170,
        maxWidth: 400,
        includeBase64: true,
      },
      async (response) => {
        if (response.didCancel) {

          console.log('User cancelled image picker');
        } else if (response.errorMessage) {

          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          if (response?.assets?.length > 0) {
            setsubmitloading(true)

            // console.log(images,response,'images/// dat')
            try {
              // Prepare an array of base64 image URLs
              const images = response.assets.map((image) => {
                return `data:${image.type};base64,${image.base64}`;
              });
              console.log(JSON.stringify({ image: images[0] }), 'image  base64 format/./..s')
              // const base64Image = response.assets[0].base64;
              // console.log(base64Image, 'bae64 imafsedfff')
              // let formdata = new FormData()
              // formdata.append('image', images[0])
              // console.log(images[0], 'image uploadf ofksofk')
              const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driverapp/image_upload.php', {
                method: 'post',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'

                },
                body: JSON.stringify({
                  image: images[0]
                })

              })
              // console.log(res.json(), 'ersdsdsd')
              const result = await res.json()

              if (result.status) {
                setuserSignupData(prev => {
                  return {
                    ...prev,
                    userprofileimage: result?.img_url
                  }
                })
                setsubmitloading(false)
              }
              console.log(result, 'image upload result//... ')
              // console.log(result)
              // if(!result.error){

              // showToast(
              // 	ToastType.Success,
              // 	t('UPLOAD_SUCCESSFULLY', 'Upload successfully'),
              // );
              // }
            } catch (error) {
              setsubmitloading(false)

              console.error('Error uploading image:', error);
            }
          } else {
            setsubmitloading(false)

            console.log('Image not found');
          }
        }
      },
    );
  }

  const usercredentialDataUpdate = (data) => {
    setuserSignupData(prev => {
      return {
        ...prev,
        userCredentialEData: data
      }
    })
  }

  const handlesubmitSignup = async () => {
    setsubmitloading(true)
    let _payloaddata = {
      phone: userSignupData?.userCredentialEData?.phone,
      email: userSignupData?.userCredentialEData?.email,
      data: userSignupData
    }

    console.log(_payloaddata,'payload darara..///')
    const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driverapp/driver_signup.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(_payloaddata)
    })
    const result = await res.json()

    if (result?.data?.error) {
      // issubmitComplete(true)
      setsubmitloading(false)
      showToast(ToastType.Errror, t('message', `${result?.message}`))
      return

    }
    if (!result?.status) {
      issubmitComplete(true)
      setsubmitloading(false)
      issubmitinComplete(false)
      showToast(ToastType.Errror, t('message', `${result?.message}`))

    } else {


      issubmitComplete(false)
      issubmitinComplete(true)
      showToast(ToastType.Errror, t('message', `Something Wrong`))
      setsubmitloading(false)
    }
    console.log(result, 'lllllll')
    if (result?.status) {
      // showToast(ToastType.Success, t('message', ` ${result?.message}`));
      setsubmitloading(false)

    }
  }

  const loadStatedata = async () => {
    try {
      const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/driverapp/fetch_state.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          driver_id: ''
        })
      })
      const result = await res.json()
      console.log(result?.data)

      if (result.status) {
        setStateDetails(result?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadStatedata();
    }, [])
  );

  return (
    <>
      {
        UIComponent && (
          <UIComponent
            {...props}
            formstate={userSignupData}
            handlechangeInput={handlechnagesInput}
            driverlicenseimageUpload={handleDriverlicenseImage}
            driverlisenc={drivcerlisence}
            driverinsuranceImgeUplaod={handleDriverinsurneImage}
            usersprofileImageUplaod={hndledriverusrprofielImage}
            userupdteCredentialData={usercredentialDataUpdate}
            driverinsurance={driverinsurance}
            deliveryType={updateDelivryType}
            backgroundChecks={backgroundCheck}
            handlesubmitsignup={handlesubmitSignup}
            signupcomplete={issignupComplete}
            submitloading={submitloading}
            submitform={submitComplete}
            stateDetails={stateDetails}
            submitImcomplete={submitinComplete}
          />
        )
      }
    </>
  )
}
