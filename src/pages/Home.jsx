import { useContext} from "react";
import Layout from "../shared/Layout";
import { ProductContext } from "../Context/ProductContext";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import ProductItems from "../shared/ProductItems";

const Home = () => {
  const { products } = useContext(ProductContext);
  // useEffect(() => {
  //   console.log("Home_prod:", products);
  // }, [products]);

  return (
    <Layout>
      <div className="min-h-screen bg-black p-4">
        <div className="bg-center bg-cover bg-[url('/images/hero.jpg')] h-[500px]"></div>

        <div className="main">
          <div className="section1 ">
            <p className="font-[900] text-lg text-white">NEW HEAT</p>

            <ProductItems products={products} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
