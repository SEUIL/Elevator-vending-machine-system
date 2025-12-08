import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import useIdleTimer from './hooks/useIdleTimer';
import useAdminKey from './hooks/useAdminKey';

// 페이지 임포트
import IntroPage from './pages/IntroPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PaymentPage from './pages/PaymentPage';
import ResultPage from './pages/ResultPage';



import AdminProductListPage from "./pages/AdminProductListPage";
import AdminProductFormPage from "./pages/AdminProductFormPage";
import AdminProductDetailPage from "./pages/AdminProductDetailPage";



// 타임아웃 감지를 위해 내부 컴포넌트 분리
const AppContent = () => {
  useIdleTimer(300000); // 300초 타임아웃 적용
    useAdminKey();

  return (
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/list" element={<ProductListPage />} />
        <Route path="/detail/:id" element={<ProductDetailPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/result" element={<ResultPage />} />
          <Route path="/adminList" element={<AdminProductListPage/>}/>
          <Route path="/adminForm" element={<AdminProductFormPage/>}/>
          <Route path="/adminForm/:id" element={<AdminProductFormPage />} />
          <Route path="/adminDetail/:id" element={<AdminProductDetailPage />} />

      </Routes>
  );
};

const App = () => {
  return (
      <OrderProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </OrderProvider>
  );
};

export default App;