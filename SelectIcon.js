import React, {
    Component,
    PropTypes,
} from 'react'
import {
    Image,
    StyleSheet,
} from 'react-native'
import selectedIcon from './selected.png'
import unSelectedIcon from './unselected.png'

export default class SelectIcon extends Component {

    static propTypes = {
        selected: PropTypes.bool.isRequired,
    }

    constructor (props) {
        super(props)
        this.state = {
            selected: props.selected
        }
    }

    //componentWillReceiveProps (nextProps) {
    //    if (nextProps.selected !== this.props.selected) {
    //        this.setState({
    //            selected: nextProps.selected,
    //        })
    //    }
    //}


    render () {
        return (
            <Image style={[this.state.selected ? styles.selectButton : styles.unSelectButton]}
                   source={this.state.selected ? selectedIcon : unSelectedIcon}/>
        )
    }

    toggleSelected () {
        this.setState({
            selected: !this.state.selected,
        })
    }

}

const styles = StyleSheet.create({
    unSelectButton: {
        width: 30,
        height: 30,
    },
    selectButton: {
        margin: 3,
        width: 24,
        height: 24,
    },
})