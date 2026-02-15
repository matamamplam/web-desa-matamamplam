import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const revalidate = 300;

async function getStructure() {
  try {
    // Try using the main model name
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
            isActive: true, // Only show active officials
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    // Manually categorize based on exact requirements
    return {
      keuchik: positions.find((p: any) => p.positionKey === 'KEUCHIK'),
      advisory: positions.filter((p: any) => 
        (p.level === 1 && p.positionKey !== 'KEUCHIK') || // Tuha Peut, Tuha Lapan, Imum
        p.category === 'ADVISORY' || 
        p.category === 'RELIGIOUS'
      ).filter((p: any) => p.positionKey !== 'KEUCHIK'), // Ensure Keuchik not included
      secretary: positions.find((p: any) => p.positionKey === 'SEKDES' || p.positionName.toLowerCase().includes('sekretaris')),
      staff: positions.filter((p: any) => 
        (p.level === 3 || p.category === 'SECRETARIAT' || p.category === 'TECHNICAL') && 
        p.positionKey !== 'SEKDES' && 
        !p.positionName.toLowerCase().includes('sekretaris')
      ),
      regional: positions.filter((p: any) => p.category === 'DUSUN' || p.level === 4),
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
  color?: 'indigo' | 'purple' | 'blue' | 'green' | 'amber';
}

function OfficialCard({ name, position, photo, dusun, size = 'medium', color = 'indigo' }: OfficialCardProps) {
  const sizeClasses = {
    large: 'p-6 w-full max-w-sm',
    medium: 'p-5 w-full max-w-xs',
    small: 'p-4 w-60'
  };

  const photoSizes = {
    large: 'w-36 h-36',
    medium: 'w-24 h-24',
    small: 'w-20 h-20'
  };

  const textSizes = {
    large: 'text-2xl',
    medium: 'text-lg',
    small: 'text-sm'
  };

  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-700',
    purple: 'bg-purple-50 text-purple-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  const borderColors = {
    indigo: 'border-indigo-200',
    purple: 'border-purple-200',
    blue: 'border-blue-200',
    green: 'border-green-200',
    amber: 'border-amber-200',
  }

  // Determine border color for the photo
  const photoBorderColor = {
    indigo: 'border-indigo-500',
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    amber: 'border-amber-500',
  }

  return (
    <div className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center border ${borderColors[color]} z-10 ${sizeClasses[size]}`}>
      <div className="-mt-12 mb-3 relative">
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
      
      <div className="text-center w-full">
        <h3 className={`${textSizes[size]} font-bold text-gray-800 leading-tight mb-1`}>{name}</h3>
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClasses[color]} mb-2`}>
          {position}
        </div>
        {dusun && (
          <p className="text-xs text-gray-500 font-medium bg-gray-100 rounded px-2 py-1 inline-block mt-1">
            {dusun}
          </p>
        )}
      </div>
    </div>
  );
}

