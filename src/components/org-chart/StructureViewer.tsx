'use client';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FiZoomIn, FiZoomOut, FiRefreshCw, FiMove } from 'react-icons/fi';
import Image from 'next/image';

// --- Card Components (Moved from server file) ---

interface OfficialCardProps {
  name: string;
  position: string;
  photo: string | null;
  dusun?: string | null;
  size?: 'large' | 'medium' | 'small';
  color?: 'indigo' | 'purple' | 'blue' | 'green' | 'amber' | 'red';
}

function OfficialCard({ name, position, photo, dusun, size = 'medium', color = 'indigo' }: OfficialCardProps) {
  const sizeClasses = {
    large: 'p-6 w-64 md:w-72',
    medium: 'p-4 w-48 md:w-56',
    small: 'p-3 w-40 md:w-44'
  };

  const photoSizes = {
    large: 'w-32 h-32',
    medium: 'w-24 h-24',
    small: 'w-20 h-20'
  };

  const textSizes = {
    large: 'text-xl',
    medium: 'text-base',
    small: 'text-xs'
  };

  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };

  const photoBorderColor = {
    indigo: 'border-indigo-500',
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    amber: 'border-amber-500',
    red: 'border-red-500',
  }

  return (
    <div className={`cursor-grab active:cursor-grabbing relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center border z-10 ${sizeClasses[size]} ${colorClasses[color].split(' ').pop()}`}>
      <div className="-mt-10 mb-2 relative">
        {photo ? (
          <div className={`relative ${photoSizes[size]} rounded-full overflow-hidden shadow-lg border-4 ${photoBorderColor[color]} bg-white`}>
            <Image src={photo} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <div className={`${photoSizes[size]} rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg border-4 ${photoBorderColor[color]}`}>
            <span className="text-3xl font-bold text-gray-500">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <div className="text-center w-full px-2 pb-2">
        <h3 className={`${textSizes[size]} font-bold text-gray-800 leading-tight mb-1 line-clamp-2`}>{name}</h3>
        <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${colorClasses[color].split(' ').slice(0, 2).join(' ')} mb-1`}>
          {position}
        </div>
        {dusun && (
          <p className="text-[10px] text-gray-500 font-medium bg-gray-100 rounded px-2 py-0.5 inline-block">
            {dusun}
          </p>
        )}
      </div>
    </div>
  );
}

// --- Main Viewer Component ---

interface StructureViewerProps {
  structure: any;
}

export default function StructureViewer({ structure }: StructureViewerProps) {
  return (
    <TransformWrapper
      initialScale={0.8}
      initialPositionX={0}
      initialPositionY={0}
      minScale={0.4}
      maxScale={2}
      centerOnInit
    >
      {({ zoomIn, zoomOut, resetTransform, centerView }) => (
        <>
          {/* Controls */}
          <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-white/90 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200">
            <button 
                onClick={() => zoomIn()} 
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                title="Zoom In"
            >
                <FiZoomIn className="w-6 h-6" />
            </button>
            <button 
                onClick={() => zoomOut()} 
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                title="Zoom Out"
            >
                <FiZoomOut className="w-6 h-6" />
            </button>
            <button 
                onClick={() => { resetTransform(); centerView(0.8); }} 
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                title="Reset View"
            >
                <FiRefreshCw className="w-6 h-6" />
            </button>
          </div>

          <div className="block active:cursor-grabbing cursor-grab h-full w-full">
            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!min-w-[1600px] !w-full !h-full !flex !items-start !justify-center !pt-20">
              
              {/* --- LEVEL 1: KEUCHIK --- */}
              <div className="relative flex flex-col items-center mb-16 w-full">
                  {structure.keuchik ? (
                    <OfficialCard
                      name={structure.keuchik.official?.name || "Belum Terisi"}
                      position={structure.keuchik.positionName}
                      photo={structure.keuchik.official?.photo || null}
                      size="large"
                      color="indigo"
                    />
                  ) : (
                    <OfficialCard name="Belum Terisi" position="Keuchik Gampong" photo={null} size="large" color="indigo" />
                  )}
                  {/* Vertical Line DOWN from Keuchik */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-10 w-px bg-gray-400"></div>
              </div>

              {/* --- MAIN SPLIT (Legislative vs Executive) --- */}
              <div className="relative w-full flex max-w-[1600px]">
                  {/* Horizontal Bridge Line */}
                  <div className="absolute -top-6 left-[17.5%] right-[32.5%] h-px bg-gray-400"></div>
                  {/* Top Connector (Connects to Keuchik) - At 50% */}
                  <div className="absolute -top-6 left-1/2 h-6 w-px bg-gray-400"></div>

                  {/* LEGISLATIVE BRANCH (35%) */}
                  <div className="w-[35%] flex flex-col items-center relative px-4">
                      {/* Connection from Bridge */}
                      <div className="absolute -top-6 left-1/2 h-6 w-px bg-gray-400"></div>
                      
                      <div className="mb-4 px-4 py-1 bg-white border border-red-200 text-red-700 font-bold rounded-full text-sm z-20">
                          LEGISLATIF
                      </div>

                      <div className="flex flex-wrap justify-center gap-8 mt-4 w-full">
                          {structure.legislative?.map((pos: any) => (
                              <div key={pos.id} className="flex flex-col items-center">
                                  <div className="h-6 w-px bg-gray-400 mb-0"></div>
                                  <OfficialCard
                                    name={pos.official?.name || "Belum Terisi"}
                                    position={pos.positionName}
                                    photo={pos.official?.photo || null}
                                    size="small"
                                    color="red"
                                  />
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* EXECUTIVE BRANCH (65%) */}
                  <div className="w-[65%] flex flex-col items-center relative px-4">
                      {/* Connection from Bridge */}
                      <div className="absolute -top-6 left-1/2 h-6 w-px bg-gray-400"></div>
                      
                      <div className="mb-8 px-4 py-1 bg-white border border-blue-200 text-blue-700 font-bold rounded-full text-sm z-20">
                          EKSEKUTIF
                      </div>

                      <div className="relative w-full flex mt-4">
                          {/* Horizontal Line */}
                          <div className="absolute -top-6 left-[20%] right-[30%] h-px bg-gray-400"></div>
                          {/* Connection to Executive Label */}
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-px bg-gray-400"></div>

                          {/* 1. Kasi Keistimewaan & Pembangunan (40% width) */}
                          <div className="w-[40%] flex flex-col items-center relative pt-8 px-2">
                              {/* Connector Up */}
                              <div className="absolute -top-6 left-1/2 h-14 w-px bg-gray-400"></div>
                              
                              <div className="flex flex-wrap justify-center gap-4">
                                {structure.executive?.direct?.map((pos: any) => (
                                    <div key={pos.id} className="flex flex-col items-center">
                                        <OfficialCard
                                            name={pos.official?.name || "Belum Terisi"}
                                            position={pos.positionName}
                                            photo={pos.official?.photo || null}
                                            size="small"
                                            color="green"
                                        />
                                    </div>
                                ))}
                              </div>
                          </div>

                          {/* 2. Sekdes & Subordinates (60% width) */}
                          <div className="w-[60%] flex flex-col items-center relative pt-8 px-2">
                              {/* Connector Up */}
                              <div className="absolute -top-6 left-1/2 h-14 w-px bg-gray-400"></div>

                              <OfficialCard
                                name={structure.executive?.sekdes?.official?.name || "Belum Terisi"}
                                position={structure.executive?.sekdes?.positionName || "Sekretaris Desa"}
                                photo={structure.executive?.sekdes?.official?.photo || null}
                                size="medium"
                                color="blue"
                            />

                              {structure.executive?.subSekdes?.length > 0 && (
                                <div className="w-full relative mt-12"> 
                                    {/* Connector Down from Sekdes */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-6 w-px bg-gray-400"></div>
                                    {/* Horizontal Bar across children */}
                                    <div className="absolute -top-6 left-[16.66%] right-[16.66%] h-px bg-gray-400"></div>
                                    
                                    <div className="flex w-full">
                                        {structure.executive.subSekdes.map((pos: any, idx: number, arr: any[]) => {
                                            const widthPercent = 100 / (arr.length || 1);
                                            return (
                                                <div key={pos.id} style={{ width: `${widthPercent}%` }} className="flex flex-col items-center relative">
                                                    <div className="absolute -top-6 left-1/2 h-6 w-px bg-gray-400"></div>
                                                    <OfficialCard
                                                        name={pos.official?.name || "Belum Terisi"}
                                                        position={pos.positionName}
                                                        photo={pos.official?.photo || null}
                                                        size="small"
                                                        color="blue"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>

              {/* --- LEVEL 4: REGIONAL (Kadus) --- */}
              {structure.dusun?.length > 0 && (
                  <div className="mt-20 relative flex flex-col items-center w-full max-w-[1600px]">
                      {/* Visual Separator */}
                      <div className="w-full border-t-2 border-dashed border-gray-300 mb-8 relative">
                          <span className="absolute top-[-14px] left-1/2 -translate-x-1/2 bg-gray-50 px-4 text-gray-400 text-sm">KEWILAYAHAN</span>
                      </div>

                      <div className="flex flex-wrap justify-center gap-8">
                          {structure.dusun.map((pos: any) => (
                              <div key={pos.id} className="flex flex-col items-center">
                                  <OfficialCard
                                    name={pos.official?.name || "Belum Terisi"}
                                    position={pos.positionName}
                                    photo={pos.official?.photo || null}
                                    dusun={pos.dusunName}
                                    size="small"
                                    color="amber"
                                  />
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </TransformComponent>
          </div>
        </>
      )}
    </TransformWrapper>
  );
}
