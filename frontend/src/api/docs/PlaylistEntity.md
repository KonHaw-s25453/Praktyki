# CmsApi.PlaylistEntity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **Number** |  | 
**name** | **String** |  | 
**description** | **String** |  | 
**revision** | **Number** |  | 
**repeatMode** | **String** | Action after playlist ends | 
**createdAt** | **Date** |  | 
**updatedAt** | **Date** |  | 
**items** | [**[PlaylistItemEntity]**](PlaylistItemEntity.md) |  | 
**screenPlaylists** | [**[ScreenPlaylistEntity]**](ScreenPlaylistEntity.md) |  | 
**screenStates** | [**[ScreenStateEntity]**](ScreenStateEntity.md) |  | 



## Enum: RepeatModeEnum


* `LOOP` (value: `"LOOP"`)

* `FALLBACK` (value: `"FALLBACK"`)




