import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const revalidate = 300;

async function getStructure() {
  try {
    const positionClient = (prisma as any).villageOfficialPosition;

    if (!positionClient) {
      console.error('VillageOfficialPosition model not found in Prisma Client');
      return null;
    }

    const positions = await positionClient.findMany({
      include: {
        official: {
          select: {
            id: true,
            name: true,
            photo: true,
            startDate: true,
            isActive: true,
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    // --- Helper for fuzzy matching ---
    const findPos = (key: string, namePart: string) => 
      positions.find((p: any) => p.positionKey === key || p.positionName.toLowerCase().includes(namePart));

    const filterPos = (category: string, excludeKey?: string) => 
      positions.filter((p: any) => p.category === category && p.positionKey !== excludeKey);
    
    // --- Categorize based on strict hierarchy request ---

    // 1. Keuchik (Top)
    const keuchik = findPos('KEUCHIK', 'keuchik');

    // 2. Legislative (Tuha Peut, Tuha Lapan, Imum) - LEFT BRANCH
    const legislative = positions.filter((p: any) => 
       p.positionKey?.startsWith('TUHA') || 
       p.positionName.toLowerCase().includes('tuha') ||
       p.positionKey === 'IMUM_GAMPONG' ||
       p.positionName.toLowerCase().includes('imum gampong')
    );

    // 3. Executive - RIGHT BRANCH
    // 3a. Direct to Keuchik (Kasi Keistimewaan, Kasi Pembangunan)
    const kasiDirect = positions.filter((p: any) => 
       p.positionName.toLowerCase().includes('keistimewaan') || 
       p.positionName.toLowerCase().includes('pembangunan')
    );

    // 3b. Sekdes (Parent of others)
    const sekdes = findPos('SEKDES', 'sekretaris');

    // 3c. Under Sekdes (Kasi Umum, Keuangan, Pemerintahan)
    const kasiUnderSekdes = positions.filter((p: any) => 
       p.positionName.toLowerCase().includes('umum') || 
       p.positionName.toLowerCase().includes('keuangan') || 
       p.positionName.toLowerCase().includes('pemerintahan')
    );

    // 4. Regional (Kadus) - BOTTOM
    const dusun = positions.filter((p: any) => p.category === 'DUSUN' || p.positionName.toLowerCase().includes('dusun'));

    return {
      keuchik,
      legislative,
      executive: {
        direct: kasiDirect,
        sekdes,
        subSekdes: kasiUnderSekdes
      },
      dusun
    };
  } catch (error) {
    console.error('Error fetching structure:', error);
    return null;
  }
}

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
    <div className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center border z-10 ${sizeClasses[size]} ${colorClasses[color].split(' ').pop()}`}>
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

// Connector Component
function Connector({ height = 'h-8', width = 'w-px', className = '' }: { height?: string, width?: string, className?: string }) {
  return <div className={`${height} ${width} bg-gray-400 mx-auto ${className}`}></div>;
}

export default async function StructurePage() {
  const structure = await getStructure();

  if (!structure) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Memuat struktur...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 overflow-x-auto">
      <div className="min-w-[1000px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Struktur Pemerintahan</h1>
          <p className="text-lg text-gray-600">Gampong Mata Mamplam</p>
        </div>

        {/* 1. KEUCHIK (Top Center) */}
        <div className="relative flex flex-col items-center mb-12">
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
            {/* Connector Down from Keuchik */}
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-8 w-px bg-gray-400"></div>
        </div>

        {/* MAIN SPLIT: LEGISLATIVE (Left) vs EXECUTIVE (Right) */}
        <div className="flex justify-center gap-16 w-full relative">
            {/* Horizontal Line Connecting Left and Right Branches */}
            <div className="absolute -top-4 left-[25%] right-[25%] h-px bg-gray-400"></div>
            {/* Vertical Line from Keuchik connects to this horizontal line's center */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-px bg-gray-400"></div>


             {/* --- LEFT BRANCH: LEGISLATIVE --- */}
            <div className="flex flex-col items-center w-5/12 relative">
                 {/* Connection to Main Horizontal */}
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-px bg-gray-400"></div>
                 
                 <div className="mb-4 px-4 py-1 bg-white border border-red-200 text-red-700 font-bold rounded-full text-sm z-20">
                    LEGISLATIF
                 </div>

                 {/* Tuha Peut & Others */}
                 <div className="flex flex-wrap justify-center gap-6 mt-4">
                     {structure.legislative.map((pos: any) => (
                         <div key={pos.id} className="flex flex-col items-center">
                             <div className="h-4 w-px bg-gray-400 mb-0"></div>
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


            {/* --- RIGHT BRANCH: EXECUTIVE --- */}
            <div className="flex flex-col items-center w-7/12 relative">
                 {/* Connection to Main Horizontal */}
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-px bg-gray-400"></div>
                 
                 <div className="mb-4 px-4 py-1 bg-white border border-blue-200 text-blue-700 font-bold rounded-full text-sm z-20">
                    EKSEKUTIF
                 </div>

                 {/* Row 1: Kasi Direct + Sekdes */}
                 {/* We need to show them side by side. Sekdes in center of his subgraph? 
                     User said: Kasi Keistimewaan & Pemb connects directly to Keuchik (part of Executive branch)
                     Sekdes connects to Keuchik (part of Executive branch)
                 */}
                 
                 <div className="relative w-full flex justify-center gap-6 mt-4">
                     {/* Horizontal line for Executive immediate children */}
                     <div className="absolute -top-4 left-[15%] right-[15%] h-px bg-gray-400"></div>
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-px bg-gray-400"></div>


                    {/* 1. Kasi Keistimewaan & Pembangunan (Direct) */}
                    {structure.executive.direct.map((pos: any) => (
                        <div key={pos.id} className="flex flex-col items-center pt-8 relative">
                             {/* Connector up to Executive Line */}
                             <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-12 w-px bg-gray-400"></div>
                             <OfficialCard
                                name={pos.official?.name || "Belum Terisi"}
                                position={pos.positionName}
                                photo={pos.official?.photo || null}
                                size="small"
                                color="green"
                              />
                        </div>
                    ))}

                    {/* 2. Sekdes (Parent of Sub-Branch) */}
                    {structure.executive.sekdes && (
                        <div className="flex flex-col items-center pt-8 relative">
                            {/* Connector up to Executive Line */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-12 w-px bg-gray-400"></div>
                            
                            <OfficialCard
                                name={structure.executive.sekdes.official?.name || "Belum Terisi"}
                                position={structure.executive.sekdes.positionName}
                                photo={structure.executive.sekdes.official?.photo || null}
                                size="medium"
                                color="blue"
                            />

                            {/* Children of Sekdes */}
                            {structure.executive.subSekdes.length > 0 && (
                                <div className="mt-8 flex justify-center gap-4 relative">
                                     {/* Connector Down from Sekdes */}
                                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-4 w-px bg-gray-400"></div>
                                     {/* Horizontal Line for Sekdes Children */}
                                     <div className="absolute -top-4 left-[10%] right-[10%] h-px bg-gray-400"></div>

                                     {structure.executive.subSekdes.map((pos: any) => (
                                          <div key={pos.id} className="flex flex-col items-center relative">
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-px bg-gray-400"></div>
                                                <OfficialCard
                                                    name={pos.official?.name || "Belum Terisi"}
                                                    position={pos.positionName}
                                                    photo={pos.official?.photo || null}
                                                    size="small"
                                                    color="blue"
                                                />
                                          </div>
                                     ))}
                                </div>
                            )}
                        </div>
                    )}
                 </div>
            </div>
        </div>

        {/* 4. KEWILAYAHAN (Dusun) - Bottom Center */}
        {structure.dusun.length > 0 && (
            <div className="mt-20 relative flex flex-col items-center w-full">
                {/* Connector from Executive/Legislative? Usually direct from Keuchik/Sekdes 
                    Let's connect from center of everything 
                */}
                {/* Long line from Keuchik or Sekdes? 
                    Let's draw a line from the bottom of Executive/Legislative container area 
                */}
                {/* Visual separation */}
                <div className="w-full border-t-2 border-dashed border-gray-300 mb-8 relative">
                     <span className="absolute top-[-14px] left-1/2 -translate-x-1/2 bg-gray-50 px-4 text-gray-400 text-sm">KEWILAYAHAN</span>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
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

      </div>
    </div>
  );
}
