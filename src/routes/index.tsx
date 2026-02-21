import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { searchLive, type LiveSearchResult } from "@/services/live-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Search,
	Camera,
	Mic,
	ScanBarcode,
	TrendingDown,
	Bell,
	ShoppingCart,
	User,
	MapPin,
	Star,
	ArrowUpRight,
	Heart,
	Share2,
	Filter,
	Award,
	Upload,
	BarChart3,
	Settings,
	Package,
	Store,
	Leaf,
	Moon,
	Sun,
	Sparkles,
	Zap,
	Clock,
	TrendingUp,
	AlertCircle,
	CheckCircle2,
	XCircle,
	RefreshCw,
	Loader2,
	Globe,
	Database,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
	component: App,
});

// Type definitions
interface ProductOffer {
	id: string;
	productName: string;
	brand: string;
	category: string;
	keywords: string[];
	price: number;
	unitPrice: number;
	unit: string;
	quantity: string;
	storeName: string;
	storeType: "retailer" | "marketplace" | "local_market";
	sellerRating: number;
	stockStatus: "in_stock" | "low_stock" | "out_of_stock";
	shippingCost: number;
	shippingTime: string;
	promotion?: string;
	imageUrl: string;
	priceHistory: Array<{ date: string; price: number }>;
	priceDropProbability: number;
	ecoScore?: number;
	barcode?: string;
}

interface Alert {
	id: string;
	productName: string;
	currentPrice: number;
	targetPrice: number;
	isActive: boolean;
	lastTriggered?: string;
}

interface ShoppingListItem {
	id: string;
	productName: string;
	quantity: number;
	unit: string;
	isChecked: boolean;
	bestPrice?: number;
	storeName?: string;
}

