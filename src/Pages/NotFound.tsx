import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import characterSvg from '@/assets/gemini-svg.svg';

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 py-8 selection:bg-blue-100 selection:text-blue-700">
            {/* Ambient decorative glow */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-50/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-50/40 blur-3xl" />

            <div className="flex w-full max-w-xl flex-col items-center text-center">
                {/* Character Illustration with floating animation and hover effect */}
                <div className="group relative mb-6 flex items-center justify-center md:mb-8">
                    {/* Soft animated shadow underneath */}
                    <div className="absolute -bottom-1 h-3.5 w-48 rounded-full bg-slate-200/50 blur-md transition-all duration-500 md:h-5 md:w-72 lg:w-80 group-hover:scale-110 group-hover:bg-slate-300/50" />

                    <img src={characterSvg} alt="Page Not Found illustration" className="relative h-72 w-auto select-none drop-shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 sm:h-84 md:h-[380px] lg:h-[420px] group-hover:scale-[1.03]" style={{ animation: 'floatCharacter 4s ease-in-out infinite', }} />
                </div>

                {/* Typography matching design */}
                <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {t('notFoundTitle')}
                </h1>

                <p className="mb-8 max-w-[420px] text-sm leading-relaxed text-slate-500 sm:text-base">
                    {t('notFoundDesc')}
                </p>

                {/* Action Button using Shadcn Button */}
                <Link to="/home">
                    <Button className="h-10 rounded-xl bg-blue-600 px-6 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/35 active:translate-y-0 cursor-pointer">{t('backToHome')}</Button>
                </Link>
            </div>

            <style>{`
                @keyframes floatCharacter {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-6px);
                    }
                }
            `}</style>
        </div>
    );
};

export default NotFound;
