
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
      </div>
      
      <div className="h-12 w-full bg-gray-200 rounded"></div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="h-10 w-full bg-gray-100 rounded"></div>
        <div className="h-10 w-full bg-gray-100 rounded"></div>
        <div className="h-10 w-full bg-gray-100 rounded"></div>
        <div className="h-10 w-full bg-gray-100 rounded"></div>
        <div className="h-10 w-full bg-gray-100 rounded"></div>
      </div>
    </div>
  )
}
