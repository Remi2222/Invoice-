import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuthStore } from '../store/auth.store';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.register(email, password);
      setAuth(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch {
      setError('Email déjà utilisé ou erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-emerald-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg rounded-[2rem] border border-emerald-200 bg-white p-10 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <img src="/logo.svg" alt="Facturly" className="mx-auto mb-6 h-16 w-auto" />
            <h1 className="text-4xl font-bold text-slate-950">Créer un compte</h1>
            <p className="mt-2 text-slate-600">Rejoignez Facturly et commencez à facturer</p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-lg"
                  placeholder=""
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-lg"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-lg"
                placeholder="vous@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-lg"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Pays</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-lg"
                required
              >
                <option value="">Sélectionnez un pays</option>
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
                <option value="CH">Suisse</option>
                <option value="CA">Canada</option>
                <option value="US">États-Unis</option>
                <option value="GB">Royaume-Uni</option>
                <option value="DE">Allemagne</option>
                <option value="ES">Espagne</option>
                <option value="IT">Italie</option>
                <option value="NL">Pays-Bas</option>
                <option value="SE">Suède</option>
                <option value="NO">Norvège</option>
                <option value="DK">Danemark</option>
                <option value="FI">Finlande</option>
                <option value="PL">Pologne</option>
                <option value="AT">Autriche</option>
                <option value="CZ">République Tchèque</option>
                <option value="GR">Grèce</option>
                <option value="PT">Portugal</option>
                <option value="IE">Irlande</option>
                <option value="AU">Australie</option>
                <option value="NZ">Nouvelle-Zélande</option>
                <option value="JP">Japon</option>
                <option value="CN">Chine</option>
                <option value="IN">Inde</option>
                <option value="BR">Brésil</option>
                <option value="MX">Mexique</option>
                <option value="ZA">Afrique du Sud</option>
                <option value="SG">Singapour</option>
                <option value="HK">Hong Kong</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 px-6 py-5 text-lg font-semibold text-white shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 mt-8"
            >
              {loading ? 'Création...' : "S'inscrire"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 transition hover:text-emerald-500">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}