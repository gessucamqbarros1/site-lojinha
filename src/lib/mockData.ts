
import { Product } from "@/components/ui/ProductCard";

// Mock Products
export const products: Product[] = [
  {
    id: "1",
    name: "Batom Hidratante Rose",
    description: "Batom com textura macia e hidratante que garante longa duração e conforto.",
    price: 49.90,
    image: "/placeholder.svg",
    category: "Maquiagem"
  },
  {
    id: "2",
    name: "Sérum Facial Iluminador",
    description: "Sérum iluminador para todos os tipos de pele que proporciona hidratação profunda.",
    price: 89.90,
    image: "/placeholder.svg",
    category: "Skincare"
  },
  {
    id: "3",
    name: "Brinco Floral Vintage",
    description: "Brinco artesanal com design floral inspirado no estilo provençal.",
    price: 65.00,
    image: "/placeholder.svg",
    category: "Acessórios"
  },
  {
    id: "4",
    name: "Nécessaire de Viagem",
    description: "Nécessaire espaçosa com estampa delicada para organizar seus itens de beleza.",
    price: 78.50,
    image: "/placeholder.svg",
    category: "Acessórios"
  },
  {
    id: "5",
    name: "Perfume Fleur de Paris",
    description: "Fragrância floral com notas de lavanda e baunilha, inspirada nos jardins franceses.",
    price: 129.90,
    image: "/placeholder.svg",
    category: "Perfumaria"
  },
  {
    id: "6",
    name: "Paleta de Sombras Nude",
    description: "Paleta com 12 tons neutros e terrosos para criar looks sofisticados para o dia ou noite.",
    price: 85.00,
    image: "/placeholder.svg",
    category: "Maquiagem"
  },
  {
    id: "7",
    name: "Pó Facial Iluminador",
    description: "Pó facial com partículas iluminadoras para um acabamento natural e radiante.",
    price: 59.90,
    image: "/placeholder.svg",
    category: "Maquiagem"
  },
  {
    id: "8",
    name: "Bracelete Dourado Vintage",
    description: "Bracelete com detalhes delicados e acabamento dourado envelhecido.",
    price: 45.00,
    image: "/placeholder.svg",
    category: "Acessórios"
  },
];

// Mock Categories
export const categories = [
  "Todos",
  "Maquiagem",
  "Skincare",
  "Perfumaria",
  "Acessórios"
];

// Mock Store Settings
export const storeSettings = {
  name: "Minha Lojinha",
  logo: "/placeholder.svg",
  banner: "/placeholder.svg",
  about: `
    <p>Bem-vindo à Minha Lojinha, um espaço dedicado à beleza e elegância.</p>
    <p>Fundada em 2023, nossa missão é oferecer produtos selecionados que combinam qualidade e estilo provençal.</p>
    <p>Cada item em nosso catálogo é escolhido com carinho para proporcionar uma experiência de compra especial.</p>
  `,
  contact: {
    instagram: "https://instagram.com/minhalojinha",
    whatsapp: "https://wa.me/5511999999999",
    email: "contato@minhalojinha.com"
  }
};
