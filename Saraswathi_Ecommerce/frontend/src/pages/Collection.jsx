import { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "./../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "./../components/Title";
import ProducItem from "./../components/ProducItem";
import { motion } from "framer-motion";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevent");
  const sectionRef = useRef(null);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let filterProductCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(filterProductCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProducts(filterProductCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // Auto-scroll to section with offset for navbar
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -120); // Adjust according to navbar height
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen pt-[120px] sm:pt-[100px] pb-24 px-4 sm:px-10" ref={sectionRef}>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
        {/* Filters */}
        <div className="min-w-60 flex flex-col gap-6">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2 font-semibold text-green-700 sm:hidden"
          >
            FILTERS
            <img
              className={`h-4 transition-transform ${showFilter ? "rotate-90" : ""}`}
              src={assets.dropdown_icon}
              alt="dropdown_icon"
            />
          </p>

          {/* Category */}
          <div className={`bg-white shadow-md rounded-lg p-4 transition-all ${showFilter ? "block" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-semibold text-gray-800">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Milk & Beverages"} onChange={toggleCategory} />
                Milk & Beverages
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Curd, Yogurt & Cream"} onChange={toggleCategory} />
                Curd, Yogurt & Cream
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Doodh Peda"} onChange={toggleCategory} />
                Doodh Peda
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Cheese & Butter"} onChange={toggleCategory} />
                Cheese & Other Dairy
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Paneer & Ghee"} onChange={toggleCategory} />
                Paneer & Ghee
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Flavored Products"} onChange={toggleCategory} />
                Flavored Products
              </label>
            </div>
          </div>

          {/* SubCategory */}
          <div className={`bg-white shadow-md rounded-lg p-4 transition-all ${showFilter ? "block" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-semibold text-gray-800">TYPE</p>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Milk"} onChange={toggleSubCategory} />
                Milk
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Curd"} onChange={toggleSubCategory} />
                Curd
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Doodh Peda"} onChange={toggleSubCategory} />
                Doodh Peda
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Yogurt"} onChange={toggleSubCategory} />
                Yogurt
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Cream"} onChange={toggleSubCategory} />
                Cream
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Cheese"} onChange={toggleSubCategory} />
                Cheese
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Butter"} onChange={toggleSubCategory} />
                Buttermilk
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Paneer"} onChange={toggleSubCategory} />
                Paneer
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Ghee"} onChange={toggleSubCategory} />
                Ghee
              </label>
              <label className="flex items-center gap-2">
                <input className="w-4 h-4 accent-green-600" type="checkbox" value={"Flavored Milk"} onChange={toggleSubCategory} />
                Flavored Milk
              </label>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center mb-4">
            <div className="mb-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
                <span className="text-green-600">All</span>
                <span className="text-green-500 tracking-wide">Products</span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">Explore our full range of fresh dairy products</p>
            </div>

            {/* <select
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-green-200 rounded-md text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="relevent">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select> */}
          </div>

          {/* Animated Grid */}
          <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filterProducts.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotateX: 5, rotateY: 5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  rotateX: 2,
                  rotateY: 2,
                  boxShadow: "0px 15px 25px rgba(0,128,0,0.2)",
                }}
              >
                <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform duration-300 hover:shadow-2xl">
                  <ProducItem
                    name={item.name}
                    id={item._id}
                    image={item.image}
                    rating={item.rating || 0}
                    reviews={item.reviews?.length || 0}
                    variants={item.variants || []}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
