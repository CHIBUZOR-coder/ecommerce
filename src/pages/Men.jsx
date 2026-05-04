import { useContext, useEffect, useState } from "react";
import Layout from "../shared/Layout";
import { ProductContext } from "../Context/ProductContext";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import ProductItems from "../shared/ProductItems";

const Men = () => {
  const { products, AddToCart } = useContext(ProductContext);

  const [men, setMen] = useState([]);

  useEffect(() => {
    console.log("Home_prod:", products);

    const menProducts = products.filter((item) => item?.category === "men");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMen(menProducts);
  }, [products]);
  return (
    <Layout>
      <div className="min-h-screen bg-black p-4">
        <div className="main">
          <div className="section1 ">
            <p className="font-[900] text-lg text-white mb-5">For Men</p>

            <ProductItems products={men} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Men;
