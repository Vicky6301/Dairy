// src/pages/PlaceOrder.jsx
import { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const getUserIdFromToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.id || payload.userId || payload._id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [hasSetPassword, setHasSetPassword] = useState(false);

  const {
    backendUrl,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendOTP = async () => {
    const mobile = formData.phone.trim();
    if (!mobile) return toast.error("Please enter your mobile number");
    if (!/^\d{10}$/.test(mobile)) return toast.error("Enter a valid 10-digit mobile number");

    try {
      const fullMobile = "+91" + mobile;
      const { data } = await axios.post(`${backendUrl}/api/otp/send-otp`, {
        mobile: fullMobile,
      });
      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // ✅ UPDATED: Include email in OTP verify request
  const verifyOTP = async () => {
    if (!otp) return toast.error("Please enter OTP");
    const mobile = formData.phone.trim();
    if (!/^\d{10}$/.test(mobile)) return;

    try {
      const fullMobile = "+91" + mobile;
      const { data } = await axios.post(`${backendUrl}/api/otp/verify-otp`, {
        mobile: fullMobile,
        otp,
        email: formData.email || undefined // ✅ send email if available
      });

      if (data.success) {
        setToken(data.token);
        setUserId(data.user.id); // ✅ critical: user.id must exist
        setVerified(true);
        localStorage.setItem("token", data.token);
        toast.success("OTP verified! Set a password to log in faster next time.");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  // ✅ UPDATED: Set password with token from OTP verify
  const setPasswordHandler = async () => {
    if (!password || password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/set-password`,
        { password },
        { headers: { token } } // ✅ uses token from OTP verify
      );

      if (data.success) {
        setHasSetPassword(true);
        toast.success("Password set! You can now log in with mobile + password.");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to set password");
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            setCartItems({});
            toast.success("Order placed successfully!");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response?.data?.message || "Payment failed");
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const placeOrder = async () => {
    if (!verified) return toast.error("Please verify OTP first");

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            const itemInfo = structuredClone(
              products.find((p) => p._id === items)
            );
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[items][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (!userId) {
        return toast.error("User ID missing. Please verify OTP again.");
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        userId: userId,
      };

      switch (method) {
        case "cod":
          const res = await axios.post(`${backendUrl}/api/order/place`, orderData, {
            headers: { token },
          });
          if (res.data.success) {
            setCartItems({});
            toast.success("Order placed successfully!");
          } else {
            toast.error(res.data.message || "Order failed");
          }
          break;
        case "razorpay":
          const responseRazorpay = await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            { headers: { token } }
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          } else {
            toast.error(responseRazorpay.data.message);
          }
          break;
        case "stripe":
          const responseStripe = await axios.post(
            `${backendUrl}/api/order/stripe`,
            orderData,
            { headers: { token } }
          );
          if (responseStripe.data.success) {
            window.location.replace(responseStripe.data.session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        default:
          toast.warn("Select a valid payment method");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Order placement failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 pt-10 sm:pt-16 px-4 sm:px-14 min-h-[85vh] bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col gap-6 w-full lg:w-2/3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Delivery <span className="text-green-600">Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            placeholder="First Name"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-200 focus:outline-none shadow-sm"
          />
          <input
            required
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            placeholder="Last Name"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-200 focus:outline-none shadow-sm"
          />
        </div>

        <input
          required
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          placeholder="Email Address"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-200 focus:outline-none shadow-sm"
        />
        <input
          required
          name="street"
          value={formData.street}
          onChange={onChangeHandler}
          placeholder="Street Address"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-200 focus:outline-none shadow-sm"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            placeholder="City"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-200 focus:outline-none shadow-sm"
          />
          <input
            required
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            placeholder="State"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-200 focus:outline-none shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            name="zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            placeholder="Zipcode"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-200 focus:outline-none shadow-sm"
          />
          <input
            required
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            placeholder="Country"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-200 focus:outline-none shadow-sm"
          />
        </div>

        {/* Phone & OTP */}
        <div className="flex gap-2 mt-2">
          <input
            required
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              phone: e.target.value.replace(/\D/g, '').slice(0, 10)
            }))}
            placeholder="Mobile Number"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-200 focus:outline-none shadow-sm"
            disabled={verified}
          />
          {!otpSent ? (
            <button
              type="button"
              onClick={sendOTP}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Send OTP
            </button>
          ) : !verified ? (
            <>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="border border-gray-300 rounded-lg px-4 py-2 w-32 focus:ring-2 focus:ring-green-200 focus:outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={verifyOTP}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Verify OTP
              </button>
            </>
          ) : (
            <span className="text-green-600 font-semibold self-center">Verified</span>
          )}
        </div>

        {/* Set Password After Verification */}
        {verified && !hasSetPassword && (
          <div className="mt-4 space-y-3 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">
              🔒 Set a password to log in faster next time (optional):
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password (min 6 chars)"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={setPasswordHandler}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                Save Password
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/3 flex flex-col gap-6 mt-10 lg:mt-0">
        <div className="sticky top-32 bg-white rounded-2xl shadow-lg p-6">
          <CartTotal />

          <div className="mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Payment <span className="text-green-600">Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {[
                { id: "stripe", logo: assets.stripe_logo, label: "" },
                { id: "razorpay", logo: assets.razorpay_logo, label: "" },
                { id: "cod", logo: "", label: "Cash on Delivery" },
              ].map((pay) => (
                <div
                  key={pay.id}
                  onClick={() => setMethod(pay.id)}
                  className={`flex flex-col items-center justify-center gap-2 border rounded-lg p-3 cursor-pointer transition-all shadow-sm w-full h-20 ${
                    method === pay.id
                      ? "border-green-600 bg-green-50 shadow-md"
                      : "border-gray-300 hover:shadow-md"
                  }`}
                >
                  <p
                    className={`min-w-4 h-4 border rounded-full transition ${
                      method === pay.id ? "bg-green-600" : ""
                    }`}
                  ></p>

                  {pay.logo ? (
                    <div className="w-20 h-8 flex items-center justify-center overflow-hidden">
                      <img
                        src={pay.logo}
                        alt={pay.id}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-700 font-medium text-sm text-center">
                      {pay.label}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={placeOrder}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;