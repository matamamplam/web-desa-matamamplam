import { prisma } from '@/lib/prisma';
import StructureViewer from '@/components/org-chart/StructureViewer';

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
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="text-center mb-8 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Struktur Pemerintahan</h1>
          <p className="text-lg text-gray-600">Gampong Mata Mamplam</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Tips</span> 
            Gunakan 2 jari atau scroll mouse untuk zoom
          </p>
      </div>
      
      <div className="h-[80vh] w-full border-y border-gray-200 bg-white relative overflow-hidden">
         <StructureViewer structure={structure} />
      </div>
    </div>
  );
}
