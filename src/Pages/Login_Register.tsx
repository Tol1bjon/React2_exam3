import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { axiosRequest, saveToken } from '@/lib/Tokens';

const LoginRegister = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()

    // Режим формы: false = Sign In (Логин), true = Sign Up (Регистрация)
    const [isSignUp, setIsSignUp] = useState(false);

    // Состояния полей и ошибок для Login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string; general?: string }>({});

    // Состояния полей и ошибок для Register
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regErrors, setRegErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
    const [regSuccess, setRegSuccess] = useState('');

    const toggleView = () => {
        setIsSignUp((prev) => !prev);
        setLoginErrors({});
        setRegErrors({});
        setRegSuccess('');
    };

    // LOGIN
    async function Login(info: any) {
        try {
            const { data } = await axiosRequest.post('/api/auth/login', info);
            saveToken(data.accessToken, data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/home');
        } catch (error) {
            console.log(error);
            setLoginErrors({ general: t('invalidLogin') });
        }
    }

    function handleLogin(e: any) {
        e.preventDefault();
        const errors: { email?: string; password?: string } = {};

        if (!loginEmail.trim()) {
            errors.email = t('emailRequired');
        }
        if (!loginPassword.trim()) {
            errors.password = t('passwordRequired');
        }

        if (Object.keys(errors).length > 0) {
            setLoginErrors(errors);
            return;
        }

        setLoginErrors({});
        Login({ email: loginEmail, password: loginPassword });
    }

    // REGISTER
    async function Register(info: any) {
        try {
            const { data } = await axiosRequest.post('/api/auth/register', info);
            if (data.accessToken) {
                saveToken(data.accessToken, data.refreshToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/home');
            } else {
                setRegSuccess(t('registerSuccess'));
                setTimeout(() => {
                    toggleView();
                }, 1500);
            }
        } catch (error) {
            console.log(error);
            setRegErrors({ general: t('registerError') });
        }
    }

    function handleRegister(e: any) {
        e.preventDefault();
        const errors: { name?: string; email?: string; password?: string } = {};

        if (!regName.trim()) {
            errors.name = t('nameRequired');
        }
        if (!regEmail.trim()) {
            errors.email = t('emailRequired');
        }
        if (!regPassword.trim()) {
            errors.password = t('passwordRequired');
        } else if (regPassword.length < 6) {
            errors.password = t('passwordTooShort');
        }

        if (Object.keys(errors).length > 0) {
            setRegErrors(errors);
            return;
        }

        setRegErrors({});
        Register({ name: regName, email: regEmail, password: regPassword });
    }

    return (
        <div className="login-register-page relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8FAFC] p-4 text-[#0F172A] selection:bg-[#046276]/20 selection:text-[#046276]">
            {/* Фоновая сетка в стиле светлой темы проекта */}
            <div className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                    backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />

            {/* Мягкие фоновые свечения в стиле проекта */}
            <div className="pointer-events-none absolute -top-32 right-1/4 h-[400px] w-[400px] rounded-full bg-[#046276]/10 blur-[130px]" />
            <div className="pointer-events-none absolute -bottom-32 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[130px]" />

            {/* Кнопка назад на главную */}
            <NavLink to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs backdrop-blur-md transition-all duration-150 hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 active:translate-y-0">
                <ArrowLeft className="size-4" />
                <span>{t('home')}</span>
            </NavLink>

            {/* ================= КАРТОЧКА LOGIN / REGISTER ================= */}
            <div className="card shadow-[0_24px_60px_-15px_rgba(15,23,42,0.14),0_0_1px_1px_rgba(15,23,42,0.04)]">
                {/* Диагональные анимированные фоны */}
                <div className={`card-bg card-bg-1 ${isSignUp ? 'signup' : 'signin'}`} />
                <div className={`card-bg card-bg-2 ${isSignUp ? 'signup' : 'signin'}`} />

                {/* Водяные знаки логотипа Adl 5:8 */}
                <div className={`logo logo-1 ${isSignUp ? 'active' : ''}`}>
                    <svg viewBox="0 0 36 36" className="size-full" fill="none">
                        <path d="M18 6V22M11 10H25M11 10L8 17H14L11 10ZM25 10L22 17H28L25 10Z" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 17C8 18.5 9.3 19.5 11 19.5C12.7 19.5 14 18.5 14 17M22 17C22 18.5 23.3 19.5 25 19.5C26.7 19.5 28 18.5 28 17" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="18" y="29" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="800">Adl 5:8</text>
                    </svg>
                </div>

                <div className={`logo logo-2 ${!isSignUp ? 'active' : ''}`}>
                    <svg viewBox="0 0 36 36" className="size-full" fill="none">
                        <path d="M18 6V22M11 10H25M11 10L8 17H14L11 10ZM25 10L22 17H28L25 10Z" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 17C8 18.5 9.3 19.5 11 19.5C12.7 19.5 14 18.5 14 17M22 17C22 18.5 23.3 19.5 25 19.5C26.7 19.5 28 18.5 28 17" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="18" y="29" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="800">Adl 5:8</text>
                    </svg>
                </div>

                {/* ================= ФОРМА SIGN IN (ВХОД) ================= */}
                <div className={`form signin ${!isSignUp ? 'active' : ''}`}>
                    <form onSubmit={handleLogin} noValidate>
                        <h2>{t('signInTitle')}</h2>

                        {loginErrors.general && (
                            <div className="rounded-lg bg-red-50 p-2 text-center text-[11px] font-semibold text-red-500 border border-red-200">
                                {loginErrors.general}
                            </div>
                        )}

                        <div className="field-group">
                            <input
                                type="email"
                                name="email"
                                value={loginEmail}
                                onChange={(e) => {
                                    setLoginEmail(e.target.value);
                                    if (loginErrors.email || loginErrors.general) {
                                        setLoginErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
                                    }
                                }}
                                placeholder={t('emailPlaceholder')}
                                autoComplete="email"
                                className={loginErrors.email ? 'input-error' : ''}
                            />
                            {loginErrors.email && (
                                <span className="error-text">{loginErrors.email}</span>
                            )}
                        </div>

                        <div className="field-group">
                            <input
                                type="password"
                                name="password"
                                value={loginPassword}
                                onChange={(e) => {
                                    setLoginPassword(e.target.value);
                                    if (loginErrors.password || loginErrors.general) {
                                        setLoginErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
                                    }
                                }}
                                placeholder={t('passwordPlaceholder')}
                                autoComplete="current-password"
                                className={loginErrors.password ? 'input-error' : ''}
                            />
                            {loginErrors.password && (
                                <span className="error-text">{loginErrors.password}</span>
                            )}
                        </div>

                        <button type="submit">{t('signInButton')}</button>
                        <a href="#signup" onClick={(e) => { e.preventDefault(); toggleView(); }}>
                            {t('dontHaveAccount')}<em>{t('signUp')}</em>
                        </a>
                    </form>
                </div>

                {/* ================= ФОРМА SIGN UP (РЕГИСТРАЦИЯ) ================= */}
                <div className={`form signup ${isSignUp ? 'active' : ''}`}>
                    <form onSubmit={handleRegister} noValidate>
                        <h2>{t('registerTitle')}</h2>

                        {regSuccess && (
                            <div className="rounded-lg bg-emerald-50 p-2 text-center text-[11px] font-semibold text-emerald-600 border border-emerald-200">
                                {regSuccess}
                            </div>
                        )}

                        {regErrors.general && (
                            <div className="rounded-lg bg-red-50 p-2 text-center text-[11px] font-semibold text-red-500 border border-red-200">
                                {regErrors.general}
                            </div>
                        )}

                        <div className="field-group">
                            <input
                                type="text"
                                name="name"
                                value={regName}
                                onChange={(e) => {
                                    setRegName(e.target.value);
                                    if (regErrors.name || regErrors.general) {
                                        setRegErrors((prev) => ({ ...prev, name: undefined, general: undefined }));
                                    }
                                }}
                                placeholder={t('namePlaceholder')}
                                autoComplete="name"
                                className={regErrors.name ? 'input-error' : ''}
                            />
                            {regErrors.name && (
                                <span className="error-text">{regErrors.name}</span>
                            )}
                        </div>

                        <div className="field-group">
                            <input
                                type="email"
                                name="email"
                                value={regEmail}
                                onChange={(e) => {
                                    setRegEmail(e.target.value);
                                    if (regErrors.email || regErrors.general) {
                                        setRegErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
                                    }
                                }}
                                placeholder={t('emailPlaceholder')}
                                autoComplete="email"
                                className={regErrors.email ? 'input-error' : ''}
                            />
                            {regErrors.email && (
                                <span className="error-text">{regErrors.email}</span>
                            )}
                        </div>

                        <div className="field-group">
                            <input
                                type="password"
                                name="password"
                                value={regPassword}
                                onChange={(e) => {
                                    setRegPassword(e.target.value);
                                    if (regErrors.password || regErrors.general) {
                                        setRegErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
                                    }
                                }}
                                placeholder={t('passwordMinPlaceholder')}
                                autoComplete="new-password"
                                className={regErrors.password ? 'input-error' : ''}
                            />
                            {regErrors.password && (
                                <span className="error-text">{regErrors.password}</span>
                            )}
                        </div>

                        <button type="submit">{t('signUpButton')}</button>
                        <a href="#signin" onClick={(e) => { e.preventDefault(); toggleView(); }}>
                            {t('alreadyHaveAccount')}<em>{t('signIn')}</em>
                        </a>
                    </form>
                </div>
            </div>

            {/* Стили согласно изученному дизайну (изображения 1, 2, 3, 4) */}
            <style>{`
                :root {
                    --color-primary: #046276;
                    --color-primary-dark: #034b5a;
                    --color-primary-light: #0d839c;
                }

                .card {
                    position: relative;
                    overflow: hidden;
                    width: 660px;
                    height: 440px;
                    border-radius: 32px;
                    background: #ffffff;
                }

                /* Диагональные фоновые плашки */
                .card-bg {
                    position: absolute;
                    z-index: 2;
                    top: -120px;
                    bottom: 0;
                    left: 0;
                    width: 860px;
                    height: 680px;
                    rotate: -45deg;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                }

                .card-bg-1 {
                    background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 60%, var(--color-primary-dark) 100%);
                    box-shadow: 0 10px 40px rgba(4, 98, 118, 0.3);
                }

                .card-bg-2 {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(4, 98, 118, 0.25) 100%);
                    backdrop-blur: 4px;
                }

                /* Положение фона при Sign In (фон справа, форма слева) */
                .card-bg-1.signin {
                    transform: translate(250px, -20px);
                }
                .card-bg-2.signin {
                    transform: translate(270px, -10px);
                }

                /* Положение фона при Sign Up (фон слева, форма справа) */
                .card-bg-1.signup {
                    transform: translate(-330px, -20px);
                }
                .card-bg-2.signup {
                    transform: translate(-350px, -10px);
                }

                /* Водяные знаки логотипа */
                .logo {
                    position: absolute;
                    top: 60px;
                    z-index: 2;
                    height: 280px;
                    width: 280px;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
                    opacity: 0;
                    pointer-events: none;
                }

                .logo-1 {
                    left: 20px;
                    transform: translate(-180px, 0);
                }
                .logo-1.active {
                    opacity: 0.18;
                    transform: translate(0, 0);
                }

                .logo-2 {
                    right: 20px;
                    transform: translate(180px, 0);
                }
                .logo-2.active {
                    opacity: 0.18;
                    transform: translate(0, 0);
                }

                /* Формы */
                .form {
                    position: absolute;
                    z-index: 3;
                    top: 0;
                    bottom: 0;
                    width: 50%;
                    display: grid;
                    place-items: center;
                    padding: 30px;
                    transition: opacity 0.4s ease, transform 0.5s ease;
                }

                .form.signin {
                    left: 0;
                }

                .form.signup {
                    left: 50%;
                }

                .form:not(.active) {
                    opacity: 0;
                    pointer-events: none;
                    transform: scale(0.95);
                }

                .form.active {
                    opacity: 1;
                    pointer-events: auto;
                    transform: scale(1);
                }

                .form h2 {
                    text-align: center;
                    font-size: 24px;
                    font-weight: 700;
                    color: #0F172A;
                    margin-bottom: 6px;
                    letter-spacing: -0.02em;
                }

                .form form {
                    width: 100%;
                    max-width: 240px;
                    display: grid;
                    gap: 12px;
                    opacity: 0;
                    transition: opacity 0.4s ease 0.15s;
                }

                .form.active form {
                    opacity: 1;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    width: 100%;
                }

                .form input {
                    width: 100%;
                    padding: 10px 14px;
                    font-size: 13px;
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    background: #F8FAFC;
                    color: #0F172A;
                    outline: none;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
                }

                .form input::placeholder {
                    color: #94A3B8;
                }

                .form input:focus {
                    background: #FFFFFF;
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 3px rgba(4, 98, 118, 0.12);
                }

                .form input.input-error {
                    border-color: #EF4444;
                    background: #FEF2F2;
                }

                .form input.input-error:focus {
                    border-color: #EF4444;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
                }

                .error-text {
                    font-size: 10px;
                    font-weight: 600;
                    color: #EF4444;
                    padding-left: 4px;
                    line-height: 1.2;
                }

                .form button {
                    margin-top: 4px;
                    width: 100%;
                    padding: 11px 16px;
                    background: var(--color-primary);
                    color: #FFFFFF;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 8px 18px -4px rgba(4, 98, 118, 0.4);
                    transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
                }

                .form button:hover {
                    transform: translateY(-2px);
                    background: var(--color-primary-dark);
                    box-shadow: 0 10px 22px -4px rgba(4, 98, 118, 0.5);
                }

                .form button:active {
                    transform: translateY(0);
                }

                .form a {
                    margin-top: 4px;
                    display: inline-flex;
                    flex-direction: column;
                    gap: 4px;
                    color: #64748B;
                    cursor: pointer;
                    font-size: 12px;
                    text-align: center;
                    text-decoration: none;
                    transition: color 0.15s ease;
                }

                .form a:hover {
                    color: #334155;
                }

                .form a em {
                    display: block;
                    font-style: normal;
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--color-primary);
                    transition: transform 0.15s ease;
                }

                .form a:hover em {
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    );
};

export default LoginRegister;