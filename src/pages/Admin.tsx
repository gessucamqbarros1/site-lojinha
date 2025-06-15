
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProductsTab from '@/components/admin/ProductsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import BackupTab from '@/components/admin/BackupTab';
import { useAdminData } from '@/hooks/useAdminData';
import { useAuth } from '@/hooks/useAuth';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { user, loading, signOut } = useAuth();
  const adminData = useAdminData();

  // Fetch data when user is authenticated
  useEffect(() => {
    if (user) {
      adminData.fetchProducts();
      adminData.fetchStoreSettings();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    setActiveTab('products');
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-brown mx-auto mb-4"></div>
            <p className="text-vintage-dark">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderAdminPanel = () => (
    <div className="vintage-container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
        />
        
        <div className="md:w-3/4">
          {activeTab === 'products' && (
            <ProductsTab
              productList={adminData.productList}
              setProductList={adminData.setProductList}
              categories={adminData.categories}
              fetchProducts={adminData.fetchProducts}
              generateWhatsAppLink={adminData.generateWhatsAppLink}
              uploading={adminData.uploading}
              setUploading={adminData.setUploading}
              saving={adminData.saving}
              setSaving={adminData.setSaving}
              toast={adminData.toast}
            />
          )}
          
          {activeTab === 'settings' && (
            <SettingsTab
              storeData={adminData.storeData}
              setStoreData={adminData.setStoreData}
              uploading={adminData.uploading}
              setUploading={adminData.setUploading}
              saving={adminData.saving}
              setSaving={adminData.setSaving}
              toast={adminData.toast}
            />
          )}

          {activeTab === 'backup' && (
            <BackupTab
              storeData={adminData.storeData}
              productList={adminData.productList}
              setProductList={adminData.setProductList}
              saving={adminData.saving}
              setSaving={adminData.setSaving}
              deleting={adminData.deleting}
              setDeleting={adminData.setDeleting}
              toast={adminData.toast}
            />
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {user ? renderAdminPanel() : <AdminLogin />}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
