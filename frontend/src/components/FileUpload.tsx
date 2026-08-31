import { useState } from "react";
import { uploadFile } from "../api/files";

interface FileUploadProps {
    onUploadSuccess: () => void;
}

export default function FileUpload({
    onUploadSuccess
}: FileUploadProps) {

    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");


    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
        }
    }


    async function handleUpload() {

        if (!file) {
            alert("Nie wybrano pliku");
            return;
        }


        try {

            await uploadFile(file);

            setMessage(`Wysłano: ${file.name}`);

            onUploadSuccess();

        } catch (error) {

            console.error(error);
            setMessage("Błąd podczas wysyłania pliku");

        }

    }


return (
    <div className="file-upload">
        <h2>Upload pliku</h2>

        <div className="file-upload-controls">
            <input
                className="file-upload-input"
                type="file"
                onChange={handleFileChange}
            />

            <button
                className="file-upload-button"
                onClick={handleUpload}
            >
                Wyślij
            </button>
        </div>

        {message && (
            <p className="file-upload-message">
                {message}
            </p>
        )}
    </div>
);
}