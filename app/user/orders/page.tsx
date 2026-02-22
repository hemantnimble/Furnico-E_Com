'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: string;
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  status: string;  // Assuming the order has a 'status' field
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/get`);
        setOrders(response.data.orders);
      } catch (error) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Link className="flex gap-1 items-center mt-5 hover:gap-2 transition-all text-gray-600" href='/user/account'>
          <ArrowLeftCircle />
          <h1 className="text-xl">Go Back</h1>
        </Link>
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        {loading && (
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                <span className="visually-hidden">.</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center text-gray-500">
            No orders found.
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-muted text-muted-foreground">
                    <th className="px-4 py-3 text-left">Order #</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Items</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="border-b hover:bg-muted/50 cursor-pointer">
                        <td className="px-4 py-3">{order.id}</td>
                        <td className="px-4 py-3">{new Date(order.createdAt).toISOString().split('T')[0]}</td>
                        <td className="px-4 py-3">
                          {order.items.map((item) => (
                            <div key={item.id}>{item.product.title} (x{item.quantity})</div>
                          ))}
                        </td>
                        <td className="px-4 py-3 text-right">
                          ₹{(order.items.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0)).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">{order.status}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