// Connector Component
function Connector({ height = 'h-8', width = 'w-px', type = 'vertical', className = '' }: { height?: string, width?: string, type?: 'vertical' | 'horizontal', className?: string }) {
  if (type === 'horizontal') {
    return <div className={`h-px bg-gray-400 ${width} ${className}`}></div>;
  }
  return <div className={`${height} w-px bg-gray-400 mx-auto ${className}`}></div>;
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
    <div className="min-h-screen bg-gray-50 pt-32 pb-20"> {/* Added top padding for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Struktur Pemerintahan</h1>
          <p className="text-lg text-gray-600">Gampong Mata Mamplam Periode 2026</p>
        </div>

        <div className="overflow-x-auto pb-12">
          {/* Container with min-width to ensure the tree doesn't break on small screens */}
          <div className="min-w-[1024px] flex flex-col items-center">
            
            {/* 1. KEUCHIK (Top Center) */}
            <div className="relative flex flex-col items-center z-20">
              {structure.keuchik ? (
                <OfficialCard
                  name={structure.keuchik.official?.name || "Belum Terisi"}
                  position={structure.keuchik.positionName}
                  photo={structure.keuchik.official?.photo || null}
                  size="large"
                  color="indigo"
                />
              ) : (
                <OfficialCard
                  name="Belum Terisi"
                  position="Keuchik Gampong"
                  photo={null}
                  size="large"
                  color="indigo"
                />
              )}
              {/* Connector Down */}
              <Connector height="h-16" />
            </div>

            {/* 2. ADVISORY & SEKDES ROW */}
            {/* Layout: Advisory Left - Sekdes Center - Advisory Right (if evenly split) or Advisory Row separate */}
            {/* Given the user asked for hierarchy, usually Tuha Peut is to the side. 
                But let's put them in a row. 
            */}
            
            <div className="relative w-full flex justify-center gap-12 z-10">
              {/* Horizontal Line Connecting Branches */}
               {/* 
                  Logic for lines:
                  We need a horizontal line connecting the vertical line from Keuchik to:
                  - Sekdes (Center) - Direct vertical
                  - Tuha Peut (Left/Right) - Horizontal then vertical
                */}
                
                {/* Visual Representation of Hierarchy Level 2 */}
                
                {/* ADVISORY (Tuha Peut, Tuha Lapan, Imum) */}
                {structure.advisory.length > 0 && (
                  <div className="absolute top-[-2rem] w-[80%] flex justify-between px-20">
                     {/* This is getting complex to draw dynamically. 
                         Let's use a simpler approach: 
                         Keuchik
                            |
                         --------------------------------
                         |              |               |
                      Advisory       Sekdes          Imum
                     */}
                  </div>
                )}
            </div>

            {/* Let's try a distinct section approach for Advisory to avoid cluttering the main command line */}
             {structure.advisory.length > 0 && (
                <div className="w-full flex justify-center gap-8 mb-8 relative">
                    {/* Horizontal connector for Advisory Nodes if we treat them as children of Keuchik distinct from Sekdes */}
                    {/* Let's just render them as 'Mitra' side-by-side with Sekdes or above? */}
                    {/* Standard: BPD is to the left of Kepala Desa with dotted line. 
                        User wants Keuchik TOP CENTER. 
                        Let's put Advisory and Imum in a row below Keuchik.
                    */}
                </div>
            )}
            
            {/* ROW 2: (Advisory + Sekdes + Imum) */}
            {/* We will mix them in one row for visual balance, or separate them? 
                Let's put Sekdes in the absolute center. 
                Advisory/Imum around him.
            */}
            
            <div className="relative flex justify-center gap-8 w-full">
               {/* Horizontal Connector Bar */}
               <div className="absolute top-0 w-[60%] h-px bg-gray-400"></div>
               {/* Vertical link from Keuchik (already drawn h-16) hits the middle of this bar */}

               {/* Render Advisory (Left Side) */}
               {structure.advisory.slice(0, Math.ceil(structure.advisory.length / 2)).map((pos: any) => (
                  <div key={pos.id} className="relative pt-12">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 w-px bg-gray-400 border-l border-dashed border-gray-400"></div> {/* Dashed for advisory? No, solid for now */}
                     <OfficialCard
                        name={pos.official?.name || "Belum Terisi"}
                        position={pos.positionName}
                        photo={pos.official?.photo || null}
                        size="small"
                        color="purple"
                      />
                  </div>
               ))}

               {/* Render Sekdes (Center) */}
               {structure.secretary && (
                 <div className="relative pt-12 mx-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 w-px bg-gray-400"></div>
                    <OfficialCard
                      name={structure.secretary.official?.name || "Belum Terisi"}
                      position={structure.secretary.positionName}
                      photo={structure.secretary.official?.photo || null}
                      size="medium"
                      color="blue"
                    />
                    {/* Connector Down from Sekdes */}
                    <div className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 h-12 w-px bg-gray-400"></div>
                 </div>
               )}

               {/* Render Advisory (Right Side) - rest of them */}
               {structure.advisory.slice(Math.ceil(structure.advisory.length / 2)).map((pos: any) => (
                  <div key={pos.id} className="relative pt-12">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 w-px bg-gray-400"></div>
                     <OfficialCard
                        name={pos.official?.name || "Belum Terisi"}
                        position={pos.positionName}
                        photo={pos.official?.photo || null}
                        size="small"
                        color="purple"
                      />
                  </div>
               ))}
            </div>

            {/* Spacer for Sekdes line down */}
            <div className="h-12"></div>

            {/* 3. STAFF (KAUR & KASI) */}
            {structure.staff.length > 0 && (
              <div className="relative flex flex-col items-center w-full z-10">
                {/* Horizontal line spanning the staff */}
                <div className="w-[80%] h-px bg-gray-400 mb-12 relative">
                    {/* This line connects to Sekdes from above */}
                </div>

                <div className="flex justify-center gap-6 flex-wrap relative -top-12">
                  {structure.staff.map((pos: any) => (
                    <div key={pos.id} className="flex flex-col items-center relative pt-12 px-2">
                       {/* Vertical line from horiz bar to card */}
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 w-px bg-gray-400"></div>
                       <OfficialCard
                        name={pos.official?.name || "Belum Terisi"}
                        position={pos.positionName}
                        photo={pos.official?.photo || null}
                        size="small"
                        color="green"
                      />
                      {/* Connector down to Regional? Usually Kadus reports to Keuchik but via Sekdes coordination. 
                          For visual tree, let's connect them centrally.
                       */}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Connector to Regional (from center of Staff group or just Sekdes flow?) 
                Let's assume Kadus line comes from the main flow (Sekdes)
            */}
            {/* We need a line continuing down from Sekdes area effectively. 
                But visually, the Sekdes line splits to Staff. 
                Let's start a new line from the center of the Staff row? 
                Or just have a separate section for "Kewilayahan" connected to the root/sekdes.
                Usually Kadus is under Keuchik directly in terms of line, but operationally Sekdes.
                Let's just put them below Staff, connected by a central line.
            */}
            
            <Connector height="h-16" />

            {/* 4. REGIONAL (KADUS) */}
            {structure.regional.length > 0 && (
               <div className="relative flex flex-col items-center w-full z-10">
                 {/* Label for Kewilayahan */}
                 <div className="bg-white px-4 py-1 rounded-full border border-amber-200 text-amber-700 text-sm font-bold mb-4 relative z-20">
                    KEPALA DUSUN
                 </div>
                 
                 <div className="w-[60%] h-px bg-gray-400 mb-12 relative"></div>
                 
                 <div className="flex justify-center gap-8 flex-wrap relative -top-12">
                   {structure.regional.map((pos: any) => (
                     <div key={pos.id} className="flex flex-col items-center relative pt-12">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 w-px bg-gray-400"></div>
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
      </div>
    </div>
  );
}
