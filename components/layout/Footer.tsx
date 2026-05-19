export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900/50 border-t border-dark-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Jarvis AI</h3>
            <p className="text-dark-400 text-sm">
              Production-ready Voice AI Assistant powered by OpenAI and ElevenLabs.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-dark-400 text-sm">
              <li>
                <a href="/assistant" className="hover:text-white transition-colors">
                  Assistant
                </a>
              </li>
              <li>
                <a href="/history" className="hover:text-white transition-colors">
                  History
                </a>
              </li>
              <li>
                <a href="/settings" className="hover:text-white transition-colors">
                  Settings
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <p className="text-dark-400 text-sm">
              Built with Next.js, React, TypeScript, and Tailwind CSS.
            </p>
            <p className="text-dark-500 text-xs mt-4">
              v1.0.0 - © 2024 All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
