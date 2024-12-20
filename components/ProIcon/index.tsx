import React from 'react';
import { Image } from 'react-native';


const IconByName = (name: string) => {

    switch (name) {
        case 'email':
            return <Image source={require('@/assets/images/message.png')} />
            break;
        case 'password':
            return <Image source={require('@/assets/images/lock.png')} />
            break;
        default:
            return null
            break;
    }

}

const ProIcon = ({ name }: any) => {
    return IconByName(name);
}

export default ProIcon;