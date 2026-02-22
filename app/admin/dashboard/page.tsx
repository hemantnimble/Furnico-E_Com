"use client"
import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { MoreHorizontal, Search, ShoppingBag, ShoppingCart, Users, Package, IndianRupee, Menu, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { signOut } from "next-auth/react"
import { fetchProducts, deleteProduct } from '@/app/lib/store/features/products/productSlice';
import { useAppDispatch, useAppSelector } from '@/app/lib/store/hooks';

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  images: string[],
}
interface Orders {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  order: {
    id: string;
    userId: string;
    paymentIntentId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: {
      name: string
    }
  };
  product: {
    id: string,
    title: string,
    price: number,
    category: string,
    images: string[],
    stock: number,
  }
}
export default function Component() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);
  const category = "All";
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stock, setStock] = useState<number | string>('');
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Orders[]>([])
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);

  const handleSignout = async () => {
    try {
      await signOut();
      alert('Signed out successfully');
    } catch (err) {
      console.error('Error signing out: ', err);
      alert('Error signing out');
    }
  };
  const fetchProductss = async () => {
    try {
      const response = await axios.get<{ products: Product[] }>("/api/products/getproducts")
      setProducts(response.data.products)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ orders: Orders[] }>("/api/admin/orders/get")
      setOrders(response.data.orders);
      calculateTotalRevenue(response.data.orders);
      calculateUniqueUsers(response.data.orders);
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    // fetchProducts();
    if (items.length === 0) {
      dispatch(fetchProducts(category));
    }

    fetchOrders();
  }, [items.length, dispatch])

  const updateProduct = async (id: string) => {

    try {
      await axios.put("/api/admin/product/updatestock", { id, stock });
      alert("Stock updated");
      fetchProductss();
    } catch (error: any) {
      alert("Error updating stock.");
    }
  };

  const deleteProductt = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        dispatch(deleteProduct(id))
        // await axios.post("/api/products/delete", { id });
        alert("Product deleted");
        // fetchProductss();
      } catch (error: any) {
        alert("Error deleting product.");
      }
    }
  };

  const calculateTotalRevenue = (orders: Orders[]) => {
    const total = orders.reduce((acc: number, order) => acc + order.product.price, 0);
    setTotalRevenue(total);
  };

  function calculateUniqueUsers(orders: Orders[]) {
    const uniqueUsers = new Set();
    orders.forEach(order => {
      uniqueUsers.add(order.order.userId);
    });
    setTotalCustomers(uniqueUsers.size);
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.post("/api/orders/status", { orderId, status: newStatus });
      alert("Order status updated");
      fetchOrders(); // Refetch the orders to get the updated list
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating status");
    }
  };


  const data = [
    {
      name: "Jan",
      total: orders.reduce((acc: number, order) => acc + order.product.price, 0),
    },
    {
      name: "Feb",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Mar",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Apr",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "May",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Jun",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
  ]
  // console.log(orders)
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <button onClick={handleSignout} className="Btn ml-2">
                  <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg></div>
                  <div className="text">Logout</div>
                </button>
              </TabsList>
              <TabsContent value="dashboard">
                <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Revenue
                      </CardTitle>
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₹ {loading ? "loading..." : totalRevenue}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        New Customers
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalCustomers}</div>
                      <p className="text-xs text-muted-foreground">
                        +180.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sales</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+12,234</div>
                      <p className="text-xs text-muted-foreground">
                        +19% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Now
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+573</div>
                      <p className="text-xs text-muted-foreground">
                        +201 since last hour
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Chart */}
                {/* <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                          <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div> */}

                {/* Recent Orders */}
                <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>
                        You have {orders.length} orders this month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead >Amount</TableHead>
                            <TableHead >Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.product.title}</TableCell>
                              <TableCell >{order.order.user.name} </TableCell>
                              <TableCell>
                                ₹ {order.product.price}
                              </TableCell>
                              <TableCell>
                                <form className="max-w-sm mx-auto">
                                  <select
                                    id="status"
                                    className={`w-28 bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
        ${order.order.status.toLowerCase() === 'delivered' ? 'text-green-600' : ''}
        ${order.order.status.toLowerCase() === 'pending' ? 'text-blue-600' : ''}
        ${order.order.status.toLowerCase() === 'cancelled' ? 'text-red-600' : ''}`}
                                    onChange={(e) => handleStatusChange(order.order.id, e.target.value.toUpperCase())}
                                  >
                                    <option value={order.order.status.toLowerCase()}>
                                      {order.order.status.toLowerCase()}
                                    </option>
                                    {["delivered", "pending", "cancelled"]
                                      .filter((status) => status !== order.order.status.toLowerCase()) // Filter out the current status
                                      .map((status) => (
                                        <option key={status} value={status}>
                                          {status}
                                        </option>
                                      ))}
                                  </select>
                                </form>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="products">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-gray-700 text-3xl font-medium">Products</h3>
                  <Link href="/admin/add">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add New Product
                    </Button>
                  </Link>
                </div>
                <Card>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.title}</TableCell>
                            <TableCell>₹{product.price}</TableCell>
                            <TableCell>
                              {product.stock}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {/* <Dialog>
                                  <DialogTrigger asChild>
                                    
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit Product</DialogTitle>
                                      <DialogDescription>
                                        Make changes to the product here. Click save when you are done.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-name" className="text-right">
                                          Name
                                        </Label>
                                        <Input id="edit-name" className="col-span-3" />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-price" className="text-right">
                                          Price
                                        </Label>
                                        <Input id="edit-price" type="number" className="col-span-3" />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-stock" className="text-right">
                                          Stock
                                        </Label>
                                        <Input id="edit-stock" type="number" className="col-span-3" />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button type="submit">Save Changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog> */}
                                <Link href={`/admin/updateproduct/${product.id}`}>
                                  <Button variant="outline" size="sm" >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => deleteProductt(product.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      Stock
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Update Stock</DialogTitle>
                                      <DialogDescription>
                                        Adjust the stock level for this product.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="stock-update" className="text-right">
                                          New Stock Level
                                        </Label>
                                        <Input onChange={(e: any) => setStock(e.target.value)} id="stock-update" type="number" className="col-span-3" />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button onClick={() => updateProduct(product.id)}>Update Stock</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}