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
} from 'react-native'

import PhotoRoll from './PhotoRoll'
import TimerEnhance from '../react-native-smart-timer-enhance'
import PullToRefreshListView from '../react-native-smart-pull-to-refresh-listview'

let pageSize = 20
let itemIndex = 0
const { height: deviceHeight } = Dimensions.get('window')

class ImagePicker extends Component {

    // 构造
    constructor(props) {
        super(props);

        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            //sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        let dataList = []

        this.state = {
            dataList: dataList,
            dataSource: this._dataSource.cloneWithRows(dataList),
        }
        this._rowCount = 0
    }

    componentWillMount () {
        this._initPhotos()
    }

    async _initPhotos () {
        let startDate = Date.now()
        let photoCount = await PhotoRoll.getPhotoCount(null)
        //console.log(`photoCount / 4 = `, photoCount / 4)
        this._rowCount = Math.floor(photoCount / 4)
        itemIndex = 0
        let startIndex = itemIndex
        let endIndex = itemIndex + pageSize <= this._rowCount ? itemIndex + pageSize : this._rowCount - itemIndex
        let refreshedDataList = []
        for(let i = startIndex; i < endIndex; i++) {
            refreshedDataList.push(0)
        }
        itemIndex = endIndex

        //need to clear ListRowRefsCache manually
        this._pullToRefreshListView.clearListRowRefsCache()

        this.setState({
            dataList: refreshedDataList,
            dataSource: this._dataSource.cloneWithRows(refreshedDataList),
        })
    }

