
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
        <div className="min-w-[1200px] w-full pt-32 pb-20 flex flex-col items-center">
            
            {/* --- LEVEL 1: TOP ROW (Legislative - Keuchik - Imum) --- */}
            <div className="relative flex justify-center items-start gap-8 mb-16 px-10">
                {/* Horizontal Dashed Line (Partnership) */}
                <div className="absolute top-1/2 left-10 right-10 h-0 border-t-2 border-dashed border-gray-300 -z-0"></div>

                {/* LEGISLATIVE (Tuha Peut/Lapan) */}
                {structure.legislative?.map((pos: any) => (
                    <div key={pos.id} className="relative z-10 bg-slate-50 p-2">
                        <OfficialCard
                            name={pos.official?.name || "Belum Terisi"}
                            position={pos.positionName}
                            photo={pos.official?.photo || null}
                            size="small"
                        />
                    </div>
                ))}

                {/* KEUCHIK */}
                <div className="relative z-10 bg-slate-50 p-2 transform scale-110">
                    <OfficialCard
                        name={structure.keuchik?.official?.name || "Belum Terisi"}
                        position="Keuchik Gampong"
                        photo={structure.keuchik?.official?.photo || null}
                        size="medium"
                    />
                    {/* Line Down from Keuchik */}
                    <Connector type="vertical" height="40px" bottom="-40px" left="50%" />
                </div>

                {/* IMUM GAMPONG */}
                {structure.imum && (
                    <div className="relative z-10 bg-slate-50 p-2">
                         <OfficialCard
                            name={structure.imum?.official?.name || "Belum Terisi"}
                            position="Imum Gampong"
                            photo={structure.imum?.official?.photo || null}
                            size="small"
                        />
                    </div>
                )}
            </div>

            {/* --- LEVEL 2: SEKRES (Sekdes) --- */}
            {structure.executive?.sekdes && (
                <div className="relative flex flex-col items-center mb-16">
                    <Connector type="vertical" height="24px" top="-24px" left="50%" />
                    
                    <OfficialCard
                        name={structure.executive.sekdes.official?.name || "Belum Terisi"}
                        position="Sekretaris Desa"
                        photo={structure.executive.sekdes.official?.photo || null}
                        size="medium"
                    />

                    {/* Line Down from Sekdes to Subordinates */}
                    <Connector type="vertical" height="40px" bottom="-40px" left="50%" />
                </div>
             )}

             {/* --- LEVEL 3: SUBORDINATES (Kaur & Kasi) --- */}
             {structure.executive?.subordinates?.length > 0 && (
                <div className="relative flex justify-center gap-6 mb-24">
                     {/* Horizontal Bar */}
                     <Connector type="horizontal" top="-24px" left="50px" right="50px" />
                     {/* Connector from Sekdes */}
                     <Connector type="vertical" height="24px" top="-24px" left="50%" />

                     {structure.executive.subordinates.map((pos: any) => (
                         <div key={pos.id} className="relative pt-4">
                             <Connector type="vertical" height="28px" top="-28px" left="50%" />
                             <OfficialCard
                                 name={pos.official?.name || "Belum Terisi"}
                                 position={pos.positionName}
                                 photo={pos.official?.photo || null}
                                 size="small"
                             />
                         </div>
                     ))}
                     
                     {/* Line Down to Dusun (From Center/Keuchik line technically, but physically here) */}
                     {/* In the image, the line goes from Keuchik all the way down. 
                         Here we simulate it flowing through Sekdes for visual hierarchy.*/}
                     <div className="absolute -bottom-12 left-1/2 w-0.5 h-12 bg-gray-300 -translate-x-1/2"></div>
                </div>
             )}

            {/* --- LEVEL 4: DUSUN --- */}
            {structure.dusun?.length > 0 && (
                <div className="relative w-full max-w-5xl flex flex-col items-center">
                    <div className="w-full flex justify-center relative">
                        {/* Horizontal Bar for Dusun */}
                        <Connector type="horizontal" top="-24px" left="10%" right="10%" />
                        {/* Connector from Above */}
                        <Connector type="vertical" height="24px" top="-24px" left="50%" />

                        <div className="flex justify-between w-full px-10 pt-4">
                            {structure.dusun.map((pos: any) => (
                                <div key={pos.id} className="relative flex flex-col items-center">
                                    <Connector type="vertical" height="28px" top="-28px" left="50%" />
                                    <OfficialCard
                                    name={pos.official?.name || "Belum Terisi"}
                                    position={pos.positionName}
                                    dusun={pos.dusunName}
                                    photo={pos.official?.photo || null}
                                    size="small"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
}
