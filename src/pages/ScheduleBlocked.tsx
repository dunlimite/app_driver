import React from 'react'
import { View } from 'react-native'
import { ScheduleBlocked as ScheduleBlockedController } from '@ui'

export const ScheduleBlocked = ({ navigation, route }: any) => {

  const ScheduleBlockedProps = {
    nextSchedule: route?.params?.nextSchedule,
  }

  return (
    <View>
      <ScheduleBlockedController {...ScheduleBlockedProps} />
    </View>
  )
}
