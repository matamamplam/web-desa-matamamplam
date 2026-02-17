import Link from 'next/link';
import Image from 'next/image';

interface Official {
  id: string;
  name: string;
  photo: string | null;
}

interface Position {
  id: string;
  positionName: string;
  dusunName: string | null;
  official: Official | null;
}

interface Structure {
  level1: Position[];
  level4: Position[];
}

export default function StructurePreview({ structure }: { structure: any }) {
  // Filter strictly for Keuchik and Sekdes
  // Using 'all' array from the structure prop which contains all positions
  const allPositions = structure.all || [];
  
  const keuchik = allPositions.find((p: any) => 
    p.positionKey === 'KEUCHIK' || 
    p.positionName.toLowerCase().includes('keuchik')
  );
  
  const sekdes = allPositions.find((p: any) => 
    p.positionKey === 'SEKDES' || 
    p.positionName.toLowerCase().includes('sekretaris') || 
    p.positionName.toLowerCase().includes('sekdes')
  );

  if (!keuchik && !sekdes) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Struktur Organisasi</h2>
          <p className="text-gray-600">Pejabat Pemerintahan Desa Mata Mamplam</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-8">
          {keuchik?.official && (
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm">
              <div className="mb-4">
                {keuchik.official.photo ? (
                  <div className="relative w-32 h-32 mx-auto pt-1">
                    <Image
                      src={keuchik.official.photo}
                      alt={keuchik.official.name}
                      fill
                      className="object-cover rounded-full border-4 border-blue-200"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-blue-200">
                    <span className="text-5xl font-bold text-white">
                      {keuchik.official.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-blue-600 mb-1">
                {keuchik.positionName}
              </h3>
              <p className="text-xl font-bold text-gray-900">
                {keuchik.official.name}
              </p>
            </div>
          )}

          {sekdes?.official && (
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm">
              <div className="mb-4">
                {sekdes.official.photo ? (
                  <div className="relative w-32 h-32 mx-auto pt-1">
                    <Image
                      src={sekdes.official.photo}
                      alt={sekdes.official.name}
                      fill
                      className="object-cover rounded-full border-4 border-indigo-200"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-indigo-200">
                    <span className="text-5xl font-bold text-white">
                      {sekdes.official.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-indigo-600 mb-1">
                {sekdes.positionName}
              </h3>
              <p className="text-xl font-bold text-gray-900">
                {sekdes.official.name}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/struktur-organisasi"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Lihat Struktur Lengkap
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
