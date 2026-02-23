'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/app/lib/store/hooks';
import { addCartItem } from '@/app/lib/store/features/cart/cartSlice';

// ── Types ────────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  rating: number;
  comment: string;
  user?: { name?: string };
  createdAt?: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category?: { name?: string };
  rating?: number;
  reviews?: Review[];
  stock?: number;
  sku?: string;
  dimensions?: string;
  material?: string;
  weight?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function StarRating({ rating, max = 5, size = 'sm' }: { rating: number; max?: number; size?: 'sm' | 'lg' }) {
  const px = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} className={`${px} ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
          viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── 3D Viewer (Three.js via CDN script) ───────────────────────────────────────
function Viewer3D({ productTitle }: { productTitle: string }) {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let renderer: any, animId: number;

    function init(THREE: any) {
      if (!mountRef.current) return;
      const W = mountRef.current.clientWidth;
      const H = mountRef.current.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f5f4);

      // Camera
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      camera.position.set(3, 2.5, 4);
      camera.lookAt(0, 0.5, 0);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W, H);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 8, 5);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.set(1024, 1024);
      scene.add(dirLight);
      const fillLight = new THREE.DirectionalLight(0xfff3e0, 0.4);
      fillLight.position.set(-4, 2, -3);
      scene.add(fillLight);

      // Floor
      const floorGeo = new THREE.PlaneGeometry(12, 12);
      const floorMat = new THREE.MeshStandardMaterial({ color: 0xe8e4de, roughness: 0.9 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // ── Furniture group ──────────────────────────────────────────────────
      const group = new THREE.Group();
      const woodMat  = new THREE.MeshStandardMaterial({ color: 0x8B6343, roughness: 0.7, metalness: 0.05 });
      const darkMat  = new THREE.MeshStandardMaterial({ color: 0x3b2a1a, roughness: 0.6 });
      const cushMat  = new THREE.MeshStandardMaterial({ color: 0xd4b896, roughness: 0.85 });
      const metalMat = new THREE.MeshStandardMaterial({ color: 0xb0a090, roughness: 0.4, metalness: 0.6 });

      // Seat base
      const seatGeo = new THREE.BoxGeometry(2, 0.18, 1.1);
      const seat = new THREE.Mesh(seatGeo, woodMat);
      seat.position.set(0, 0.55, 0);
      seat.castShadow = true;
      group.add(seat);

      // Seat cushion
      const cushGeo = new THREE.BoxGeometry(1.88, 0.16, 1.0);
      const cush = new THREE.Mesh(cushGeo, cushMat);
      cush.position.set(0, 0.72, 0.02);
      cush.castShadow = true;
      group.add(cush);

      // Back rest frame
      const backGeo = new THREE.BoxGeometry(2, 0.9, 0.1);
      const back = new THREE.Mesh(backGeo, woodMat);
      back.position.set(0, 1.1, -0.5);
      back.castShadow = true;
      group.add(back);

      // Back cushion
      const backCushGeo = new THREE.BoxGeometry(1.88, 0.78, 0.1);
      const backCush = new THREE.Mesh(backCushGeo, cushMat);
      backCush.position.set(0, 1.1, -0.44);
      group.add(backCush);

      // Arms
      [[-0.95, 0], [0.95, 0]].forEach(([x]) => {
        const armGeo = new THREE.BoxGeometry(0.1, 0.34, 1.1);
        const arm = new THREE.Mesh(armGeo, woodMat);
        arm.position.set(x, 0.88, 0);
        arm.castShadow = true;
        group.add(arm);
        // arm top cap
        const capGeo = new THREE.BoxGeometry(0.16, 0.06, 1.12);
        const cap = new THREE.Mesh(capGeo, darkMat);
        cap.position.set(x, 1.07, 0);
        group.add(cap);
      });

      // Legs (tapered cylinder)
      [[-0.82, -0.44], [0.82, -0.44], [-0.82, 0.44], [0.82, 0.44]].forEach(([x, z]) => {
        const legGeo = new THREE.CylinderGeometry(0.045, 0.03, 0.56, 8);
        const leg = new THREE.Mesh(legGeo, metalMat);
        leg.position.set(x, 0.27, z);
        leg.castShadow = true;
        group.add(leg);
        // foot pad
        const padGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.03, 8);
        const pad = new THREE.Mesh(padGeo, darkMat);
        pad.position.set(x, 0.015, z);
        group.add(pad);
      });

      // Back legs (support to back rest)
      [[-0.82], [0.82]].forEach(([x]) => {
        const supportGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8);
        const support = new THREE.Mesh(supportGeo, metalMat);
        support.position.set(x, 1.06, -0.44);
        support.castShadow = true;
        group.add(support);
      });

      scene.add(group);

      // ── Drag-to-rotate ────────────────────────────────────────────────────
      let isDragging = false, prevX = 0, rotY = 0.3;

      const onDown = (e: MouseEvent | TouchEvent) => {
        isDragging = true;
        prevX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      };
      const onUp = () => { isDragging = false; };
      const onMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        rotY += (x - prevX) * 0.012;
        prevX = x;
      };

      renderer.domElement.addEventListener('mousedown', onDown);
      renderer.domElement.addEventListener('touchstart', onDown);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove);

      // ── Animate ────────────────────────────────────────────────────────────
      const clock = new THREE.Clock();
      function animate() {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        if (!isDragging) rotY += 0.004;
        group.rotation.y = rotY;
        // gentle float
        group.position.y = Math.sin(t * 0.6) * 0.03;
        renderer.render(scene, camera);
      }
      animate();
      setLoaded(true);

      // Cleanup stored on ref
      (mountRef.current as any).__cleanup = () => {
        cancelAnimationFrame(animId);
        renderer.domElement.removeEventListener('mousedown', onDown);
        renderer.domElement.removeEventListener('touchstart', onDown);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchend', onUp);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        renderer.dispose();
        if (mountRef.current) mountRef.current.innerHTML = '';
      };
    }

    // Load Three.js from CDN
    if ((window as any).THREE) {
      init((window as any).THREE);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => init((window as any).THREE);
      document.head.appendChild(script);
    }

    return () => {
      if (mountRef.current && (mountRef.current as any).__cleanup) {
        (mountRef.current as any).__cleanup();
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-gray-100">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          {[0,1,2].map(i => (
            <span key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}
      {loaded && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] text-gray-500">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
          </svg>
          Drag to rotate
        </div>
      )}
    </div>
  );
}


export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [view3D, setView3D] = useState(false);

  // Fetch product
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch('/api/products/getsingleproduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (!res.ok || !data.product) {
          toast.error('Product not found');
          setLoading(false);
          return;
        }
        setProduct(data.product);
        // fetch related
        try {
          const rel = await fetch(`/api/products?limit=4`);
          const relData = await rel.json();
          setRelatedProducts((relData.products || relData).filter((p: Product) => p.id !== id).slice(0, 4));
        } catch {
          // related products are non-critical, ignore errors
        }
      } catch {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await dispatch(addCartItem(product.id)).unwrap();
      toast.success('Added to cart!');
    } catch {
      toast.error('Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl bg-gray-100" />
              <div className="grid grid-cols-4 gap-2">
                {[0,1,2,3].map(i => <div key={i} className="aspect-square rounded-xl bg-gray-100" />)}
              </div>
            </div>
            <div className="space-y-4 pt-4">
              <div className="h-4 bg-gray-100 rounded w-24" />
              <div className="h-8 bg-gray-100 rounded w-3/4" />
              <div className="h-6 bg-gray-100 rounded w-1/3" />
              <div className="h-24 bg-gray-100 rounded" />
              <div className="h-12 bg-gray-100 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500 text-lg">Product not found.</p>
        <Link href="/" className="text-sm underline text-gray-800">Back to home</Link>
      </div>
    );
  }

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : product.rating || 0;

  // ── Specs (use real fields if present, fallback to display sample) ──────────
  const specs = [
    { label: 'SKU', value: product.sku || `FRN-${product.id.slice(0, 6).toUpperCase()}` },
    { label: 'Material', value: product.material || 'Premium Wood & Metal' },
    { label: 'Dimensions', value: product.dimensions || '80 × 45 × 90 cm' },
    { label: 'Weight', value: product.weight || '18 kg' },
    { label: 'Category', value: product.category?.name || 'Furniture' },
    { label: 'In Stock', value: product.stock != null ? `${product.stock} units` : 'Available' },
  ];

  const features = [
    'Crafted from sustainably sourced materials',
    'Easy assembly with included hardware',
    '5-year manufacturer warranty',
    'Available for free returns within 30 days',
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-700 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[160px]">{product.title}</span>
        </nav>
      </div>

      {/* ── Main product area ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">

          {/* ── Image Gallery ── */}
          <div className="space-y-3">

            {/* 2D / 3D toggle pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setView3D(false)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                    ${!view3D ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Photos
                </button>
                <button
                  onClick={() => setView3D(true)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                    ${view3D ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                  View in 3D
                </button>
              </div>
              {view3D && (
                <span className="text-[10px] tracking-widest text-gray-400 uppercase animate-fadeIn">
                  Interactive
                </span>
              )}
            </div>

            {/* Main viewer — conditionally 2D or 3D */}
            {view3D ? (
              <Viewer3D productTitle={product.title} />
            ) : (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                <img
                  key={activeImage}
                  src={product.images[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-opacity duration-300 animate-fadeIn"
                />
                {/* Badge */}
                {product.stock != null && product.stock < 10 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
                    Low Stock
                  </span>
                )}
                {/* Nav arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage(i => Math.max(i - 1, 0))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-600 hover:bg-white transition-colors disabled:opacity-30"
                      disabled={activeImage === 0}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActiveImage(i => Math.min(i + 1, product.images.length - 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-600 hover:bg-white transition-colors disabled:opacity-30"
                      disabled={activeImage === product.images.length - 1}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Thumbnails — only in photo mode */}
            {!view3D && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2.5">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200
                      ${i === activeImage ? 'border-gray-900 shadow-sm' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col gap-5 lg:pt-2">

            {/* Category tag */}
            <div>
              <span className="inline-block text-[10px] tracking-widest text-gray-400 uppercase border border-gray-200 rounded-full px-3 py-1">
                {product.category?.name || 'Furniture'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 flex-wrap">
              <StarRating rating={avgRating} size="lg" />
              <span className="text-sm text-gray-500">
                {avgRating.toFixed(1)} ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{(Number(product.price) * 1.15).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                15% OFF
              </span>
            </div>

            <div className="border-t border-gray-100" />

            {/* Short description */}
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Feature list */}
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100" />

            {/* Quantity + CTA */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Qty stepper */}
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg"
                >−</button>
                <span className="w-10 text-center text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg"
                >+</button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 min-w-[180px] flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white text-sm font-semibold py-3 hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                {addingToCart ? (
                  <span className="flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              {/* Wishlist */}
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200 transition-colors">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', label: 'Secure Pay' },
                { icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z', label: 'Free Returns' },
                { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: 'Free Delivery' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 border border-gray-100">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                  <span className="text-[10px] text-gray-500 font-medium tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <div className="flex gap-1 mb-8 bg-gray-100 rounded-full p-1 w-fit">
            {(['description', 'specs', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200
                  ${activeTab === tab
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'}`}
              >
                {tab === 'reviews' ? `Reviews (${product.reviews?.length || 0})` : tab}
              </button>
            ))}
          </div>

          {/* Description tab */}
          {activeTab === 'description' && (
            <div className="max-w-3xl animate-fadeIn">
              <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Design', body: 'Each piece is carefully designed to blend form with function, ensuring it fits seamlessly into any modern living space.' },
                  { title: 'Quality', body: 'We source only the finest materials, subjecting every product to rigorous quality testing before it reaches your home.' },
                  { title: 'Sustainability', body: 'Our materials are ethically sourced from sustainable forests, certified by recognized environmental bodies.' },
                  { title: 'Warranty', body: 'All Furnico products come with a 5-year structural warranty and 1-year finish warranty for complete peace of mind.' },
                ].map(({ title, body }) => (
                  <div key={title} className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1.5">{title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specs tab */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl animate-fadeIn">
              <div className="rounded-2xl overflow-hidden border border-gray-100">
                {specs.map(({ label, value }, i) => (
                  <div
                    key={label}
                    className={`grid grid-cols-2 gap-4 px-5 py-3.5 text-sm
                      ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <span className="font-medium text-gray-500">{label}</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div className="max-w-3xl animate-fadeIn space-y-5">
              {/* Summary */}
              <div className="flex items-center gap-6 rounded-2xl bg-gray-50 border border-gray-100 p-6">
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-gray-900">{avgRating.toFixed(1)}</p>
                  <StarRating rating={avgRating} size="sm" />
                  <p className="text-xs text-gray-400 mt-1">{product.reviews?.length || 0} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map(star => {
                    const count = product.reviews?.filter(r => r.rating === star).length || 0;
                    const pct = product.reviews?.length ? (count / product.reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-4 text-right">{star}</span>
                        <svg className="w-3 h-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          {review.user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                          {review.createdAt && (
                            <p className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pl-11">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-sm">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                <p className="text-sm text-gray-400 mt-1">You might also like</p>
              </div>
              <Link href="/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p, i) => (
                <Link key={p.id} href={`/product/${p.id}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                  className="group block rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-200 animate-fadeInUp">
                  <div className="aspect-square overflow-hidden bg-gray-100 relative">
                    <img src={p.images?.[0]} alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {/* Cart icon overlay */}
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-bold text-gray-900">₹{Number(p.price).toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-400">{(p.rating || 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn    { animation: fadeIn 0.3s ease both; }
        .animate-fadeInUp  { animation: fadeInUp 0.35s ease both; }
      `}</style>
    </div>
  );
}