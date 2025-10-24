import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import { CouponProvider } from "./context/CouponContext.jsx"; // import coupon provider

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopContextProvider>
      <CouponProvider>
        <App />
      </CouponProvider>
    </ShopContextProvider>
  </BrowserRouter>
);
