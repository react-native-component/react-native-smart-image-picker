//
//  RCTPhotoRoll.m
//  RCTPhotoRoll
//
//  Created by cyqresig on 17/2/19.
//  Copyright © 2017年 react-native-component. All rights reserved.
//

#import "RCTPhotoRollManager.h"
#import "RCTUIManager.h"

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
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(@(self.assetsFetchResults.count));
}

RCT_EXPORT_METHOD(refresh:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (!self.collectionResult || self.collectionResult.count == 0) {
        self.collectionResult = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeSmartAlbum subtype:PHAssetCollectionSubtypeSmartAlbumUserLibrary options:nil];
//        self.imageOptions = [[PHImageRequestOptions alloc] init];
//        self.imageOptions.synchronous = NO;
//        self.fetchOptions = [[PHFetchOptions alloc] init];
//        self.fetchOptions.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:YES],];
    }
//    self.assetsFetchResults = [PHAsset fetchAssetsInAssetCollection:self.collectionResult.firstObject options:self.fetchOptions];
    
    NSArray *keys = [options allKeys];
    CGFloat width = 0;
    CGFloat height = 0;
    CGFloat scale = [UIScreen mainScreen].scale;
    
    if([keys containsObject:@"frame"]) {
        NSDictionary *frame = [options objectForKey:@"frame"];
        width = [[frame objectForKey:@"width"] floatValue];
        height = [[frame objectForKey:@"height"] floatValue];
    }
    
    CGSize AssetGridThumbnailSize = CGSizeMake(width * scale, height * scale);
    
    [self loadImages:AssetGridThumbnailSize];
    resolve(@[[NSNull null]]);
}



- (id)init {
    if ((self = [super init])) {
        self.collectionResult = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeSmartAlbum subtype:PHAssetCollectionSubtypeSmartAlbumUserLibrary options:nil];
        self.imageOptions = [[PHImageRequestOptions alloc] init];
        self.imageOptions.synchronous = NO;
        self.imageOptions.deliveryMode = PHImageRequestOptionsDeliveryModeFastFormat;
        
        self.fetchOptions = [[PHFetchOptions alloc] init];
        self.fetchOptions.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:NO],];
//        self.assetsFetchResults = [PHAsset fetchAssetsInAssetCollection:collectionResult.firstObject options:fetchOptions];
    }
    return self;
}

- (void)loadImages:(CGSize)AssetGridThumbnailSize
{
    [self.imageManager stopCachingImagesForAllAssets];
    self.assetsFetchResults = [PHAsset fetchAssetsInAssetCollection:self.collectionResult.firstObject options:self.fetchOptions];
    NSMutableArray *assets = [[NSMutableArray alloc] init];
    [self.assetsFetchResults enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([obj isKindOfClass:[PHAsset class]]) {
            [assets addObject:obj];
        }
    }];
    self.imageManager = [[PHCachingImageManager alloc] init];
    [self.imageManager startCachingImagesForAssets:assets
                                   targetSize:AssetGridThumbnailSize
                                  contentMode:PHImageContentModeAspectFit
                                      options:self.imageOptions];
}



-(void)setPhotoViewOptions:(UIImageView *)view :(nonnull NSDictionary *)options
{
    NSArray *keys = [options allKeys];
    
    int index = 0;
    CGFloat width = 0;
    CGFloat height = 0;
    CGFloat scale = [UIScreen mainScreen].scale;
    
    if([keys containsObject:@"frame"]) {
        NSDictionary *frame = [options objectForKey:@"frame"];
        width = [[frame objectForKey:@"width"] floatValue];
        height = [[frame objectForKey:@"height"] floatValue];
        view.frame = CGRectMake(view.frame.origin.x, view.frame.origin.y, width, height);
//        view.backgroundColor = [UIColor brownColor];
        view.clipsToBounds = YES;
        view.contentMode = UIViewContentModeScaleAspectFill;
    }
    if([keys containsObject:@"index"]) {
        index = [[options objectForKey:@"index"] intValue];
    }

    CGSize AssetGridThumbnailSize = CGSizeMake(width * scale, height * scale);
    
    PHAsset *asset = self.assetsFetchResults[index];
//    [[PHImageManager defaultManager] requestImageForAsset:asset targetSize:AssetGridThumbnailSize contentMode:PHImageContentModeAspectFill options:self.imageOptions resultHandler:^(UIImage * _Nullable result, NSDictionary * _Nullable info) {
//        view.image = result;
//    }];
    [self.imageManager requestImageForAsset:asset targetSize:AssetGridThumbnailSize contentMode:PHImageContentModeAspectFit options:self.imageOptions resultHandler:^(UIImage * _Nullable result, NSDictionary * _Nullable info) {
        view.image = result;
    }];
}

@end
