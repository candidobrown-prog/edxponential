import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Package } from 'lucide-react';
import { getModuleIcon, getModuleName } from '@/lib/personalizationEngine';

export default function PersonalizedDashboard() {
  const [user, setUser] = useState(null);
  const [personalization, setPersonalization] = useState(null);
  const [showXSchoolBox, setShowXSchoolBox] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (currentUser?.visible_modules) {
        setPersonalization({
          visibleModules: currentUser.visible_modules,
          xschoolBox: currentUser.xschool_box || [],
          tier: currentUser.preferred_tier || 'pro',
        });
      }
    };
    fetchUser();
  }, []);

  if (!personalization) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Building your personalized experience…</p>
        </div>
      </div>
    );
  }

  const moduleRoutes = {
    operationx: '/operationx',
    graiedx: '/graiedx/home',
    foundaitionx: '/foundaitionx/home',
    xschores: '/xschores/home',
    'daida-baixed': '/daida-baixed/home',
    classifiedx: '/classifiedx/home',
    perspedxtives: '/perspedxtives/home',
    twotrx: '/twotrx',
    educartx: '/educartx',
    edxportante: '/edxportante',
    coaching: '/coaching',
    edvestors: '/edvestors',
    'deal-room': '/deal-room',
    pipeline: '/pipeline',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 sticky top-0 z-40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">Personalized for your role and goals</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-gray-600">AI-Curated</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Main Modules */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalization.visibleModules.map((moduleId, idx) => (
              <Link key={moduleId} to={moduleRoutes[moduleId] || '#'}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="text-5xl mb-4">{getModuleIcon(moduleId)}</div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {getModuleName(moduleId)}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">Access now</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 mt-4 transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* XSchool Box */}
        {personalization.xschoolBox && personalization.xschoolBox.length > 0 && (
          <section>
            <button
              onClick={() => setShowXSchoolBox(!showXSchoolBox)}
              className="flex items-center gap-3 mb-6 hover:opacity-70 transition-opacity group"
            >
              <Package className="w-5 h-5 text-gray-900 group-hover:text-blue-600 transition-colors" />
              <h2 className="text-2xl font-bold text-gray-900">XSchool Box</h2>
              <span className="text-xs text-gray-500 ml-2">
                {personalization.xschoolBox.length} more tools
              </span>
            </button>

            {showXSchoolBox && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {personalization.xschoolBox.map((moduleId, idx) => (
                  <Link key={moduleId} to={moduleRoutes[moduleId] || '#'}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-200 hover:bg-white hover:border-gray-300 transition-all cursor-pointer group"
                    >
                      <div className="text-4xl mb-3 opacity-70 group-hover:opacity-100 transition-opacity">
                        {getModuleIcon(moduleId)}
                      </div>
                      <h3 className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors text-sm">
                        {getModuleName(moduleId)}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2">Explore when ready</p>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            )}
            <p className="text-xs text-gray-400 mt-4">
              More tools appear here based on your activity. Expand to discover advanced features.
            </p>
          </section>
        )}

        {/* Quick Actions */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-sm text-gray-600">Add your details to unlock personalized recommendations</p>
              <Link to="/profile" className="text-blue-600 text-sm font-semibold mt-3 inline-block hover:underline">
                Go to Profile →
              </Link>
            </div>
            <div className="p-6 rounded-xl bg-orange-50 border border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-2">Explore Communities</h3>
              <p className="text-sm text-gray-600">Connect with other education leaders</p>
              <Link to="/communities" className="text-orange-600 text-sm font-semibold mt-3 inline-block hover:underline">
                Join Communities →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}