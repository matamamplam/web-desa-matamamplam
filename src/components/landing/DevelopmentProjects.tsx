import Link from 'next/link';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  budget: number;
  location: string | null;
  progress: number;
  startDate: string;
  endDate: string | null;
  photoBefore?: string | null;
  photoGallery?: any;
}

export default function DevelopmentProjects({ projects }: { projects: Project[] }) {
  const getFirstImage = (project: any) => {
    if (project.photoBefore) return project.photoBefore;
    if (project.photoGallery) {
      if (typeof project.photoGallery === 'string') {
        try {
          const parsed = JSON.parse(project.photoGallery);
          return Array.isArray(parsed) ? parsed[0] : null;
        } catch { return null; }
      }
      if (Array.isArray(project.photoGallery) && project.photoGallery.length > 0) {
        return project.photoGallery[0];
      }
    }
    return null;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Pembangunan Desa</h2>
          <p className="text-gray-600">Proyek pembangunan yang sedang berlangsung</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {projects.map((project) => {
            const firstImage = getFirstImage(project);
            
            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                {firstImage ? (
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={firstImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'IN_PROGRESS' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status === 'IN_PROGRESS' ? 'Sedang Berjalan' : project.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  )}

                  {project.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{project.location}</span>
                    </div>
                  )}

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mt-4">
                    <span className="font-semibold text-gray-900">
                      Rp {project.budget.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/pembangunan"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Lihat Semua Proyek
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
