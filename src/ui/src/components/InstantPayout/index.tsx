import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Modal, View, Alert, Text, Platform, Dimensions, SafeAreaView } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  OButton, OIcon, OText, OModal, OInput, Container
} from '@ui'
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { normalize, moderateScale } from '../../providers/Responsive';
import { useLanguage, useSession, useUtils, ToastType, useToast } from '@components';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export const InstantPayout = (props: any) => {
  const {
    setOpenInstantPayOut,
    payAmount,
    handelAddAccount,
    bankDetails,
    setChangeBankAccount,
    changeBankAccount,
    handelDriverPayout,
    handelDeleteAccount,
    insPayDetails,
    setPayAmount,
    handelCheckPayout
  } = props;
  console.log('bankDetails')
  console.log(bankDetails?.length)
  const theme = useTheme();
  const [, t] = useLanguage();
  const navigation = useNavigation();
  const [{ parsePrice }] = useUtils()
  const [, { showToast }] = useToast()
  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [chooseBank, setChooseBank] = useState(null);
  const [tempPayAmount, setTempPayAmount] = useState(0);
  const [deleteitem, setdelteitem] = useState()
  const [isdeleteAcc, setisaccDelete] = useState(false)
  const [tooglebackacc, setToogleBankAccount] = useState(false)
  const handelGoToOrder = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Payout' }],
    });
  }

  const chooseBankAccount = (item: any) => {
    setChooseBank(item)
  };

  const handelFinalPayout = () => {
    if (chooseBank === null) {
      alert(t('CHOOSE_YOUR_ACCOUT', 'Please choose your account'))
      return
    }
    handelDriverPayout && handelDriverPayout(payAmount, chooseBank)
  };

  const handleChangePayout = (e: any) => {
    console.log(e)
    setTempPayAmount(e)
    if (e >= insPayDetails?.minmum_witdraw && e <= insPayDetails?.finaltotalpayout) {
      setPayAmount(e)
      handelCheckPayout(e)
    } else {
      setPayAmount(payAmount)
      alert(t('PAYOUT_MINIMUM', 'You can payout minimum _MINIMUM_ and maximum _MAXIMUM_').replace('_MINIMUM_', insPayDetails?.minmum_witdraw).replace('_MAXIMUM_', insPayDetails?.finaltotalpayout))
      return
    }

  };
  const handleFocusOut = () => {
    if (tempPayAmount >= insPayDetails?.minmum_witdraw && tempPayAmount <= insPayDetails?.finaltotalpayout) {
      setPayAmount(tempPayAmount)
      handelCheckPayout(tempPayAmount)
    } else {
      setPayAmount(payAmount)
      alert(t('PAYOUT_MINIMUM', 'You can payout minimum _MINIMUM_ and maximum _MAXIMUM_').replace('_MINIMUM_', insPayDetails?.minmum_witdraw).replace('_MAXIMUM_', insPayDetails?.finaltotalpayout))
      return
    }
  }

  const handleChangeHolderName = (e: any) => {
    console.log(e)
    setHolderName(e)
  };
  const handleChangeAccountNumber = (e: any) => {
    console.log(e)
    setAccountNumber(e)
  };
  const handleChangeRoutingNumber = (e: any) => {
    console.log(e)
    setRoutingNumber(e)
  };
  const handleChangeBankName = (e: any) => {
    console.log(e)
    setBankName(e)
  };

  const deleteBankAccount = (item: any) => {
    Alert.alert(
      t('ARE_YOU_SURE', 'Are you sure?'),
      t('DELETE_THIS_ACCOUNT', 'You want to delete this account'),
      [
        { text: t('CANCEL', 'Cancel'), style: "cancel" },
        { text: t('DELETE', 'Delete'), onPress: () => handelDeleteAccount(item) },
      ]
    );

  }

  const handleAddBank = () => {
    if (holderName === '') {
      alert(t('HOLDER_NAME_REQUIRED', 'Please enter holder name'))
      return
    }
    if (accountNumber === '') {
      alert(t('ACCOUNT_NUMBER_REQUIRED', 'Please enter account number'))
      return
    }
    if (routingNumber === '') {
      alert(t('ROUTING_NUMBER_REQUIRED', 'Please enter routing number'))
      return
    } else if (routingNumber.length != 9) {
      alert(t('ROUTING_NUMBER_VALID_LENGTH', 'Routing number must be 9 digit'))
      return
    }
    if (bankName === '') {
      alert(t('BANK_NAME_REQUIRED', 'Please enter bank name'))
      return
    }

    handelAddAccount && handelAddAccount(holderName, accountNumber, routingNumber, bankName)

  }

  const maskAccountNumber = (accountNo) => {
    if (!accountNo || accountNo.length < 8) return accountNo; // Handle invalid cases

    return `${accountNo.slice(0, 4)} **** **** ${accountNo.slice(-4)}`;
  };


  const styles = StyleSheet.create({
    btnText: {
      color: '#fff',
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
    btn: {
      borderRadius: 12,
      height: 53,
      marginTop: 20,

    },
    btnBackArrow: {
      borderWidth: 0,
      // width: '40%',
      height: 32,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0,
      marginBottom: Platform.OS == 'ios' ? 0 : 0,
      marginTop: Platform.OS === 'ios' ? 0 : 5
    },
    header: {
      width: '100%',
      borderBottomColor: '#ECEEEF',
      borderBottomWidth: 1
    }
  });

  useEffect(() => {
    if (changeBankAccount === 4) {
      setTimeout(() => {
        handelGoToOrder()
      }, 2000);
    }
  }, [changeBankAccount])
  return (
    <>
      <SafeAreaView style={{
        flex: 1
      }}>

        {changeBankAccount === 1 && (
          <>
            <View style={styles?.header}>
              <View style={{
                width: Platform.OS === 'android' ? '50%' : '70%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 10,
                paddingTop: 10,
                paddingBottom: 10
              }}>
                <TouchableOpacity onPress={() => setOpenInstantPayOut(false)} style={styles.btnBackArrow}>
                  <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
                </TouchableOpacity>
                <Text style={{
                  fontSize: moderateScale(17),
                  fontWeight: '400',
                  color: '#1B3E70',
                  fontFamily: 'Outfit'
                }}>{t('INSTANT_PAYOUT', 'Instant Payout')}</Text>
              </View>

            </View>
          </>
        )}
        {changeBankAccount === 2 && (
          <>

            <View style={styles?.header}>
              <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10
              }}>
                <TouchableOpacity onPress={() => {
                  setChangeBankAccount(1)
                  setToogleBankAccount(false)
                }} style={styles.btnBackArrow}>
                  <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
                </TouchableOpacity>
                <Text style={{
                  fontSize: moderateScale(15),
                  fontWeight: '400',
                  color: '#1B3E70',
                  fontFamily: 'Outfit'
                }}>{t('WITHDRAWAL_METHODS', 'Withdrawal Methods')}</Text>

                <TouchableOpacity
                  onPress={() => setToogleBankAccount(!tooglebackacc)}
                >
                  <Text style={{
                    fontSize: moderateScale(15),
                    fontWeight: '400',
                    color: '#EE4140',
                    fontFamily: 'Outfit'
                  }}>
                    {
                      !tooglebackacc ? 'Edit' : 'Done'
                    }


                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </>
        )}
        {changeBankAccount === 3 && (
          <>
            <View style={styles?.header}>
              <View style={{
                width: '50%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 10,
                paddingTop: 10,
                paddingBottom: 10
              }}>
                <TouchableOpacity onPress={() => setChangeBankAccount(2)} style={styles.btnBackArrow}>
                  <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
                </TouchableOpacity>
                <Text style={{
                  fontSize: moderateScale(17),
                  fontWeight: '400',
                  color: '#1B3E70',
                  fontFamily: 'Outfit'
                }}>{t('ADD_ACCOUNT', 'Add Account')}</Text>
              </View>

            </View>
          </>
        )}
        <Container style={{
          // height: Dimensions.get('screen').height,

          // padding: 10
        }}>
          <View style={{ flex: 1 }}>
            {changeBankAccount === 1 && (
              <>
                {/* <View style={styles?.header}>
                <View style={{
                  width: '60%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 10
                }}>
                  <TouchableOpacity onPress={() => setOpenInstantPayOut(false)} style={styles.btnBackArrow}>
                    <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
                  </TouchableOpacity>
                  <Text style={{
                    fontSize: moderateScale(17),
                    fontWeight: '400',
                    color: '#1B3E70',
                    fontFamily: 'Outfit'
                  }}>{t('INSTANT_PAYOUT', 'Instant Payout')}</Text>
                </View>

              </View> */}
                <View style={{
                  padding: 10
                }}>

                  <OText style={{
                    fontSize: 16,
                    color: '#1B3E70',
                    fontWeight: '400',
                    fontFamily: 'Outfit',

                  }}>{t('AVAILABLE_BALANCE', 'Available Balance')}: {parsePrice(insPayDetails?.currentbalance)}</OText>

                  <OText style={{
                    fontSize: 16,
                    color: '#1B3E70',
                    fontWeight: '400',
                    fontFamily: 'Outfit',
                    paddingTop: 5

                  }}>{t('MAXIMUM_PAYOUT_AMOUNT', 'Maximum Payout Amount')}: {parsePrice(insPayDetails?.finaltotalpayout)}</OText>
                  <View style={{
                    width: '100%',
                    paddingBottom: 10,
                    marginTop: 8
                  }}>

                    <OText style={{
                      fontSize: 16,
                      color: '#1B3E70',
                      fontWeight: '400',
                      fontFamily: 'Outfit',
                      // marginTop: 12,
                      paddingBottom: 10
                    }}>
                      {t('PAYOUT_AMOUNT', 'Payout Amount')}:
                    </OText>

                    <OInput
                      onChange={(e: any) => {
                        handleChangePayout(e);

                      }}
                      value={payAmount?.toString()} // Display with two decimal places
                      editable={true}
                      selectionColor={theme.colors.primary}
                      placeholderTextColor={theme.colors.textGray}
                      color={theme.colors.textGray}
                      style={{
                        backgroundColor: '#F4F5F6',
                        borderRadius: 20,
                        width: '100%',
                        height: 48
                        // marginBottom: 20
                      }}
                    />

                  </View>
                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 10,


                  }}>
                    <View style={{
                      width: '48%',
                      padding: 15,
                      backgroundColor: '#F4F5F6',
                      borderRadius: 18,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <OText style={{
                        fontSize: 16,
                        color: '#1B3E70',
                        fontWeight: '400',
                        fontFamily: 'Outfit',

                      }}>{t('STRIPE_CHARGE', 'Stripe Charge')}:</OText>
                      <OText>{parsePrice(insPayDetails?.stripe_charge)}</OText>

                    </View>
                    <View style={{
                      width: '48%',
                      padding: 15,
                      backgroundColor: '#F4F5F6',
                      borderRadius: 18,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <OText style={{
                        fontSize: 16,
                        color: '#1B3E70',
                        fontWeight: '400',
                        fontFamily: 'Outfit',
                      }} >{t('TOTAL_PAYOUT', 'Total Payout')}:</OText>
                      <OText> {parsePrice(insPayDetails?.totalpayout)}</OText>

                    </View>

                  </View>



                  <OButton
                    onClick={() => setChangeBankAccount(2)}
                    text={t('PAYOUT', 'Payout')}
                    textStyle={styles.btnText}
                    imgRightSrc={null}
                    style={styles.btn}
                    bgColor='#EE4140'
                    borderColor={theme.colors.primary}
                  />
                </View>
              </>
            )}
            {/* {
  tooglebackacc
          } */}
            {changeBankAccount === 2 && (
              <>
                <View style={{
                  height: Dimensions.get('window').height
                }}>

                  <View style={{
                    padding: 10
                  }}>
                    {
                      !tooglebackacc && (
                        <Text style={{
                          fontSize: 22,
                          color: '#1B3E70',
                          fontFamily: 'Outfit',
                          fontWeight: '400',
                          paddingTop: 10,
                          paddingBottom: 10
                        }}>{t('CHANGE_BANK_ACCOUNT', 'Change your Bank Account')}</Text>
                      )
                    }
                    {
                      tooglebackacc && (
                        <Text style={{
                          fontSize: 22,
                          color: '#1B3E70',
                          fontFamily: 'Outfit',
                          fontWeight: '400',
                          paddingTop: 10,
                          paddingBottom: 10
                        }}>{t('YOUR_BANK_ACCOUNT', 'Your Bank Accounts')}</Text>
                      )
                    }

                    {/* <TouchableOpacity onPress={() => setChangeBankAccount(1)}>
                <IconAntDesign
                  name='arrowleft'
                  size={26}
                />
              </TouchableOpacity>
              <OText>
                {t('WITHDRAWAL_METHODS', 'Withdrawal Methods')}
              </OText> */}

                    {bankDetails?.length > 0 && bankDetails.map((item: any, index: any) => (
                      <View key={item.id} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingTop: 6,
                        paddingBottom: 5
                      }}>
                        <TouchableOpacity onPress={() => chooseBankAccount(item)} >
                          <OText style={{
                            fontSize: 15,
                            color: '#1B3E70',
                            fontWeight: '400',
                            fontFamily: 'Outfit'
                          }}>
                            {item?.bank_name}
                          </OText>
                          <OText style={{
                            fontSize: 13,
                            color: '#979B9D',
                            fontWeight: '400',
                            fontFamily: 'Outfit'
                          }}>
                            {maskAccountNumber(item?.account_no)}
                          </OText>
                        </TouchableOpacity>
                        <View style={{
                          // flexDirection: 'row',
                          // alignItems: 'center'
                        }}>
                          {
                            !tooglebackacc && (
                              <View style={{
                                marginRight: 10
                              }}>
                                {
                                  item?.account_no == chooseBank?.account_no ? (
                                    <TouchableOpacity
                                      onPress={() => chooseBankAccount(item)}
                                      style={{
                                        width: 20, height: 20,
                                        borderColor: '#2773B8',
                                        borderWidth: 1.5,
                                        borderRadius: 100,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                      }}>
                                      <View style={{
                                        width: 15, height: 15,
                                        backgroundColor: '#EE4140',
                                        borderRadius: 100
                                      }}></View>
                                    </TouchableOpacity>
                                  )
                                    :
                                    (
                                      <TouchableOpacity
                                        onPress={() => chooseBankAccount(item)}
                                        style={{
                                          width: 20, height: 20,
                                          borderColor: '#2773B8',
                                          borderWidth: 1.5,
                                          borderRadius: 100,
                                          justifyContent: 'center',
                                          alignItems: 'center'
                                        }}>
                                      </TouchableOpacity>
                                    )

                                }
                                {/* <MaterialIcon
                            name='radio-button-checked'
                            size={20}
                            color={item?.account_no == chooseBank?.account_no ? '#EE4140' : '#000'}

                          /> */}
                              </View>
                            )
                          }

                          {
                            tooglebackacc && (
                              <TouchableOpacity
                                onPress={() => {
                                  setdelteitem(item)
                                  setisaccDelete(!isdeleteAcc)
                                }
                                }
                              //  onPress={() => deleteBankAccount(item)}

                              >
                                <EntypoIcon
                                  name='cross'
                                  size={23}
                                  color='#EE4140'
                                />
                              </TouchableOpacity>
                            )
                          }

                        </View>

                      </View>
                    ))}

                    {
                      !tooglebackacc && (
                        <>
                          <View style={{
                            marginTop: 400
                          }}>
                            <OButton
                              onClick={() => setChangeBankAccount(3)}
                              text={t('ADD_NEW_ACCOUNT', 'Add a new Account')}
                              textStyle={styles.btnText}
                              imgRightSrc={null}
                              style={styles.btn}
                              bgColor={theme.colors.primary}
                              borderColor={theme.colors.primary}
                              parentStyle={{
                                // position:'absolute',
                                // bottom:50
                              }}
                            />
                            <OButton
                              onClick={handelFinalPayout}
                              text={t('PAYOUT', 'Payout')}
                              textStyle={styles.btnText}
                              imgRightSrc={null}
                              style={styles.btn}
                              bgColor={theme.colors.primary}
                              borderColor={theme.colors.primary}
                            />
                          </View>
                        </>
                      )
                    }

                  </View>
                </View>

              </>
            )}
            {changeBankAccount === 3 && (
              <>
                {/* <ScrollView style={{
               flexGrow:1
               }}> */}
                <KeyboardAwareScrollView contentContainerStyle={{
                  flexGrow: 1
                }}
                  enableOnAndroid={true}
                  extraScrollHeight={50}
                  enableAutomaticScroll={true}
                  keyboardShouldPersistTaps="handled" // Ensures taps work properly
                  keyboardOpeningTime={0} // Helps prevent unwanted scroll behavior on iOS
                  showsVerticalScrollIndicator={false}

                >
                  <OText style={{
                    fontSize: 22,
                    color: '#1B3E70',
                    fontWeight: '400',
                    fontFamily: 'Outfit',
                    paddingTop: 10,
                    paddingBottom: 12,
                    paddingHorizontal: 8
                  }}>
                    {t('GET_PAID_AUTOMATICALLY', 'Get paid automatically')}
                  </OText>
                  {/* <TouchableOpacity onPress={() => setChangeBankAccount(2)}>
                <IconAntDesign
                  name='arrowleft'
                  size={26}
                />
              </TouchableOpacity>
              <OText>
                {t('GET_PAID_AUTOMATICALLY', 'Get paid automatically')}
              </OText> */}
                  <View style={{
                    padding: 10
                  }}>
                    <OText style={{
                      fontSize: 15,
                      color: '#979B9D',
                      fontWeight: '400',
                      fontFamily: 'Outfit',
                      paddingTop: 2,
                      paddingBottom: 12,
                      lineHeight: 25
                    }}>
                      {t('ADD_YOUR_DEBITCARD_CASHOUT', 'Add your debit card and cash out your earnings they will automatically have funds transferred to your bank account immediately.')}
                    </OText>
                    <OText style={{
                      fontSize: 15,
                      color: '#1B3E70',
                      fontWeight: '400',
                      fontFamily: 'Outfit',
                      paddingBottom: 10

                    }} >
                      {t('ACCOUNT_HOLDER_NAME', 'Account Holder Name')}
                    </OText>
                    <OInput
                      onChange={(e: any) => {
                        handleChangeHolderName(e);
                      }}
                      placeholder={t('HOLDER_NAME', 'Holder Name')}
                      editable={true}
                      selectionColor={theme.colors.primary}
                      placeholderTextColor={theme.colors.textGray}
                      color={theme.colors.textGray}
                      style={{
                        backgroundColor: '#F4F5F6',
                        borderRadius: 20,
                        marginBottom: 20
                      }}
                    />
                    <OText style={{
                      fontSize: 15,
                      color: '#1B3E70',
                      fontWeight: '400',
                      fontFamily: 'Outfit',
                      paddingBottom: 10

                    }} >
                      {t('ACCOUNT_NUMBER', 'Account Number')}
                    </OText>
                    <OInput
                      onChange={(e: any) => {
                        handleChangeAccountNumber(e);
                      }}
                      placeholder='0000-0000-0000-0000'
                      editable={true}
                      selectionColor={theme.colors.primary}
                      placeholderTextColor={theme.colors.textGray}
                      color={theme.colors.textGray}
                      style={{
                        backgroundColor: '#F4F5F6',
                        borderRadius: 20,
                        marginBottom: 20
                      }}
                    />
                    <OText style={{
                      fontSize: 15,
                      color: '#1B3E70',
                      fontWeight: '400',
                      fontFamily: 'Outfit',
                      paddingBottom: 10

                    }} >
                      {t('ROUTING_NUMBER', 'Routing Number')}
                    </OText>
                    <OInput
                      onChange={(e: any) => {
                        handleChangeRoutingNumber(e);
                      }}
                      placeholder={t('ROUTING_NUMBER', 'Routing Number')}
                      editable={true}
                      selectionColor={theme.colors.primary}
                      placeholderTextColor={theme.colors.textGray}
                      color={theme.colors.textGray}
                      style={{
                        backgroundColor: '#F4F5F6',
                        borderRadius: 20,
                        marginBottom: 20
                      }}
                      maxLength={9}
                      keyboardType='name-phone-pad'
                    />
                    <OText style={{
                      fontSize: 15,
                      color: '#1B3E70',
                      fontWeight: '400',
                      fontFamily: 'Outfit',
                      paddingBottom: 10

                    }}>
                      {t('BANK_NAME', 'Bank Name')}
                    </OText>
                    <OInput
                      onChange={(e: any) => {
                        handleChangeBankName(e);
                      }}
                      placeholder={t('BANK_NAME', 'Bank Name')}
                      editable={true}
                      selectionColor={theme.colors.primary}
                      placeholderTextColor={theme.colors.textGray}
                      color={theme.colors.textGray}
                      style={{
                        backgroundColor: '#F4F5F6',
                        borderRadius: 20,
                        marginBottom: 20
                      }}
                    />

                    <OButton
                      onClick={() => handleAddBank()}
                      text={t('ADD', 'Add')}
                      textStyle={styles.btnText}
                      imgRightSrc={null}
                      style={styles.btn}
                      bgColor={theme.colors.primary}
                      borderColor={theme.colors.primary}
                    />
                  </View>
                  {/* </ScrollView> */}
                </KeyboardAwareScrollView>
              </>
            )}
            {changeBankAccount === 4 && (
              <>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={true}
                >
                  <TouchableOpacity
                    // onPress={handelGoToOrder}
                    style={{
                      flex: 1,
                      backgroundColor: '#EE4140E5',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    {/* <View> */}
                    <View style={{
                      width: moderateScale(90),
                      height: moderateScale(90),
                      borderRadius: 100,
                      backgroundColor: '#FFFFFF',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <EntypoIcon
                        name='check'
                        size={50}
                        color='#EE4140'
                      />
                    </View>
                    <OText style={{
                      fontSize: 30,
                      color: '#FFFFFF',
                      fontWeight: '400',
                      fontFamily: 'Outfit',
                      paddingTop: 13
                    }}>
                      {t('PAYOUT_COMPLETED', 'Payout Completed')}
                    </OText>
                  </TouchableOpacity>


                </Modal>

              </>

            )}

            <Modal
              animationType="slide"
              transparent={true}
              visible={isdeleteAcc}
            >
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "rgba(0, 0, 0, 0.5)"
              }}>
                <View style={{
                  width: 300,
                  height: 300,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  // justifyContent:'center',
                  // alignItems: 'center'
                }}>
                  <View style={{ alignItems: 'center' }}>


                    <View
                      style={{
                        width: 170,
                        height: 170,
                        borderRadius: 100,
                        backgroundColor: '#F5F5F5',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 13
                      }}
                    >
                      <Ionicons
                        name='trash-outline'
                        color='#ACAFB1'
                        size={80}
                      />

                    </View>
                    <Text style={{
                      fontSize: 17,
                      color: '#1B3E70',
                      fontWeight: '400',
                      fontFamily: 'Outfit'
                    }}>{t('ARE_YOU_SURE', 'Are you sure?')}</Text>
                    <Text style={{
                      fontSize: 15,
                      color: '#979B9D',
                      fontWeight: '400',
                      fontFamily: 'Outfit',
                      paddingTop: 5,
                      paddingBottom: 5
                    }}>{t('DELETE_THIS_ACCOUNT', 'You want to delete this account')}</Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10
                  }}>
                    <TouchableOpacity
                      onPress={() => setisaccDelete(!isdeleteAcc)}
                      style={{
                        paddingTop: 15,
                        paddingLeft: 40,
                        paddingRight: 40,
                        paddingBottom: 15,
                        backgroundColor: '#C1C3C4', borderRadius: 29
                      }}><Text style={{
                        color: '#FFFFFF',
                        fontWeight: '600',
                        fontSize: 17,
                        fontFamily: 'Outfit'
                      }}>{t('CANCEL', 'Cancel')}</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handelDeleteAccount(deleteitem)
                        setisaccDelete(!isdeleteAcc)
                      }
                      }
                      style={{
                        paddingTop: 15,
                        paddingLeft: 40,
                        paddingRight: 40,
                        paddingBottom: 15,
                        padding: 13,
                        backgroundColor: '#E15B5D',
                        borderRadius: 29
                      }}><Text style={{
                        color: '#FFFFFF',
                        fontWeight: '600',
                        fontSize: 17,
                        fontFamily: 'Outfit'
                      }}>{t('DELETE', 'Delete')}</Text></TouchableOpacity>

                  </View>
                </View>


              </View>

            </Modal>
          </View>
        </Container>

      </SafeAreaView>
    </>
  )
}
