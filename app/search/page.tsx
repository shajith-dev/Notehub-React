import SearchComponent from "../components/SearchComponent";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <SearchComponent />
      </div>
    </div>
  );
}
