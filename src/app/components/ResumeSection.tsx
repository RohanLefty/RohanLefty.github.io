import { motion } from 'motion/react';
import { Download, Maximize2 } from 'lucide-react';
import { useState } from 'react';

export function ResumeSection() {
  const [isEnlarged, setIsEnlarged] = useState(false);
  const resumePdf = '/RohanSinghResume2026.pdf';

  return (
    <section className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h2 className="text-3xl text-white mb-2">RESUME</h2>
            <div className="h-px w-32 bg-gray-700" />
          </div>

          <div className="border border-gray-700 bg-black/40 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side - Info */}
              <div className="lg:col-span-1">
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Complete curriculum vitae including education, experience,
                  technical skills, and project portfolio.
                </p>

                <div className="space-y-3 text-xs mb-6">
                  <div>
                    <div className="text-gray-500">DOCUMENT TYPE</div>
                    <div className="text-white">PDF</div>
                  </div>
                  <div>
                    <div className="text-gray-500">LAST UPDATED</div>
                    <div className="text-white">May 2026</div>
                  </div>
                  <div>
                    <div className="text-gray-500">VERSION</div>
                    <div className="text-white">2026.05</div>
                  </div>
                  <div>
                    <div className="text-gray-500">PAGES</div>
                    <div className="text-white">2</div>
                  </div>
                </div>

                <a
                  href={resumePdf}
                  download="RohanSingh_Resume_2026.pdf"
                  className="group relative inline-flex items-center gap-3 px-6 py-3 border-2 border-gray-700 bg-black/60 hover:bg-gray-900 hover:border-gray-500 transition-all duration-300 w-full justify-center"
                >
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-white uppercase tracking-wider text-sm">
                    Download PDF
                  </span>

                  <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              {/* Right Side - Resume Preview */}
              <div className="lg:col-span-2">
                <div className="relative border-2 border-gray-700 bg-gray-900/50 group">
                  <button
                    onClick={() => setIsEnlarged(true)}
                    className="absolute top-2 right-2 z-10 p-2 bg-black/80 border border-gray-600 hover:border-blue-500 transition-colors"
                    title="Enlarge preview"
                  >
                    <Maximize2 className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>

                  <iframe
                    src={resumePdf}
                    title="Resume Preview"
                    className="w-full h-[600px] bg-white border-0"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-black/90 border-t border-gray-700 px-3 py-2 text-xs text-gray-500">
                    CLICK TO ENLARGE
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Reference Bar */}
            <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-600">
              <div>DOC-REF: RS-CV-2026</div>
              <div>ROHAN SINGH | MECHANICAL ENGINEERING</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enlarged Modal */}
      {isEnlarged && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8"
          onClick={() => setIsEnlarged(false)}
        >
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsEnlarged(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-400 text-sm uppercase tracking-wider"
            >
              ✕ Close
            </button>
            <iframe
              src={resumePdf}
              title="Resume Preview - Enlarged"
              className="w-full h-[85vh] border-2 border-gray-600 bg-white"
            />
          </div>
        </div>
      )}
    </section>
  );
}
