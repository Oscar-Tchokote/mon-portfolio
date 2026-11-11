import {
    BarChart, Bot, Cloud, Code, Database, Layout, Palette, Rocket, Server, Shield, ShoppingCart, Smartphone, Truck, Wrench,
} from 'lucide-react';

const icons = {
    code: Code,
    smartphone: Smartphone,
    server: Server,
    palette: Palette,
    'shopping-cart': ShoppingCart,
    rocket: Rocket,
    database: Database,
    cloud: Cloud,
    shield: Shield,
    'bar-chart': BarChart,
    layout: Layout,
    wrench: Wrench,
    bot: Bot,
    truck: Truck,
};

export default function ServiceIcon({ name, className = 'h-5 w-5' }) {
    const Icon = icons[name] ?? Code;

    return <Icon className={className} strokeWidth={1.75} />;
}
