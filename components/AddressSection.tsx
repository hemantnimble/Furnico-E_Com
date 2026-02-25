'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Address {
    id: number;
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

interface AddressSectionProps {
    onSelectAddress?: (addressId: number) => void;
}

function Field({ label, id, value, onChange, placeholder }: {
    label: string; id: string; value: string;
    onChange: (v: string) => void; placeholder?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-xs font-medium text-gray-500 uppercase tracking-widest">{label}</label>
            <input
                id={id} value={value} onChange={e => onChange(e.target.value)}
                placeholder={placeholder} required
                className="w-full border-b border-gray-200 pb-2.5 pt-1 text-sm text-gray-900 placeholder:text-gray-300 bg-transparent focus:outline-none focus:border-gray-900 transition-colors duration-200"
            />
        </div>
    );
}

function Modal({ open, onClose, title, children }: {
    open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-fadeInUp">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>
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

const AddressSection: React.FC<AddressSectionProps> = ({ onSelectAddress }) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [editAddressId, setEditAddressId] = useState<number | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    const resetForm = () => { setName(''); setStreet(''); setCity(''); setState(''); setZipCode(''); };

    const fetchAddresses = async () => {
        try {
            const res = await axios.get('/api/user/addresses/get');
            const list: Address[] = res.data.addresses;
            setAddresses(list);
            if (!selectedAddressId && list.length > 0) {
                setSelectedAddressId(list[0].id);
                onSelectAddress?.(list[0].id);
            }
        } catch { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAddresses(); }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('/api/user/addresses/add', { name, street, city, state, zipCode });
        setShowAdd(false); resetForm(); fetchAddresses();
    };

    const handleUpdate = async (addressId: number, e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('/api/user/addresses/update', { name, street, city, state, zip: zipCode, addressId });
        setEditAddressId(null); resetForm(); fetchAddresses();
    };

    const handleDelete = async (addressId: number) => {
        await axios.post('/api/user/addresses/delete', { addressId });
        setDeleteConfirmId(null); fetchAddresses();
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

    if (loading) {
        return (
            <div className="space-y-3">
                {[0, 1].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
            </div>
        );
    }

    return (
        <div>
            {/* Empty state */}
            {addresses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-4 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-900">No saved addresses</p>
                        <p className="text-xs text-gray-400 mt-1">Add one to continue</p>
                    </div>
                    <button onClick={() => { resetForm(); setShowAdd(true); }}
                        className="rounded-full bg-gray-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-gray-700 transition-colors">
                        Add Address
                    </button>
                </div>
            )}

            {/* Address list */}
            <div className="space-y-3">
                {addresses.map((address, i) => {
                    const isSelected = selectedAddressId === address.id;
                    return (
                        <div key={address.id}
                            style={{ animationDelay: `${i * 0.06}s` }}
                            onClick={() => handleSelect(address.id)}
                            className={`relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 animate-fadeInUp
                                ${isSelected ? 'border-gray-900 bg-white' : 'border-gray-100 bg-white hover:border-gray-300'}`}>

                            {/* Selected tick */}
                            {isSelected && (
                                <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                            )}

                            <p className="text-sm font-semibold text-gray-900 pr-8">{address.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{address.street}</p>
                            <p className="text-xs text-gray-500">{address.city}, {address.state} — {address.zipCode}</p>

                            {/* Edit / Delete */}
                            <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                                <button onClick={() => openEdit(address)}
                                    className="rounded-full text-xs font-medium px-3 py-1 border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                    </svg>
                                    Edit
                                </button>
                                <button onClick={() => setDeleteConfirmId(address.id)}
                                    className="rounded-full text-xs font-medium px-3 py-1 border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add another */}
            {addresses.length > 0 && (
                <button onClick={() => { resetForm(); setShowAdd(true); }}
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-3.5 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add another address
                </button>
            )}

            {/* Add Modal */}
            <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Address">
                <form onSubmit={handleAdd} className="space-y-5">
                    <Field label="Full Name" id="name" value={name} onChange={setName} placeholder="John Doe" />
                    <Field label="Street Address" id="street" value={street} onChange={setStreet} placeholder="123 Main St" />
                    <div className="grid grid-cols-2 gap-4">
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

            {/* Edit Modal */}
            <Modal open={editAddressId !== null} onClose={() => { setEditAddressId(null); resetForm(); }} title="Edit Address">
                <form onSubmit={e => handleUpdate(editAddressId!, e)} className="space-y-5">
                    <Field label="Full Name" id="edit-name" value={name} onChange={setName} />
                    <Field label="Street Address" id="edit-street" value={street} onChange={setStreet} />
                    <div className="grid grid-cols-2 gap-4">
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

            {/* Delete confirm */}
            <Modal open={deleteConfirmId !== null} onClose={() => setDeleteConfirmId(null)} title="Remove Address">
                <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove this address? This cannot be undone.</p>
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