import React from "react";
import { moderateScale } from "../../providers/Responsive";
import { Dimensions, StyleSheet, View, Text, SafeAreaView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  OIconButton, OButton, ODropDown, Container
} from '@ui'
import { useLanguage } from "@components"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginCheckDriverDelivery = (props) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: Dimensions.get('window').height,
      // alignItems: 'center',
      maxWidth: Dimensions.get('window').width,
      marginTop: 20
      // padding:10
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      // margin:10,
      gap: 6,
      left: -20
      // backgroundColor:'red'
    },
    row_text: {
      fontSize: moderateScale(15),
      fontFamily: 'Outfit',
      fontWeight: '400',
      color: '#1B3E70',
    },
    btn: {
      borderRadius: 7.6,
      height: moderateScale(44),
      left: 0,
      width: '100%',
      // marginHorizontal: 16
    },
  });

  const [, t] = useLanguage();

  const driverConfirm = async () => {
    await AsyncStorage.setItem('driver_Confirm', 'true')
    props?.setdriverCheck(false)
    // props?.refRBSheetCLoginCheck()
  }
  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        // padding:20

      }}

      >
        <View style={styles.container}>

          <View style={styles.row}>
            <Ionicons
              name='shield-checkmark'
              color='#EE4140'
              size={30}
            />
            <Text>Check vehicle condition (fuel, brakes, lights, tires, etc.)</Text>
          </View>
          <View style={styles.row}>
            <Ionicons
              name='shield-checkmark'
              color='#EE4140'
              size={30}
            />
            <Text>Ensure mobile phone is charged and has a GPS app ready
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons
              name='shield-checkmark'
              color='#EE4140'
              size={30}
            />
            <Text>Carry all necessary documents (driver’s license, insurance, delivery manifests)

            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons
              name='shield-checkmark'
              color='#EE4140'
              size={30}
            />
            <Text> Verify all orders are packed and match the order details


            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons
              name='shield-checkmark'
              color='#EE4140'
              size={30}
            />
            <Text>  Ensure cash float (if handling cash payments)

            </Text>
          </View>
          <OButton

            onClick={() => driverConfirm()}
            text='Confirm and Continue'
            bgColor='#EE4140'
            borderColor='#FFFFFF'
            textStyle={{
              fontSize: moderateScale(15),
              color: '#FFFFFF',
              fontWeight: '400',
              fontFamily: 'Outfit'
            }}
            imgRightSrc={null}
            parentStyle={{
              position: 'absolute',
              bottom: 80,
              width: '100%'
            }}
            //   isLoading={formState?.loading || loading}
            style={styles.btn}

          />
        </View>
      </SafeAreaView>
    </>
  )
}
