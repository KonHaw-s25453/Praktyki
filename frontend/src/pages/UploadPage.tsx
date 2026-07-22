import FileUpload from "../components/FileUpload.tsx";
export default function UploadPage() {
    const handleUploadSuccess = () => {
        console.log("File uploaded successfully");
    };

    return (
        <div>
            <h1>CMS ekranów</h1>
            <p>Frontend działa!</p>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
    );
}