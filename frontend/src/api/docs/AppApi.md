# CmsApi.AppApi

All URIs are relative to *http://localhost:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**appControllerGetHello**](AppApi.md#appControllerGetHello) | **GET** / | 



## appControllerGetHello

> appControllerGetHello()



### Example

```javascript
import CmsApi from 'cms_api';

let apiInstance = new CmsApi.AppApi();
apiInstance.appControllerGetHello((error, data, response) => {
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

