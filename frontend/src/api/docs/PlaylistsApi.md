# CmsApi.PlaylistsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**playlistsControllerAddItem**](PlaylistsApi.md#playlistsControllerAddItem) | **POST** /playlists/{id}/items | 
[**playlistsControllerCreate**](PlaylistsApi.md#playlistsControllerCreate) | **POST** /playlists | 
[**playlistsControllerDelete**](PlaylistsApi.md#playlistsControllerDelete) | **DELETE** /playlists/{id} | 
[**playlistsControllerFindAll**](PlaylistsApi.md#playlistsControllerFindAll) | **GET** /playlists | 
[**playlistsControllerFindById**](PlaylistsApi.md#playlistsControllerFindById) | **GET** /playlists/{id} | 
[**playlistsControllerGetRevision**](PlaylistsApi.md#playlistsControllerGetRevision) | **GET** /playlists/{id}/revision | 
[**playlistsControllerRemoveItem**](PlaylistsApi.md#playlistsControllerRemoveItem) | **DELETE** /playlists/{id}/items/{itemId} | 
[**playlistsControllerReorderItems**](PlaylistsApi.md#playlistsControllerReorderItems) | **PUT** /playlists/{id}/reorder | 
[**playlistsControllerUpdate**](PlaylistsApi.md#playlistsControllerUpdate) | **PUT** /playlists/{id} | 



## playlistsControllerAddItem

> playlistsControllerAddItem(id, addItemToPlaylistDto)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.PlaylistsApi();
let id = 3.4; // Number | 
let addItemToPlaylistDto = new CmsApi.AddItemToPlaylistDto(); // AddItemToPlaylistDto | 
apiInstance.playlistsControllerAddItem(id, addItemToPlaylistDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**|  | 
 **addItemToPlaylistDto** | [**AddItemToPlaylistDto**](AddItemToPlaylistDto.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## playlistsControllerCreate

> playlistsControllerCreate(createPlaylistDto)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.PlaylistsApi();
let createPlaylistDto = new CmsApi.CreatePlaylistDto(); // CreatePlaylistDto | 
apiInstance.playlistsControllerCreate(createPlaylistDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createPlaylistDto** | [**CreatePlaylistDto**](CreatePlaylistDto.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## playlistsControllerDelete

> playlistsControllerDelete(id)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.PlaylistsApi();
let id = 3.4; // Number | 
apiInstance.playlistsControllerDelete(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## playlistsControllerFindAll

> [PlaylistEntity] playlistsControllerFindAll()



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.PlaylistsApi();
apiInstance.playlistsControllerFindAll((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[PlaylistEntity]**](PlaylistEntity.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## playlistsControllerFindById

> playlistsControllerFindById(id)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.PlaylistsApi();
let id = 3.4; // Number | 
apiInstance.playlistsControllerFindById(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## playlistsControllerGetRevision

> playlistsControllerGetRevision(id)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.PlaylistsApi();
let id = 3.4; // Number | 
apiInstance.playlistsControllerGetRevision(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## playlistsControllerRemoveItem

> playlistsControllerRemoveItem(id, itemId)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.PlaylistsApi();
let id = 3.4; // Number | 
let itemId = 3.4; // Number | 
apiInstance.playlistsControllerRemoveItem(id, itemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**|  | 
 **itemId** | **Number**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## playlistsControllerReorderItems

> playlistsControllerReorderItems(id, body)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.PlaylistsApi();
let id = 3.4; // Number | 
let body = {key: null}; // Object | 
apiInstance.playlistsControllerReorderItems(id, body, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**|  | 
 **body** | **Object**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## playlistsControllerUpdate

> playlistsControllerUpdate(id, updatePlaylistDto)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.PlaylistsApi();
let id = 3.4; // Number | 
let updatePlaylistDto = new CmsApi.UpdatePlaylistDto(); // UpdatePlaylistDto | 
apiInstance.playlistsControllerUpdate(id, updatePlaylistDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**|  | 
 **updatePlaylistDto** | [**UpdatePlaylistDto**](UpdatePlaylistDto.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

