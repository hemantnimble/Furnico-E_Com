'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface AddressSectionProps {
  onSelectAddress?: (addressId: number) => void;
}

// ── Reusable input ────────────────────────────────────────────────────────────
function Field({
  label, id, value, onChange, placeholder
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      <input
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
      />
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-fadeInUp">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const AddressSection: React.FC<AddressSectionProps> = ({ onSelectAddress }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Form state
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Modal state
  const [showAdd, setShowAdd] = useState(false);
  const [editAddressId, setEditAddressId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const resetForm = () => { setName(''); setStreet(''); setCity(''); setState(''); setZipCode(''); };

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg); setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get('/api/user/addresses/get');
      const list: Address[] = res.data.addresses;
      setAddresses(list);
      if (!selectedAddressId && list.length > 0) {
        setSelectedAddressId(list[0].id);
        onSelectAddress?.(list[0].id);
      }
    } catch {
      notify('Failed to load addresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/user/addresses/add', { name, street, city, state, zipCode });
      notify('Address added successfully');
      setShowAdd(false); resetForm(); fetchAddresses();
    } catch { notify('Failed to add address', 'error'); }
  };

  const handleUpdate = async (addressId: number, e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/user/addresses/update', { name, street, city, state, zip: zipCode, addressId });
      notify('Address updated');
      setEditAddressId(null); resetForm(); fetchAddresses();
    } catch { notify('Failed to update address', 'error'); }
  };

  const handleDelete = async (addressId: number) => {
    try {
      await axios.post('/api/user/addresses/delete', { addressId });
      notify('Address removed');
      setDeleteConfirmId(null); fetchAddresses();
    } catch { notify('Failed to delete address', 'error'); }
  };

  const openEdit = (address: Address) => {
    setEditAddressId(address.id);
    setName(address.name); setStreet(address.street);
    setCity(address.city); setState(address.state); setZipCode(address.zipCode);
  };

  const handleSelect = (id: number) => {
    setSelectedAddressId(id);
    onSelectAddress?.(id);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
          {[0,1].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <Link href="/user/account"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Account
          </Link>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">Delivery</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Saved Addresses</h1>
            <button
              onClick={() => { resetForm(); setShowAdd(true); }}
              className="flex items-center gap-2 rounded-full bg-gray-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-gray-700 transition-colors shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add New
            </button>
          </div>
          <div className="mt-4 border-b border-gray-200" />
        </div>

        {/* ── Toast ── */}
        {message && (
          <div className={`flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm mb-5 animate-fadeIn
            ${messageType === 'success' ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-600'}`}>
            {messageType === 'success'
              ? <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              : <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            }
            {message}
          </div>
        )}

        {/* ── Empty ── */}
        {addresses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">No addresses saved yet</p>
              <p className="text-sm text-gray-400 mt-1">Add an address to speed up checkout.</p>
            </div>
            <button onClick={() => { resetForm(); setShowAdd(true); }}
              className="rounded-full bg-gray-900 text-white text-sm font-medium px-6 py-2.5 hover:bg-gray-700 transition-colors">
              Add Address
            </button>
          </div>
        )}

        {/* ── Address cards ── */}
        <div className="space-y-3">
          {addresses.map((address, i) => {
            const isSelected = selectedAddressId === address.id;
            return (
              <div key={address.id}
                style={{ animationDelay: `${i * 0.07}s` }}
                className={`relative rounded-2xl border-2 transition-all duration-200 animate-fadeInUp
                  ${isSelected ? 'border-gray-900 bg-white' : 'border-gray-100 bg-white hover:border-gray-200'}`}>

                {/* Selected tick */}
                {isSelected && (
                  <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}

                <div className="p-5">
                  {/* Name + address */}
                  <p className="font-semibold text-gray-900 text-sm pr-8">{address.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{address.street}</p>
                  <p className="text-sm text-gray-500">{address.city}, {address.state} — {address.zipCode}</p>

                  {/* Actions row */}
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {/* Deliver here */}
                    <button
                      onClick={() => handleSelect(address.id)}
                      disabled={isSelected}
                      className={`rounded-full text-xs font-semibold px-4 py-1.5 transition-colors
                        ${isSelected
                          ? 'bg-gray-900 text-white cursor-default'
                          : 'border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900'}`}
                    >
                      {isSelected ? 'Delivering Here' : 'Deliver Here'}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEdit(address)}
                      className="rounded-full text-xs font-medium px-4 py-1.5 border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmId(address.id)}
                      className="rounded-full text-xs font-medium px-4 py-1.5 border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom Add button (when addresses exist) ── */}
        {addresses.length > 0 && (
          <button
            onClick={() => { resetForm(); setShowAdd(true); }}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-4 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add another address
          </button>
        )}
      </div>

      {/* ── Add Modal ── */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Address">
        <form onSubmit={handleAdd} className="space-y-4">
          <Field label="Full Name" id="name" value={name} onChange={setName} placeholder="John Doe" />
          <Field label="Street Address" id="street" value={street} onChange={setStreet} placeholder="123 Main St" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" id="city" value={city} onChange={setCity} placeholder="Mumbai" />
            <Field label="State" id="state" value={state} onChange={setState} placeholder="Maharashtra" />
          </div>
          <Field label="ZIP Code" id="zip" value={zipCode} onChange={setZipCode} placeholder="400001" />
          <button type="submit"
            className="w-full rounded-full bg-gray-900 text-white text-sm font-semibold py-3 hover:bg-gray-700 transition-colors mt-2">
            Save Address
          </button>
        </form>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal
        open={editAddressId !== null}
        onClose={() => { setEditAddressId(null); resetForm(); }}
        title="Edit Address">
        <form onSubmit={e => handleUpdate(editAddressId!, e)} className="space-y-4">
          <Field label="Full Name" id="edit-name" value={name} onChange={setName} />
          <Field label="Street Address" id="edit-street" value={street} onChange={setStreet} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" id="edit-city" value={city} onChange={setCity} />
            <Field label="State" id="edit-state" value={state} onChange={setState} />
          </div>
          <Field label="ZIP Code" id="edit-zip" value={zipCode} onChange={setZipCode} />
          <button type="submit"
            className="w-full rounded-full bg-gray-900 text-white text-sm font-semibold py-3 hover:bg-gray-700 transition-colors mt-2">
            Update Address
          </button>
        </form>
      </Modal>

      {/* ── Delete confirm modal ── */}
      <Modal
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Remove Address">
        <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove this address? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirmId(null)}
            className="flex-1 rounded-full border border-gray-200 text-sm font-medium text-gray-600 py-2.5 hover:border-gray-400 transition-colors">
            Cancel
          </button>
          <button onClick={() => handleDelete(deleteConfirmId!)}
            className="flex-1 rounded-full bg-red-500 text-white text-sm font-semibold py-2.5 hover:bg-red-600 transition-colors">
            Remove
          </button>
        </div>
      </Modal>

      <style>{`
        @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeInUp  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadeIn      { animation: fadeIn 0.2s ease both }
        .animate-fadeInUp    { animation: fadeInUp 0.3s ease both }
      `}</style>
    </div>
  );
};

export default AddressSection;