import SearchComponent from "../components/SearchComponent";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Search Notes
        </h1>
        <SearchComponent />
      </div>
    </div>
  );
}
