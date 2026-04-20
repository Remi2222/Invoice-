import { useEffect, useState } from 'react';
import { invoicesService, clientsService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [form, setForm] = useState({
    clientId: '',
    dueDate: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    poNumber: '',
    paymentTerms: 'À réception de facture',
    currency: 'MAD',
    logo: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }]
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invRes, cliRes] = await Promise.all([invoicesService.getAll(), clientsService.getAll()]);
      setInvoices(invRes.data);
      setClients(cliRes.data);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        console.error('Error loading data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'UNPAID':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const handleEdit = (invoice: any) => {
    setEditingInvoice(invoice);
    setForm({
      clientId: invoice.clientId,
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
      invoiceDate: invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      poNumber: invoice.poNumber || '',
      paymentTerms: invoice.paymentTerms || 'À réception de facture',
      currency: invoice.currency || 'MAD',
      logo: invoice.logo || '',
      items: invoice.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      clientId: '',
      dueDate: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      poNumber: '',
      paymentTerms: 'À réception de facture',
      currency: 'MAD',
      logo: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }]
    });
    setEditingInvoice(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const updateItem = (index: number, field: string, value: any) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInvoice) {
        // Mode édition
        await invoicesService.update(editingInvoice.id, form);
      } else {
        // Mode création
        await invoicesService.create(form);
      }
      resetForm();
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Erreur lors de la sauvegarde de la facture');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setForm({ ...form, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    await invoicesService.updateStatus(id, status);
    loadData();
  };

  const handlePdf = async (id: string, number: string) => {
    const res = await invoicesService.downloadPdf(id);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${number}.pdf`;
    a.click();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette facture ?')) {
      await invoicesService.delete(id);
      loadData();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Factures</h2>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            + Nouvelle facture
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-6">
              {editingInvoice ? 'Modifier la facture' : 'Nouvelle facture'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Logo Section - Top Left */}
              <div className="flex gap-6 mb-6">
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                    {form.logo ? (
                      <img src={form.logo} alt="Logo preview" className="h-full w-full object-contain p-2" />
                    ) : (
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V16a4 4 0 00-4-4h-8l-4-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="20" cy="24" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M40 32l-6.5-6.5-12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-xs text-gray-500 mt-2">Ajouter logo</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="mt-2 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>

                {/* Other top fields */}
                <div className="flex-grow grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                    <select
                      value={form.clientId}
                      onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de facture</label>
                    <input
                      type="date"
                      value={form.invoiceDate}
                      onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">À payer avant le</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MAD">MAD (Dirham)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="USD">USD (Dollar)</option>
                    <option value="GBP">GBP (Livre)</option>
                    <option value="CHF">CHF (Franc)</option>
                    <option value="CAD">CAD (Dollar canadien)</option>
                    <option value="AUD">AUD (Dollar australien)</option>
                    <option value="JPY">JPY (Yen)</option>
                    <option value="CNY">CNY (Yuan)</option>
                    <option value="INR">INR (Roupie)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bon de commande</label>
                  <input
                    type="text"
                    value={form.poNumber}
                    onChange={(e) => setForm({ ...form, poNumber: e.target.value })}
                    placeholder="Ex: BC-2024-001"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modalités de paiement</label>
                  <input
                    type="text"
                    value={form.paymentTerms}
                    onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
                    placeholder="Ex: À réception de facture"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prestations</label>
                {form.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(i, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={item.quantity}
                        onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire</label>
                      <input
                        type="number"
                        placeholder={`Prix unitaire (${form.currency})`}
                        value={item.unitPrice}
                        onChange={(e) => updateItem(i, 'unitPrice', parseFloat(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addItem} className="text-blue-600 text-sm hover:underline">
                  + Ajouter une prestation
                </button>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
                  {editingInvoice ? 'Modifier la facture' : 'Créer la facture'}
                </button>
                <button type="button" onClick={handleCancel} className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-50">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
{loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="divide-y divide-gray-100">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{inv.number}</p>
                    <p className="text-sm text-gray-500">{inv.client.name} · {new Date(inv.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{inv.total.toLocaleString('fr-FR')} MAD</p>
                    <select
                      value={inv.status}
                      onChange={(e) => handleStatus(inv.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${getStatusClass(inv.status)}`}
                    >
                      <option value="UNPAID">UNPAID</option>
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                    <button onClick={() => handleEdit(inv)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
                      Éditer
                    </button>
                    <button onClick={() => handlePdf(inv.id, inv.number)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                      Télécharger
                    </button>
                    <button onClick={() => handleDelete(inv.id)} className="text-red-500 hover:text-red-700 text-sm">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
              {invoices.length === 0 && (
                <p className="p-6 text-gray-400 text-center">Aucune facture pour le moment</p>
              )}
            </div>
          </div>
        )}
    </div>
  );
}