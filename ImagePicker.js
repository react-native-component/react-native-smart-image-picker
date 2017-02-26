/*
 * A smart image picker for react-native apps
 * https://github.com/react-native-component/react-native-smart-image-picker/
 * Released under the MIT license
 * Copyright (c) 2016 react-native-component <moonsunfall@aliyun.com>
 */

import React, {
    Component,
    PropTypes,
} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    ListView,
    TouchableOpacity,
    Platform,
} from 'react-native'

import PhotoRoll from './PhotoRoll'
import PullToRefreshListView from '../react-native-smart-pull-to-refresh-listview'
import SelectIcon from './SelectIcon'

const { width: deviceWidth, height: deviceHeight, } = Dimensions.get('window')

export default class ImagePicker extends Component {

    static defaultProps = {
        autoRecycle: true,
        columnCount: 4,
        padding: 1,
    }

    static propTypes = {
        autoRecycle: PropTypes.bool,
        columnCount: PropTypes.number,
        padding: PropTypes.number,
        style: View.propTypes.style,
        onSelect: PropTypes.function,
    }

    // 构造
    constructor (props) {
        super(props)

        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })

        let dataList = []

        this.state = {
            dataList: dataList,
            dataSource: this._dataSource.cloneWithRows(dataList),
        }
        this._photoCount = 0
        this._rowCount = 0
        this._itemIndex = 0
        this._cells = []
        this._photoWidth = this._getPhotoWidth()
        this._listItemHeight = this._getListItemHeight()
        this._pageSize = this._getPageSize()
    }

    componentWillMount () {
        this._initPhotos()
    }

    render () {
        return (
            <PullToRefreshListView
                ref={ (component) => this._pullToRefreshListView = component }
                viewType={PullToRefreshListView.constants.viewType.listView}
                contentContainerStyle={styles.contentContainer}
                style={[{padding: this.props.padding,}, this.props.style, ]}
                initialListSize={this._pageSize}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                pageSize={this._pageSize}
                renderRow={this._renderRow}
                showsVerticalScrollIndicator={false}
                listItemProps={this.props.autoRecycle ? { style: {overflow: 'hidden', height: this._listItemHeight,}, } : null}
                renderFooter={this._renderFooter}
                onLoadMore={this._onLoadMore}
                autoLoadMore={true}
                enabledPullDown={false}
                //onEndReachedThreshold={deviceHeight - (Platform.OS == 'ios' ? 64 : 56)}
                //onEndReachedThreshold={Platform.OS == 'ios' ? 64 : 56}
            />
        )

    }

    _renderCells (rowIndex) {
        let { columnCount, padding, } = this.props
        let width = this._photoWidth
        let height = this._photoWidth
        let baseIndex = rowIndex * columnCount
        let cells = [];
        for (let i = 0; i < columnCount; i++) {
            let index = baseIndex + i
            if (index == this._photoCount) {
                break;
            }
            cells.push(
                <TouchableOpacity onPress={this._onPressCell}>
                    <PhotoRoll
                        style={{width, height, margin: padding,}}
                        options={{
                                    frame: { width, height, },
                                    index,
                                 }}
                    />
                    {this._renderSelectButton(index)}
                </TouchableOpacity>
            )
        }
        return cells;
    }

    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <View style={{flexDirection: 'row', overflow: 'hidden'}}>
                {this._renderCells(rowID)}
            </View>
        )
    }

    _renderSelectButton = (cellIndex) => {
        if (this._cells[ cellIndex ] == null) {
            this._cells[ cellIndex ] = {
                selected: false
            }
        }
        let selected = this._cells[ cellIndex ].selected
        return (
            <TouchableOpacity style={[styles.selectButtonContainer, styles.selectButton]}
                              onPress={this._onPressSelectButton.bind(this, cellIndex)}>
                <SelectIcon ref={ component => { this._cells[cellIndex].selectIcon = component} }
                            selected={this._cells[cellIndex].selected}/>
            </TouchableOpacity>
        )
    }

    _onPressCell = () => {

    }

    _onPressSelectButton = (cellIndex) => {
        let cell = this._cells[ cellIndex ]
        cell.selected = !cell.selected
        let { selectIcon, selected } = cell
        selectIcon.toggleSelected()
    }

    _getPhotoWidth () {
        let { columnCount, padding } = this.props
        return (deviceWidth - columnCount * (padding + 2) ) / columnCount
    }

    _getPageSize () {
        return Math.ceil(deviceHeight / this._getListItemHeight())
    }

    _getListItemHeight () {
        let { padding, } = this.props
        return this._photoWidth + padding * 2
    }

    _getRowDataList () {
        let startIndex = this._itemIndex
        let endIndex = this._itemIndex + this._pageSize <= this._rowCount ? this._itemIndex + this._pageSize : this._rowCount
        let dataList = []
        for (let i = startIndex; i < endIndex; i++) {
            dataList.push(null)
        }
        this._itemIndex = endIndex
        return dataList
    }

    _renderFooter = (viewState) => {
        let {pullState, } = viewState
        let {load_more_none, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        switch (pullState) {
            case load_more_none:
            case loading_more:
                return (
                    <View
                        style={styles.footer}>
                        <ActivityIndicator
                            animating={true}
                            size={'small'}/>
                    </View>
                )
            case loaded_all:
                return null
        }
        return null
    }

    async _initPhotos () {
        let { columnCount, } = this.props
        this._photoCount = await PhotoRoll.getPhotoCount(null)
        this._rowCount = Math.ceil(this._photoCount / columnCount)
        this._itemIndex = 0

        let refreshedDataList = this._getRowDataList()
        this.setState({
            dataList: refreshedDataList,
            dataSource: this._dataSource.cloneWithRows(refreshedDataList),
        })
    }

    _onLoadMore = () => {
        let addedDataList = this._getRowDataList()
        let newDataList = this.state.dataList.concat(addedDataList)
        this.setState({
            dataList: newDataList,
            dataSource: this._dataSource.cloneWithRows(newDataList),
        }, () => {
            let loadedAll
            if (this.state.dataList.length == this._rowCount) {
                loadedAll = true
                this._pullToRefreshListView.endLoadMore(loadedAll)
            }
            else {
                loadedAll = false
                this._pullToRefreshListView.endLoadMore(loadedAll)
            }
        })
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: 'transparent',
    },

    selectButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
    },

    footer: {
        flexDirection: 'row',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
})

