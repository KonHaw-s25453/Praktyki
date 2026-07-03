# CmsApi.FilesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**filesControllerCheckIfUsed**](FilesApi.md#filesControllerCheckIfUsed) | **GET** /files/{id}/used | 
[**filesControllerCreate**](FilesApi.md#filesControllerCreate) | **POST** /files | 
[**filesControllerDelete**](FilesApi.md#filesControllerDelete) | **DELETE** /files/{id} | 
[**filesControllerFindAll**](FilesApi.md#filesControllerFindAll) | **GET** /files | 
[**filesControllerFindById**](FilesApi.md#filesControllerFindById) | **GET** /files/{id} | 
[**filesControllerGetAllImages**](FilesApi.md#filesControllerGetAllImages) | **GET** /files/images | 
[**filesControllerGetAllVideos**](FilesApi.md#filesControllerGetAllVideos) | **GET** /files/videos | 
[**filesControllerUpdate**](FilesApi.md#filesControllerUpdate) | **PUT** /files/{id} | 



## filesControllerCheckIfUsed

> filesControllerCheckIfUsed(id)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.FilesApi();
let id = 3.4; // Number | 
apiInstance.filesControllerCheckIfUsed(id, (error, data, response) => {
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


## filesControllerCreate

> filesControllerCreate(createFileDto)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.FilesApi();
let createFileDto = new CmsApi.CreateFileDto(); // CreateFileDto | 
apiInstance.filesControllerCreate(createFileDto, (error, data, response) => {
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
 **createFileDto** | [**CreateFileDto**](CreateFileDto.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## filesControllerDelete

> filesControllerDelete(id)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.FilesApi();
let id = 3.4; // Number | 
apiInstance.filesControllerDelete(id, (error, data, response) => {
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


## filesControllerFindAll

> filesControllerFindAll()



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.FilesApi();
apiInstance.filesControllerFindAll((error, data, response) => {
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


## filesControllerFindById

> filesControllerFindById(id)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.FilesApi();
let id = 3.4; // Number | 
apiInstance.filesControllerFindById(id, (error, data, response) => {
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


## filesControllerGetAllImages

> filesControllerGetAllImages()



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.FilesApi();
apiInstance.filesControllerGetAllImages((error, data, response) => {
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


## filesControllerGetAllVideos

> filesControllerGetAllVideos()



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.FilesApi();
apiInstance.filesControllerGetAllVideos((error, data, response) => {
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


## filesControllerUpdate

> filesControllerUpdate(id, updateFileDto)



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.FilesApi();
let id = 3.4; // Number | 
let updateFileDto = new CmsApi.UpdateFileDto(); // UpdateFileDto | 
apiInstance.filesControllerUpdate(id, updateFileDto, (error, data, response) => {
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
 **updateFileDto** | [**UpdateFileDto**](UpdateFileDto.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

