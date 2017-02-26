import React, {
    PropTypes,
    Component,
} from 'react'
import {
    View,
    requireNativeComponent,
    NativeModules,
    findNodeHandle,
    Platform,
} from 'react-native'

const PhotoRollManager = Platform.OS == 'ios' ? NativeModules.PhotoRoll : NativeModules.PhotoRollManager

export default class PhotoRoll extends Component {

    static getPhotoCount = PhotoRollManager.getPhotoCount

    static refresh = PhotoRollManager.refresh

    static defaultProps = {
        number: 0,
    }

    static propTypes = {
        ...View.propTypes,
        options: PropTypes.shape({
            frame: PropTypes.shape({
                width: PropTypes.number.isRequired,
                height: PropTypes.number.isRequired,
            }),
            number: PropTypes.number
        }).isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <NativePhotoRoll
                {...this.props}
            />
        )
    }
}

const NativePhotoRoll = Platform.OS == 'ios' ? requireNativeComponent('RCTPhotoRoll', PhotoRoll) : requireNativeComponent('RCTPhotoRollView', PhotoRoll)
