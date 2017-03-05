//
//  RCTPhotoRoll.h
//  RCTPhotoRoll
//
//  Created by cyqresig on 17/2/19.
//  Copyright © 2017年 react-native-component. All rights reserved.
//

#import "RCTViewManager.h"
#import <Photos/Photos.h>

@interface RCTPhotoRollManager : RCTViewManager

@property (strong) PHFetchResult *collectionResult;
@property (strong) PHFetchResult *assetsFetchResults;
@property (strong) PHFetchOptions *fetchOptions;
@property (strong) PHImageRequestOptions *imageOptions;
@property (strong) PHCachingImageManager *imageManager;
@property CGSize AssetGridThumbnailSize;

@end
