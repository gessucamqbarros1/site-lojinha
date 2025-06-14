
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'admin@example.com' && password === 'password') {
      onLogin();
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Erro de login",
        description: "Email ou senha inválidos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="vintage-container py-12">
      <div className="max-w-md mx-auto vintage-card p-8">
        <h1 className="text-2xl font-playfair text-vintage-brown mb-6 text-center">
          Acesso Administrativo
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-vintage-dark mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="vintage-input w-full"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-vintage-dark mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="vintage-input w-full"
              placeholder="Digite sua senha"
              required
            />
            <p className="text-xs text-vintage-dark/60 mt-1">
              (Use o email: admin@example.com e senha: password)
            </p>
          </div>
          
          <button type="submit" className="vintage-button w-full py-2">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
