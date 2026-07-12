export default function LoadingSpinner() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-stroke border-t-primary" />
    </div>
  );
}
