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

> syncControllerCheckManifestChanged(screenId, currentRevision)



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
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **screenId** | **Number**|  | 
 **currentRevision** | **Number**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## syncControllerGetFallback

> syncControllerGetFallback(screenId)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
apiInstance.syncControllerGetFallback(screenId, (error, data, response) => {
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

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## syncControllerGetLogs

> syncControllerGetLogs(screenId)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
apiInstance.syncControllerGetLogs(screenId, (error, data, response) => {
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

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## syncControllerGetManifest

> syncControllerGetManifest()



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
apiInstance.syncControllerGetManifest((error, data, response) => {
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


## syncControllerHeartbeat

> syncControllerHeartbeat(screenId)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
apiInstance.syncControllerHeartbeat(screenId, (error, data, response) => {
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

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## syncControllerRecordLog

> syncControllerRecordLog(screenId, body)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
let body = {key: null}; // Object | 
apiInstance.syncControllerRecordLog(screenId, body, (error, data, response) => {
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
 **body** | **Object**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## syncControllerUpdateScreenState

> syncControllerUpdateScreenState(screenId, body)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.SyncApi();
let screenId = 3.4; // Number | 
let body = {key: null}; // Object | 
apiInstance.syncControllerUpdateScreenState(screenId, body, (error, data, response) => {
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
 **body** | **Object**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

