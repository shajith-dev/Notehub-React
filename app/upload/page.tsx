import UploadNoteForm from "../components/UploadNoteForm";

export default function UploadPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <UploadNoteForm />
    </div>
  );
}
