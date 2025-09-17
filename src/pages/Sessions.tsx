import React from 'react'
import { Container, Sessions as SessionsController } from '@ui'

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
