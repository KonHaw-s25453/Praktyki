import { useEffect, useState } from "react";

import FilesApi from "../api/src/api/FilesApi";

import FileList from "../components/FileList";

import FileUpload from "../components/FileUpload";

import type { FileDto } from "../types/FileDto";



const filesApi = new FilesApi();
console.log("API CLIENT:", filesApi.apiClient);
console.log("BASE PATH:", filesApi.apiClient.basePath);

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
    <main className="page">
        <div className="page-header">
            <div>
                <h1>Biblioteka plików</h1>
                <p className="page-description">
                    Zarządzaj plikami wykorzystywanymi przez system.
                </p>
            </div>
        </div>

        <section className="page-section">
            <FileUpload
                onUploadSuccess={loadFiles}
            />
        </section>

        <section className="page-section">
            <FileList
                files={files}
                onDelete={deleteFile}
            />
        </section>
    </main>
);
}   