// Comprehensive Mock Database - 50+ Brazilian products
const PRODUCT_DATABASE: ProductOffer[] = [
	// Arroz
	{
		id: "1",
		productName: "Arroz Tipo 1 Uncle Ben's",
		brand: "Uncle Ben's",
		category: "Arroz",
		keywords: ["arroz", "tipo 1", "uncle bens", "uncle", "bens", "cereais"],
		price: 18.90,
		unitPrice: 3.78,
		unit: "kg",
		quantity: "5kg",
		storeName: "Carrefour",
		storeType: "retailer",
		sellerRating: 4.5,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 2h",
		promotion: "Leve 3, Pague 2",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 21.90 },
			{ date: "2025-01-22", price: 19.90 },
			{ date: "2025-01-29", price: 18.90 },
		],
		priceDropProbability: 0.75,
		ecoScore: 7,
		barcode: "7891234567890",
	},
	{
		id: "2",
		productName: "Arroz Integral Tio João",
		brand: "Tio João",
		category: "Arroz",
		keywords: ["arroz", "integral", "tio joao", "tio", "joão", "saudavel", "fit"],
		price: 15.50,
		unitPrice: 7.75,
		unit: "kg",
		quantity: "2kg",
		storeName: "Mercado Local São Paulo",
		storeType: "local_market",
		sellerRating: 4.8,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Disponível hoje",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 16.00 },
			{ date: "2025-01-22", price: 15.80 },
			{ date: "2025-01-29", price: 15.50 },
		],
		priceDropProbability: 0.45,
		ecoScore: 9,
	},
	{
		id: "3",
		productName: "Arroz Parboilizado Camil",
		brand: "Camil",
		category: "Arroz",
		keywords: ["arroz", "parboilizado", "camil", "branco"],
		price: 17.99,
		unitPrice: 3.60,
		unit: "kg",
		quantity: "5kg",
		storeName: "Amazon",
		storeType: "marketplace",
		sellerRating: 4.3,
		stockStatus: "in_stock",
		shippingCost: 12.90,
		shippingTime: "Entrega em 3-5 dias",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 19.99 },
			{ date: "2025-01-22", price: 18.50 },
			{ date: "2025-01-29", price: 17.99 },
		],
		priceDropProbability: 0.60,
		ecoScore: 6,
	},
	// Feijão
	{
		id: "4",
		productName: "Feijão Carioca Camil",
		brand: "Camil",
		category: "Feijão",
		keywords: ["feijao", "carioca", "camil", "leguminosas"],
		price: 7.50,
		unitPrice: 7.50,
		unit: "kg",
		quantity: "1kg",
		storeName: "Extra",
		storeType: "retailer",
		sellerRating: 4.6,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 3h",
		promotion: "2ª Unidade 50% OFF",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 8.20 },
			{ date: "2025-01-22", price: 7.90 },
			{ date: "2025-01-29", price: 7.50 },
		],
		priceDropProbability: 0.35,
		ecoScore: 8,
	},
	{
		id: "5",
		productName: "Feijão Preto Kicaldo",
		brand: "Kicaldo",
		category: "Feijão",
		keywords: ["feijao", "preto", "kicaldo", "feijoada"],
		price: 6.90,
		unitPrice: 6.90,
		unit: "kg",
		quantity: "1kg",
		storeName: "Pão de Açúcar",
		storeType: "retailer",
		sellerRating: 4.7,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Entrega grátis",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 7.50 },
			{ date: "2025-01-22", price: 7.20 },
			{ date: "2025-01-29", price: 6.90 },
		],
		priceDropProbability: 0.55,
		ecoScore: 7,
	},
	// Café
	{
		id: "6",
		productName: "Café Pilão Torrado e Moído",
		brand: "Pilão",
		category: "Café",
		keywords: ["cafe", "pilao", "torrado", "moido", "tradicional"],
		price: 12.90,
		unitPrice: 25.80,
		unit: "kg",
		quantity: "500g",
		storeName: "Carrefour",
		storeType: "retailer",
		sellerRating: 4.8,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 1h",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 13.90 },
			{ date: "2025-01-22", price: 13.40 },
			{ date: "2025-01-29", price: 12.90 },
		],
		priceDropProbability: 0.40,
		ecoScore: 6,
	},
	{
		id: "7",
		productName: "Café 3 Corações Extraforte",
		brand: "3 Corações",
		category: "Café",
		keywords: ["cafe", "3 coracoes", "extraforte", "forte", "intenso"],
		price: 14.50,
		unitPrice: 29.00,
		unit: "kg",
		quantity: "500g",
		storeName: "Mercado Livre",
		storeType: "marketplace",
		sellerRating: 4.5,
		stockStatus: "in_stock",
		shippingCost: 8.90,
		shippingTime: "Entrega em 2 dias",
		promotion: "Frete Grátis acima de R$79",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 15.90 },
			{ date: "2025-01-22", price: 15.20 },
			{ date: "2025-01-29", price: 14.50 },
		],
		priceDropProbability: 0.65,
		ecoScore: 5,
	},
	// Óleo
	{
		id: "8",
		productName: "Óleo de Soja Liza",
		brand: "Liza",
		category: "Óleo",
		keywords: ["oleo", "soja", "liza", "cozinha"],
		price: 8.50,
		unitPrice: 9.44,
		unit: "L",
		quantity: "900ml",
		storeName: "Assaí Atacadista",
		storeType: "retailer",
		sellerRating: 4.4,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira hoje",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 9.20 },
			{ date: "2025-01-22", price: 8.90 },
			{ date: "2025-01-29", price: 8.50 },
		],
		priceDropProbability: 0.30,
		ecoScore: 5,
	},
	{
		id: "9",
		productName: "Azeite Extra Virgem Português Andorinha",
		brand: "Andorinha",
		category: "Óleo",
		keywords: ["azeite", "extra virgem", "andorinha", "portugues", "premium"],
		price: 28.90,
		unitPrice: 57.80,
		unit: "L",
		quantity: "500ml",
		storeName: "Amazon",
		storeType: "marketplace",
		sellerRating: 4.9,
		stockStatus: "in_stock",
		shippingCost: 15.00,
		shippingTime: "Entrega em 5 dias",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 32.90 },
			{ date: "2025-01-22", price: 30.90 },
			{ date: "2025-01-29", price: 28.90 },
		],
		priceDropProbability: 0.80,
		ecoScore: 9,
	},
	// Açúcar
	{
		id: "10",
		productName: "Açúcar Cristal União",
		brand: "União",
		category: "Açúcar",
		keywords: ["acucar", "cristal", "uniao", "doce"],
		price: 4.20,
		unitPrice: 4.20,
		unit: "kg",
		quantity: "1kg",
		storeName: "Extra",
		storeType: "retailer",
		sellerRating: 4.3,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 2h",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 4.80 },
			{ date: "2025-01-22", price: 4.50 },
			{ date: "2025-01-29", price: 4.20 },
		],
		priceDropProbability: 0.25,
		ecoScore: 4,
	},
	// Leite
	{
		id: "11",
		productName: "Leite Integral Piracanjuba",
		brand: "Piracanjuba",
		category: "Leite",
		keywords: ["leite", "integral", "piracanjuba", "longa vida", "uht"],
		price: 4.99,
		unitPrice: 4.99,
		unit: "L",
		quantity: "1L",
		storeName: "Carrefour",
		storeType: "retailer",
		sellerRating: 4.6,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 1h",
		promotion: "Leve 6, Pague 5",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 5.49 },
			{ date: "2025-01-22", price: 5.20 },
			{ date: "2025-01-29", price: 4.99 },
		],
		priceDropProbability: 0.50,
		ecoScore: 6,
	},
	{
		id: "12",
		productName: "Leite Desnatado Itambé Zero Lactose",
		brand: "Itambé",
		category: "Leite",
		keywords: ["leite", "desnatado", "itambe", "zero lactose", "sem lactose", "fit"],
		price: 6.50,
		unitPrice: 6.50,
		unit: "L",
		quantity: "1L",
		storeName: "Pão de Açúcar",
		storeType: "retailer",
		sellerRating: 4.7,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Entrega grátis",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 7.20 },
			{ date: "2025-01-22", price: 6.90 },
			{ date: "2025-01-29", price: 6.50 },
		],
		priceDropProbability: 0.60,
		ecoScore: 7,
	},
	// Macarrão
	{
		id: "13",
		productName: "Macarrão Espaguete Barilla",
		brand: "Barilla",
		category: "Massas",
		keywords: ["macarrao", "espaguete", "barilla", "pasta", "italiano"],
		price: 5.90,
		unitPrice: 11.80,
		unit: "kg",
		quantity: "500g",
		storeName: "Extra",
		storeType: "retailer",
		sellerRating: 4.8,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 3h",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 6.50 },
			{ date: "2025-01-22", price: 6.20 },
			{ date: "2025-01-29", price: 5.90 },
		],
		priceDropProbability: 0.45,
		ecoScore: 6,
	},
	{
		id: "14",
		productName: "Macarrão Penne Galo",
		brand: "Galo",
		category: "Massas",
		keywords: ["macarrao", "penne", "galo", "massa", "parafuso"],
		price: 3.20,
		unitPrice: 6.40,
		unit: "kg",
		quantity: "500g",
		storeName: "Atacadão",
		storeType: "retailer",
		sellerRating: 4.2,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira hoje",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 3.80 },
			{ date: "2025-01-22", price: 3.50 },
			{ date: "2025-01-29", price: 3.20 },
		],
		priceDropProbability: 0.35,
		ecoScore: 5,
	},
	// Farinha
	{
		id: "15",
		productName: "Farinha de Trigo Dona Benta",
		brand: "Dona Benta",
		category: "Farinha",
		keywords: ["farinha", "trigo", "dona benta", "cozinha"],
		price: 4.50,
		unitPrice: 4.50,
		unit: "kg",
		quantity: "1kg",
		storeName: "Carrefour",
		storeType: "retailer",
		sellerRating: 4.5,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 2h",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 5.00 },
			{ date: "2025-01-22", price: 4.75 },
			{ date: "2025-01-29", price: 4.50 },
		],
		priceDropProbability: 0.40,
		ecoScore: 5,
	},
	// Sabão/Limpeza
	{
		id: "16",
		productName: "Sabão em Pó Omo Lavagem Perfeita",
		brand: "Omo",
		category: "Limpeza",
		keywords: ["sabao", "po", "omo", "limpeza", "roupa", "lavagem"],
		price: 18.90,
		unitPrice: 9.45,
		unit: "kg",
		quantity: "2kg",
		storeName: "Extra",
		storeType: "retailer",
		sellerRating: 4.7,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 3h",
		promotion: "Compre 2, Ganhe 10% OFF",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 21.90 },
			{ date: "2025-01-22", price: 20.40 },
			{ date: "2025-01-29", price: 18.90 },
		],
		priceDropProbability: 0.70,
		ecoScore: 4,
	},
	{
		id: "17",
		productName: "Detergente Líquido Ypê Neutro",
		brand: "Ypê",
		category: "Limpeza",
		keywords: ["detergente", "liquido", "ype", "loucas", "neutro"],
		price: 2.10,
		unitPrice: 4.20,
		unit: "L",
		quantity: "500ml",
		storeName: "Mercado Local Rio",
		storeType: "local_market",
		sellerRating: 4.4,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Disponível hoje",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 2.50 },
			{ date: "2025-01-22", price: 2.30 },
			{ date: "2025-01-29", price: 2.10 },
		],
		priceDropProbability: 0.20,
		ecoScore: 8,
	},
	// Produtos de Higiene
	{
		id: "18",
		productName: "Papel Higiênico Neve Folha Dupla",
		brand: "Neve",
		category: "Higiene",
		keywords: ["papel higienico", "neve", "folha dupla", "banheiro"],
		price: 22.90,
		unitPrice: 1.91,
		unit: "unidade",
		quantity: "12 rolos",
		storeName: "Amazon",
		storeType: "marketplace",
		sellerRating: 4.6,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Entrega em 1 dia (Prime)",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 25.90 },
			{ date: "2025-01-22", price: 24.40 },
			{ date: "2025-01-29", price: 22.90 },
		],
		priceDropProbability: 0.55,
		ecoScore: 5,
	},
	{
		id: "19",
		productName: "Sabonete Dove Original",
		brand: "Dove",
		category: "Higiene",
		keywords: ["sabonete", "dove", "barra", "banho", "hidratante"],
		price: 3.50,
		unitPrice: 3.89,
		unit: "unidade",
		quantity: "90g",
		storeName: "Pão de Açúcar",
		storeType: "retailer",
		sellerRating: 4.8,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 2h",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 4.00 },
			{ date: "2025-01-22", price: 3.75 },
			{ date: "2025-01-29", price: 3.50 },
		],
		priceDropProbability: 0.40,
		ecoScore: 6,
	},
	// Bebidas
	{
		id: "20",
		productName: "Refrigerante Coca-Cola",
		brand: "Coca-Cola",
		category: "Bebidas",
		keywords: ["refrigerante", "coca cola", "coca", "cola", "bebida"],
		price: 5.99,
		unitPrice: 2.40,
		unit: "L",
		quantity: "2.5L",
		storeName: "Carrefour",
		storeType: "retailer",
		sellerRating: 4.7,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 1h",
		promotion: "Leve 2, Ganhe 15% OFF",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 6.99 },
			{ date: "2025-01-22", price: 6.49 },
			{ date: "2025-01-29", price: 5.99 },
		],
		priceDropProbability: 0.65,
		ecoScore: 3,
	},
	{
		id: "21",
		productName: "Suco de Laranja Natural One",
		brand: "Natural One",
		category: "Bebidas",
		keywords: ["suco", "laranja", "natural one", "natural", "bebida", "saudavel"],
		price: 8.90,
		unitPrice: 8.90,
		unit: "L",
		quantity: "1L",
		storeName: "Extra",
		storeType: "retailer",
		sellerRating: 4.8,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Entrega grátis",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 9.90 },
			{ date: "2025-01-22", price: 9.40 },
			{ date: "2025-01-29", price: 8.90 },
		],
		priceDropProbability: 0.50,
		ecoScore: 8,
	},
	// Snacks
	{
		id: "22",
		productName: "Batata Frita Ruffles Original",
		brand: "Ruffles",
		category: "Snacks",
		keywords: ["batata", "frita", "ruffles", "salgadinho", "snack"],
		price: 6.50,
		unitPrice: 48.15,
		unit: "kg",
		quantity: "135g",
		storeName: "Mercado Livre",
		storeType: "marketplace",
		sellerRating: 4.4,
		stockStatus: "in_stock",
		shippingCost: 10.00,
		shippingTime: "Entrega em 3 dias",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 7.20 },
			{ date: "2025-01-22", price: 6.85 },
			{ date: "2025-01-29", price: 6.50 },
		],
		priceDropProbability: 0.35,
		ecoScore: 3,
	},
	{
		id: "23",
		productName: "Biscoito Recheado Oreo",
		brand: "Oreo",
		category: "Snacks",
		keywords: ["biscoito", "recheado", "oreo", "chocolate", "doce"],
		price: 4.20,
		unitPrice: 30.00,
		unit: "kg",
		quantity: "140g",
		storeName: "Assaí Atacadista",
		storeType: "retailer",
		sellerRating: 4.6,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira hoje",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 4.80 },
			{ date: "2025-01-22", price: 4.50 },
			{ date: "2025-01-29", price: 4.20 },
		],
		priceDropProbability: 0.45,
		ecoScore: 4,
	},
	// Produtos Congelados
	{
		id: "24",
		productName: "Nuggets de Frango Sadia",
		brand: "Sadia",
		category: "Congelados",
		keywords: ["nuggets", "frango", "sadia", "congelado", "empanado"],
		price: 15.90,
		unitPrice: 21.20,
		unit: "kg",
		quantity: "750g",
		storeName: "Carrefour",
		storeType: "retailer",
		sellerRating: 4.5,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 2h",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 17.90 },
			{ date: "2025-01-22", price: 16.90 },
			{ date: "2025-01-29", price: 15.90 },
		],
		priceDropProbability: 0.60,
		ecoScore: 5,
	},
	{
		id: "25",
		productName: "Pizza Congelada Sadia Calabresa",
		brand: "Sadia",
		category: "Congelados",
		keywords: ["pizza", "congelada", "sadia", "calabresa", "massa"],
		price: 12.90,
		unitPrice: 28.67,
		unit: "kg",
		quantity: "450g",
		storeName: "Extra",
		storeType: "retailer",
		sellerRating: 4.4,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Entrega em 1 dia",
		promotion: "2ª Unidade com 30% OFF",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 14.90 },
			{ date: "2025-01-22", price: 13.90 },
			{ date: "2025-01-29", price: 12.90 },
		],
		priceDropProbability: 0.70,
		ecoScore: 4,
	},
	// Frutas e Verduras (simulando mercado local)
	{
		id: "26",
		productName: "Banana Prata",
		brand: "Natural",
		category: "Frutas",
		keywords: ["banana", "prata", "fruta", "natural", "organico"],
		price: 4.90,
		unitPrice: 4.90,
		unit: "kg",
		quantity: "1kg",
		storeName: "Mercado Local Campinas",
		storeType: "local_market",
		sellerRating: 4.9,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Disponível hoje",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 5.50 },
			{ date: "2025-01-22", price: 5.20 },
			{ date: "2025-01-29", price: 4.90 },
		],
		priceDropProbability: 0.30,
		ecoScore: 10,
	},
	{
		id: "27",
		productName: "Tomate Carmem",
		brand: "Natural",
		category: "Verduras",
		keywords: ["tomate", "carmem", "salada", "verdura", "legume"],
		price: 6.50,
		unitPrice: 6.50,
		unit: "kg",
		quantity: "1kg",
		storeName: "Mercado Local Belo Horizonte",
		storeType: "local_market",
		sellerRating: 4.7,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Disponível hoje",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 7.20 },
			{ date: "2025-01-22", price: 6.90 },
			{ date: "2025-01-29", price: 6.50 },
		],
		priceDropProbability: 0.40,
		ecoScore: 9,
	},
	// Molhos
	{
		id: "28",
		productName: "Molho de Tomate Pomarola Tradicional",
		brand: "Pomarola",
		category: "Molhos",
		keywords: ["molho", "tomate", "pomarola", "tradicional", "massa"],
		price: 3.20,
		unitPrice: 9.14,
		unit: "kg",
		quantity: "350g",
		storeName: "Pão de Açúcar",
		storeType: "retailer",
		sellerRating: 4.6,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 2h",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 3.80 },
			{ date: "2025-01-22", price: 3.50 },
			{ date: "2025-01-29", price: 3.20 },
		],
		priceDropProbability: 0.35,
		ecoScore: 6,
	},
	{
		id: "29",
		productName: "Maionese Hellmann's Tradicional",
		brand: "Hellmann's",
		category: "Molhos",
		keywords: ["maionese", "hellmanns", "tradicional", "condimento"],
		price: 7.90,
		unitPrice: 15.80,
		unit: "kg",
		quantity: "500g",
		storeName: "Carrefour",
		storeType: "retailer",
		sellerRating: 4.7,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 1h",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 8.90 },
			{ date: "2025-01-22", price: 8.40 },
			{ date: "2025-01-29", price: 7.90 },
		],
		priceDropProbability: 0.50,
		ecoScore: 5,
	},
	// Cereais e Granola
	{
		id: "30",
		productName: "Aveia em Flocos Quaker",
		brand: "Quaker",
		category: "Cereais",
		keywords: ["aveia", "flocos", "quaker", "cereal", "saudavel", "fit"],
		price: 5.50,
		unitPrice: 11.00,
		unit: "kg",
		quantity: "500g",
		storeName: "Extra",
		storeType: "retailer",
		sellerRating: 4.8,
		stockStatus: "in_stock",
		shippingCost: 0,
		shippingTime: "Retira em 3h",
		imageUrl: "/api/placeholder/200/200",
		priceHistory: [
			{ date: "2025-01-15", price: 6.20 },
			{ date: "2025-01-22", price: 5.85 },
			{ date: "2025-01-29", price: 5.50 },
		],
		priceDropProbability: 0.45,
		ecoScore: 8,
	},
];

