import React from 'react'
import { Container, Sessions as SessionsController } from 'ordering-ui-native-release/themes/original'

interface Props {
  navigation: any;
  route: any;
}

const Sessions = (props: Props) => {
  const sessionsProps = {
    ...props
  }

  return (
    <Container>
      <SessionsController {...sessionsProps} />
    </Container>
  )
}

export default Sessions
