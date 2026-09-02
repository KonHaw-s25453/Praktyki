# CmsApi.ScreenPlaylistEntity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **Number** | Unique identifier for the screen-playlist association | 
**screenId** | **Number** | Identifier for the associated screen | 
**playlistId** | **Number** | Identifier for the associated playlist | 
**priority** | **Number** | Priority of the screen-playlist association | 
**activeFrom** | **Date** | Start date and time when the playlist becomes active on the screen | 
**activeTo** | **Date** | End date and time when the playlist is no longer active on the screen | 
**revision** | **Number** | Revision number for the screen-playlist association | 
**createdAt** | **Date** |  | 
**updatedAt** | **Date** |  | 
**screen** | [**PlaylistEntity**](PlaylistEntity.md) |  | 
**playlist** | [**PlaylistEntity**](PlaylistEntity.md) |  | 


