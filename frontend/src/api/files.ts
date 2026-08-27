import ApiClient from "./src/ApiClient";
import FilesApi from "./src/api/FilesApi";

const apiClient = new ApiClient();

apiClient.basePath = import.meta.env.VITE_API_URL;

const filesApi = new FilesApi(apiClient);

export function uploadFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
        filesApi.filesControllerUploadFile(
            { file },
            (error: any, data: any) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(data);
            }
        );
    });
}