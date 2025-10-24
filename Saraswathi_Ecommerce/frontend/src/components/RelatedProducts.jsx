import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from './Title';
import ProducItem from "./ProducItem";
import PropTypes from 'prop-types';



const RelatedProducts = ({ category, subCategory }) => {

  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);


  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
      setRelated(productsCopy.slice(0, 5));
    }

  }, [products, category, subCategory])

  return (

    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
          <span className="text-green-500">RELATED </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-500">
            PRODUCTS
          </span>
        </h2>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-5">

        {related.map((item, index) => (
          <ProducItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
        ))}

      </div>

    </div>
  )
}
RelatedProducts.propTypes = {
  category: PropTypes.string.isRequired,
  subCategory: PropTypes.string.isRequired,
};

export default RelatedProducts
