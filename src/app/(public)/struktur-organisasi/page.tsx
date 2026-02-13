import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const revalidate = 300;

async function getStructure() {
  try {
    // Try using the main model name, often lowercased property on prisma client
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

    return {
      leadership: positions.filter((p: any) => p.level === 1), // Keuchik
      advisory: positions.filter((p: any) => p.level === 2), // Tuha Lapan, Tuha Peut & Imum
      // Skip community (level 3) - not used in government structure
      secretary: positions.filter((p: any) => p.level === 4 && p.positionName.toLowerCase().includes('sekretaris')), // Sekdes only
      operational: positions.filter((p: any) => 
        (p.level === 4 && !p.positionName.toLowerCase().includes('sekretaris')) || // KAUR
        p.level === 5 // KASI
      ),
      regional: positions.filter((p: any) => p.level === 6), // Petua Dusun
    };
  } catch (error) {
    console.error('Error fetching structure:', error);
    return null;
  }
}

interface Official {
  id: string;
  name: string;
  photo: string | null;
  startDate: Date | null;
  isActive: boolean;
  phone?: string;
}

interface Position {
  id: string;
  positionName: string;
  level: number;
  dusunName?: string | null;
  official: Official | null;
}

interface OfficialCardProps {
  name: string;
  position: string;
  photo: string | null;
  dusun?: string | null;
  size?: 'large' | 'medium' | 'small';
}

function OfficialCard({ name, position, photo, dusun, size = 'medium' }: OfficialCardProps) {
  const sizeClasses = {
    large: 'p-8 max-w-sm',
    medium: 'p-6 max-w-xs',
    small: 'p-4 max-w-[260px]'
  };

  const photoSizes = {
    large: 'w-36 h-36',
    medium: 'w-28 h-28',
    small: 'w-24 h-24'
  };

  const textSizes = {
    large: 'text-2xl',
    medium: 'text-lg',
    small: 'text-base'
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 flex flex-col items-center h-full ${sizeClasses[size]}`}>
      <div className="mb-4 relative">
        {photo ? (
          <div className={`relative ${ photoSizes[size]} rounded-full overflow-hidden shadow-md border-4 border-indigo-100`}>
            <Image
              src={photo}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className={`${photoSizes[size]} rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-md border-4 border-indigo-100`}>
            <span className={`${size === 'large' ? 'text-4xl' : size === 'medium' ? 'text-3xl' : 'text-2xl'} font-bold text-white`}>
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      <h3 className={`${textSizes[size]} font-bold text-gray-900 mb-1 leading-tight`}>{name}</h3>
      <p className={`text-indigo-600 font-semibold ${size === 'large' ? 'text-base' : 'text-sm'} mb-1`}>{position}</p>
      {dusun && (
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full mt-2 font-medium">
          {dusun}
        </span>
      )}
    </div>
  );
}

export default async function StructurePage() {
  const structure = await getStructure();

  if (!structure) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Gagal memuat data struktur</h2>
          <p className="text-gray-500">Silakan coba lagi nanti</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Struktur Organisasi
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Pemerintahan Gampong Mata Mamplam
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* LEVEL 1: KEUCHIK - Pimpinan Gampong (Paling Atas) */}
        {structure.leadership.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                🏛 PIMPINAN GAMPONG
              </span>
            </div>
            <div className="flex justify-center mb-8">
              {structure.leadership.map((pos: any) => (
                <div key={pos.id} className="transform hover:scale-105 transition-duration-300">
                  <OfficialCard
                    name={pos.official?.name || "Belum Terisi"}
                    position={pos.positionName}
                    photo={pos.official?.photo || null}
                    size="large"
                  />
                </div>
              ))}
            </div>
            
            {/* Visual connector */}
            <div className="flex justify-center">
              <div className="w-1 h-16 bg-gradient-to-b from-indigo-400 to-transparent"></div>
            </div>
          </div>
        )}

        {/* LEVEL 2: ADVISORY - Mitra & Pengawasan (Sejajar) */}
        {structure.advisory.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                🕌 MITRA & PENGAWASAN ADAT/KEAGAMAAN
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {structure.advisory.map((pos: any) => (
                <div key={pos.id} className="w-full sm:w-auto">
                  <OfficialCard
                    name={pos.official?.name || "Belum Terisi"}
                    position={pos.positionName}
                    photo={pos.official?.photo || null}
                    size="medium"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="w-1 h-12 bg-gradient-to-b from-indigo-300 to-transparent"></div>
            </div>
          </div>
        )}

        {/* LEVEL 3: SEKRETARIS DESA */}
        {structure.secretary && structure.secretary.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                🗂 SEKRETARIAT DESA
              </span>
            </div>
            <div className="flex justify-center mb-8">
              {structure.secretary.map((pos: any) => (
                <div key={pos.id}>
                  <OfficialCard
                    name={pos.official?.name || "Belum Terisi"}
                    position={pos.positionName}
                    photo={pos.official?.photo || null}
                    size="medium"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="w-1 h-12 bg-gradient-to-b from-indigo-300 to-transparent"></div>
            </div>
          </div>
        )}

        {/* LEVEL 4 & 5: KAUR & KASI - Pelaksana Teknis */}
        {structure.operational && structure.operational.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                🏢 PELAKSANA TEKNIS (KAUR & KASI)
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {structure.operational.map((pos: any) => (
                <div key={pos.id} className="w-full sm:w-auto">
                  <OfficialCard
                    name={pos.official?.name || "Belum Terisi"}
                    position={pos.positionName}
                    photo={pos.official?.photo || null}
                    size="small"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="w-1 h-12 bg-gradient-to-b from-indigo-300 to-transparent"></div>
            </div>
          </div>
        )}

        {/* LEVEL 6: PETUA DUSUN - Perangkat Kewilayahan */}
        {structure.regional.length > 0 && (
          <div className="mb-8">
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                🏘 PERANGKAT KEWILAYAHAN
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {structure.regional.map((pos: any) => (
                <div key={pos.id} className="w-full sm:w-auto">
                  <OfficialCard
                    name={pos.official?.name || "Belum Terisi"}
                    position={pos.positionName}
                    photo={pos.official?.photo || null}
                    dusun={pos.dusunName}
                    size="small"
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
