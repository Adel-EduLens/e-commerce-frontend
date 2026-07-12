export default function LoadingSpinner({
  className = "h-10 w-10",
  text,
  fullScreen = false,
  containerClassName = "",
}: {
  className?: string;
  text?: string;
  fullScreen?: boolean;
  containerClassName?: string;
}) {
  const containerClasses = fullScreen 
    ? `flex h-screen w-full flex-col items-center justify-center p-8 gap-3 ${containerClassName}`
    : `flex h-full w-full flex-col items-center justify-center p-8 gap-3 ${containerClassName}`;

  return (
    <div className={containerClasses}>
      <div className={`${className} animate-spin rounded-full border-4 border-stroke border-t-primary`} />
      {text && <p className="font-['Montserrat'] text-sm text-gray-text">{text}</p>}
    </div>
  );
}
