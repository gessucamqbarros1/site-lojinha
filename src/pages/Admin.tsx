
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProductsTab from '@/components/admin/ProductsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import BackupTab from '@/components/admin/BackupTab';
import { useAdminData } from '@/hooks/useAdminData';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  
  const {
    storeData,
    setStoreData,
    productList,
    setProductList,
    categories,
    uploading,
    setUploading,
    saving,
    setSaving,
    deleting,
    setDeleting,
    fetchProducts,
    fetchStoreSettings,
    generateWhatsAppLink,
    toast
  } = useAdminData();

  // Fetch products and store settings when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
      fetchStoreSettings();
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

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
              productList={productList}
              setProductList={setProductList}
              categories={categories}
              fetchProducts={fetchProducts}
              generateWhatsAppLink={generateWhatsAppLink}
              uploading={uploading}
              setUploading={setUploading}
              saving={saving}
              setSaving={setSaving}
              toast={toast}
            />
          )}
          
          {activeTab === 'settings' && (
            <SettingsTab
              storeData={storeData}
              setStoreData={setStoreData}
              uploading={uploading}
              setUploading={setUploading}
              saving={saving}
              setSaving={setSaving}
              toast={toast}
            />
          )}

          {activeTab === 'backup' && (
            <BackupTab
              storeData={storeData}
              productList={productList}
              setProductList={setProductList}
              saving={saving}
              setSaving={setSaving}
              deleting={deleting}
              setDeleting={setDeleting}
              toast={toast}
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
        {isLoggedIn ? renderAdminPanel() : <AdminLogin onLogin={handleLogin} />}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
