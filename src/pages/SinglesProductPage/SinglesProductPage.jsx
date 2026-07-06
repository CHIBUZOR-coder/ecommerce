import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import Layout from "../../shared/Layout.jsx";
import { ProductContext } from "../../Context/ProductContext.jsx";

export default function SinglesProductPage() {
  const { products, AddToCart, HandleGetProduct } = useContext(ProductContext);
  const { id } = useParams();
  const [singleProduct, setSingleProduct] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);


  const sizes = ["S", "M", "L", "XL"];

  useEffect(() => {
    console.log("quant:", quantity);
    console.log("selected_size:", selectedSize);
  }, [quantity, selectedSize]);

  useEffect(() => {
    console.log("selected:", selected);
    if (singleProduct) {
      // console.log("single:", singleProduct);
      console.log("size:", singleProduct.defaultSize);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(singleProduct.defaultSize);
      setSelectedSize(singleProduct.defaultSize);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleProduct]);

  useEffect(() => {
    if (!products.length > 0) {
      HandleGetProduct();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);
  useEffect(() => {
    if (products && products.length > 0) {
      const found = products.find((item) => parseInt(item?.id) === parseInt(id));
 
      console.log("found:", found);
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSingleProduct(found);
    }
  }, [products, id]);

  // useEffect(() => {
  //   console.log("selected:", selected);
  // }, [selected]);

  // useEffect(() => {
  //   console.log("singleProduct:", singleProduct);
  // }, [singleProduct]);
  return (
    <Layout>
      <div className="border border-white flex flex-row items-center justify-evenly gap-2 py-2 px-8">
        <Link to={`/SingleProductPage/${singleProduct?.id}`}>
          <img
            src={singleProduct?.image}
            alt="Sneaker Image"
            className="w-120"
          />
        </Link>
        <div className="flex flex-col gap-2 items-start">
          <p className="text-5xl text-black font-bold">{singleProduct?.name}</p>
          <p className="text-3xl text-black">${singleProduct?.price}</p>
          <p className="text-lg text-gray-600">{singleProduct?.category}</p>
          <div className="flex flex-col gap-2">
            <p className="text-3xl text-black">Quantity</p>
            <input
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              className="border-2 border-gray-800 w-12 text-center text-2xl  aspect-square"
              defaultValue={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-3xl text-black">Size</p>
            <div className="flex flex-row gap-2">
              {singleProduct && (
                <>
                  {singleProduct?.sizes?.map((size, i) => {
                    if (selected && selected === size) {
                      return (
                        <div
                          key={i}
                          className="border-2  w-12 text-center text-2xl  aspect-square bg-red-500 text-white cursor-pointer"
                        >
                          {size}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          onClick={() => {
                            setSelected(size);
                            setSelectedSize(size);
                            // setQuantity()
                          }}
                          key={i}
                          className="border-2 border-black w-12 text-center text-2xl  aspect-square cursor-pointer"
                        >
                          {size}
                        </div>
                      );
                    }
                  })}
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => AddToCart(singleProduct, quantity, selectedSize)}
            className="bg-black px-4 py-2 text-xl text-white rounded-md text-center w-full cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Layout>
  );
}
