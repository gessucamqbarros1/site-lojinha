
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (password !== confirmPassword) {
        return;
      }
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-md mx-auto admin-card p-8">
        <h1 className="text-2xl font-playfair text-vintage-brown mb-6 text-center">
          {isSignUp ? 'Criar Conta' : 'Acesso Administrativo'}
        </h1>
        <form onSubmit={handleSubmit}>
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
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="mb-4">
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
          </div>
          {isSignUp && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-vintage-dark mb-1">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="vintage-input w-full"
                placeholder="Confirme sua senha"
                required
              />
              {password !== confirmPassword && confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  As senhas não coincidem
                </p>
              )}
            </div>
          )}
          <button 
            type="submit" 
            className="admin-button w-full py-2 mb-4"
            disabled={loading || (isSignUp && password !== confirmPassword)}
          >
            {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-vintage-brown hover:underline"
          >
            {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
