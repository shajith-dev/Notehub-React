import ResolveRequestForm from "../../components/ResolveRequestForm";

export default function ResolveRequestPage({
  params,
}: {
  params: { id: number };
}) {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Resolve Note Request
        </h2>
        <ResolveRequestForm requestId={params.id} />
      </div>
    </div>
  );
}
