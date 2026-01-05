import React from 'react';
import { NotificationsList as NotificationsController } from 'ordering-ui-native-release/themes/original';
import { useSession } from 'ordering-components-external/native';
import styled from 'styled-components/native';
import { Platform } from 'react-native'

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-top: ${Platform.OS === 'ios' ? '0px' : '10px'};
`;

interface Props {
    navigation: any;
    route: any;
}

const NotificationsList = (props: Props) => {

    const notificationsProps = {
        ...props,
        useSessionUser: true,
        useValidationFields: true,
        refreshSessionUser: true,
        goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
        onNavigationRedirect: (route: string, params: any) =>
            props.navigation.navigate(route, params),
    };

    return (
        <SafeAreaContainer>
            <NotificationsController {...notificationsProps} />
        </SafeAreaContainer>
    )
};

export default NotificationsList;
