import moment from "moment";
import { moderateScale } from "../../providers/Responsive";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Modal, Platform, ScrollView, StatusBar } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import styled, { useTheme } from 'styled-components/native';
// import { useSession } from  '../../../../'
import { useLanguage, useUtils, useConfig, useSession, useApi } from '@components';
import { Loader, OIcon } from '@ui';
import { SafeAreaView } from "react-native";

export const DriverEarnings = (props: any) => {
  const theme = useTheme();
  const [, t] = useLanguage();
  const [ordering] = useApi()
  // const [{ user, token, auth }] = useSession()
  const [{ user }] = useSession();
  const userId = props?.route?.params?.userId
  const [fetchearmomfsLoading, setFetchEatningsLoading] = useState(false)
  const [deliberyWeekList, setdeliveryWeeklist] = useState([])
  const [earnigsData, setEarningsData] = useState({
    "totalorder": 0,
    "totaldeliveryfee": 0,
    "totalbonus": 0,
    "totalshiftbonus": 0,
    "totaltips": 0,
    "base": 0,
    "totalearns": 0
  })

  const [currentReportDate, setcurrentreportDate] = useState('')
  const [reportData, setReprtData] = useState([])
  const [reportVisible, setreportVisible] = useState(false)
  const [currentWeekStart, setCurrentWeekStart] = useState(
    props?.route?.params?.weekdate // ISO week starts on Monday
  );

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      width: '70%',
      justifyContent: 'space-between',

    },
    headers: {
      width: '100%',
      borderBottomColor: '#ECEEEF',
      borderBottomWidth: 1
    },
    current_earning: {
      fontFamily: 'Outfit-Regular',
      fontSize: moderateScale(17),
      textAlign: 'center',
      marginTop: moderateScale(15)
    },
    full_card: {
      marginTop: moderateScale(10),
      marginHorizontal: moderateScale(15),
      borderRadius: moderateScale(10),
      alignItems: 'center',
      justifyContent: 'center',
      // padding: moderateScale(10)
    },
    tip_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: moderateScale(14),
    },
    tip_number_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: moderateScale(22),
      marginTop: moderateScale(5)
    },
    main_view: {
      marginTop: moderateScale(10),
      marginHorizontal: moderateScale(15),
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: 10
    },
    half_card: {
      borderRadius: moderateScale(10),
      alignItems: 'center',
      justifyContent: 'center',
      // padding: moderateScale(10),
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: Dimensions.get('window').width * 0.30
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
      marginBottom: Platform.OS == 'ios' ? 0 : 0,
      marginTop: Platform.OS === 'ios' ? 0 : 0
    },
    daily_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: moderateScale(16),
      marginTop: moderateScale(15),
      marginHorizontal: moderateScale(15),
      fontWeight: '400',
      color: '#000000',
      marginBottom: 4
    },
    daily_card: {
      // marginTop: moderateScale(10),
      marginHorizontal: moderateScale(15),
      borderRadius: moderateScale(10),
      padding: moderateScale(10),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,

      elevation: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6
    },
    date_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: moderateScale(14),
    },
    delivary_txt: {
      fontFamily: 'Outfit-Regular',
      fontSize: moderateScale(12),
      marginTop: moderateScale(7)
    },

    top_view: {
      padding: moderateScale(7),
      // marginHorizontal: moderateScale(10),

      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopLeftRadius: moderateScale(10),
      borderTopRightRadius: moderateScale(10),
      width: Dimensions.get('window').width

    },
    table_view: {
      // paddingHorizontal: moderateScale(7),
      // marginHorizontal: moderateScale(10),
      borderBottomLeftRadius: moderateScale(10),
      borderBottomRightRadius: moderateScale(10),
      paddingBottom: moderateScale(5),
      width: Dimensions.get('window').width
    },
    order_txt: {
      fontSize: moderateScale(12),
      fontFamily: 'Outfit-Regular',
      // textAlign: 'center',
      fontWeight: '500'
    },
    order_txt_table: {
      fontSize: moderateScale(10),
      fontFamily: 'Outfit-Regular',
      // textAlign: 'center',
      fontWeight: '400',
      paddingTop: 5,
      paddingBottom: 4
    },
    table_line: {
      // padding: moderateScale(7),
      // marginHorizontal: moderateScale(10),

      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopLeftRadius: moderateScale(10),
      borderTopRightRadius: moderateScale(10),
      width: '100%',
      paddingHorizontal: 10,
      borderBottomColor: '#ECEEEF',
      borderBottomWidth: 1,
      paddingTop: 3,
      paddingBottom: 3
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      // paddingBottom: moderateScale(7),
      // paddingTop: moderateScale(7)
    }
  })

  // const theme = useTheme();
  const percentageWidth = Dimensions.get('window').width * .20
  const [checkcurrenwekk, setcheckcurrentweek] = useState(false)
  const fetchdaylireport = async () => {
    setFetchEatningsLoading(true)


    let _paylaodData = {
      start_date: moment(currentReportDate).format('YYYY-MM-DD'),
      end_date: moment(currentReportDate).format('YYYY-MM-DD'),
      driver_id: userId
    }

    let _res = await fetch('https://plugins-development.ordering.co/' + ordering.project + '/driver_earning/driver_app_driver_daily_earning.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(_paylaodData)
    })
    let data = await _res?.json()

    if (data?.status) {
      setReprtData(data?.data)
      setFetchEatningsLoading(false)
      setreportVisible(true)
      // setcurrentreportDate('')
    } else {
      setFetchEatningsLoading(false)
    }

    console.log(data, 'dailyrepoert..////.')

  }

  useEffect(() => {
    if (currentReportDate != '') {
      fetchdaylireport()
    }
  }, [currentReportDate, userId])
  // Calculate start and end of the week

  const fetchearnings = async () => {
    setFetchEatningsLoading(true)
    const startDate = currentWeekStart.format("YYYY-MM-DD");
    const endDate = currentWeekStart.clone().endOf("isoWeek").format("YYYY-MM-DD");

    let _paylaodData = {
      start_date: startDate,
      end_date: endDate,
      driver_id: userId
    }
    try {
      let _res = await fetch('https://plugins-development.ordering.co/' + ordering.project + '/driver_earning/driver_app_driver_weekly_earning.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_paylaodData)
      })

      let data = await _res?.json()

      console.log(data?.datewisedata, 'data..../')
      setEarningsData(data?.data)
      setdeliveryWeeklist(data?.datewisedata)
      if (data?.status) {
        setFetchEatningsLoading(false)
      } else {
        setFetchEatningsLoading(false)

      }
    } catch (error) {
      setFetchEatningsLoading(false)
    }

  }
  useEffect(() => {


    fetchearnings()

  }, [currentWeekStart, userId])
  // Function to go to the previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => prev.clone().subtract(1, "week"));
  };

  // Function to go to the next week
  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => prev.clone().add(1, "week"));
  };


  useEffect(() => {
    function isDateInCurrentWeek(dateString) {
      const inputDate = new Date(dateString);
      const now = new Date();

      // Get the start of the current week (Sunday at 00:00:00)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      // Get the end of the current week (Saturday at 23:59:59)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return inputDate >= startOfWeek && inputDate <= endOfWeek;
    }

    setcheckcurrentweek(isDateInCurrentWeek(currentWeekStart))
  }, [currentWeekStart])
  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
            paddingTop:Platform.OS === 'android' ? StatusBar?.currentHeight : 0

      }} >

        {
          Platform.OS === 'ios' && (
            <>
              <View style={{
                borderBottomColor: '#ECEEEF',
                borderBottomWidth: 1,
                width: '100%',
                paddingBottom: 10,
                paddingHorizontal: 10,
                marginTop: Platform.OS == 'ios' ? 10 : 0
              }}>
                <TouchableOpacity

                  onPress={() => {
                    setcheckcurrentweek(false)

                    props?.navigation?.canGoBack() && props?.navigation?.goBack()
                    // setCurrentWeekStart(moment().startOf("isoWeek"))
                    setFetchEatningsLoading(false)
                  }}


                  style={styles?.header}>
                  <FeatherIcon
                    name='arrow-left'
                    size={25}
                    color='#000000'
                  />
                  <Text style={{
                    fontSize: moderateScale(17),
                    color: '#1B3E70',
                    fontWeight: '400',
                    fontFamily: 'Outfit-Regular'
                  }}>History</Text>
                </TouchableOpacity>
              </View>
            </>
          )
        }
        <View style={[styles?.headers, {
          marginTop: 10
        }]}>
          <View style={{
            width: Platform.OS === 'android' ? '50%' : '60%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
           paddingLeft:10, paddingTop:10,paddingBottom:10
            // paddingBottom: 6
            //  backgroundColor:'red'
          }}>
            <TouchableOpacity

              onPress={() => {
                setcheckcurrentweek(false)

                props?.navigation?.canGoBack() && props?.navigation?.goBack()
                // setCurrentWeekStart(moment().startOf("isoWeek"))
                setFetchEatningsLoading(false)
              }
              } style={styles.btnBackArrow}>
              <OIcon src={theme.images.general.arrow_left} color='#1B3E70' />
            </TouchableOpacity>


            <Text style={{
              fontSize: moderateScale(17),
              fontWeight: '400',
              color: '#1B3E70',
              fontFamily: 'Outfit-Regular',
              // backgroundColor:'red'
            }}>{t('EARNINGS_HISTORY', 'Earnings History')}</Text>

          </View>

        </View>


        <ScrollView

          style={{

            backgroundColor: theme.colors.white,
            // marginTop: Platform.OS == 'ios' ? 80 : 30,


          }}

          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          {
            fetchearmomfsLoading ?
              <Modal
                visible={fetchearmomfsLoading}
                transparent={true}
              >
                <Loader />
              </Modal>

              : null
          }



          <View style={styles.main_view}>
            <View style={{ ...styles.half_card, backgroundColor: '#F4F5F6' }}>
              <Text style={{ ...styles.tip_txt, color: '#7D8793' }}>{t('DELIVERY_FE', 'Base Fare')}</Text>
              <Text style={{ ...styles.tip_number_txt, color: '#1B3E70', fontSize: 20 }}>{earnigsData?.totaldeliveryfee}</Text>
            </View>
            <View style={{ ...styles.half_card, backgroundColor: '#F4F5F6' }}>
              <Text style={{ ...styles.tip_txt, color: '#7D8793' }}>{t('BONUS', 'Bonus')}</Text>
              <Text style={{ ...styles.tip_number_txt, color: '#1B3E70', fontSize: 20 }}>{earnigsData?.totalbonus}</Text>
            </View>
            <View style={{ ...styles.half_card, backgroundColor: '#F4F5F6' }}>
              <Text style={{ ...styles.tip_txt, color: '#7D8793' }}>{t('TIP', 'Tip')}</Text>
              <Text style={{ ...styles.tip_number_txt, color: '#1B3E70', fontSize: 20 }}>{earnigsData?.totaltips}</Text>
            </View>
          </View>
          <View style={[styles.main_view, { paddingTop: 5 }]}>
            <View style={{ ...styles.half_card, backgroundColor: '#F4F5F6', width: Dimensions.get('window').width * 0.45 }}>
              <Text style={{ ...styles.tip_txt, color: '#7D8793' }}>{t('TOTAL_EARNINGS_WEEKLY', 'Total Earnings')}</Text>
              <Text style={{ ...styles.tip_number_txt, color: '#1B3E70', fontSize: 20 }}>{earnigsData?.totalearns}</Text>
            </View>
            <View style={{ ...styles.half_card, backgroundColor: '#F4F5F6', width: Dimensions.get('window').width * 0.45 }}>
              <Text style={{ ...styles.tip_txt, color: '#7D8793' }}>{t('NUMBER_ORDERS', 'Number Orders')}</Text>
              <Text style={{ ...styles.tip_number_txt, color: '#1B3E70', fontSize: 20 }}>{earnigsData?.totalorder}</Text>
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
            paddingTop: 25,
            paddingBottom: 10
          }}>
            <TouchableOpacity
              onPress={() => goToPreviousWeek()}
            >
              <FeatherIcon
                name='chevron-left'
                size={25}
                color="#000000"
              />
            </TouchableOpacity>

            <Text style={{
              fontSize: moderateScale(15),
              color: '#1B3E70',
              fontWeight: '400',
              fontFamily:'Outfit-Regular'
            }}>
              {
                checkcurrenwekk ? t('CURRENT_EARNINGS', 'Current Earnings') : t('PREVIOUS_EARNINGS', 'Previous Earnings')
              }

            </Text>
            {
              checkcurrenwekk ?
                // <TouchableOpacity
                //   // onPress={() => goToNextWeek()}
                // >
                <FeatherIcon
                  name='chevron-right'
                  size={25}
                  color="#9da19e"
                />
                // </TouchableOpacity>
                :
                <TouchableOpacity
                  onPress={() => goToNextWeek()}
                >
                  <FeatherIcon
                    name='chevron-right'
                    size={25}
                    color='#000000'



                  />
                </TouchableOpacity>
            }


          </View>
          <Text style={{
            fontSize: 15,
            fontFamily: 'Outfit-Regular',
            textAlign: 'center',
            fontWeight: '400',
            color: '#1B3E70'
          }}>
            {`${currentWeekStart.format("MM/DD/YYYY")} - ${currentWeekStart.clone().endOf("isoWeek").format("MM/DD/YYYY")}`}

          </Text>
          {/* <Text style={{ ...styles.current_earning, color: '#26374B', fontSize: moderateScale(15) }}>$ {earnigsData?.totalearns}</Text>
        <Text style={{ ...styles.current_earning, color: '#1B3E70', fontSize: moderateScale(15) }}>{t('NUMBER_ORDERS', 'Number Orders')} : {earnigsData?.totalorder}</Text>

        <View style={{ ...styles.full_card, backgroundColor: '#F4F5F6' }}>
          <Text style={{ ...styles.tip_txt, color: '#7D8793' }}>{t('TIP', 'Tip')}</Text>
          <Text style={{ ...styles.tip_number_txt, color: '#1B3E70', fontSize: 20 }}>{earnigsData?.totaltips}</Text>
        </View>
        <View style={styles.main_view}>
          <View style={{ ...styles.half_card, backgroundColor: '#F4F5F6' }}>
            <Text style={{ ...styles.tip_txt, color: '#7D8793' }}>{t('DELIVERY_FEE', 'Delivery Fee')}</Text>
            <Text style={{ ...styles.tip_number_txt, color: '#1B3E70', fontSize: 20 }}>{earnigsData?.totaldeliveryfee}</Text>
          </View>
          <View style={{ ...styles.half_card, backgroundColor: '#F4F5F6' }}>
            <Text style={{ ...styles.tip_txt, color: '#7D8793' }}>{t('BONUS', 'Bonus')}</Text>
            <Text style={{ ...styles.tip_number_txt, color: '#1B3E70', fontSize: 20 }}>{earnigsData?.totalbonus}</Text>
          </View>
        </View> */}


          <Text style={{ ...styles.daily_txt }}>{t('DAILY_REPORT', 'Daily Report')}</Text>

          {
            deliberyWeekList?.map((d, index) => {
              return (
                <TouchableOpacity
                  id={index?.toString()}
                  onPress={() => setcurrentreportDate(d?.date)}
                  // onPress={() => NavigationService.navigate('DailyHistory')}
                  style={{ ...styles.daily_card, backgroundColor: '#FFFFFF', marginTop: 5 }}>
                  <View>
                    <Text style={{ ...styles.date_txt, color: '#1B3E70' }}>{moment(d?.date).format("dddd, MMMM D")}</Text>
                    <Text style={{ ...styles.delivary_txt, color: '#979B9D' }}>{d?.totaldelivery} Deliveries</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                      <Text style={{ ...styles.date_txt, color: '#EE4140' }}>${d?.totalpayment}</Text>
                      <FeatherIcon
                        name='chevron-right'
                        size={17}
                        color="#528FC6"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })
          }

        </ScrollView>

        <Modal
          visible={reportVisible}
        >
          <SafeAreaView style={{
            flex: 1
          }}>
            {
              Platform.OS === 'ios' && (
                <>
                  <View style={{
                    borderBottomColor: '#ECEEEF',
                    borderBottomWidth: 1,
                    width: '100%',
                    paddingBottom: 10,
                    paddingHorizontal: 10,
                    marginTop: Platform.OS == 'ios' ? 10 : 0
                  }}>
                    <TouchableOpacity

                      onPress={() => {
                        setcheckcurrentweek(false)

                        props?.navigation?.canGoBack() && props?.navigation?.goBack()
                        // setCurrentWeekStart(moment().startOf("isoWeek"))
                        setFetchEatningsLoading(false)
                      }}


                      style={styles?.header}>
                      <FeatherIcon
                        name='arrow-left'
                        size={25}
                        color='#000000'
                      />
                      <Text style={{
                        fontSize: moderateScale(17),
                        color: '#1B3E70',
                        fontWeight: '400',
                        fontFamily: 'Outfit-Regular'
                      }}>History</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )
            }
            <View style={[styles?.headers, {
              marginTop: 10
            }]}>
              <View style={{
                width: Platform.OS === 'android' ? '50%' : '60%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10
                //  backgroundColor:'red'
              }}>
                <TouchableOpacity

                  onPress={() => {
                    setcurrentreportDate('')
                    setreportVisible(!reportVisible)
                  }
                  } style={styles.btnBackArrow}>
                  <OIcon src={theme.images.general.arrow_left} color='#1B3E70' />
                </TouchableOpacity>


                <Text style={{
                  fontSize: moderateScale(17),
                  fontWeight: '400',
                  color: '#1B3E70',
                  fontFamily: 'Outfit-Regular',
                  // backgroundColor:'red'
                }}>{t('EARNINGS_HISTORY', 'Earnings History')}</Text>

              </View>

            </View>
            {/* <View style={{
              borderBottomColor: '#ECEEEF',
              borderBottomWidth: 1,
              width: '100%',
              paddingBottom: 10,
              paddingHorizontal: 10

            }}>
              <View style={[styles?.header, {
                // marginTop:
              }]}>
                <TouchableOpacity
                  onPress={() => {
                    setcurrentreportDate('')
                    setreportVisible(!reportVisible)
                  }}
                >
                  <FeatherIcon
                    name='arrow-left'
                    size={25}
                    color='#000000'
                  />
                </TouchableOpacity>

                <Text style={{
                  fontSize: moderateScale(17),
                  color: '#1B3E70',
                  fontWeight: '400',
                  fontFamily: 'Outfit-Regular'
                }}>{t('EARNINGS_HISTORY', 'Earnings History')}</Text>
              </View>
            </View> */}

            <ScrollView style={{
              flex: 1,
              backgroundColor: theme.colors.white,
              marginTop: Platform.OS == 'ios' ? 10 : 30,

            }}>

              <Text style={{
                textAlign: 'center',
                fontSize: moderateScale(17),
                color: '#1B3E70',
                fontWeight: '400',
                marginTop: 5,
                fontFamily:'Outfit-Regular'
              }}>{moment(currentReportDate).format("dddd, MMMM D")}</Text>
              <View style={{
                ...styles.top_view, borderBottomColor: '#B5B5B5',
                borderBottomWidth: 1, marginTop: moderateScale(15),
                // backgroundColor: "red"
              }}>

                <View
                  style={{ width: Dimensions.get('window').width * .15 }}
                >
                  <Text style={{ ...styles.order_txt, color: '#1B3E70' }}>{t('ORDER', 'Order')} #</Text>
                </View>

                {/* <View style={{ width: moderateScale(60), alignSelf: 'center' }}
          >
            <Text style={{ ...styles.order_txt, color: '#1B3E70' }}>Date</Text>
          </View> */}

                <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                  <Text style={{ ...styles.order_txt, color: '#1B3E70' }}>{t('TIP', 'Tip')}</Text>
                </View>

                <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                  <Text style={{ ...styles.order_txt, color: '#1B3E70' }}>{t('DELIVERY_FEE', 'Delivery Fee')}</Text>
                </View>

                <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                  <Text style={{ ...styles.order_txt, color: '#1B3E70' }}>{t('BONUS', 'Bonus')}</Text>
                </View>

                <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                  <Text style={{ ...styles.order_txt, color: '#1B3E70' }}>{t('TOTAL', 'Total')}</Text>
                </View>

              </View>

              <View style={{ backgroundColor: '#FFFFFF' }}>
                <FlatList
                  data={reportData?.driversorder}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ ...styles.table_line, borderBottomColor: '#B5B5B5' }}>

                        <View style={{ width: Dimensions.get('window').width * .15, alignItems: 'center' }}>
                          <Text style={{ ...styles.order_txt_table, color: '#1B3E70' }}>{item?.order?.id}</Text>
                        </View>

                        {/* <View style={{ alignSelf: 'center', width: 70 }}>
                    <Text style={{ ...styles.order_txt_table, color: '#1B3E70' }}>{moment(item?.order?.delivery_datetime).format('MM/DD/YYYY')}</Text>
                  </View> */}

                        <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                          <Text style={{ ...styles.order_txt_table, color: '#1B3E70' }}>${item?.driverpaytips}</Text>
                          {/* {
                    reportData?.length - 1 == index ?
                    <Text>{earnigsData?.totaltips}</Text>
                    :
                    null
                   } */}
                        </View>

                        <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                          <Text style={{ ...styles.order_txt_table, color: '#1B3E70' }}>${item?.driverpaydeliveryfee}</Text>
                        </View>

                        <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                          <Text style={{ ...styles.order_txt_table, color: '#1B3E70' }}>${item?.driverpaybonus}</Text>
                        </View>

                        <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                          <Text style={{ ...styles.order_txt_table, color: '#1B3E70' }}>${item?.ordertotalearns?.toFixed(2)}</Text>
                        </View>

                      </View>
                    );
                  }}
                  contentContainerStyle={{
                    width: Dimensions.get('window').width,
                    overflow: 'hidden',

                    // backgroundColor: 'green'
                  }}
                  style={{
                  }}
                />



              </View>
              <View style={{ backgroundColor: '#FFFFFF' }}>
                <FlatList
                  data={[1]}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ ...styles.table_line, borderBottomColor: '#B5B5B5', borderBottomWidth: 0 }}>

                        <View style={{ width: Dimensions.get('window').width * .15, alignItems: 'center' }}>
                          <Text style={{ ...styles.order_txt_table, color: '#1B3E70', fontWeight: '800' }}>{t('TOTAL', 'Total')}</Text>
                        </View>

                        {/* <View style={{ alignSelf: 'center', width: 70 }}>
                    <Text style={{ ...styles.order_txt_table, color: '#1B3E70' }}>{moment(item?.order?.delivery_datetime).format('MM/DD/YYYY')}</Text>
                  </View> */}

                        <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                          <Text style={{ ...styles.order_txt_table, color: '#1B3E70', fontWeight: '800' }}>${reportData?.totaltips}</Text>
                          {/* {
                    reportData?.length - 1 == index ?
                    <Text>{earnigsData?.totaltips}</Text>
                    :
                    null
                   } */}
                        </View>

                        <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                          <Text style={{ ...styles.order_txt_table, color: '#1B3E70', fontWeight: '800' }}>${reportData?.totaldeliveryfee}</Text>
                        </View>

                        <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                          <Text style={{ ...styles.order_txt_table, color: '#1B3E70', fontWeight: '800' }}>${reportData?.totalbonus}</Text>
                        </View>

                        <View style={{ width: percentageWidth, alignItems: 'flex-end' }}>
                          <Text style={{ ...styles.order_txt_table, color: '#1B3E70', fontWeight: '800' }}>${reportData?.totalearns}</Text>
                        </View>

                      </View>
                    );
                  }}
                />



              </View>

            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView >
    </>
  )
}

