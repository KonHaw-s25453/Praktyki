# CmsApi.SyncApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**syncControllerCheckManifestChanged**](SyncApi.md#syncControllerCheckManifestChanged) | **GET** /sync/{screenId}/check | 
[**syncControllerGetFallback**](SyncApi.md#syncControllerGetFallback) | **GET** /sync/{screenId}/fallback | 
[**syncControllerGetLogs**](SyncApi.md#syncControllerGetLogs) | **GET** /sync/{screenId}/logs | 
[**syncControllerGetManifest**](SyncApi.md#syncControllerGetManifest) | **GET** /sync/manifest | 
[**syncControllerHeartbeat**](SyncApi.md#syncControllerHeartbeat) | **POST** /sync/{screenId}/heartbeat | 
[**syncControllerRecordLog**](SyncApi.md#syncControllerRecordLog) | **POST** /sync/{screenId}/logs | 
[**syncControllerUpdateScreenState**](SyncApi.md#syncControllerUpdateScreenState) | **POST** /sync/{screenId}/state | 



## syncControllerCheckManifestChanged

> Object syncControllerCheckManifestChanged(screenId, currentRevision)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
let currentRevision = 3.4; // Number | 
apiInstance.syncControllerCheckManifestChanged(screenId, currentRevision, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **screenId** | **Number**|  | 
 **currentRevision** | **Number**|  | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## syncControllerGetFallback

> Object syncControllerGetFallback(screenId)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
apiInstance.syncControllerGetFallback(screenId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **screenId** | **Number**|  | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## syncControllerGetLogs

> [Object] syncControllerGetLogs(screenId)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
apiInstance.syncControllerGetLogs(screenId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **screenId** | **Number**|  | 

### Return type

**[Object]**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## syncControllerGetManifest

> Object syncControllerGetManifest(xScreenID, opts)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let xScreenID = "xScreenID_example"; // String | Screen identifier
let opts = {
  'sinceRevision': 3.4 // Number | 
};
apiInstance.syncControllerGetManifest(xScreenID, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xScreenID** | **String**| Screen identifier | 
 **sinceRevision** | **Number**|  | [optional] 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## syncControllerHeartbeat

> syncControllerHeartbeat(screenId, updateScreenHeartbeatDto)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
let updateScreenHeartbeatDto = new CmsApi.UpdateScreenHeartbeatDto(); // UpdateScreenHeartbeatDto | 
apiInstance.syncControllerHeartbeat(screenId, updateScreenHeartbeatDto, (error, data, response) => {
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
 **screenId** | **Number**|  | 
 **updateScreenHeartbeatDto** | [**UpdateScreenHeartbeatDto**](UpdateScreenHeartbeatDto.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## syncControllerRecordLog

> syncControllerRecordLog(screenId, recordLogDto)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
let recordLogDto = new CmsApi.RecordLogDto(); // RecordLogDto | 
apiInstance.syncControllerRecordLog(screenId, recordLogDto, (error, data, response) => {
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
 **screenId** | **Number**|  | 
 **recordLogDto** | [**RecordLogDto**](RecordLogDto.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## syncControllerUpdateScreenState

> Object syncControllerUpdateScreenState(screenId, updateScreenStateDto)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
let updateScreenStateDto = new CmsApi.UpdateScreenStateDto(); // UpdateScreenStateDto | 
apiInstance.syncControllerUpdateScreenState(screenId, updateScreenStateDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **screenId** | **Number**|  | 
 **updateScreenStateDto** | [**UpdateScreenStateDto**](UpdateScreenStateDto.md)|  | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

