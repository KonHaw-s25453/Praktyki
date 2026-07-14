import ApiClient from "./src/ApiClient";
import FilesApi from "./src/api/FilesApi";


const apiClient = new ApiClient();

apiClient.basePath = "http://localhost:3000";


const filesApi = new FilesApi(apiClient);


export function getFiles() {
    return new Promise((resolve, reject) => {
        filesApi.filesControllerFindAll(
            (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(data);
            }
        );
    });
}


export function uploadFile(file) {
    return new Promise((resolve, reject) => {
        filesApi.filesControllerUploadFile(
            {
                file: file
            },
            (error, data, response) => {
                console.log("UPLOAD CALLBACK");
                console.log("error:", error);
                console.log("data:", data);
                console.log("response:", response);

                if (error) {
                    reject(error)
                    return;
                } 
                resolve(response.body);
            }
        );
    });
}

export function deleteFile(id) {
    return new Promise((resolve, reject) => {
        filesApi.filesControllerDelete(
            id,
            (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(data);
            }
        );
    });
}