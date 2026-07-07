# CmsApi.ScreensApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**screensControllerAssignPlaylist**](ScreensApi.md#screensControllerAssignPlaylist) | **POST** /screens/{id}/playlists | 
[**screensControllerCreate**](ScreensApi.md#screensControllerCreate) | **POST** /screens | 
[**screensControllerDelete**](ScreensApi.md#screensControllerDelete) | **DELETE** /screens/{id} | 
[**screensControllerFindAll**](ScreensApi.md#screensControllerFindAll) | **GET** /screens | 
[**screensControllerFindById**](ScreensApi.md#screensControllerFindById) | **GET** /screens/{id} | 
[**screensControllerGenerateNewApiKey**](ScreensApi.md#screensControllerGenerateNewApiKey) | **POST** /screens/{id}/api-key | 
[**screensControllerGetByLocation**](ScreensApi.md#screensControllerGetByLocation) | **GET** /screens/location/{location} | 
[**screensControllerHeartbeat**](ScreensApi.md#screensControllerHeartbeat) | **POST** /screens/{id}/heartbeat | 
[**screensControllerRemovePlaylist**](ScreensApi.md#screensControllerRemovePlaylist) | **DELETE** /screens/{id}/playlists/{playlistId} | 
[**screensControllerUpdateAssignment**](ScreensApi.md#screensControllerUpdateAssignment) | **PUT** /screens/{id}/playlists/{playlistId} | 



## screensControllerAssignPlaylist

> screensControllerAssignPlaylist(id, body)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.ScreensApi();
let id = 3.4; // Number | 
let body = {key: null}; // Object | 
apiInstance.screensControllerAssignPlaylist(id, body, (error, data, response) => {
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


## screensControllerCreate

> screensControllerCreate(createScreenDto)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.ScreensApi();
let createScreenDto = new CmsApi.CreateScreenDto(); // CreateScreenDto | 
apiInstance.screensControllerCreate(createScreenDto, (error, data, response) => {
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
 **createScreenDto** | [**CreateScreenDto**](CreateScreenDto.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## screensControllerDelete

> screensControllerDelete(id)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.ScreensApi();
let id = 3.4; // Number | 
apiInstance.screensControllerDelete(id, (error, data, response) => {
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


## screensControllerFindAll

> screensControllerFindAll()



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.ScreensApi();
apiInstance.screensControllerFindAll((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## screensControllerFindById

> screensControllerFindById(id)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.ScreensApi();
let id = 3.4; // Number | 
apiInstance.screensControllerFindById(id, (error, data, response) => {
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


## screensControllerGenerateNewApiKey

> screensControllerGenerateNewApiKey(id)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.ScreensApi();
let id = 3.4; // Number | 
apiInstance.screensControllerGenerateNewApiKey(id, (error, data, response) => {
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


## screensControllerGetByLocation

> screensControllerGetByLocation(location)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.ScreensApi();
let location = "location_example"; // String | 
apiInstance.screensControllerGetByLocation(location, (error, data, response) => {
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
 **location** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## screensControllerHeartbeat

> screensControllerHeartbeat(id)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.ScreensApi();
let id = 3.4; // Number | 
apiInstance.screensControllerHeartbeat(id, (error, data, response) => {
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


## screensControllerRemovePlaylist

> screensControllerRemovePlaylist(id, playlistId)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.ScreensApi();
let id = 3.4; // Number | 
let playlistId = 3.4; // Number | 
apiInstance.screensControllerRemovePlaylist(id, playlistId, (error, data, response) => {
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
 **playlistId** | **Number**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## screensControllerUpdateAssignment

> screensControllerUpdateAssignment(id, playlistId)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.ScreensApi();
let id = 3.4; // Number | 
let playlistId = 3.4; // Number | 
apiInstance.screensControllerUpdateAssignment(id, playlistId, (error, data, response) => {
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
 **playlistId** | **Number**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