    //Using ListView
    render() {
        return (
            <PullToRefreshListView
                ref={ (component) => this._pullToRefreshListView = component }
                viewType={PullToRefreshListView.constants.viewType.listView}
                contentContainerStyle={{backgroundColor: 'transparent', }}
                style={{marginTop: Platform.OS == 'ios' ? 64 : 56, }}
                initialListSize={20}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                pageSize={20}
                renderRow={this._renderRow}
                showsVerticalScrollIndicator={false}
                //renderSeparator={(sectionID, rowID) => <View style={styles.separator} />}
                //listItemProps={{overflow: 'hidden', height: 150, }}
                listItemProps={{ style: {overflow: 'hidden', height: 100,}, }}
                //renderHeader={this._renderHeader}
                renderFooter={this._renderFooter}
                //onRefresh={this._onRefresh}
                onLoadMore={this._onLoadMore}
                autoLoadMore={true}
                enabledPullDown={false}
                //onEndReachedThreshold={deviceHeight}
            />
        )

    }

    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <View style={{flexDirection: 'row',}}>
                <PhotoRoll
                    style={{width: 100, height: 100, borderWidth: 1, borderColor: 'red',}}
                    options={{
                                                frame: {
                                                    width: 100,
                                                    height: 100
                                                },
                                                number: rowID * 4,
                                             }}
                />
                <PhotoRoll
                    style={{width: 100, height: 100, borderWidth: 1, borderColor: 'red',}}
                    options={{
                                                frame: {
                                                    width: 100,
                                                    height: 100
                                                },
                                                number: rowID * 4 + 1,
                                             }}
                />
                <PhotoRoll
                    style={{width: 100, height: 100, borderWidth: 1, borderColor: 'red',}}
                    options={{
                                                frame: {
                                                    width: 100,
                                                    height: 100
                                                },
                                                number: rowID * 4 + 2,
                                             }}
                />
                <PhotoRoll
                    style={{width: 100, height: 100, borderWidth: 1, borderColor: 'red',}}
                    options={{
                                                frame: {
                                                    width: 100,
                                                    height: 100
                                                },
                                                number: rowID * 4 + 3,
                                             }}
                />
                <Text style={{paddingHorizontal: 30, paddingVertical: 20}} >{rowID}</Text>
            </View>
        )
    }

    //_renderHeader = (viewState) => {
    //    let {pullState, pullDistancePercent} = viewState
    //    let {refresh_none, refresh_idle, will_refresh, refreshing,} = PullToRefreshListView.constants.viewState
    //    pullDistancePercent = Math.round(pullDistancePercent * 100)
    //    switch(pullState) {
    //        case refresh_none:
    //            return (
    //                <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
    //                    <Text>pull down to refresh</Text>
    //                </View>
    //            )
    //        case refresh_idle:
    //            return (
    //                <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
    //                    <Text>pull down to refresh {pullDistancePercent}%</Text>
    //                </View>
    //            )
    //        case will_refresh:
    //            return (
    //                <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
    //                    <Text>release to refresh {pullDistancePercent > 100 ? 100 : pullDistancePercent}%</Text>
    //                </View>
    //            )
    //        case refreshing:
    //            return (
    //                <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
    //                    {this._renderActivityIndicator()}<Text>refreshing</Text>
    //                </View>
    //            )
    //    }
    //}

    _renderFooter = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch(pullState) {
            case load_more_none:
            case loading_more:
                return (
                    <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        {this._renderActivityIndicator()}
                    </View>
                )
            case loaded_all:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>no more</Text>
                    </View>
                )
        }
        return null
    }

    _onRefresh = () => {
        //console.log('outside _onRefresh start...')

        //console.log(`this._pullToRefreshListView._listItemRefs`)
        //console.log(this._pullToRefreshListView._listItemRefs.length)
        //console.log(Object.keys(this._pullToRefreshListView._listItemRefs).length)

        //simulate request data
        this.setTimeout( () => {
            itemIndex = 0
            let startIndex = itemIndex
            let endIndex = itemIndex + pageSize <= this._rowCount ? itemIndex + pageSize : this._rowCount - itemIndex
            let refreshedDataList = []
            for(let i = startIndex; i < endIndex; i++) {
                refreshedDataList.push(0)
            }
            itemIndex = endIndex

            //need to clear ListRowRefsCache manually
            this._pullToRefreshListView.clearListRowRefsCache()

            this.setState({
                dataList: refreshedDataList,
                dataSource: this._dataSource.cloneWithRows(refreshedDataList),
            })
            this._pullToRefreshListView.endRefresh(true)

        }, 1)
    }

    _onLoadMore = () => {
        //console.log('outside _onLoadMore start...')

        //simulate request data
        this.setTimeout( () => {

            let startIndex = itemIndex
            let endIndex = itemIndex + pageSize <= this._rowCount ? itemIndex + pageSize : this._rowCount
            let addedDataList = []
            for(let i = startIndex; i < endIndex; i++) {
                addedDataList.push(0)
            }
            itemIndex = endIndex

            console.log(`_onLoadMore = itemIndex = `, itemIndex)

            let newDataList = this.state.dataList.concat(addedDataList)
            this.setState({
                dataList: newDataList,
                dataSource: this._dataSource.cloneWithRows(newDataList),
            }, () => {
                let loadedAll
                if(this.state.dataList.length >= this._rowCount) {
                    loadedAll = true
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
                else {
                    loadedAll = false
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
            })
        }, 1)
    }

    _renderActivityIndicator() {
        return ActivityIndicator ? (
            <ActivityIndicator
                style={{marginRight: 10,}}
                animating={true}
                //color={'#ff0000'}
                size={'small'}/>
        ) : Platform.OS == 'android' ?
            (
                <ProgressBarAndroid
                    style={{marginRight: 10,}}
                    //color={'#ff0000'}
                    styleAttr={'Small'}/>

            ) :  (
            <ActivityIndicatorIOS
                style={{marginRight: 10,}}
                animating={true}
                //color={'#ff0000'}
                size={'small'}/>
        )
    }

}



const styles = StyleSheet.create({
    itemHeader: {
        height: 35,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        backgroundColor: 'blue',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        height: 60,
        //borderBottomWidth: StyleSheet.hairlineWidth,
        //borderBottomColor: '#ccc',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },

    contentContainer: {
        paddingTop: 20 + 44,
    },

    separator: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },

    thumbnail: {
        padding: 6,
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        overflow: 'hidden',
    },

    textContainer: {
        //height: 100,
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default TimerEnhance(ImagePicker)