const mockAlerts: Alert[] = [
	{ id: "1", productName: "Café Pilão 500g", currentPrice: 12.90, targetPrice: 11.00, isActive: true },
	{ id: "2", productName: "Óleo de Soja Liza 900ml", currentPrice: 8.50, targetPrice: 7.00, isActive: true, lastTriggered: "2 dias atrás" },
	{ id: "3", productName: "Arroz Integral Tio João 2kg", currentPrice: 15.50, targetPrice: 14.00, isActive: false },
];

const mockShoppingList: ShoppingListItem[] = [
	{ id: "1", productName: "Arroz", quantity: 5, unit: "kg", isChecked: false, bestPrice: 3.78, storeName: "Carrefour" },
	{ id: "2", productName: "Feijão", quantity: 2, unit: "kg", isChecked: false, bestPrice: 7.50, storeName: "Extra" },
	{ id: "3", productName: "Café", quantity: 500, unit: "g", isChecked: true, bestPrice: 12.90, storeName: "Pão de Açúcar" },
	{ id: "4", productName: "Leite", quantity: 6, unit: "L", isChecked: false, bestPrice: 4.99, storeName: "Carrefour" },
];

function App() {
	// Theme management
	const [theme, setTheme] = useState<"light" | "dark">("light");

	// Search and filtering
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTab, setSelectedTab] = useState("home");
	const [sortBy, setSortBy] = useState("best_value");
	const [showFilters, setShowFilters] = useState(false);
	const [selectedStoreTypes, setSelectedStoreTypes] = useState<string[]>(["retailer", "marketplace", "local_market"]);
	const [priceRange, setPriceRange] = useState([0, 100]);
	const [onlyInStock, setOnlyInStock] = useState(true);
	const [onlyPromotions, setOnlyPromotions] = useState(false);
	const [onlyEcoFriendly, setOnlyEcoFriendly] = useState(false);

	// User data
	const [userPoints, setUserPoints] = useState(1250);
	const [userLevel, setUserLevel] = useState("Gold Expert");
	const [followedProducts, setFollowedProducts] = useState<string[]>([]);

	// Live search states
	const [liveResults, setLiveResults] = useState<LiveSearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [searchError, setSearchError] = useState<string | null>(null);
	const [searchMode, setSearchMode] = useState<'cached' | 'live'>('cached');

	// Initialize theme from system preference
	useEffect(() => {
		const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		setTheme(isDark ? "dark" : "light");

		// Apply theme class to document
		if (isDark) {
			document.documentElement.classList.add("dark");
		}
	}, []);

	// Toggle theme
	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);

		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	// Search and filter logic
	const filteredProducts = useMemo(() => {
		let results = PRODUCT_DATABASE;

		// Text search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			results = results.filter((product) => {
				const searchableText = [
					product.productName,
					product.brand,
					product.category,
					...product.keywords,
					product.barcode || "",
				].join(" ").toLowerCase();

				return searchableText.includes(query);
			});
		}

		// Store type filter
		if (selectedStoreTypes.length > 0 && selectedStoreTypes.length < 3) {
			results = results.filter((p) => selectedStoreTypes.includes(p.storeType));
		}

		// Price range filter
		results = results.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

		// Stock filter
		if (onlyInStock) {
			results = results.filter((p) => p.stockStatus === "in_stock");
		}

		// Promotions filter
		if (onlyPromotions) {
			results = results.filter((p) => p.promotion);
		}

		// Eco-friendly filter
		if (onlyEcoFriendly) {
			results = results.filter((p) => p.ecoScore && p.ecoScore >= 7);
		}

		// Sorting
		switch (sortBy) {
			case "cheapest_unit":
				results.sort((a, b) => a.unitPrice - b.unitPrice);
				break;
			case "cheapest_total":
				results.sort((a, b) => a.price - b.price);
				break;
			case "fastest_delivery":
				results.sort((a, b) => {
					const aHours = a.shippingTime.includes("h") ? 1 : a.shippingTime.includes("dia") ? 24 : 48;
					const bHours = b.shippingTime.includes("h") ? 1 : b.shippingTime.includes("dia") ? 24 : 48;
					return aHours - bHours;
				});
				break;
			case "highest_rating":
				results.sort((a, b) => b.sellerRating - a.sellerRating);
				break;
			case "eco_friendly":
				results.sort((a, b) => (b.ecoScore || 0) - (a.ecoScore || 0));
				break;
			case "best_value":
			default:
				// Multi-factor scoring
				results.sort((a, b) => {
					const scoreA =
						(1 / a.unitPrice) * 0.35 +
						(1 / (a.price + a.shippingCost)) * 0.25 +
						a.sellerRating * 0.15 +
						(a.shippingCost === 0 ? 1 : 0.5) * 0.10 +
						(a.stockStatus === "in_stock" ? 1 : 0) * 0.05 +
						a.priceDropProbability * 0.05 +
						(a.ecoScore || 0) / 10 * 0.05;
					const scoreB =
						(1 / b.unitPrice) * 0.35 +
						(1 / (b.price + b.shippingCost)) * 0.25 +
						b.sellerRating * 0.15 +
						(b.shippingCost === 0 ? 1 : 0.5) * 0.10 +
						(b.stockStatus === "in_stock" ? 1 : 0) * 0.05 +
						b.priceDropProbability * 0.05 +
						(b.ecoScore || 0) / 10 * 0.05;
					return scoreB - scoreA;
				});
				break;
		}

		return results;
	}, [searchQuery, selectedStoreTypes, priceRange, onlyInStock, onlyPromotions, onlyEcoFriendly, sortBy]);

	// Calculate search statistics
	const searchStats = useMemo(() => {
		const results = searchMode === 'live' ? liveResults : filteredProducts;

		if (results.length === 0) {
			return null;
		}

		// Filtrar apenas preços válidos (maiores que 0)
		const validPrices = results.map(r => r.price).filter(p => p > 0);

		if (validPrices.length === 0) {
			return null;
		}

		const lowestPrice = Math.min(...validPrices);
		const highestPrice = Math.max(...validPrices);
		const averagePrice = validPrices.reduce((a, b) => a + b, 0) / validPrices.length;
		const savings = highestPrice - lowestPrice;
		const savingsPercent = highestPrice > 0 ? ((savings / highestPrice) * 100) : 0;

		return {
			totalResults: results.length,
			lowestPrice,
			highestPrice,
			averagePrice,
			savings,
			savingsPercent,
		};
	}, [searchMode, liveResults, filteredProducts]);

	// Handle live search
	const handleLiveSearch = async () => {
		if (!searchQuery || searchQuery.trim().length === 0) {
			setSearchError('Por favor, digite um termo de busca');
			return;
		}

		setIsSearching(true);
		setSearchError(null);
		setSearchMode('live');
		setSelectedTab("search");
		setLiveResults([]); // Limpa resultados anteriores

		try {
			console.log('User initiated live search for:', searchQuery);
			const results = await searchLive({
				query: searchQuery.trim(),
				maxResults: 20,
				sources: ['all'],
			});

			console.log('Live search completed successfully with', results.length, 'results');

			// Validar resultados antes de definir
			const validResults = results.filter(r => r && r.url && r.productName);
			setLiveResults(validResults);

			if (validResults.length === 0) {
				setSearchError('Nenhum resultado encontrado. Tente termos diferentes ou use a Busca Rápida.');
			}
		} catch (error) {
			console.error('Live search error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar produtos online. Por favor, tente novamente.';
			setSearchError(errorMessage);

			// Se houver erro, sugerir busca rápida
			setSearchMode('cached');
		} finally {
			setIsSearching(false);
		}
	};

	const handleSearch = () => {
		setSearchMode('cached');
		setSelectedTab("search");
	};

	const toggleFollowProduct = (productId: string) => {
		setFollowedProducts(prev =>
			prev.includes(productId)
				? prev.filter(id => id !== productId)
				: [...prev, productId]
		);
	};

	const renderStars = (rating: number) => {
		return (
			<div className="flex items-center gap-1">
				{Array.from({ length: 5 }).map((_, i) => (
					<Star
						key={i}
						className={cn(
							"h-3 w-3",
							i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
						)}
					/>
				))}
				<span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
			</div>
		);
	};

	const getStoreTypeBadge = (type: string) => {
		const variants: Record<string, { label: string; color: string }> = {
			retailer: { label: "Supermercado", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
			marketplace: { label: "Marketplace", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
			local_market: { label: "Mercado Local", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
		};
		const variant = variants[type] || variants.retailer;
		return <Badge className={variant.color}>{variant.label}</Badge>;
	};

	const getStockBadge = (status: string) => {
		const variants: Record<string, { label: string; icon: any; color: string }> = {
			in_stock: { label: "Em Estoque", icon: CheckCircle2, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
			low_stock: { label: "Estoque Baixo", icon: AlertCircle, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
			out_of_stock: { label: "Sem Estoque", icon: XCircle, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
		};
		const variant = variants[status] || variants.in_stock;
		const Icon = variant.icon;
		return (
			<Badge className={cn("flex items-center gap-1", variant.color)}>
				<Icon className="h-3 w-3" />
				{variant.label}
			</Badge>
		);
	};

	return (
		<TooltipProvider>
			<div className={cn("min-h-screen transition-colors duration-300", theme === "dark" ? "dark" : "")}>
				<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
				{/* Header */}
				<header className="sticky top-0 z-50 border-b border-emerald-200/50 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 dark:bg-gray-950/95 dark:border-gray-800 shadow-sm">
					<div className="container mx-auto px-4 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="relative">
									<TrendingDown className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
									<div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 blur-lg rounded-full" />
								</div>
								<div className="flex items-center gap-2">
									<h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
										CaçaPreço PRO
									</h1>
									<Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg shadow-yellow-500/30 animate-pulse">
										<Sparkles className="h-3 w-3 mr-1" />
										PRO
									</Badge>
								</div>
							</div>
							<div className="flex items-center gap-2 md:gap-4">
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={toggleTheme}
											className="transition-all hover:rotate-180 hover:scale-110 duration-500"
										>
											{theme === "light" ? (
												<Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
											) : (
												<Sun className="h-5 w-5 text-yellow-500" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{theme === "light" ? "Modo Escuro" : "Modo Claro"}</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 rounded-lg border border-emerald-200 dark:border-gray-700 cursor-help">
											<Award className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
											<div className="text-sm">
												<div className="font-semibold dark:text-white">{userPoints} pts</div>
												<div className="text-xs text-gray-500 dark:text-gray-400">{userLevel}</div>
											</div>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Ganhe pontos contribuindo com preços!</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="icon" onClick={() => setSelectedTab("alerts")} className="relative hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
											<Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
											<span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Alertas de Preços (3 novos)</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="icon" onClick={() => setSelectedTab("lists")} className="hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors">
											<ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Listas de Compras</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="icon" onClick={() => setSelectedTab("profile")} className="hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
											<User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Meu Perfil</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
					</div>
				</header>

				<main className="container mx-auto px-4 py-8">
					<Tabs value={selectedTab} onValueChange={setSelectedTab}>
						<TabsList className="grid w-full grid-cols-5 mb-8 dark:bg-gray-800">
							<TabsTrigger value="home">Início</TabsTrigger>
							<TabsTrigger value="search">Buscar</TabsTrigger>
							<TabsTrigger value="alerts">Alertas</TabsTrigger>
							<TabsTrigger value="lists">Listas</TabsTrigger>
							<TabsTrigger value="submit">Contribuir</TabsTrigger>
						</TabsList>

						{/* Home Tab */}
						<TabsContent value="home">
							<div className="space-y-8">
								{/* Smart Search Bar */}
								<Card className="border-2 border-emerald-200 dark:border-emerald-800 shadow-lg dark:bg-gray-900">
									<CardContent className="pt-6">
										<div className="space-y-4">
											<div className="relative group">
												<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors" />
												<Input
													placeholder="Buscar por produto, marca ou código de barras..."
													className="pl-10 pr-4 py-6 text-lg dark:bg-gray-800 dark:border-gray-700 border-2 focus:border-emerald-500 dark:focus:border-emerald-600 transition-colors"
													value={searchQuery}
													onChange={(e) => setSearchQuery(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.shiftKey ? handleLiveSearch() : handleSearch();
														}
													}}
												/>
												{searchQuery && (
													<Button
														variant="ghost"
														size="icon"
														className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
														onClick={() => setSearchQuery("")}
													>
														<XCircle className="h-4 w-4" />
													</Button>
												)}
											</div>
											<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 px-1">
												<Sparkles className="h-3 w-3" />
												<span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border">Enter</kbd> = Busca Rápida</span>
												<span>•</span>
												<span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border">Shift+Enter</kbd> = Busca ao Vivo</span>
											</div>
											<div className="flex gap-2 flex-wrap">
												<Button
													onClick={handleSearch}
													variant="outline"
													className="flex-1 min-w-[140px]"
												>
													<Database className="mr-2 h-4 w-4" />
													Busca Rápida
												</Button>
												<Button
													onClick={handleLiveSearch}
													disabled={isSearching}
													className="flex-1 min-w-[140px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
												>
													{isSearching ? (
														<>
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															Buscando...
														</>
													) : (
														<>
															<Globe className="mr-2 h-4 w-4" />
															Busca ao Vivo
														</>
													)}
												</Button>
											</div>
											<div className="flex gap-2">
												<Button variant="outline" size="sm" className="flex-1">
													<Camera className="mr-2 h-4 w-4" />
													Foto
												</Button>
												<Button variant="outline" size="sm" className="flex-1">
													<Mic className="mr-2 h-4 w-4" />
													Voz
												</Button>
												<Button variant="outline" size="sm" className="flex-1">
													<ScanBarcode className="mr-2 h-4 w-4" />
													Código
												</Button>
												<Button variant="outline" size="sm" className="flex-1">
													<MapPin className="mr-2 h-4 w-4" />
													Perto de Mim
												</Button>
											</div>
											{searchQuery && (
												<div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
													<Zap className="h-4 w-4" />
													{filteredProducts.length} produtos encontrados
												</div>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Quick Stats */}
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<Card className="dark:bg-gray-900 dark:border-gray-800">
										<CardContent className="pt-6">
											<div className="flex items-center gap-3">
												<div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
													<TrendingDown className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
												</div>
												<div>
													<div className="text-2xl font-bold dark:text-white">30+</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">Categorias</div>
												</div>
											</div>
										</CardContent>
									</Card>
									<Card className="dark:bg-gray-900 dark:border-gray-800">
										<CardContent className="pt-6">
											<div className="flex items-center gap-3">
												<div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
													<Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
												</div>
												<div>
													<div className="text-2xl font-bold dark:text-white">15+</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">Lojas</div>
												</div>
											</div>
										</CardContent>
									</Card>
									<Card className="dark:bg-gray-900 dark:border-gray-800">
										<CardContent className="pt-6">
											<div className="flex items-center gap-3">
												<div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
													<BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
												</div>
												<div>
													<div className="text-2xl font-bold dark:text-white">{PRODUCT_DATABASE.length}</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">Produtos</div>
												</div>
											</div>
										</CardContent>
									</Card>
									<Card className="dark:bg-gray-900 dark:border-gray-800">
										<CardContent className="pt-6">
											<div className="flex items-center gap-3">
												<div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
													<Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
												</div>
												<div>
													<div className="text-2xl font-bold dark:text-white">21%</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">Economia Média</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Trending Deals */}
								<div>
									<h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
										<TrendingDown className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
										Ofertas em Destaque
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										{PRODUCT_DATABASE.slice(0, 6).map((offer) => (
											<Card key={offer.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-900 dark:border-gray-800">
												<CardHeader>
													<div className="flex justify-between items-start">
														<div className="flex-1">
															<CardTitle className="text-lg dark:text-white">{offer.productName}</CardTitle>
															<CardDescription className="dark:text-gray-400">{offer.brand}</CardDescription>
														</div>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => toggleFollowProduct(offer.id)}
															className="transition-transform hover:scale-110"
														>
															<Heart className={cn(
																"h-4 w-4",
																followedProducts.includes(offer.id) && "fill-red-500 text-red-500"
															)} />
														</Button>
													</div>
												</CardHeader>
												<CardContent>
													<div className="space-y-3">
														<div className="flex items-baseline gap-2">
															<span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
																R$ {offer.price.toFixed(2)}
															</span>
															<span className="text-sm text-gray-500 dark:text-gray-400">
																R$ {offer.unitPrice.toFixed(2)}/{offer.unit}
															</span>
														</div>
														{offer.promotion && (
															<Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
																{offer.promotion}
															</Badge>
														)}
														<div className="flex items-center justify-between flex-wrap gap-2">
															{getStoreTypeBadge(offer.storeType)}
															<span className="text-sm font-medium dark:text-white">{offer.storeName}</span>
														</div>
														{renderStars(offer.sellerRating)}
														{offer.priceDropProbability > 0.5 && (
															<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
																<TrendingDown className="h-4 w-4" />
																{Math.round(offer.priceDropProbability * 100)}% chance de queda
															</div>
														)}
														{offer.ecoScore && offer.ecoScore >= 8 && (
															<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
																<Leaf className="h-4 w-4" />
																Eco Score: {offer.ecoScore}/10
															</div>
														)}
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								</div>

								{/* Your Alerts Summary */}
								<Card className="dark:bg-gray-900 dark:border-gray-800">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 dark:text-white">
											<Bell className="h-5 w-5" />
											Seus Alertas Ativos
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											{mockAlerts.filter(a => a.isActive).slice(0, 2).map((alert) => (
												<div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
													<div>
														<div className="font-medium dark:text-white">{alert.productName}</div>
														<div className="text-sm text-gray-500 dark:text-gray-400">
															Meta: R$ {alert.targetPrice.toFixed(2)} | Atual: R$ {alert.currentPrice.toFixed(2)}
														</div>
													</div>
													<Badge variant="secondary" className="dark:bg-emerald-900/30 dark:text-emerald-300">Ativo</Badge>
												</div>
											))}
											<Button variant="link" onClick={() => setSelectedTab("alerts")} className="dark:text-emerald-400">
												Ver todos os alertas →
											</Button>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						{/* Search Results Tab */}
						<TabsContent value="search">
							<div className="space-y-4">
								{/* Search Mode Toggle */}
								<div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
									<div className="flex items-center gap-3">
										{searchMode === 'live' ? (
											<>
												<Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
												<div>
													<div className="font-semibold text-emerald-700 dark:text-emerald-300">Busca ao Vivo</div>
													<div className="text-sm text-emerald-600 dark:text-emerald-400">
														Resultados direto dos marketplaces brasileiros
													</div>
												</div>
											</>
										) : (
											<>
												<Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
												<div>
													<div className="font-semibold text-blue-700 dark:text-blue-300">Busca Rápida (Cache)</div>
													<div className="text-sm text-blue-600 dark:text-blue-400">
														Resultados do banco de dados local
													</div>
												</div>
											</>
										)}
									</div>
									<div className="flex gap-2">
										<Button
											variant={searchMode === 'cached' ? 'default' : 'outline'}
											size="sm"
											onClick={() => setSearchMode('cached')}
										>
											<Database className="mr-2 h-4 w-4" />
											Cache
										</Button>
										<Button
											variant={searchMode === 'live' ? 'default' : 'outline'}
											size="sm"
											onClick={handleLiveSearch}
											disabled={isSearching}
										>
											{isSearching ? (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											) : (
												<Globe className="mr-2 h-4 w-4" />
											)}
											Ao Vivo
										</Button>
									</div>
								</div>

								{/* Search Header with Filters */}
								<div className="flex items-center justify-between flex-wrap gap-4">
									<div>
										<h2 className="text-2xl font-bold dark:text-white">
											{searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Produtos"}
										</h2>
										<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
											{searchMode === 'live' ? liveResults.length : filteredProducts.length} produtos encontrados
										</p>
									</div>
									<div className="flex gap-2">
										<Select value={sortBy} onValueChange={setSortBy}>
											<SelectTrigger className="w-[220px] dark:bg-gray-800 dark:border-gray-700">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="dark:bg-gray-800 dark:border-gray-700">
												<SelectItem value="best_value">🏆 Melhor Custo-Benefício</SelectItem>
												<SelectItem value="cheapest_unit">💰 Menor Preço por Unidade</SelectItem>
												<SelectItem value="cheapest_total">💵 Menor Preço Total</SelectItem>
												<SelectItem value="fastest_delivery">⚡ Entrega Mais Rápida</SelectItem>
												<SelectItem value="highest_rating">⭐ Melhor Avaliação</SelectItem>
												<SelectItem value="eco_friendly">🌱 Mais Sustentável</SelectItem>
											</SelectContent>
										</Select>
										<Dialog open={showFilters} onOpenChange={setShowFilters}>
											<DialogTrigger asChild>
												<Button variant="outline" className="dark:bg-gray-800 dark:border-gray-700">
													<Filter className="mr-2 h-4 w-4" />
													Filtros
													{(selectedStoreTypes.length < 3 || onlyPromotions || onlyEcoFriendly) && (
														<Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-emerald-600 text-white">
															{(selectedStoreTypes.length < 3 ? 1 : 0) + (onlyPromotions ? 1 : 0) + (onlyEcoFriendly ? 1 : 0)}
														</Badge>
													)}
												</Button>
											</DialogTrigger>
											<DialogContent className="dark:bg-gray-900 dark:border-gray-800">
												<DialogHeader>
													<DialogTitle className="dark:text-white">Filtros de Busca</DialogTitle>
													<DialogDescription className="dark:text-gray-400">
														Refine sua busca por tipo de loja, preço e mais
													</DialogDescription>
												</DialogHeader>
												<ScrollArea className="max-h-[500px] pr-4">
													<div className="space-y-4">
														<div>
															<Label className="mb-2 dark:text-white">Tipo de Loja</Label>
															<div className="space-y-2">
																{[
																	{ value: "retailer", label: "Supermercados" },
																	{ value: "marketplace", label: "Marketplaces" },
																	{ value: "local_market", label: "Mercados Locais" },
																].map((type) => (
																	<div key={type.value} className="flex items-center space-x-2">
																		<Checkbox
																			id={type.value}
																			checked={selectedStoreTypes.includes(type.value)}
																			onCheckedChange={(checked) => {
																				setSelectedStoreTypes(
																					checked
																						? [...selectedStoreTypes, type.value]
																						: selectedStoreTypes.filter((t) => t !== type.value)
																				);
																			}}
																		/>
																		<Label htmlFor={type.value} className="dark:text-gray-300">{type.label}</Label>
																	</div>
																))}
															</div>
														</div>
														<Separator className="dark:bg-gray-800" />
														<div>
															<Label className="mb-2 dark:text-white">Faixa de Preço (R$)</Label>
															<Slider
																value={priceRange}
																onValueChange={setPriceRange}
																max={100}
																step={5}
																className="mt-2"
															/>
															<div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
																<span>R$ {priceRange[0]}</span>
																<span>R$ {priceRange[1]}</span>
															</div>
														</div>
														<Separator className="dark:bg-gray-800" />
														<div className="space-y-2">
															<div className="flex items-center space-x-2">
																<Checkbox id="in_stock" checked={onlyInStock} onCheckedChange={(checked) => setOnlyInStock(!!checked)} />
																<Label htmlFor="in_stock" className="dark:text-gray-300">Apenas em estoque</Label>
															</div>
															<div className="flex items-center space-x-2">
																<Checkbox id="free_shipping" />
																<Label htmlFor="free_shipping" className="dark:text-gray-300">Frete grátis</Label>
															</div>
															<div className="flex items-center space-x-2">
																<Checkbox id="promotions" checked={onlyPromotions} onCheckedChange={(checked) => setOnlyPromotions(!!checked)} />
																<Label htmlFor="promotions" className="dark:text-gray-300">Apenas promoções</Label>
															</div>
															<div className="flex items-center space-x-2">
																<Checkbox id="eco_friendly" checked={onlyEcoFriendly} onCheckedChange={(checked) => setOnlyEcoFriendly(!!checked)} />
																<Label htmlFor="eco_friendly" className="dark:text-gray-300">Produtos sustentáveis (Eco ≥ 7)</Label>
															</div>
														</div>
														<Button
															className="w-full"
															onClick={() => {
																setSelectedStoreTypes(["retailer", "marketplace", "local_market"]);
																setPriceRange([0, 100]);
																setOnlyInStock(true);
																setOnlyPromotions(false);
																setOnlyEcoFriendly(false);
															}}
															variant="outline"
														>
															<RefreshCw className="mr-2 h-4 w-4" />
															Limpar Filtros
														</Button>
													</div>
												</ScrollArea>
											</DialogContent>
										</Dialog>
									</div>
								</div>

								{/* Error Message */}
								{searchError && (
									<Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
										<CardContent className="p-6">
											<div className="flex items-center gap-3">
												<AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
												<div className="flex-1">
													<div className="font-semibold text-red-700 dark:text-red-300 mb-1">
														{searchMode === 'live' ? 'Erro na Busca ao Vivo' : 'Erro na busca'}
													</div>
													<div className="text-sm text-red-600 dark:text-red-400 mb-3">{searchError}</div>
													{searchMode === 'live' && (
														<div className="flex gap-2 flex-wrap">
															<Button
																size="sm"
																variant="outline"
																onClick={() => {
																	setSearchMode('cached');
																	setSearchError(null);
																	setSelectedTab("search");
																}}
																className="border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
															>
																<Database className="mr-2 h-4 w-4" />
																Tentar Busca Rápida
															</Button>
															<Button
																size="sm"
																variant="outline"
																onClick={() => {
																	setSearchError(null);
																	handleLiveSearch();
																}}
																className="border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
															>
																<RefreshCw className="mr-2 h-4 w-4" />
																Tentar Novamente
															</Button>
														</div>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								)}

								{/* Loading State */}
								{isSearching && (
									<div className="space-y-4">
										<Card className="dark:bg-gray-900 dark:border-gray-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 border-2 border-emerald-200 dark:border-gray-700">
											<CardContent className="p-8 text-center">
												<div className="relative inline-block mb-4">
													<Loader2 className="h-16 w-16 mx-auto text-emerald-600 dark:text-emerald-400 animate-spin" />
													<div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 blur-2xl rounded-full animate-pulse" />
												</div>
												<h3 className="text-2xl font-bold mb-2 dark:text-white bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
													{searchMode === 'live' ? 'Buscando em Tempo Real...' : 'Buscando produtos...'}
												</h3>
												<p className="text-gray-600 dark:text-gray-400 mb-4">
													{searchMode === 'live'
														? 'Procurando nos principais marketplaces e lojas online do Brasil'
														: 'Filtrando produtos do nosso catálogo'}
												</p>
												{searchMode === 'live' && (
													<div className="space-y-2 mb-4">
														<div className="flex gap-2 justify-center items-center text-xs text-gray-500 dark:text-gray-400">
															<div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
															<span>Estratégia 1: Busca rápida em sites gerais</span>
														</div>
														<div className="flex gap-2 justify-center items-center text-xs text-gray-500 dark:text-gray-400">
															<div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
															<span>Estratégia 2: Marketplaces específicos</span>
														</div>
														<div className="flex gap-2 justify-center items-center text-xs text-gray-500 dark:text-gray-400">
															<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
															<span>Estratégia 3: Busca genérica ampla</span>
														</div>
													</div>
												)}
												<div className="flex gap-2 justify-center items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
													<Globe className="h-4 w-4 animate-pulse" />
													<span>Aguarde 10-20 segundos para melhores resultados</span>
												</div>
											</CardContent>
										</Card>
										{/* Skeleton Cards */}
										{[1, 2, 3].map((i) => (
											<Card key={i} className="dark:bg-gray-900 dark:border-gray-800 animate-pulse">
												<CardContent className="p-6">
													<div className="flex gap-6">
														<div className="w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-lg flex-shrink-0" />
														<div className="flex-1 space-y-3">
															<div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
															<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
															<div className="flex gap-2">
																<div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-20" />
																<div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-24" />
															</div>
															<div className="grid grid-cols-3 gap-4 mt-4">
																<div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
																<div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
																<div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								)}

								{/* Search Statistics */}
								{!isSearching && searchStats && (
									<Card className="dark:bg-gray-900 dark:border-gray-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 border border-emerald-200 dark:border-gray-700">
										<CardContent className="p-6">
											<div className="flex items-center gap-2 mb-4">
												<TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
												<h3 className="text-lg font-bold dark:text-white">Resumo da Busca</h3>
												{searchMode === 'live' && (
													<Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white ml-auto">
														<Globe className="mr-1 h-3 w-3" />
														Ao Vivo
													</Badge>
												)}
											</div>
											<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
												<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
													<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Resultados</div>
													<div className="text-2xl font-bold text-gray-900 dark:text-white">{searchStats.totalResults}</div>
												</div>
												<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-emerald-200 dark:border-emerald-900">
													<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Menor Preço</div>
													<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">R$ {searchStats.lowestPrice.toFixed(2)}</div>
												</div>
												<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
													<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Maior Preço</div>
													<div className="text-2xl font-bold text-gray-900 dark:text-white">R$ {searchStats.highestPrice.toFixed(2)}</div>
												</div>
												<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
													<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Preço Médio</div>
													<div className="text-2xl font-bold text-gray-900 dark:text-white">R$ {searchStats.averagePrice.toFixed(2)}</div>
												</div>
												<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
													<div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Economia Máx.</div>
													<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">R$ {searchStats.savings.toFixed(2)}</div>
													<div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">-{searchStats.savingsPercent.toFixed(0)}%</div>
												</div>
											</div>
										</CardContent>
									</Card>
								)}

								{/* Results */}
								{!isSearching && (searchMode === 'live' ? liveResults.length : filteredProducts.length) === 0 ? (
									<Card className="dark:bg-gray-900 dark:border-gray-800 border-dashed border-2">
										<CardContent className="p-12 text-center">
											<div className="relative inline-block mb-6">
												<Package className="h-20 w-20 mx-auto text-gray-300 dark:text-gray-700" />
												<div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-10 blur-2xl rounded-full" />
											</div>
											<h3 className="text-2xl font-bold mb-3 dark:text-white bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
												Nenhum produto encontrado
											</h3>
											<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
												{searchMode === 'live'
													? "A busca ao vivo não encontrou resultados. Tente termos diferentes ou use a Busca Rápida."
													: "Não encontramos produtos que correspondam aos seus critérios. Tente ajustar os filtros ou buscar por outro termo."}
											</p>
											<div className="flex gap-3 justify-center flex-wrap">
												<Button onClick={() => {
													setSearchQuery("");
													setSelectedStoreTypes(["retailer", "marketplace", "local_market"]);
													setPriceRange([0, 100]);
													setOnlyPromotions(false);
													setOnlyEcoFriendly(false);
												}} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
													<RefreshCw className="mr-2 h-4 w-4" />
													Limpar Filtros
												</Button>
												{searchMode === 'live' && (
													<Button variant="outline" onClick={() => {
														setSearchMode('cached');
														setSearchError(null);
													}}>
														<Database className="mr-2 h-4 w-4" />
														Tentar Busca Rápida
													</Button>
												)}
											</div>
											<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
												<p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Sugestões populares:</p>
												<div className="flex gap-2 justify-center flex-wrap">
													{["Arroz", "Feijão", "Café", "Leite", "Açúcar", "Óleo"].map((suggestion) => (
														<Button
															key={suggestion}
															variant="outline"
															size="sm"
															onClick={() => {
																setSearchQuery(suggestion.toLowerCase());
																setSearchMode('cached');
																setSelectedTab("search");
															}}
															className="hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700"
														>
															{suggestion}
														</Button>
													))}
												</div>
											</div>
										</CardContent>
									</Card>
								) : !isSearching ? (
									<div className="grid grid-cols-1 gap-4">
										{/* Render Live Results */}
										{searchMode === 'live' && liveResults.map((result, index) => (
											<Card key={result.id} className="group hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 dark:bg-gray-900 dark:border-gray-800 border-2 border-teal-200 dark:border-teal-900 hover:border-teal-400 dark:hover:border-teal-600 overflow-hidden relative">
												<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/10 to-transparent pointer-events-none" />
												<CardContent className="p-6">
													<div className="flex gap-6">
														<div className="relative w-32 h-32 bg-gradient-to-br from-teal-100 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300 border-2 border-teal-300/50 dark:border-teal-700/50">
															<Package className="h-16 w-16 text-teal-500 dark:text-teal-400 group-hover:scale-110 transition-transform" />
															<div className="absolute inset-0 bg-gradient-to-br from-teal-400/0 to-emerald-400/0 group-hover:from-teal-400/20 group-hover:to-emerald-400/20 transition-all duration-300" />
														</div>
														<div className="flex-1 space-y-3">
															<div className="flex justify-between items-start">
																<div className="flex-1">
																	<h3 className="text-xl font-bold dark:text-white">{result.productName}</h3>
																	<p className="text-gray-600 dark:text-gray-400">{result.brand}</p>
																</div>
																<Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
																	<Globe className="mr-1 h-3 w-3" />
																	AO VIVO
																</Badge>
															</div>

															<div className="flex items-center gap-2 flex-wrap">
																{index === 0 && (
																	<Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0">
																		🏆 Melhor Preço
																	</Badge>
																)}
																{result.storeType === 'marketplace' ? (
																	<Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
																		Marketplace
																	</Badge>
																) : (
																	<Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
																		Supermercado
																	</Badge>
																)}
															</div>

															<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
																<div>
																	<div className="text-sm text-gray-500 dark:text-gray-400">Preço</div>
																	{result.price > 0 ? (
																		<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
																			R$ {result.price.toFixed(2)}
																		</div>
																	) : (
																		<div className="text-sm text-gray-500 dark:text-gray-400 italic">
																			Ver no site
																		</div>
																	)}
																</div>
																<div>
																	<div className="text-sm text-gray-500 dark:text-gray-400">Loja</div>
																	<div className="font-medium dark:text-white">{result.storeName}</div>
																	{result.rating && (
																		<div className="flex items-center gap-1">
																			{Array.from({ length: 5 }).map((_, i) => (
																				<Star
																					key={i}
																					className={cn(
																						"h-3 w-3",
																						i < Math.floor(result.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
																					)}
																				/>
																			))}
																		</div>
																	)}
																</div>
																<div>
																	<div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
																	<Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
																		<CheckCircle2 className="h-3 w-3 mr-1" />
																		Disponível
																	</Badge>
																</div>
															</div>

															<div className="flex gap-2 flex-wrap">
																<Button className="flex-1 min-w-[150px]" asChild>
																	<a href={result.url} target="_blank" rel="noopener noreferrer">
																		<ArrowUpRight className="mr-2 h-4 w-4" />
																		Ver na Loja
																	</a>
																</Button>
																<Button variant="outline" className="flex-1 min-w-[150px]">
																	<Heart className="mr-2 h-4 w-4" />
																	Seguir
																</Button>
																<Button variant="outline" className="flex-1 min-w-[150px]">
																	<Bell className="mr-2 h-4 w-4" />
																	Criar Alerta
																</Button>
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										))}

										{/* Render Cached Results */}
										{searchMode === 'cached' && filteredProducts.map((offer, index) => (
											<Card key={offer.id} className="group hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 dark:bg-gray-900 dark:border-gray-800 border border-gray-200 dark:hover:border-emerald-700 hover:border-emerald-300 overflow-hidden">
												<CardContent className="p-6">
													<div className="flex gap-6">
														<div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
															<Package className="h-16 w-16 text-gray-400 dark:text-gray-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
															<div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-teal-400/0 group-hover:from-emerald-400/10 group-hover:to-teal-400/10 transition-all duration-300" />
														</div>
														<div className="flex-1 space-y-3">
															<div className="flex justify-between items-start">
																<div>
																	<h3 className="text-xl font-bold dark:text-white">{offer.productName}</h3>
																	<p className="text-gray-600 dark:text-gray-400">{offer.brand} • {offer.quantity}</p>
																</div>
																<div className="flex gap-2">
																	<Button
																		variant="ghost"
																		size="icon"
																		onClick={() => toggleFollowProduct(offer.id)}
																		className="transition-transform hover:scale-110"
																	>
																		<Heart className={cn(
																			"h-4 w-4",
																			followedProducts.includes(offer.id) && "fill-red-500 text-red-500"
																		)} />
																	</Button>
																	<Button variant="ghost" size="icon">
																		<Share2 className="h-4 w-4" />
																	</Button>
																</div>
															</div>

															<div className="flex items-center gap-2 flex-wrap">
																{index === 0 && sortBy === "best_value" && (
																	<Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0">
																		🏆 Melhor Oferta
																	</Badge>
																)}
																{getStoreTypeBadge(offer.storeType)}
																{getStockBadge(offer.stockStatus)}
																{offer.promotion && (
																	<Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
																		{offer.promotion}
																	</Badge>
																)}
															</div>

															<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
																<div>
																	<div className="text-sm text-gray-500 dark:text-gray-400">Preço Total</div>
																	<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
																		R$ {offer.price.toFixed(2)}
																	</div>
																</div>
																<div>
																	<div className="text-sm text-gray-500 dark:text-gray-400">Preço por {offer.unit}</div>
																	<div className="text-xl font-semibold dark:text-white">
																		R$ {offer.unitPrice.toFixed(2)}
																	</div>
																</div>
																<div>
																	<div className="text-sm text-gray-500 dark:text-gray-400">Loja</div>
																	<div className="font-medium dark:text-white">{offer.storeName}</div>
																	{renderStars(offer.sellerRating)}
																</div>
																<div>
																	<div className="text-sm text-gray-500 dark:text-gray-400">Entrega</div>
																	<div className="font-medium dark:text-white flex items-center gap-1">
																		<Clock className="h-3 w-3" />
																		{offer.shippingTime}
																	</div>
																	<div className="text-sm">
																		{offer.shippingCost === 0 ? (
																			<span className="text-green-600 dark:text-green-400">Frete grátis</span>
																		) : (
																			<span className="dark:text-gray-400">+ R$ {offer.shippingCost.toFixed(2)}</span>
																		)}
																	</div>
																</div>
															</div>

															<div className="flex items-center gap-4 text-sm flex-wrap">
																{offer.priceDropProbability > 0.5 && (
																	<div className="flex items-center gap-1 text-green-600 dark:text-green-400">
																		<TrendingDown className="h-4 w-4" />
																		{Math.round(offer.priceDropProbability * 100)}% chance de baixar nos próximos 7 dias
																	</div>
																)}
																{offer.ecoScore && (
																	<div className="flex items-center gap-1 text-green-600 dark:text-green-400">
																		<Leaf className="h-4 w-4" />
																		Eco Score: {offer.ecoScore}/10
																	</div>
																)}
															</div>

															<div className="flex gap-2 flex-wrap">
																<Button className="flex-1 min-w-[150px]">
																	<ArrowUpRight className="mr-2 h-4 w-4" />
																	Ver na Loja
																</Button>
																<Button variant="outline" className="flex-1 min-w-[150px]">
																	<Bell className="mr-2 h-4 w-4" />
																	Criar Alerta
																</Button>
																<Button variant="outline" className="flex-1 min-w-[150px]">
																	<BarChart3 className="mr-2 h-4 w-4" />
																	Histórico
																</Button>
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								) : null}
							</div>
						</TabsContent>

						{/* Alerts Tab */}
						<TabsContent value="alerts">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h2 className="text-2xl font-bold dark:text-white">Meus Alertas de Preço</h2>
									<Dialog>
										<DialogTrigger asChild>
											<Button>
												<Bell className="mr-2 h-4 w-4" />
												Criar Novo Alerta
											</Button>
										</DialogTrigger>
										<DialogContent className="dark:bg-gray-900 dark:border-gray-800">
											<DialogHeader>
												<DialogTitle className="dark:text-white">Criar Alerta de Preço</DialogTitle>
												<DialogDescription className="dark:text-gray-400">
													Configure um alerta para ser notificado quando o preço atingir seu objetivo
												</DialogDescription>
											</DialogHeader>
											<div className="space-y-4">
												<div>
													<Label className="dark:text-white">Produto</Label>
													<Input placeholder="Digite o nome do produto" className="dark:bg-gray-800 dark:border-gray-700" />
												</div>
												<div>
													<Label className="dark:text-white">Preço Alvo (R$)</Label>
													<Input type="number" placeholder="0.00" className="dark:bg-gray-800 dark:border-gray-700" />
												</div>
												<div>
													<Label className="dark:text-white">Tipo de Alerta</Label>
													<Select>
														<SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
															<SelectValue placeholder="Selecione" />
														</SelectTrigger>
														<SelectContent className="dark:bg-gray-800 dark:border-gray-700">
															<SelectItem value="price_drop">Quando baixar</SelectItem>
															<SelectItem value="target_price">Atingir preço específico</SelectItem>
															<SelectItem value="stock">Voltar ao estoque</SelectItem>
															<SelectItem value="new_seller">Novo vendedor</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div>
													<Label className="dark:text-white">Canais de Notificação</Label>
													<div className="space-y-2 mt-2">
														<div className="flex items-center space-x-2">
															<Checkbox id="push" defaultChecked />
															<Label htmlFor="push" className="dark:text-gray-300">Push (App)</Label>
														</div>
														<div className="flex items-center space-x-2">
															<Checkbox id="email" />
															<Label htmlFor="email" className="dark:text-gray-300">Email</Label>
														</div>
														<div className="flex items-center space-x-2">
															<Checkbox id="whatsapp" />
															<Label htmlFor="whatsapp" className="dark:text-gray-300">WhatsApp</Label>
														</div>
														<div className="flex items-center space-x-2">
															<Checkbox id="telegram" />
															<Label htmlFor="telegram" className="dark:text-gray-300">Telegram</Label>
														</div>
													</div>
												</div>
												<Button className="w-full">Criar Alerta</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>

								<div className="grid grid-cols-1 gap-4">
									{mockAlerts.map((alert) => (
										<Card key={alert.id} className="dark:bg-gray-900 dark:border-gray-800">
											<CardContent className="p-6">
												<div className="flex justify-between items-start">
													<div className="space-y-2 flex-1">
														<div className="flex items-center gap-2">
															<h3 className="text-lg font-bold dark:text-white">{alert.productName}</h3>
															<Badge variant={alert.isActive ? "default" : "secondary"} className={alert.isActive ? "dark:bg-emerald-600" : ""}>
																{alert.isActive ? "Ativo" : "Pausado"}
															</Badge>
														</div>
														<div className="grid grid-cols-2 gap-4">
															<div>
																<div className="text-sm text-gray-500 dark:text-gray-400">Preço Atual</div>
																<div className="text-xl font-semibold dark:text-white">R$ {alert.currentPrice.toFixed(2)}</div>
															</div>
															<div>
																<div className="text-sm text-gray-500 dark:text-gray-400">Preço Alvo</div>
																<div className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
																	R$ {alert.targetPrice.toFixed(2)}
																</div>
															</div>
														</div>
														{alert.lastTriggered && (
															<div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
																<Clock className="h-3 w-3" />
																Último disparo: {alert.lastTriggered}
															</div>
														)}
														<div className="flex items-center gap-2">
															<div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex-1">
																<div
																	className="h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
																	style={{
																		width: `${(alert.targetPrice / alert.currentPrice) * 100}%`,
																	}}
																/>
															</div>
															<span className="text-sm text-gray-500 dark:text-gray-400">
																{Math.round(((alert.currentPrice - alert.targetPrice) / alert.currentPrice) * 100)}% para atingir
															</span>
														</div>
													</div>
													<div className="flex flex-col gap-2 ml-4">
														<Button variant="outline" size="sm">
															<Settings className="h-4 w-4" />
														</Button>
														<Button variant="outline" size="sm">
															{alert.isActive ? "Pausar" : "Ativar"}
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</TabsContent>

						{/* Shopping Lists Tab */}
						<TabsContent value="lists">
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<h2 className="text-2xl font-bold dark:text-white">Minhas Listas de Compras</h2>
									<Dialog>
										<DialogTrigger asChild>
											<Button>
												<ShoppingCart className="mr-2 h-4 w-4" />
												Nova Lista
											</Button>
										</DialogTrigger>
										<DialogContent className="dark:bg-gray-900 dark:border-gray-800">
											<DialogHeader>
												<DialogTitle className="dark:text-white">Criar Nova Lista</DialogTitle>
											</DialogHeader>
											<div className="space-y-4">
												<div>
													<Label className="dark:text-white">Nome da Lista</Label>
													<Input placeholder="Ex: Compras da Semana" className="dark:bg-gray-800 dark:border-gray-700" />
												</div>
												<div className="flex items-center space-x-2">
													<Checkbox id="shared" />
													<Label htmlFor="shared" className="dark:text-gray-300">Compartilhar com família</Label>
												</div>
												<Button className="w-full">Criar Lista</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>

								<Card className="dark:bg-gray-900 dark:border-gray-800">
									<CardHeader>
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="dark:text-white">Lista de Compras Semanal</CardTitle>
												<CardDescription className="dark:text-gray-400">{mockShoppingList.length} itens • Última atualização há 2 horas</CardDescription>
											</div>
											<Button variant="outline">
												<TrendingDown className="mr-2 h-4 w-4" />
												Otimizar Compra
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{mockShoppingList.map((item) => (
												<div
													key={item.id}
													className={cn(
														"group flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-md",
														item.isChecked
															? "bg-gray-50 dark:bg-gray-800/50 opacity-60 border-gray-200 dark:border-gray-700"
															: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"
													)}
												>
													<div className="flex items-center gap-3 flex-1">
														<Checkbox
															checked={item.isChecked}
															className="transition-transform group-hover:scale-110"
														/>
														<div className="flex-1">
															<div className={cn(
																"font-medium transition-all",
																item.isChecked && "line-through text-gray-400 dark:text-gray-500",
																!item.isChecked && "dark:text-white"
															)}>
																{item.productName}
															</div>
															<div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
																<Package className="h-3 w-3" />
																{item.quantity} {item.unit}
															</div>
														</div>
													</div>
													{item.bestPrice && (
														<div className="text-right">
															<div className={cn(
																"font-semibold transition-colors",
																item.isChecked
																	? "text-gray-400 dark:text-gray-500"
																	: "text-emerald-600 dark:text-emerald-400"
															)}>
																R$ {(item.bestPrice * item.quantity).toFixed(2)}
															</div>
															<div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
																<Store className="h-3 w-3" />
																{item.storeName}
															</div>
														</div>
													)}
													<Button
														variant="ghost"
														size="icon"
														className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
													>
														<XCircle className="h-4 w-4 text-gray-400" />
													</Button>
												</div>
											))}
										</div>

										<Separator className="my-6 dark:bg-gray-800" />

										<div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 p-4 rounded-lg border-2 border-emerald-200 dark:border-emerald-900 space-y-3">
											<div className="flex justify-between items-center text-sm">
												<span className="dark:text-gray-300 flex items-center gap-2">
													<Package className="h-4 w-4" />
													Subtotal (melhor preço)
												</span>
												<span className="font-semibold dark:text-white">R$ 59.14</span>
											</div>
											<div className="flex justify-between items-center text-sm">
												<span className="dark:text-gray-300 flex items-center gap-2">
													<TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
													Economia vs. compra única
												</span>
												<span className="font-semibold text-green-600 dark:text-green-400">- R$ 15.86 (21%)</span>
											</div>
											<Separator className="dark:bg-emerald-900/30" />
											<div className="flex justify-between items-center">
												<span className="text-lg font-bold dark:text-white">Total Estimado</span>
												<span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">R$ 59.14</span>
											</div>
											<div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
												<Sparkles className="h-3 w-3" />
												Você está economizando comprando nos melhores lugares!
											</div>
										</div>

										<div className="grid grid-cols-2 gap-3 mt-4">
											<Button variant="outline" className="border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
												<Share2 className="mr-2 h-4 w-4" />
												Compartilhar
											</Button>
											<Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
												<BarChart3 className="mr-2 h-4 w-4" />
												Otimizar
											</Button>
										</div>
									</CardContent>
								</Card>

								{/* Shopping Optimization */}
								<Card className="dark:bg-gray-900 dark:border-gray-800">
									<CardHeader>
										<CardTitle className="dark:text-white">Otimização Multi-Lojas</CardTitle>
										<CardDescription className="dark:text-gray-400">
											Economize comprando em diferentes lojas conforme disponibilidade e preço
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-all duration-300 hover:scale-102">
												<div className="flex items-center gap-3">
													<Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
													<div>
														<div className="font-semibold dark:text-white">Carrefour</div>
														<div className="text-sm text-gray-600 dark:text-gray-400">2 itens • R$ 23.89</div>
													</div>
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
													<Clock className="h-3 w-3" />
													Retira hoje
												</div>
											</div>
											<div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-all duration-300 hover:scale-102">
												<div className="flex items-center gap-3">
													<Store className="h-8 w-8 text-purple-600 dark:text-purple-400" />
													<div>
														<div className="font-semibold dark:text-white">Extra</div>
														<div className="text-sm text-gray-600 dark:text-gray-400">2 itens • R$ 35.25</div>
													</div>
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
													<Clock className="h-3 w-3" />
													Entrega 2 dias
												</div>
											</div>
											<div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
												<div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
													<TrendingDown className="h-5 w-5" />
													Economia total: R$ 15.86 (21%)
												</div>
												<div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
													Comparado a comprar tudo em uma única loja
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						{/* Contribute Tab */}
						<TabsContent value="submit">
							<div className="space-y-6">
								<Card className="border-2 border-emerald-200 dark:border-emerald-800 dark:bg-gray-900">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 dark:text-white">
											<Award className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
											Contribua e Ganhe Pontos!
										</CardTitle>
										<CardDescription className="dark:text-gray-400">
											Ajude a comunidade enviando preços de mercados locais e ganhe recompensas
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
											<div className="group relative text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-900 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer overflow-hidden">
												<div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl group-hover:bg-yellow-400/20 transition-all" />
												<Award className="h-8 w-8 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
												<div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">+10</div>
												<div className="text-xs text-gray-600 dark:text-gray-400 mt-1">pontos</div>
												<div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Por preço aprovado</div>
											</div>
											<div className="group relative text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-900 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer overflow-hidden">
												<div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl group-hover:bg-orange-400/20 transition-all" />
												<Camera className="h-8 w-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
												<div className="text-3xl font-bold text-orange-700 dark:text-orange-400">+50</div>
												<div className="text-xs text-gray-600 dark:text-gray-400 mt-1">pontos</div>
												<div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Por foto verificada</div>
											</div>
											<div className="group relative text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-900 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer overflow-hidden">
												<div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all" />
												<CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
												<div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">+100</div>
												<div className="text-xs text-gray-600 dark:text-gray-400 mt-1">pontos</div>
												<div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Vendedor verificado</div>
											</div>
										</div>

										<div className="space-y-4">
											<div>
												<Label className="dark:text-white">Produto</Label>
												<Input placeholder="Ex: Arroz Tipo 1 Uncle Ben's 5kg" className="dark:bg-gray-800 dark:border-gray-700" />
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<Label className="dark:text-white">Preço (R$)</Label>
													<Input type="number" placeholder="0.00" className="dark:bg-gray-800 dark:border-gray-700" />
												</div>
												<div>
													<Label className="dark:text-white">Quantidade</Label>
													<Input placeholder="Ex: 5kg, 500g" className="dark:bg-gray-800 dark:border-gray-700" />
												</div>
											</div>
											<div>
												<Label className="dark:text-white">Mercado/Loja</Label>
												<Input placeholder="Nome do estabelecimento" className="dark:bg-gray-800 dark:border-gray-700" />
											</div>
											<div>
												<Label className="dark:text-white">Localização</Label>
												<div className="flex gap-2">
													<Input placeholder="Endereço ou use GPS" className="flex-1 dark:bg-gray-800 dark:border-gray-700" />
													<Button variant="outline">
														<MapPin className="h-4 w-4" />
													</Button>
												</div>
											</div>
											<div>
												<Label className="dark:text-white flex items-center gap-2">
													<Camera className="h-4 w-4" />
													Foto do Produto/Preço (Opcional)
													<Badge className="bg-orange-500 text-white">+50 pts</Badge>
												</Label>
												<div className="group border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer relative overflow-hidden">
													<div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-teal-400/0 group-hover:from-emerald-400/5 group-hover:to-teal-400/5 transition-all" />
													<Upload className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mb-3 transition-colors group-hover:scale-110 transform duration-300" />
													<div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
														Clique para fazer upload ou arraste a foto aqui
													</div>
													<div className="text-xs text-gray-500 dark:text-gray-400">
														PNG, JPG ou WEBP até 10MB
													</div>
													<div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-3 py-1 rounded-full">
														<Sparkles className="h-3 w-3" />
														Fotos verificadas ganham +40 pontos extras!
													</div>
												</div>
											</div>
											<Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all" size="lg">
												<Upload className="mr-2 h-5 w-5" />
												<span className="font-semibold">Enviar Preço</span>
												<Badge className="ml-2 bg-yellow-400 text-black">+10 pts</Badge>
											</Button>
										</div>
									</CardContent>
								</Card>

								{/* Leaderboard */}
								<Card className="dark:bg-gray-900 dark:border-gray-800">
									<CardHeader>
										<CardTitle className="dark:text-white">Placar de Líderes - Este Mês</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{[
												{ name: "João Silva", level: "Platinum Scout", points: 2890, position: 1 },
												{ name: "Maria Santos", level: "Gold Expert", points: 2150, position: 2 },
												{ name: "Pedro Costa", level: "Gold Expert", points: 1820, position: 3 },
												{ name: "Você", level: userLevel, points: userPoints, position: 12 },
											].map((user) => (
												<div
													key={user.position}
													className={cn(
														"flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-102",
														user.name === "Você"
															? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800"
															: "bg-gray-50 dark:bg-gray-800"
													)}
												>
													<div className="flex items-center gap-3">
														<div
															className={cn(
																"w-8 h-8 rounded-full flex items-center justify-center font-bold",
																user.position === 1
																	? "bg-yellow-400 text-yellow-900"
																	: user.position === 2
																	? "bg-gray-300 text-gray-700"
																	: user.position === 3
																	? "bg-orange-400 text-orange-900"
																	: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
															)}
														>
															{user.position}
														</div>
														<div>
															<div className="font-semibold dark:text-white">{user.name}</div>
															<div className="text-sm text-gray-500 dark:text-gray-400">{user.level}</div>
														</div>
													</div>
													<div className="text-right">
														<div className="font-bold text-emerald-600 dark:text-emerald-400">{user.points} pts</div>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>
					</Tabs>
				</main>

				{/* Footer */}
				<footer className="border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-800 mt-12">
					<div className="container mx-auto px-4 py-8">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
							<div>
								<h3 className="font-bold text-lg mb-3 dark:text-white">CaçaPreço PRO</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									A maior plataforma de comparação de preços do Brasil
								</p>
							</div>
							<div>
								<h4 className="font-semibold mb-3 dark:text-white">Recursos</h4>
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li>Busca Inteligente</li>
									<li>Alertas de Preço</li>
									<li>Listas Otimizadas</li>
									<li>Mercados Locais</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold mb-3 dark:text-white">Suporte</h4>
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li>Central de Ajuda</li>
									<li>Como Funciona</li>
									<li>Contato</li>
									<li>Blog</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold mb-3 dark:text-white">Legal</h4>
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li>Termos de Uso</li>
									<li>Política de Privacidade</li>
									<li>LGPD</li>
									<li>Cookies</li>
								</ul>
							</div>
						</div>
						<Separator className="my-6 dark:bg-gray-800" />
						<div className="text-center text-sm text-gray-600 dark:text-gray-400">
							© 2025 CaçaPreço PRO. Todos os direitos reservados.
						</div>
					</div>
				</footer>
			</div>
		</div>
		</TooltipProvider>
	);
}
