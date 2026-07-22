import { useEffect, useState } from "react";

import FilesApi from "../api/src/api/FilesApi";

import FileList from "../components/FileList";

import FileUpload from "../components/FileUpload";

import type { FileDto } from "../types/FileDto";



const filesApi = new FilesApi();


export default function FilesPage() {

    const [files, setFiles] = useState<FileDto[]>([]);
    const [loading, setLoading] = useState(true);


    const loadFiles = () => {
    filesApi.filesControllerFindAll(
        (error: any, data: FileDto[]) => {

            if (error) {
                console.error(
                    "Błąd pobierania:",
                    error
                );
                setLoading(false);
                return;
            }

            setFiles(data ?? []);
            setLoading(false);
        }
    );
};


useEffect(() => {
    loadFiles();
}, []);



    const deleteFile = (id: number) => {
           
        if (!confirm("Czy jesteś pewien że chcesz trwale usunąć ten plik?")) {
        return;
    }

        filesApi.filesControllerDelete(
            id,
            (error) => {

                if (error) {
                    console.error(
                        "Błąd usuwania:",
                        error
                    );
                    return;
                }


                setFiles(current =>
                    current.filter(
                        file => file.id !== id
                    )
                );

            }
        );

    };



    if (loading) {
        return <p>Ładowanie...</p>;
    }



    return (
        <div>

            <h1>
                Biblioteka plików
            </h1>

            <FileUpload
            onUploadSuccess={loadFiles}
            />

            <FileList
                files={files}
                onDelete={deleteFile}

            />

        </div>
    );
}   