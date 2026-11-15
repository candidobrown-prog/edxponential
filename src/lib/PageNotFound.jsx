import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';


export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await base44.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#07080f]" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <div className="max-w-lg w-full text-center space-y-10">
                {/* Logo */}
                <img
                    src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
                    alt="edXponential"
                    className="h-10 w-auto object-contain mx-auto opacity-60"
                />

                {/* 404 */}
                <div>
                    <div className="text-[120px] font-black text-white/[0.04] leading-none select-none mb-2">404</div>
                    <div className="w-12 h-px bg-white/10 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-white mb-3">Page Not Found</h2>
                    <p className="text-white/30 text-sm leading-relaxed">
                        The page <span className="text-white/50 font-semibold">"{pageName}"</span> doesn't exist yet.
                    </p>
                </div>

                {/* Admin Note */}
                {isFetched && authData?.isAuthenticated && authData?.user?.role === 'admin' && (
                    <div className="p-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-left">
                        <p className="text-white/50 text-xs font-black uppercase tracking-wider mb-1">Admin Note</p>
                        <p className="text-white/30 text-sm leading-relaxed">
                            This page hasn't been implemented yet. Ask the AI to build it in the chat.
                        </p>
                    </div>
                )}

                {/* CTA */}
                <Link to="/"
                    className="inline-flex items-center gap-2 bg-white text-[#07080f] font-black text-sm px-6 py-3 rounded-xl hover:bg-zinc-100 transition-all shadow-2xl shadow-white/10">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <p className="text-white/10 text-[11px] font-black uppercase tracking-widest">edXponential · The Future of Education</p>
            </div>
        </div>
    )
}