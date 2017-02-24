//
//  RCTPhotoRoll.m
//  RCTPhotoRoll
//
//  Created by cyqresig on 17/2/19.
//  Copyright © 2017年 react-native-component. All rights reserved.
//

#import "RCTPhotoRollManager.h"
#import "RCTUIManager.h"

@interface RCTPhotoRollManager () <PHPhotoLibraryChangeObserver>
@property (strong) PHCachingImageManager *imageManager;
@end

@implementation RCTPhotoRollManager

RCT_EXPORT_MODULE(RCTPhotoRoll)

- (UIView *)view
{
    UIImageView *imageView = [[UIImageView alloc] init];
    return imageView;
}

RCT_CUSTOM_VIEW_PROPERTY(options, NSDictionary, UIImageView) {
    NSDictionary *options = [RCTConvert NSDictionary:json];
    [self setPhotoViewOptions:view :options];
}

RCT_EXPORT_METHOD(getPhotoCount:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@(self.assetsFetchResults.count));
}



- (id)init {
    if ((self = [super init])) {
        PHFetchResult<PHAssetCollection *> *collectionResult = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeSmartAlbum subtype:PHAssetCollectionSubtypeAlbumRegular options:nil];

//        for (PHAssetCollection *collection in collectionResult) {
//            if ([collection.localizedTitle isEqualToString:@"相机胶卷"]) {
//                self.imageOptions = [[PHImageRequestOptions alloc] init];
//                self.imageOptions.synchronous = NO;
//                PHFetchOptions *options = [[PHFetchOptions alloc] init];
//                options.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:NO]];
//                self.assetsFetchResults = [PHAsset fetchAssetsInAssetCollection:collection options:options];
//                break;
//            }
//        }
        
        PHAssetCollection *collection = collectionResult[0];
        self.imageOptions = [[PHImageRequestOptions alloc] init];
        self.imageOptions.synchronous = NO;
        PHFetchOptions *options = [[PHFetchOptions alloc] init];
        options.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:NO]];
        self.assetsFetchResults = [PHAsset fetchAssetsInAssetCollection:collection options:options];

    }
    return self;
}

-(void)setPhotoViewOptions:(UIImageView *)view :(nonnull NSDictionary *)options
{
    NSArray *keys = [options allKeys];
    
    int number = 0;
    CGFloat width = 0;
    CGFloat height = 0;
    CGFloat scale = [UIScreen mainScreen].scale;
    
    if([keys containsObject:@"frame"]) {
        NSDictionary *frame = [options objectForKey:@"frame"];
        width = [[frame objectForKey:@"width"] floatValue];
        height = [[frame objectForKey:@"height"] floatValue];
        view.frame = CGRectMake(view.frame.origin.x, view.frame.origin.y, width, height);
    }
    if([keys containsObject:@"number"]) {
        number = [[options objectForKey:@"number"] intValue];
    }

    CGSize AssetGridThumbnailSize = CGSizeMake(width * scale, height * scale);
    
    PHAsset *asset = self.assetsFetchResults[number];
    [[PHImageManager defaultManager] requestImageForAsset:asset targetSize:AssetGridThumbnailSize contentMode:PHImageContentModeAspectFill options:self.imageOptions resultHandler:^(UIImage * _Nullable result, NSDictionary * _Nullable info) {
        view.image = result;
    }];
}

@end
