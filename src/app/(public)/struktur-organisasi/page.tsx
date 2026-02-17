
import { prisma } from "@/lib/prisma";
import { getOrgChartData } from "@/lib/data-public";
import Image from "next/image";

export const dynamic = "force-dynamic";

// Connector Component
function Connector({ type, height, width, top, left, right, bottom }: any) {
    const style: any = {};
    if (height) style.height = height;
    if (width) style.width = width;
    if (top) style.top = top;
    if (left) style.left = left;
    if (right) style.right = right;
    if (bottom) style.bottom = bottom;

    let className = "absolute bg-gray-300 ";
    if (type === "vertical") className += "w-0.5 transform -translate-x-1/2";
    if (type === "horizontal") className += "h-0.5";

    return <div className={className} style={style}></div>;
}

// Card Component
function OfficialCard({ name, position, photo, dusun, size = 'medium' }: any) {
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

export default async function StructurePage() {
  const structure = await getOrgChartData();
  
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-auto">
        <div className="min-w-[1600px] w-full pt-32 pb-20 flex flex-col items-center">
            
            {/* --- LEVEL 1: KEUCHIK --- */}
            <div className="relative flex flex-col items-center mb-16">
                <OfficialCard
                name={structure.keuchik?.official?.name || "Belum Terisi"}
                position="Keuchik Gampong"
                photo={structure.keuchik?.official?.photo || null}
                size="large"
                />
                {/* Vertical Line DOWN */}
                <Connector type="vertical" height="40px" bottom="-40px" left="50%" />
            </div>

            {/* --- LEVEL 2: LEGISLATIF & EKSEKUTIF --- */}
            <div className="relative w-full max-w-6xl flex justify-between px-10">
                {/* Bridge Line */}
                <Connector type="horizontal" top="-24px" left="25%" right="25%" />
                {/* Connector to Keuchik */}
                <Connector type="vertical" height="24px" top="-24px" left="50%" />

                {/* LEGISLATIF (Left) */}
                <div className="flex flex-col items-center w-[40%] relative">
                    <Connector type="vertical" height="24px" top="-24px" left="50%" />
                    <div className="mb-8 px-4 py-1 bg-white border border-gray-200 text-gray-500 font-bold text-xs tracking-widest rounded-full uppercase z-20">Legislatif</div>
                    
                    <div className="flex flex-wrap justify-center gap-6 relative">
                        {/* Horizontal Bar for Legislatif Children if multiple */}
                        {structure.legislative?.length > 1 && (
                        <Connector type="horizontal" top="-16px" left="40px" right="40px" />
                        )}
                        
                        {structure.legislative?.map((pos: any) => (
                            <div key={pos.id} className="relative mt-4">
                                <Connector type="vertical" height="16px" top="-16px" left="50%" />
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
                        <Connector type="vertical" height="24px" top="-24px" left="50%" />
                        <div className="mb-8 px-4 py-1 bg-white border border-gray-200 text-gray-500 font-bold text-xs tracking-widest rounded-full uppercase z-20">Eksekutif</div>

                        <div className="w-full flex justify-center relative">
                            {/* Connector Structure for Executive */}
                            <Connector type="vertical" height="24px" top="-24px" left="50%" />
                            {/* Bar bridging Kasi & Sekdes */}
                            <Connector type="horizontal" top="0" left="20%" right="20%" />

                            {/* Kasi Left Branch (40% width) */}
                            <div className="w-[40%] flex justify-center relative pt-8">
                                <Connector type="vertical" height="32px" top="0" left="50%" />
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

                            {/* Sekdes Branch (60% width) */}
                            <div className="w-[60%] flex flex-col items-center relative pt-8">
                                <Connector type="vertical" height="32px" top="0" left="50%" />
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
                                        <Connector type="vertical" height="32px" top="-48px" left="50%" />
                                        {/* Horizontal Bar */}
                                        <Connector type="horizontal" top="-16px" left="40px" right="40px" />

                                        {structure.executive.subSekdes.map((pos: any) => (
                                            <div key={pos.id} className="relative">
                                                    <Connector type="vertical" height="16px" top="-16px" left="50%" />
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
    </div>
  );
}
