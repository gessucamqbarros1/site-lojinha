
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
  
  const adminData = useAdminData();

  // Fetch data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      adminData.fetchProducts();
      adminData.fetchStoreSettings();
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('products');
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
        {isLoggedIn ? renderAdminPanel() : <AdminLogin onLogin={handleLogin} />}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
