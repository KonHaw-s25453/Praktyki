import { useState } from "react";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
        }
    }

    function handleUpload() {
        if (!file) {
            alert("Nie wybrano pliku");
            return;
        }

        alert(`Wybrano: ${file.name}`);
    }

    return (
        <div>
            <h2>Upload pliku</h2>

            <input 
                type="file"
                onChange={handleFileChange}
            />

            <button onClick={handleUpload}>
                Wyślij
            </button>
        </div>
    );
}