import { useEffect, useState } from "react";
import FilesApi from "../api/src/api/FilesApi";
import FileList from "../components/FileList";

const filesApi = new FilesApi();

export default function FilesPage() {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    filesApi.filesControllerFindAll((error: any, data: any) => {
        console.log("ERROR:", error);
        console.log("DATA:", data);

        if (error) {
            console.error("Błąd pobierania plików:", error);
            setLoading(false);
            return;
        }

        setFiles(data ?? []);
        setLoading(false);
    });
}, []);

const deleteFile = (id: number) => {
    filesApi.filesControllerRemove(id, (error) => {
        if (error) {
            console.error("Błąd usuwania:", error);
            return;
        }

        setFiles(current =>
            current.filter(file => file.id !== id)
        );
    });
};

if (loading) {
    return <p>Ładowanie...</p>;
}
    return (
        <div>
            <h1>Biblioteka plików</h1>
            <FileList 
            files={files}
            onDelete={deleteFile}
            />
        </div>
    );

}