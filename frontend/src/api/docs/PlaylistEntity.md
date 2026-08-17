# CmsApi.PlaylistEntity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **Number** |  | 
**name** | **String** |  | 
**description** | **Object** |  | 
**revision** | **Number** |  | 
**repeatMode** | **String** | Action after playlist ends | 
**createdAt** | **Date** |  | 
**updatedAt** | **Date** |  | 
**items** | [**[PlaylistItemEntity]**](PlaylistItemEntity.md) |  | 
**screenPlaylists** | [**[ScreenPlaylistEntity]**](ScreenPlaylistEntity.md) |  | 
**screenStates** | **[Object]** |  | 



## Enum: RepeatModeEnum


* `LOOP` (value: `"LOOP"`)

* `FALLBACK` (value: `"FALLBACK"`)




