import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Accueil', href: '#top' },
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Tarifs', href: '#pricing' },
  
];

export default function Landing() {
  const navigate = useNavigate();

  const pageClass = 'min-h-screen bg-emerald-50 text-slate-950 transition-colors duration-300';
  const cardBgClass = 'rounded-[1.5rem] border border-emerald-200 bg-white p-8 shadow-xl shadow-slate-200/50';

  return (
    <div id="top" className={pageClass}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_25%)]" />

        <header className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-12 md:py-8 bg-white/80 border-b border-emerald-200 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="Facturly" className="h-20 w-auto" />
            
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-emerald-600">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate('/login')}
              className="text-slate-700 hover:text-slate-900 text-sm"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate('/register')}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-500"
            >
              Commencer gratuitement
            </button>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-10 md:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-4 py-2 text-sm text-emerald-700 shadow-sm">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Gagnez du temps sur votre facturation.
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
                  Gérez vos factures <span className="text-emerald-600">en vert et en grand</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  Facturly transforme votre gestion de facturation en un espace clair, professionnel et intuitif. Créez, suivez et exportez vos documents rapidement.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-500"
                >
                  Commencer gratuitement
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-8 py-3 text-base font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800"
                >
                  Se connecter
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { label: 'Factures/mois', value: '∞' },
                  { label: 'Clients', value: 'Illimité' },
                  { label: 'Support', value: '24/7' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-emerald-200 bg-white px-5 py-4 text-center shadow-sm">
                    <p className="text-2xl font-semibold text-slate-950">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-x-6 -top-6 h-72 rounded-[2rem] bg-emerald-300/20 blur-3xl" />
              <div className="relative rounded-[2rem] border border-emerald-200 bg-white p-8 shadow-2xl shadow-slate-200/50 animate-fade-in">
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Fonctionnalités clés</p>
                  <h2 className="mt-3 text-2xl font-bold text-slate-950">Tout en un seul endroit</h2>
                </div>
                <div className="space-y-5">
                  {[
                    { title: 'Automatisation', desc: 'Relances automatiques et factures générées en un clic.' },
                    { title: 'Suivi clair', desc: 'Visualisez l’état des paiements et les clients en retard.' },
                    { title: 'Export instantané', desc: 'Téléchargez vos factures en PDF rapidement.' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl">
                      <p className="text-sm text-emerald-700">{item.title}</p>
                      <p className="mt-3 text-lg font-semibold leading-7 text-slate-950">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <section id="features" className="bg-emerald-50 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-center text-3xl font-bold text-slate-950 sm:text-4xl">Tout ce dont vous avez besoin pour gérer vos clients et vos factures</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Un espace unique pour créer des factures, suivre les paiements, relancer les impayés et garder un œil sur vos performances.</p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Factures rapides', desc: 'Créez et envoyez des factures en quelques secondes.' },
              { title: 'Gestion clients', desc: 'Regroupez tous vos clients et suivez leur historique.' },
              { title: 'Export PDF & Excel', desc: 'Téléchargez vos documents en un format professionnel.' },
            ].map((feature) => (
              <div key={feature.title} className={`${cardBgClass} animate-fade-in`}>
                <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Tarif transparent</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Un tarif simple pour chaque freelance</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-emerald-200 bg-white p-8 shadow-2xl shadow-slate-200/50">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Gratuit</p>
              <h3 className="mt-4 text-5xl font-bold text-slate-950">0 MAD</h3>
              <p className="mt-4 text-slate-600">Parfait pour démarrer et tester l’outil avec votre première clientèle.</p>
              <ul className="mt-8 space-y-4 text-slate-700">
                {['5 factures / mois', '3 clients connectés', 'Export PDF', 'Dashboard basique'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="text-emerald-600">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="mt-10 w-full rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-500">
                Commencer
              </button>
            </div>

            <div className="relative rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-8 shadow-2xl shadow-emerald-200/40">
              <div className="absolute -top-4 left-6 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-400/20">Populaire</div>
              <div className="mt-6">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Pro</p>
                <h3 className="mt-4 text-5xl font-bold text-slate-950">79 MAD</h3>
                <p className="mt-3 text-slate-700">Par mois, pour une utilisation pro illimitée.</p>
              </div>
              <ul className="mt-8 space-y-4 text-slate-700">
                {['Factures illimitées', 'Clients illimités', 'Export PDF Pro', 'Dashboard avancé', 'Support prioritaire'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="text-emerald-600">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="mt-10 w-full rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-500">
                Choisir Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer" className="border-t border-emerald-200 py-8 text-center text-slate-500">
        © 2026 Facturly
      </footer>
    </div>
  );
}
