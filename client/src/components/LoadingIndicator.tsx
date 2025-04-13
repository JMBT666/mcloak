export default function LoadingIndicator() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
