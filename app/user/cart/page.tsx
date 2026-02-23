'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/app/lib/store/hooks';
import { fetchCartItems, removeCartItem, updateCartItem } from '@/app/lib/store/features/cart/cartSlice';

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cartItems, status } = useAppSelector((state) => state.cart);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchCartItems());
  }, [dispatch, status]);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const price = typeof item.product?.price === 'string'
        ? parseFloat(item.product.price)
        : item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  async function handleDelete(cartItemId: string) {
    setRemovingId(cartItemId);
    try {
      await dispatch(removeCartItem(cartItemId)).unwrap();
      toast.success('Item removed from cart');
    } catch {
      toast.error('Error removing item');
    } finally {
      setRemovingId(null);
    }
  }

  const handleQuantityChange = async (productId: string, increment: boolean) => {
    const item = cartItems.find((i) => i.product.id === productId);
    if (!item) return;
    const newQuantity = increment ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
    try {
      await dispatch(updateCartItem({ id: item.id, quantity: newQuantity })).unwrap();
      toast.success('Quantity updated');
    } catch {
      toast.error('Error updating quantity');
    }
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <span key={i} className="w-2.5 h-2.5 rounded-full bg-gray-800 animate-bounce"
              style={{ animationDelay: `${i*0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'succeeded' && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm">Looks like you haven't added anything yet.</p>
        </div>
        <Link href="/"
          className="rounded-full bg-gray-900 text-white text-sm font-medium px-7 py-3 hover:bg-gray-700 transition-colors flex items-center gap-2">
          Shop Now
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    );
  }

  const shipping = 8;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-400 text-sm mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          <div className="mt-5 border-b border-gray-200" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Items ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Column labels */}
            <div className="hidden sm:grid grid-cols-12 text-xs font-medium text-gray-400 uppercase tracking-widest pb-2">
              <span className="col-span-6">Product</span>
              <span className="col-span-3 text-center">Quantity</span>
              <span className="col-span-3 text-right">Total</span>
            </div>

            {cartItems.map((item, i) => (
              <div key={item.id}
                style={{ animationDelay: `${i * 0.07}s` }}
                className={`
                  grid grid-cols-12 items-center gap-4 py-5 border-b border-gray-100
                  transition-all duration-300
                  ${removingId === item.id ? 'opacity-30 scale-[0.98]' : 'opacity-100'}
                  animate-fadeInUp
                `}>

                {/* Product info */}
                <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                  <Link href={`/product/${item.product.id}`}
                    className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 block">
                    <img
                      src={item.product?.images?.[0]}
                      alt={item.product?.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">Furniture</p>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight truncate max-w-[180px]">
                      {item.product?.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">₹{Number(item.product?.price).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-6 sm:col-span-3 flex items-center justify-start sm:justify-center">
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
                    <button onClick={() => handleQuantityChange(item.product.id, false)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-base">
                      −
                    </button>
                    <span className="w-7 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.product.id, true)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-base">
                      +
                    </button>
                  </div>
                </div>

                {/* Total + Remove */}
                <div className="col-span-6 sm:col-span-3 flex items-center justify-end gap-3">
                  <span className="font-bold text-gray-900 text-sm sm:text-base">
                    ₹{(Number(item.product?.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                  <button onClick={() => handleDelete(item.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                    aria-label="Remove">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <div className="pt-4">
              <Link href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24 border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-5 tracking-wide">Order Summary</h2>

              <div className="space-y-2.5 mb-5">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center gap-2 text-sm">
                    <span className="text-gray-500 truncate flex-1">
                      {item.product?.title?.slice(0, 20)}{item.product?.title?.length > 20 ? '…' : ''}
                      <span className="text-gray-400 ml-1">×{item.quantity}</span>
                    </span>
                    <span className="text-gray-700 font-medium shrink-0">
                      ₹{(Number(item.product?.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-800 font-medium">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery</span>
                  <span className="text-gray-800 font-medium">₹{shipping}.00</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-3 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-gray-900">
                  ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <Link href="/user/checkout"
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white text-sm font-semibold py-3.5 hover:bg-gray-700 transition-colors">
                Proceed to Checkout
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Trust row */}
              <div className="mt-5 flex items-center justify-center gap-5">
                {[
                  { label: 'Secure', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                  { label: 'Free Returns', icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-1.5 4 1.5 4-1.5 4 1.5z' },
                ].map(({ label, icon }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.3s ease both; }
      `}</style>
    </div>
  );
}