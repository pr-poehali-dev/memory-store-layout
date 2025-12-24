import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  capacity: string;
  speed: string;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'DDR4 Kingston Fury HyperX',
    price: 8990,
    capacity: '32GB (1x32GB)',
    speed: '3200MHz',
    image: 'https://cdn.poehali.dev/files/Kingston-Fury-Beast-32GB-2x16GB-3200MHz-DDR4-CL16-DIMM-Pamiec-RAM.jpeg',
    category: 'gaming'
  },
  {
    id: 2,
    name: 'Corsair Vengeance RGB PRO',
    price: 12490,
    capacity: '32GB',
    speed: '3600MHz',
    image: 'https://cdn.poehali.dev/projects/026eed3a-a70c-42ac-801c-708b59a84280/files/7de4b992-2d16-442a-af17-fccad070f59e.jpg',
    category: 'gaming'
  },
  {
    id: 3,
    name: 'Kingston ValueRAM',
    price: 3490,
    capacity: '8GB',
    speed: '2666MHz',
    image: 'https://cdn.poehali.dev/projects/026eed3a-a70c-42ac-801c-708b59a84280/files/825f830b-340c-43d9-b535-f9aa7fe47d54.jpg',
    category: 'office'
  },
  {
    id: 4,
    name: 'Crucial Office Memory',
    price: 5990,
    capacity: '16GB',
    speed: '2666MHz',
    image: 'https://cdn.poehali.dev/projects/026eed3a-a70c-42ac-801c-708b59a84280/files/825f830b-340c-43d9-b535-f9aa7fe47d54.jpg',
    category: 'office'
  },
  {
    id: 5,
    name: 'Samsung ECC Registered',
    price: 24990,
    capacity: '32GB',
    speed: '2933MHz',
    image: 'https://cdn.poehali.dev/projects/026eed3a-a70c-42ac-801c-708b59a84280/files/9423c50b-62fb-4e91-9cbb-9142d5f3e279.jpg',
    category: 'server'
  },
  {
    id: 6,
    name: 'Kingston Server Premier',
    price: 18990,
    capacity: '16GB',
    speed: '2666MHz',
    image: 'https://cdn.poehali.dev/projects/026eed3a-a70c-42ac-801c-708b59a84280/files/9423c50b-62fb-4e91-9cbb-9142d5f3e279.jpg',
    category: 'server'
  }
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: 'Товар добавлен в корзину',
      description: product.name,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Заполните обязательные поля',
        description: 'Имя и телефон обязательны для оформления заказа',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Заказ оформлен!',
      description: `Спасибо, ${formData.name}! Мы свяжемся с вами по телефону ${formData.phone}`,
    });
    setCart([]);
    setCheckoutOpen(false);
    setFormData({ name: '', phone: '', email: '' });
  };

  const scrollToCatalog = () => {
    const element = document.getElementById('catalog');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderCategory = (title: string, category: string) => {
    const categoryProducts = products.filter(p => p.category === category);
    return (
      <div className="mb-16">
        <h2 className="text-3xl font-heading font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in">
              <CardHeader className="p-0">
                <div className="aspect-square overflow-hidden bg-secondary/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full hover:scale-105 transition-transform duration-300 object-contain"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl font-heading mb-2">{product.name}</CardTitle>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary">{product.capacity}</Badge>
                  <Badge variant="secondary">{product.speed}</Badge>
                </div>
                <p className="text-3xl font-heading font-bold text-[#000000]">10000 Rub</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={() => addToCart(product)}
                  className="w-full group"
                  size="lg"
                >
                  <Icon name="ShoppingCart" className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                  В корзину
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Cpu" className="text-primary" size={32} />
            <h1 className="text-2xl font-heading font-bold">MemoryShop</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={scrollToCatalog} variant="default" size="lg">
              <Icon name="Grid3x3" className="mr-2" size={20} />
              В каталог
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg" className="relative">
                  <Icon name="ShoppingBag" size={24} />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-heading">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 opacity-20" />
                      <p>Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="flex gap-4 p-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-heading font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.capacity} • {item.speed}
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Icon name="Minus" size={16} />
                                </Button>
                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Icon name="Plus" size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-auto text-destructive"
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-heading font-bold text-lg">
                                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between text-lg font-heading font-bold">
                          <span>Итого:</span>
                          <span className="text-primary text-2xl">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <Button
                          onClick={() => setCheckoutOpen(true)}
                          className="w-full"
                          size="lg"
                        >
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <section className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4 animate-fade-in">
            Память для любых задач
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Игровая, офисная и серверная память от проверенных производителей
          </p>
        </section>

        <section id="catalog">
          {renderCategory('Игровая память', 'gaming')}
          {renderCategory('Офисная память', 'office')}
          {renderCategory('Серверная память', 'server')}
        </section>
      </main>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">Оформление заказа</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Иван Иванов"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@mail.ru"
              />
            </div>
            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Товаров:</span>
                <span>{totalItems} шт.</span>
              </div>
              <div className="flex justify-between font-heading font-bold text-lg">
                <span>Итого:</span>
                <span className="text-primary">{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCheckout} className="w-full" size="lg">
              Подтвердить заказ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;