'use client';

import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';

export default function FAQPage() {
  const { settings, loading } = useSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  const { faq } = settings;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            FAQ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Pertanyaan yang Sering Diajukan
          </p>
        </div>

        {/* FAQ List */}
        {faq && faq.length > 0 ? (
          <div className="space-y-4">
            {faq.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                      {item.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-5 pt-0">
                    <div className="pl-14">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Belum ada FAQ yang tersedia
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Masih ada pertanyaan?
          </h2>
          <p className="text-white/90 mb-6">
            Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan lain
          </p>
          <a
            href="/kontak"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </div>
    </div>
  );
}
