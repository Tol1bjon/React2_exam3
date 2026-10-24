import { ChevronDown, ReceiptText, CircleDollarSign } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/Store/Zustand';
import DebtStatsCards from '@/components/DebtStatsCards';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const years = ['2024', '2025', '2026', '2027'];
const xCoords = [40, 89, 138, 187, 236, 285, 335, 384, 433, 482, 531, 580];

const Dushboard = () => {
    const { t } = useTranslation();
    const [selectedYear, setSelectedYear] = useState('2026');
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [showLent, setShowLent] = useState(true);
    const [showBorrowed, setShowBorrowed] = useState(true);

    const user = useUser((state: any) => state.user);
    const payments = useUser((state: any) => state.payments);
    const debts = useUser((state: any) => state.debts);
    const getDebts = useUser((state: any) => state.getDebts);

    useEffect(() => {
        getDebts();
    }, []);

    // Агрегация долгов по месяцам для выбранного года
    const year = Number(selectedYear);
    const monthlyLent = Array(12).fill(0);
    const monthlyBorrowed = Array(12).fill(0);

    (debts || []).forEach((debt: any) => {
        const rawDate = debt.created_at || debt.createdAt || debt.due_date || debt.dueDate;
        const d = rawDate ? new Date(rawDate) : new Date();
        if (isNaN(d.getTime())) return;

        if (d.getFullYear() === year) {
            const month = d.getMonth();
            const amount = Number(debt.amount) || 0;
            const isLent = debt.direction === 'they_owe_me' || debt.type === 'lent' || debt.type === 'owes_me';
            const isBorrowed = debt.direction === 'i_owe_them' || debt.type === 'owe' || debt.type === 'borrowed';
            if (isLent) {
                monthlyLent[month] += amount;
            } else if (isBorrowed) {
                monthlyBorrowed[month] += amount;
            }
        }
    });

    // Масштабирование оси Y (минимум 5k, с шагом в 1k)
    const maxVal = Math.max(5000, ...monthlyLent, ...monthlyBorrowed);
    const maxScale = Math.ceil(maxVal / 5000) * 5000;

    const levels = [
        { value: maxScale, label: `${Math.round(maxScale / 1000)}k`, y: 55 },
        { value: maxScale * 0.8, label: `${Math.round((maxScale * 0.8) / 1000)}k`, y: 81 },
        { value: maxScale * 0.6, label: `${Math.round((maxScale * 0.6) / 1000)}k`, y: 107 },
        { value: maxScale * 0.4, label: `${Math.round((maxScale * 0.4) / 1000)}k`, y: 133 },
        { value: maxScale * 0.2, label: `${Math.round((maxScale * 0.2) / 1000)}k`, y: 159 },
        { value: 0, label: '0k', y: 185 },
    ];

    const getY = (val: number) => 185 - (val / maxScale) * 130;

    // Точки для зеленой линии (Lent)
    const lentPoints = xCoords.map((x, i) => {
        const val = monthlyLent[i];
        return {
            x: val > 0 ? x : x - 3.5,
            y: val > 0 ? getY(val) : 184,
            val,
            month: months[i],
        };
    });

    // Точки для красной линии (Borrowed)
    const borrowedPoints = xCoords.map((x, i) => {
        const val = monthlyBorrowed[i];
        return {
            x: val > 0 ? x : x + 3.5,
            y: val > 0 ? getY(val) : 186,
            val,
            month: months[i],
        };
    });

    // Построение плавной кривой безье
    const generateSmoothPath = (pts: Array<{ x: number; y: number }>) => {
        if (pts.length === 0) return '';
        let path = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) {
            const p0 = pts[i - 1];
            const p1 = pts[i];
            const dx = p1.x - p0.x;
            const cp1x = p0.x + dx * 0.45;
            const cp1y = p0.y;
            const cp2x = p1.x - dx * 0.45;
            const cp2y = p1.y;
            path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
        }
        return path;
    };

    const lentLine = generateSmoothPath(lentPoints);
    const lentArea = `${lentLine} L ${xCoords[11]} 185 L ${xCoords[0]} 185 Z`;

    const borrowedLine = generateSmoothPath(borrowedPoints);
    const borrowedArea = `${borrowedLine} L ${xCoords[11]} 185 L ${xCoords[0]} 185 Z`;

    return (
        <div className="pt-2">
            <h1 className="mb-6 text-xl font-bold tracking-tight text-slate-800 dark:text-white md:text-2xl">
                {t('welcome')}, {user?.name || 'Abuumar'}!
            </h1>

            {/* Top Stats Cards */}
            <DebtStatsCards />

            {/* Overview & Recent Payments */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Monthly Debts Overview */}
                <div className="flex flex-col rounded-3xl border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] p-5 sm:p-6 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-base font-bold text-slate-800 dark:text-white md:text-lg">
                            {t('monthlyDebtsOverview')}
                        </h2>

                        {/* Year Select Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a2636] px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-700 active:translate-y-0 outline-none cursor-pointer">
                                <span>{selectedYear}</span>
                                <ChevronDown className="size-4 text-slate-500 dark:text-slate-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={6} className="w-28 rounded-xl border-0 bg-white dark:bg-[#1a2636] p-1.5 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 z-50">
                                {years.map((y) => (
                                    <DropdownMenuItem key={y} onClick={() => setSelectedYear(y)} className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-all duration-150 ${ y === selectedYear ? 'bg-blue-50 dark:bg-blue-900/40 font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50' }`}>
                                        {y}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Legend - независимые кнопки переключения серий */}
                    <div className="mt-4 flex flex-wrap items-center gap-5 text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => setShowLent((prev) => !prev)}
                            className={`flex items-center gap-2 cursor-pointer transition-all duration-150 select-none ${
                                showLent
                                    ? 'text-slate-800 dark:text-slate-200 font-semibold'
                                    : 'text-slate-400 dark:text-slate-500 line-through opacity-50'
                            }`}
                        >
                            <span
                                className={`size-3.5 rounded-full border-2 border-emerald-500 transition-colors ${
                                    showLent ? 'bg-emerald-500/25' : 'bg-transparent'
                                }`}
                            />
                            <span>{t('lentOwedToMe')}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowBorrowed((prev) => !prev)}
                            className={`flex items-center gap-2 cursor-pointer transition-all duration-150 select-none ${
                                showBorrowed
                                    ? 'text-slate-800 dark:text-slate-200 font-semibold'
                                    : 'text-slate-400 dark:text-slate-500 line-through opacity-50'
                            }`}
                        >
                            <span
                                className={`size-3.5 rounded-full border-2 border-red-500 transition-colors ${
                                    showBorrowed ? 'bg-red-500/25' : 'bg-transparent'
                                }`}
                            />
                            <span>{t('borrowedIOwe')}</span>
                        </button>
                    </div>

                    {/* SVG Chart with dynamic curves and grid */}
                    <div className="mt-4 w-full overflow-hidden relative">
                        <svg viewBox="0 0 600 230" className="h-auto w-full select-none" preserveAspectRatio="xMidYMid meet">
                            <defs>
                                <linearGradient id="lentGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id="borrowedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Grid Lines */}
                            {levels.map(({ y, label }) => (
                                <g key={label}>
                                    <text x="32" y={y + 4} textAnchor="end" className="fill-slate-400 dark:fill-slate-500 text-[11px] font-medium">
                                        {label}
                                    </text>
                                    <line
                                        x1="40"
                                        y1={y}
                                        x2="580"
                                        y2={y}
                                        stroke="currentColor"
                                        className="text-[#f1f5f9] dark:text-[#1e293b]"
                                        strokeWidth="1.2"
                                        strokeDasharray="4 4"
                                    />
                                </g>
                            ))}

                            {/* Зеленая серия (Lent) - работает полностью отдельно */}
                            {showLent && (
                                <g>
                                    <path d={lentArea} fill="url(#lentGrad)" opacity="0.65" />
                                    <path
                                        d={lentLine}
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    {lentPoints.map((pt, i) => (
                                        <circle
                                            key={`l-dot-${i}`}
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={pt.val > 0 ? 5 : 3.5}
                                            fill="#ffffff"
                                            stroke="#10b981"
                                            strokeWidth={pt.val > 0 ? 2.5 : 1.5}
                                            className="transition-transform duration-150 hover:scale-125"
                                        />
                                    ))}
                                </g>
                            )}

                            {/* Красная серия (Borrowed) - работает полностью отдельно */}
                            {showBorrowed && (
                                <g>
                                    <path d={borrowedArea} fill="url(#borrowedGrad)" opacity="0.55" />
                                    <path
                                        d={borrowedLine}
                                        fill="none"
                                        stroke="#ef4444"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    {borrowedPoints.map((pt, i) => (
                                        <circle
                                            key={`b-dot-${i}`}
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={pt.val > 0 ? 4.5 : 3}
                                            fill="#ffffff"
                                            stroke="#ef4444"
                                            strokeWidth={pt.val > 0 ? 2.5 : 1.5}
                                            className="transition-transform duration-150 hover:scale-125"
                                        />
                                    ))}
                                </g>
                            )}

                            {/* Hover Guide line */}
                            {hoveredIndex !== null && (
                                <g>
                                    <line
                                        x1={xCoords[hoveredIndex]}
                                        y1={55}
                                        x2={xCoords[hoveredIndex]}
                                        y2={185}
                                        stroke="#94a3b8"
                                        strokeWidth="1.5"
                                        strokeDasharray="3 3"
                                        opacity="0.6"
                                    />
                                    {/* Tooltip Popup */}
                                    <g transform={`translate(${Math.min(500, Math.max(80, xCoords[hoveredIndex]))}, 38)`}>
                                        <rect
                                            x="-60"
                                            y="-32"
                                            width="120"
                                            height="34"
                                            rx="8"
                                            className="fill-slate-900/90 dark:fill-[#0b131f]/95 stroke stroke-slate-700/60 shadow-lg"
                                        />
                                        <text x="0" y="-18" textAnchor="middle" className="fill-white text-[10px] font-semibold">
                                            {months[hoveredIndex]} {selectedYear}
                                        </text>
                                        <text x="-4" y="-6" textAnchor="end" className="fill-emerald-400 text-[10px] font-bold">
                                            {showLent ? `+${monthlyLent[hoveredIndex].toLocaleString('ru-RU')}` : ''}
                                        </text>
                                        <text x="4" y="-6" textAnchor="start" className="fill-red-400 text-[10px] font-bold">
                                            {showBorrowed ? `-${monthlyBorrowed[hoveredIndex].toLocaleString('ru-RU')}` : ''}
                                        </text>
                                    </g>
                                </g>
                            )}

                            {/* Interactive Hover Hit Zones */}
                            {xCoords.map((x, i) => (
                                <rect
                                    key={`hit-${i}`}
                                    x={x - 22}
                                    y={40}
                                    width={44}
                                    height={155}
                                    fill="transparent"
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                />
                            ))}

                            {/* Months text along X-axis */}
                            {months.map((m, i) => (
                                <text
                                    key={m}
                                    x={xCoords[i]}
                                    y="212"
                                    textAnchor="middle"
                                    className={`text-[11px] font-medium transition-colors ${
                                        hoveredIndex === i
                                            ? 'fill-blue-500 dark:fill-blue-400 font-bold'
                                            : 'fill-slate-500 dark:fill-slate-400'
                                    }`}
                                >
                                    {m}
                                </text>
                            ))}
                        </svg>
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="flex flex-col rounded-3xl border border-slate-200/80 dark:border-[#1e293b] bg-white dark:bg-[#131d2b] p-5 sm:p-6 shadow-sm lg:col-span-1">
                    <h2 className="text-base font-bold text-slate-800 dark:text-white md:text-lg">
                        {t('recentPayments')}
                    </h2>

                    {payments.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-[#1a2636] text-slate-400 dark:text-slate-500">
                                <ReceiptText className="size-6" />
                            </div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t('noRecentPayments')}</p>
                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{t('paymentsWillAppearHere')}</p>
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-col divide-y divide-slate-100 dark:divide-[#1e293b]/60">
                            {payments.slice(0, 6).map((item: any) => {
                                const isIncoming = item.direction !== 'i_owe_them';
                                const dateStr = item.created_at ? new Intl.DateTimeFormat('ru-RU', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }).format(new Date(item.created_at)).replace('г.,', 'г. ·') : '24 окт. 2026 г. · 12:14';

                                return (
                                    <div key={item.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${isIncoming ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15' : 'bg-red-500/10 text-red-500 dark:bg-red-500/15'}`}>
                                                <CircleDollarSign className="size-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm text-slate-800 dark:text-white">
                                                    {item.contact_name || 'Платеж'}
                                                </span>
                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                    {dateStr}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`font-bold text-sm ${isIncoming ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {isIncoming ? '+' : '-'}{Number(item.amount).toLocaleString('ru-RU')}
                                            </span>
                                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${isIncoming ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20'}`}>
                                                {isIncoming ? t('incoming') : t('outgoing')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dushboard;
