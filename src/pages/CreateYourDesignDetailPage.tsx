import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlankProduct } from '../hooks/queries/blankProductQuery';
import { Rnd } from 'react-rnd';
import { Maximize2, Upload, LayoutGrid, Share, ChevronLeft, ChevronRight } from 'lucide-react';

const CreateYourDesignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: blankProduct, isLoading, error } = useBlankProduct(id ?? '');
  
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeColor, setActiveColor] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [rndState, setRndState] = useState({
    x: 50,
    y: 50,
    width: 150,
    height: 150,
  });

  useEffect(() => {
    const func=async ()=>{

        if (blankProduct) {
            if (blankProduct.images?.length > 0) {
                setActiveImage(blankProduct.images[0].url);
            }
            if (blankProduct.colors?.length > 0) {
                setActiveColor(blankProduct.colors[0].color);
            }
        }
    }
    func();
  }, [blankProduct]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorClick = (color: string) => {
    setActiveColor(color);
    const matchedImage = blankProduct?.images?.find((img) => img.color === color);
    if (matchedImage) {
      setActiveImage(matchedImage.url);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center bg-background text-foreground">
        Loading designer...
      </div>
    );
  }

  if (error || !blankProduct) {
    return (
      <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 bg-background text-danger">
        <p>Failed to load the product.</p>
        <button onClick={() => navigate('/createYourDesign')} className="underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 lg:flex-row">
        
        {/* Left Column: Viewer */}
        <div className="relative flex min-h-[500px] flex-1 items-center justify-center overflow-hidden rounded-[24px] bg-[#111111] lg:min-h-[700px]">
          
          {/* Header Info inside Viewer */}
          <div className="absolute left-6 top-6 z-10 md:left-10 md:top-10">
            <h2 className="font-['Montserrat'] text-lg font-medium text-gray-400">
              {blankProduct.name}
            </h2>
            <p className="mt-1 font-['Montserrat'] text-2xl font-bold text-white">
              {blankProduct.price}$
            </p>
          </div>
          
          {/* Maximize Button */}
          <button className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-transform hover:scale-110 md:right-10 md:top-10">
            <Maximize2 size={18} />
          </button>

          {/* Base Product Image */}
          <img
            src={activeImage}
            alt={blankProduct.name}
            className="pointer-events-none h-full w-full object-contain p-8 md:p-16"
          />

          {/* Bounding Box / Print Area Overlay */}
          {/* The bounding box defines where the design can be visible (overflow hidden) */}
          <div className="absolute inset-0 m-auto h-[280px] w-[220px] overflow-hidden border-2 border-dashed border-[#0EA5E9]/50 sm:h-[400px] sm:w-[300px]">
            {uploadedImage && (
              <Rnd
                position={{ x: rndState.x, y: rndState.y }}
                size={{ width: rndState.width, height: rndState.height }}
                onDragStop={(e, d) => setRndState({ ...rndState, x: d.x, y: d.y })}
                onResizeStop={(e, direction, ref, delta, position) => {
                  setRndState({
                    width: parseInt(ref.style.width, 10),
                    height: parseInt(ref.style.height, 10),
                    x: position.x,
                    y: position.y,
                  });
                }}
                lockAspectRatio={true}
                enableResizing={true}
                className="z-20 cursor-move"
              >
                <img
                  src={uploadedImage}
                  alt="Your Design"
                  className="pointer-events-none h-full w-full object-contain"
                  draggable={false}
                />
              </Rnd>
            )}
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="flex w-full flex-col gap-8 rounded-[24px] bg-[#111111] p-6 lg:w-[420px] xl:w-[480px]">
          
          {/* Sub Navigation */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <button className="text-gray-400 transition-colors hover:text-white">
              <ChevronLeft size={20} />
            </button>
            <span className="font-['Montserrat'] text-lg font-medium text-white">Hood</span>
            <button className="text-gray-400 transition-colors hover:text-white">
              <ChevronRight size={20} />
            </button>
            <button className="ml-auto rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
              Menu
            </button>
          </div>

          {/* Color Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-['Montserrat'] text-base font-semibold text-white">Color</h3>
            <div className="flex flex-wrap gap-3">
              {blankProduct.colors?.map((colorObj) => (
                <button
                  key={colorObj.id}
                  onClick={() => handleColorClick(colorObj.color)}
                  className={`h-9 w-9 rounded-full border-2 transition-all ${
                    activeColor === colorObj.color
                      ? 'border-white ring-2 ring-white/20'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: colorObj.color }}
                  title={colorObj.color}
                />
              ))}
            </div>
          </div>

          {/* Material Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-['Montserrat'] text-base font-semibold text-white">Material</h3>
            <div className="flex flex-wrap gap-3">
              {['Cotton', 'Fleece', 'Jersey', 'Recycled'].map((mat) => (
                <button
                  key={mat}
                  className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                    mat === blankProduct.material
                      ? 'bg-[#BF1629] text-white'
                      : 'border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-['Montserrat'] text-base font-semibold text-white">Pattern</h3>
            <div className="flex flex-wrap gap-3">
              {['Plain', 'Stripes', 'Camouflage', 'Gradient'].map((pat) => (
                <button
                  key={pat}
                  className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                    pat === blankProduct.pattern
                      ? 'bg-[#BF1629] text-white'
                      : 'border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          </div>

          {/* Print / Upload Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-['Montserrat'] text-base font-semibold text-white">Print</h3>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
                <Upload size={18} />
                Upload Your Own
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
                <LayoutGrid size={18} />
                Browse Library
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-auto flex gap-4 pt-6">
            <button className="flex-1 rounded-xl bg-[#BF1629] py-4 font-['Montserrat'] text-base font-semibold text-white transition-all hover:bg-red-800 hover:scale-[1.02]">
              Done
            </button>
            <button className="flex items-center justify-center rounded-xl border border-white/10 px-5 text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
              <Share size={20} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateYourDesignDetailPage;