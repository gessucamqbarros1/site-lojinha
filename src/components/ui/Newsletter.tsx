
import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate subscription
    setIsSubscribed(true);
    toast({
      title: "Inscrição realizada!",
      description: "Você receberá nossas novidades em breve.",
    });
    setEmail('');
    
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-vintage-beige/20 to-vintage-pink/20 rounded-lg p-6 text-center">
      <div className="mb-4">
        <Mail className="mx-auto text-primary mb-2" size={32} />
        <h3 className="text-xl font-playfair text-vintage-brown mb-2">Fique por dentro das novidades</h3>
        <p className="text-vintage-dark/70 text-sm">Receba em primeira mão nossos lançamentos e ofertas especiais.</p>
      </div>
      
      {!isSubscribed ? (
        <form onSubmit={handleSubmit} className="flex max-w-sm mx-auto">
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 border border-vintage-beige/50 rounded-l-full focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
          />
          <button
            type="submit"
            className="vintage-button rounded-l-none rounded-r-full px-6"
          >
            Inscrever
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-center space-x-2 text-green-600 animate-fade-in">
          <Check size={20} />
          <span>Inscrição realizada com sucesso!</span>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
