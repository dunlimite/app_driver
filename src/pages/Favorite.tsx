import React from 'react'
import {
  Favorite as FavoriteController,
  Container,
} from 'ordering-ui-native-release/themes/original';

interface Props {
  navigation: any;
  route: any;
}

const Favorite = (props: Props) => {
  const favoriteProps = {
    ...props
  }

  return (
    <Container>
      <FavoriteController {...favoriteProps} />
    </Container>
  )
}

export default Favorite;
