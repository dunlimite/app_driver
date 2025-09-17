import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Modal, View, Text, Platform, SafeAreaView } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  OButton, OIcon, OText, OModal, Container
} from '@ui'
import { InstantPayout } from '../InstantPayout';
import { useLanguage, useSession, useUtils } from '@components';
import { PayoutController } from './PayoutController';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale } from "../../providers/Responsive";
// import { Container } from "@";
import FeatherIcon from 'react-native-vector-icons/Feather';
export const PayoutUI = (props: any) => {

  const {
    navigation,
    driverData,
    setOpenInstantPayOut,
    openInstantPayOut,
    handelclickInsPay,
    setPayAmount,
    payAmount,
    handelAddAccount,
    bankDetails,
    setChangeBankAccount,
    changeBankAccount,
    handelDriverPayout,
    handelDeleteAccount,
    insPayDetails,
    handelCheckPayout
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parsePrice }] = useUtils()
  // const goToBack = () => navigation?.canGoBack() && navigation.goBack()
  const [historyDetails, setHistoryDetails] = useState(null);

  const handelInsPayout = () => {
    setOpenInstantPayOut(true)
  }
  const openHistoryDetails = (item: any) => {
    setHistoryDetails(item)
  }
  const closeHistoryDetails = () => {
    setHistoryDetails(null)
  }

  const goToBack = () => {
    navigation?.canGoBack() && navigation.goBack()
    navigation.closeDrawer();
  }
  const styles = StyleSheet.create({
    btnText: {
      color: '#fff',
      fontFamily: 'Outfit-Regular',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
    btn: {
      borderRadius: moderateScale(12),
      height: moderateScale(45),
      marginTop: moderateScale(24),
      marginBottom: moderateScale(20)
    },
    btnBackArrow: {
      borderWidth: 0,
      width: '40%',
      // height: ,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0,
      marginBottom: Platform.OS == 'ios' ? 0 : 10,
      marginTop: Platform.OS === 'ios' ? 0 : 30
    },
    container: {
      flex: 1,

    },
    header: {
      width: '100%',
      borderBottomColor: '#ECEEEF',
      borderBottomWidth: 1
    },
    cardview: {
      backgroundColor: '#F4F5F6',
      borderRadius: moderateScale(12),
      paddingTop: moderateScale(16),
      paddingBottom: moderateScale(16),
      paddingLeft: moderateScale(5),
      paddingRight: moderateScale(5),
      justifyContent: 'center',
      alignItems: 'center'
    }
  });

  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: '#FFFFFF'
      }}>

        {
          !historyDetails && (
            <View style={[styles?.header, {
              marginTop: 10
            }]}>
              <View style={{
                width: '60%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10
                //  backgroundColor:'red'
              }}>
                <TouchableOpacity

                  onPress={() => goToBack()} style={styles.btnBackArrow}>
                  <OIcon src={theme.images.general.arrow_left} color='#1B3E70' />
                </TouchableOpacity>


                <Text style={{
                  fontSize: moderateScale(17),
                  fontWeight: '400',
                  color: '#1B3E70',
                  fontFamily: 'Outfit-Regular',
                  // backgroundColor:'red'
                }}>{t('DEPOSITS', 'Deposits')}</Text>

              </View>

            </View>

          )
        }
          {historyDetails && (
            <>
              <View style={[styles?.header, { paddingBottom: 10 }]}>
                <View style={{
                  width: '60%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding:10
                }}>
                  <TouchableOpacity onPress={() => closeHistoryDetails()} style={styles.btnBackArrow}>
                    <OIcon src={theme.images.general.arrow_left} color='#1B3E70' />
                  </TouchableOpacity>
                  <Text style={{
                    fontSize: moderateScale(17),
                    fontWeight: '400',
                    color: '#1B3E70',
                    fontFamily: 'Outfit-Regular'
                  }}>{t('DEPOSITS', 'Deposits')}</Text>
                </View>

              </View>
            </>
          )}
        <Container style={{
          //  padding:10

        }}>

          {!historyDetails && (
            <>


              <View style={{
                padding: 10
              }}>
                <View style={[styles?.cardview, { marginTop: 20 }]}>
                  <OText style={{
                    fontSize: moderateScale(15),
                    color: '#7D8793',
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}>
                    {t('CURRENT_BALANCE', 'Current Balance')}
                  </OText>
                  <OText style={{
                    fontSize: moderateScale(25),
                    color: '#EE4140',
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular',
                    paddingTop: 3
                  }}>
                    {parsePrice(driverData?.data?.currentbalance)}
                  </OText>



                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: moderateScale(20)
                  // gap: moderateScale(10)
                }}>
                  <View style={[styles?.cardview, { width: '48%' }]}>
                    <OText style={{
                      fontSize: moderateScale(13),
                      color: '#7D8793',
                      fontWeight: '400',
                      fontFamily: 'Outfit-Regular'
                    }}>
                      {t('PAYOUTS', 'Payouts')}
                    </OText>
                    <OText style={{
                      fontSize: moderateScale(20),
                      color: '#1B3E70',
                      fontWeight: '400',
                      fontFamily: 'Outfit-Regular'
                    }}>
                      {parsePrice(driverData?.data?.instantpayamount)}
                    </OText>
                  </View>

                  <View style={[styles?.cardview, { width: '48%' }]}>
                    <OText style={{
                      fontSize: moderateScale(13),
                      color: '#7D8793',
                      fontWeight: '400',
                      fontFamily: 'Outfit-Regular'
                    }}>
                      {t('DELIVERIES', 'Deliveries')}</OText>
                    <OText
                      style={{
                        fontSize: moderateScale(20),
                        color: '#1B3E70',
                        fontWeight: '400',
                        fontFamily: 'Outfit-Regular'
                      }}
                    >
                      {driverData?.data?.numberoforder}
                    </OText>
                  </View>
                </View>


                <OButton
                  onClick={handelclickInsPay}
                  text={t('INSTANT_PAYOUT', 'Instant Payout')}
                  textStyle={styles.btnText}
                  imgRightSrc={null}
                  style={styles.btn}
                  bgColor={theme.colors.primary}
                  borderColor={theme.colors.primary}
                />

                <View style={{
                  borderBottomColor: '#ECEEEF',
                  borderBottomWidth: 1,
                  paddingBottom: moderateScale(10)
                }}>
                  <OText style={{
                    fontSize: moderateScale(13),
                    color: '#1B3E70',
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}>
                    {t('PROCESSING_PAYOUTS', 'Processing Payouts')}
                  </OText>
                </View>
                <View style={{
                  backgroundColor: '#F4F5F6',
                  borderRadius: moderateScale(12),
                  marginTop: moderateScale(20), justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingTop: moderateScale(20),
                  paddingBottom: moderateScale(15)
                }}>
                  <OText style={{
                    paddingLeft: 20
                  }}>
                    {t('NO_PROCESSING_PAYOUTS', '')}
                  </OText>
                </View>

                <View style={{
                  borderBottomColor: '#ECEEEF',
                  borderBottomWidth: 1,
                  paddingBottom: moderateScale(10),
                  marginTop: moderateScale(20)
                }}>
                  <OText style={{
                    fontSize: moderateScale(13),
                    color: '#1B3E70',
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}>
                    {t('PAYOUTS_HISTORY', 'Payout History')}
                  </OText>
                </View>


                {
                  driverData?.data?.historydata?.length == 0 ? (
                    <View style={{
                      backgroundColor: '#F4F5F6',
                      borderRadius: moderateScale(12),
                      marginTop: moderateScale(20), justifyContent: 'center',
                      alignItems: 'flex-start',
                      paddingTop: moderateScale(20),
                      paddingBottom: moderateScale(15)
                    }}>
                      <OText style={{
                        paddingLeft: 20
                      }}>
                        {t('NO_PAYOUTS_HISTORY', 'You have no payouts history')}
                      </OText>
                    </View>
                  )
                    :
                    null
                }
                {driverData?.data?.historydata?.length > 0 && driverData?.data?.historydata.map((item: any, index: any) => (
                  <TouchableOpacity
                    onPress={() => openHistoryDetails(item)}
                    key={index} style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      borderBottomWidth: 1,
                      borderBottomColor: '#ECEEEF',
                      paddingTop: 7,
                      paddingBottom: 7

                    }}>
                    <OText style={{
                      fontSize: moderateScale(13),
                      color: '#1B3E70',
                      fontWeight: '400',
                      fontFamily: 'Outfit-Regular'
                    }}>
                      {item?.date_range}
                    </OText>
                    <View style={{
                      flexDirection: 'row'
                    }}>
                      <OText style={{
                        fontSize: moderateScale(13),
                        color: '#EE4140',
                        fontWeight: '400',
                        fontFamily: 'Outfit-Regular'
                      }}>
                        ${item?.totalPay?.toString()}
                      </OText>
                      <TouchableOpacity >
                        <FeatherIcon
                          name='chevron-right'
                          size={20}
                          color='#528FC6'
                        />
                      </TouchableOpacity>

                    </View>

                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          {historyDetails && (
            <>

              {/* <TouchableOpacity onPress={() => closeHistoryDetails()} style={styles.btnBackArrow}>
              <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
            </TouchableOpacity>
            <OText>
              {t('DEPOSITS', 'Deposits')}
            </OText> */}
              <View style={{
                backgroundColor: '#F4F5F6',
                paddingTop: 30,
                paddingBottom: 30,
                paddingLeft: 50, paddingRight: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                marginTop: 20
              }}>
                <OText style={{
                  color: '#7D8793',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 15,
                  fontWeight: '400'
                }}>
                  {historyDetails?.date_range}
                </OText>
                <OText style={{
                  color: '#EE4140',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 30,
                  fontWeight: '400',
                  paddingTop: 5
                }}>
                  {parsePrice(historyDetails?.totalPay)?.toString()}
                </OText>
              </View>

              {historyDetails?.histdata?.length > 0 && historyDetails?.histdata.map((item: any, index: any) => (
                <View key={index} style={{
                  // marginHorizontal: moderateScale(15),
                  borderRadius: moderateScale(10),
                  padding: moderateScale(15),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.20,
                  shadowRadius: 1.41,

                  elevation: 2,

                  marginBottom: 6,
                  backgroundColor: '#FFFFFF',
                  marginTop: 20,
                  height: 60,
                  paddingBottom: 20,
                  justifyContent: 'center',
                  // alignItems:'center'

                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      // alignItems: 'center',
                    }}>


                      <OText style={{
                        fontSize: 15,
                        color: '#1B3E70',
                        fontWeight: '500',
                        fontFamily: 'Outfit-Regular'
                      }}>
                        {t('PAYOUT', 'Payout')}
                      </OText>
                      <OText style={{
                        fontSize: 13,
                        color: '#ACAFB1',
                        fontWeight: '400',
                        fontFamily: 'Outfit-Regular',
                        marginLeft: 10

                      }}>
                        {item?.date_payout}
                      </OText>
                    </View>
                    <OText style={{
                      color: '#EE4140',
                      fontWeight: '500',
                      fontFamily: 'Outfit-Regular',
                      fontSize: 15
                    }}>
                      {parsePrice(item?.payout)?.toString()}
                    </OText>
                  </View>

                  {/* <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 20,
                }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Oufit',
                      color: '#979B9D',
                      fontWeight: '500'
                    }}
                  >Tip</Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Oufit',
                      color: '#979B9D',
                      fontWeight: '500'
                    }}
                  > $78.00</Text>
                </View> */}
                </View>
              ))}
            </>
          )}

        </Container >
        <Modal
          visible={openInstantPayOut}
          onRequestClose={() => setOpenInstantPayOut(false)}>
          <InstantPayout
            setOpenInstantPayOut={setOpenInstantPayOut}
            navigation={navigation}
            payAmount={payAmount}
            insPayDetails={insPayDetails}
            handelAddAccount={handelAddAccount}
            bankDetails={bankDetails}
            setChangeBankAccount={setChangeBankAccount}
            changeBankAccount={changeBankAccount}
            handelDriverPayout={handelDriverPayout}
            handelDeleteAccount={handelDeleteAccount}
            setPayAmount={setPayAmount}
            handelCheckPayout={handelCheckPayout}
          />
        </Modal>
      </SafeAreaView>
    </>
  )
}
export const Payout = (props: any) => {
  const payoutProps = {
    ...props,
    UIComponent: PayoutUI,
  };
  return <PayoutController {...payoutProps} />;
};
