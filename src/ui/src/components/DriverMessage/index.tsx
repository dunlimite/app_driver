import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Modal, View, Text, Platform, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  OButton, OIcon, OText, OModal, Container
} from '@ui'
import { useLanguage, useSession, useUtils, useApi } from '@components';
import { moderateScale } from "../../providers/Responsive";
import { DriverChat } from "../DriverChat";
import Ionicons from "react-native-vector-icons/Ionicons";

export const DriverMessage = (props: any) => {

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
  const [ordering] = useApi()
  const [{ parsePrice }] = useUtils()
  const [{ user }] = useSession();

  const [chatContacts, setChatContacts] = useState([])

  const [chatOrder, setChatOrder] = useState(null)
  const [showChatOrder, setShowChatOrder] = useState(false)
  const handleShowDriChat = (item) => {
    setShowChatOrder(true)
    setChatOrder({ ...item })
  }

  const goToBack = () => {
    navigation?.canGoBack() && navigation.goBack()
    navigation.closeDrawer();
  }
  const styles = StyleSheet.create({
    btnText: {
      color: '#fff',
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
    headers: {
      width: '100%',
      borderBottomColor: '#ECEEEF',
      borderBottomWidth: 1
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
      marginBottom: Platform.OS == 'ios' ? 0 : 0,
      marginTop: Platform.OS === 'ios' ? 0 : 0
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

  const handleGetChatContact = async () => {
    try {
      const resd = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/global_chat.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          function: 'getDriverChatContact',
          userid: user?.id
        })
      })
      const resultData = await resd.json()
      let chats = resultData?.result || [];
      // console.log('chats')
      // console.log(chats)

      // Step 1: sort by created_at (latest first)
      chats = chats.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // Step 2: filter out duplicates for private chats
      const uniqueChats = [];
      const seenUsers = new Set();

      for (const chat of chats) {
        if (chat.groupchat) {
          uniqueChats.push(chat); // keep all group chats
        } else {
          if (!seenUsers.has(chat.user_id)) {
            uniqueChats.push(chat); // keep only the latest per user
            seenUsers.add(chat.user_id);
          }
        }
      }

      // Step 3: add dummy if no private chats exist
      const hasPrivate = uniqueChats.some(c => !c.groupchat);
      if (!hasPrivate) {
        uniqueChats.push({
          id: 'dummy-1',
          author_id: 0,
          author_name: 'System',
          comment: 'No private chats yet',
          created_at: new Date().toISOString(),
          driverids: [],
          groupchat: false,
          groupname: '',
          read: null,
          source: '',
          type: 2,
          user_agent: null,
          user_id: user?.id,
          user_name: user?.name
        });
      }

      // console.log('uniqueChats')
      // console.log(uniqueChats)
      setChatContacts(uniqueChats)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    handleGetChatContact()
  }, [user?.id])

  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
            paddingTop:Platform.OS === 'android' ? StatusBar?.currentHeight : 0

        // padding:10
      }}>
        {
          Platform.OS === 'ios' && (
            <>
             <View style={[styles?.header, {
          // marginTop: 4
          backgroundColor: '#FFFFFF',
          paddingLeft: 10,
          paddingRight: 10
        }]}>
          <View style={{
            width: '60%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // padding: 10
            //  backgroundColor:'red'
          }}>
            <TouchableOpacity

              onPress={() => goToBack()} style={styles.btnBackArrow}>
              <OIcon src={theme.images.general.arrow_left} color='#1B3E70' />
            </TouchableOpacity>


            <Text style={{
              fontSize: moderateScale(17),
              fontWeight: '400',
            color:'#1B3E70',
              fontFamily: 'Outfit',
              // backgroundColor:'red'
            }}>{t('CHAT', 'Chat')}</Text>

          </View>

        </View>
            </>
          )
        }


         <View style={[styles?.headers, {
                  // marginTop: 10
                }]}>
                  <View style={{
                    width: Platform.OS === 'android' ? '50%' : '60%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // padding: 10,
                    paddingLeft:10, paddingTop:10,paddingBottom:10
                    //  backgroundColor:'red'
                  }}>
                    <TouchableOpacity

                      onPress={() => {
                        goToBack()
                      }
                      } style={styles.btnBackArrow}>
                      <OIcon src={theme.images.general.arrow_left} color='#1B3E70' />
                    </TouchableOpacity>


                    <Text style={{
                      fontSize: moderateScale(17),
                      fontWeight: '400',
                      color: '#1B3E70',
                      fontFamily: 'Outfit',
                      // backgroundColor:'red'
                    }}>{t('CHAT', 'Chat')}</Text>

                  </View>

                </View>

        <View style={{
          padding: 10
        }}>


          {chatContacts?.length > 0 && chatContacts.map((item: any, index: any) => (
            <TouchableOpacity
              onPress={() => handleShowDriChat(item)}
              key={index} style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems:'center',
                width: '100%',
                borderBottomWidth: 1,
                borderBottomColor: '#ECEEEF',
                paddingTop: 7,
                paddingBottom: 7

              }}>
              <View style={{
                flexDirection:'row',
                alignItems:'center'
              }}>
                <Ionicons
                  name='chatbubble-ellipses-sharp'
                  color={theme?.colors?.statusOrderBlue}
                  size={22}
                />
                {item?.groupchat && (
                  <OText style={{
                    fontSize: moderateScale(13),
                    color: '#1B3E70',
                    fontWeight: '400',
                    fontFamily: 'Outfit',
                    paddingLeft:7
                  }}
                  numberOfLines={1}
                  >
                    {item?.groupname} Group ({item?.author_name})
                  </OText>
                )}

                {!item?.groupchat && (
                  <OText style={{
                    fontSize: moderateScale(13),
                    color: '#1B3E70',
                    fontWeight: '400',
                    fontFamily: 'Outfit',
                    paddingLeft:7
                  }}
                  numberOfLines={1}
                  >
                    Chat with Dispatcher
                  </OText>
                )}
              </View>
              <Ionicons
                  name='chevron-forward'
                  color='#1B3E70'
                  size={22}
                />
            </TouchableOpacity>
          ))}
        </View>
        {showChatOrder && (
          <OModal
            open={showChatOrder}
            title={chatOrder?.groupchat ? chatOrder?.groupname : 'Chat with Dispatcher'}
            entireModal
            hideIcons
            onClose={() => setShowChatOrder(false)}>
            <DriverChat
              isChat
              authorId={chatOrder?.author_id}
              authorName={chatOrder?.author_name}
              driverId={chatOrder?.groupchat ? chatOrder.user_id : user?.id}
              order={chatOrder}
              open={showChatOrder}
              onClose={() => setShowChatOrder(false)}
            />
          </OModal>
        )}

      </SafeAreaView>
    </>
  )
}
