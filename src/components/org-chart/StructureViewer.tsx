'use client';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FiZoomIn, FiZoomOut, FiRefreshCw, FiMove } from 'react-icons/fi';
import Image from 'next/image';

// --- Card Components (Moved from server file) ---

// --- Card Components (Simplified) ---

interface OfficialCardProps {
  name: string;
  position: string;
  photo: string | null;
  dusun?: string | null;
  size?: 'large' | 'medium' | 'small';
}

function OfficialCard({ name, position, photo, dusun, size = 'medium' }: OfficialCardProps) {
  // Simple clean card style
  const widthClass = size === 'large' ? 'w-64' : size === 'medium' ? 'w-48' : 'w-40';
  const imgSize = size === 'large' ? 'w-24 h-24' : 'w-16 h-16';

  return (
    <div className={`relative flex flex-col items-center bg-white rounded-lg shadow-md border border-gray-200 p-4 ${widthClass} z-10 transition-transform hover:scale-105`}>
      <div className={`${imgSize} rounded-full overflow-hidden border-2 border-gray-100 mb-3 bg-gray-50 flex-shrink-0 relative`}>
        {photo ? (
          <Image src={photo} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-2xl">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="text-center w-full">
        <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{name}</h3>
        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">{position}</p>
        {dusun && <p className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block">{dusun}</p>}
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
      minScale={0.2}
      maxScale={4}
      centerOnInit
    >
      {({ zoomIn, zoomOut, resetTransform, centerView }) => (
        <>
          <div className="absolute top-4 right-4 z-50 flex gap-2 bg-white/90 p-1.5 rounded-lg shadow-md border border-gray-200">
             <button onClick={() => zoomIn()} className="p-2 hover:bg-gray-100 rounded text-gray-600"><FiZoomIn/></button>
             <button onClick={() => zoomOut()} className="p-2 hover:bg-gray-100 rounded text-gray-600"><FiZoomOut/></button>
             <button onClick={() => { resetTransform(); centerView(0.8); }} className="p-2 hover:bg-gray-100 rounded text-gray-600"><FiRefreshCw/></button>
          </div>

          <div className="w-full h-full bg-slate-50 cursor-grab active:cursor-grabbing overflow-hidden">
             {/* Force a large container to ensure lines don't break */}
            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
              <div className="min-w-[1800px] w-full pt-20 pb-20 flex flex-col items-center">
                  
                  {/* --- LEVEL 1: KEUCHIK --- */}
                  <div className="relative flex flex-col items-center mb-16">
                      <OfficialCard
                        name={structure.keuchik?.official?.name || "Belum Terisi"}
                        position="Keuchik Gampong"
                        photo={structure.keuchik?.official?.photo || null}
                        size="large"
                      />
                      {/* Vertical Line DOWN */}
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-10 w-0.5 bg-gray-300"></div>
                  </div>

                  {/* --- LEVEL 2: LEGISLATIF & EKSEKUTIF --- */}
                  <div className="relative w-full max-w-6xl flex justify-between px-10">
                      {/* Bridge Line */}
                      <div className="absolute -top-6 left-[25%] right-[25%] h-0.5 bg-gray-300"></div>
                      {/* Connector to Keuchik */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-0.5 bg-gray-300"></div>

                      {/* LEGISLATIF (Left) */}
                      <div className="flex flex-col items-center w-[40%] relative">
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-0.5 bg-gray-300"></div>
                          <div className="mb-8 px-4 py-1 bg-white border border-gray-200 text-gray-500 font-bold text-xs tracking-widest rounded-full uppercase z-20">Legislatif</div>
                          
                          <div className="flex flex-wrap justify-center gap-6 relative">
                              {/* Horizontal Bar for Legislatif Children if multiple */}
                              {structure.legislative?.length > 1 && (
                                <div className="absolute -top-4 left-10 right-10 h-0.5 bg-gray-300"></div>
                              )}
                              
                              {structure.legislative?.map((pos: any) => (
                                  <div key={pos.id} className="relative mt-4">
                                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-0.5 bg-gray-300"></div>
                                      <OfficialCard
                                        name={pos.official?.name || "Belum Terisi"}
                                        position={pos.positionName}
                                        photo={pos.official?.photo || null}
                                        size="small"
                                      />
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* EKSEKUTIF (Right) */}
                      <div className="flex flex-col items-center w-[60%] relative">
                           <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-0.5 bg-gray-300"></div>
                           <div className="mb-8 px-4 py-1 bg-white border border-gray-200 text-gray-500 font-bold text-xs tracking-widest rounded-full uppercase z-20">Eksekutif</div>

                           <div className="w-full flex justify-center relative">
                                {/* Connector Structure for Executive */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-0.5 bg-gray-300"></div>
                                {/* Bar bridging Kasi & Sekdes */}
                                <div className="absolute top-0 left-[20%] right-[20%] h-0.5 bg-gray-300"></div>

                                {/* Kasi Left Branch */}
                                <div className="w-1/2 flex justify-center relative pt-8">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-gray-300"></div>
                                    <div className="flex flex-col gap-4">
                                        {structure.executive?.direct?.map((pos: any) => (
                                            <OfficialCard
                                                key={pos.id}
                                                name={pos.official?.name || "Belum Terisi"}
                                                position={pos.positionName}
                                                photo={pos.official?.photo || null}
                                                size="small"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Sekdes Branch */}
                                <div className="w-1/2 flex flex-col items-center relative pt-8">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-gray-300"></div>
                                    <OfficialCard
                                        name={structure.executive?.sekdes?.official?.name || "Belum Terisi"}
                                        position="Sekretaris Desa"
                                        photo={structure.executive?.sekdes?.official?.photo || null}
                                        size="medium"
                                    />
                                    
                                    {/* KAUR / Subordinates */}
                                    {structure.executive?.subSekdes?.length > 0 && (
                                        <div className="mt-12 relative w-full flex justify-center gap-4">
                                            {/* Line Down from Sekdes */}
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-gray-300"></div>
                                            {/* Horizontal Bar */}
                                            <div className="absolute -top-4 left-10 right-10 h-0.5 bg-gray-300"></div>

                                            {structure.executive.subSekdes.map((pos: any) => (
                                                <div key={pos.id} className="relative">
                                                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-0.5 bg-gray-300"></div>
                                                     <OfficialCard
                                                        name={pos.official?.name || "Belum Terisi"}
                                                        position={pos.positionName}
                                                        photo={pos.official?.photo || null}
                                                        size="small"
                                                     />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                           </div>
                      </div>
                  </div>

                  {/* --- LEVEL 3: KEWILAYAHAN (DUSUN) --- */}
                  {structure.dusun?.length > 0 && (
                      <div className="mt-24 relative w-full max-w-7xl flex flex-col items-center">
                          <div className="w-full border-t border-dashed border-gray-300 relative mb-12">
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-50 px-4 text-gray-400 text-xs font-bold tracking-widest uppercase">Kewilayahan (Kepala Dusun)</span>
                          </div>
                          
                          <div className="flex flex-wrap justify-center gap-8 w-full px-4">
                              {structure.dusun.map((pos: any) => (
                                  <OfficialCard
                                    key={pos.id}
                                    name={pos.official?.name || "Belum Terisi"}
                                    position={pos.positionName}
                                    dusun={pos.dusunName}
                                    photo={pos.official?.photo || null}
                                    size="small"
                                  />
                              ))}
                          </div>
                      </div>
                  )}

              </div>
            </TransformComponent>
          </div>
        </>
      )}
    </TransformWrapper>
  );
}
