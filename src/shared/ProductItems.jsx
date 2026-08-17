import { useContext, useState } from "react";
import { ProductContext } from "../Context/ProductContext";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

const ProductItems = ({ products }) => {
  const { AddToCart } = useContext(ProductContext);
  const [few, setFew] = useState(true);
  return (
    <div>
      <div className="new grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
        {few ? (
          <>
            {products?.slice(0, 15).map((item, i) => (
              <div
                key={i}
                className=" w-full rounded-md overflow-hidden border-[1px] border-white p-2"
              >
                <Link
                  style={{ backgroundImage: `url("${item?.image}")` }}
                  className={` w-full h-[300px] bg-cover bg-center block`}
                  to={`singleproduct/${item?.id}`}
                ></Link>

                <div className="flex justify-between items-center ">
                  <div className="flex flex-col  text-white font-semibold">
                    <p>{item?.name}</p>
                    <p>${item?.price}</p>
                  </div>

                  <span
                    onClick={() => {
                      AddToCart(item, 1, item?.defaultSize);
                    }}
                    className=" bg-white text-black rounded-full w-8 h-8 p-2 flex justify-center items-center cursor-pointer"
                  >
                    <FaCartShopping />
                  </span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {products?.map((item, i) => (
              <div
                key={i}
                className=" w-full rounded-md overflow-hidden border-[1px] border-white p-2"
              >
                <Link
                  style={{ backgroundImage: `url("${item?.image}")` }}
                  className={` w-full h-[300px] bg-cover bg-center block`}
                  to={`singleproduct/${item?.id}`}
                ></Link>

                <div className="flex justify-between items-center ">
                  <div className="flex flex-col  text-white font-semibold">
                    <p>{item?.name}</p>
                    <p>${item?.price}</p>
                  </div>

                  <span
                    onClick={() => {
                      AddToCart(item, 1, item?.defaultSize);
                    }}
                    className=" bg-white text-black rounded-full w-8 h-8 p-2 flex justify-center items-center cursor-pointer"
                  >
                    <FaCartShopping />
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="w-full flex justify-center items-center mt-11 p-5">
        {few ? (
          <span
            onClick={() => setFew((prev) => !prev)}
            className="inline-block p-2 bg-white text-black border-[1px] border-black font-semibold rounded-md cursor-pointer"
          >
            Show More
          </span>
        ) : (
          <span
            onClick={() => setFew((prev) => !prev)}
            className="inline-block p-2 bg-white text-black border-[1px] border-black font-semibold rounded-md cursor-pointer"
          >
            Show Less
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductItems;
