import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Pagination from "react-js-pagination";
import MetaData from "./layout/MetaData";
import Loader from "./layout/Loader";
import Product from "./product/Product";

import { useDispatch, useSelector } from "react-redux";

import { getProducts } from "../actions/productActions";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, SetPrice] = useState([1000, 100000]);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

  const categories = [
    "Electronics",
    "Laptops",
    "Cameras",
    "Accessorries",
    "Headphones",
    "Food",
    "Books",
    "Cloths/Shoes",
    "Beauty/Health",
    "Sports",
    "Outdoor",
    "Home",
  ];

  const alert = useAlert();
  const { keyword } = useParams();

  const dispatch = useDispatch();

  const {
    loading,
    products,
    error,
    productsCount,
    resPerPage,
    filterProductsCount,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts(keyword, currentPage, price, category, rating));
  }, [dispatch, alert, error, keyword, currentPage, price, category, rating]);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }
  let count = productsCount;
  if (keyword) {
    count = filterProductsCount;
  }

  return (
    <>
      {loading ? (                                                      
        <Loader />
      ) : (
        <>
          <MetaData title={"Buy Best Products Online"} />

          <h1 id='products_heading'>Latest Products</h1>

          <section id='products' className='container mt-5'>
            <div className='row'>
              {keyword ? (
                <>
                  <div className='col-6 col-md-3 mt-5 mb-5'>
                    <div className='px-5'>
                      <Range
                        marks={{
                          1000: ` ₦1000`,
                          100000: ` ₦100000`,
                        }}
                        min={1000}
                        max={100000}
                        defaultValue={[1000, 100000]}
                        tipFormatter={(value) => `₦${value}`}
                        tipProps={{
                          placement: "top",
                          visible: true,
                        }}
                        value={price}
                        onChange={(price) => SetPrice(price)}
                      />
                      <hr className='my-5' />

                      <div className='mt-5'>
                        <h4 className='mb-3'>categories</h4>
                        <ul className='pl-0'>
                          {categories.map((category) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={category}
                              onClick={() => {
                                setCategory(category);
                              }}
                            >
                              {category}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <hr className='my-3' />

                      <div className='mt-5'>
                        <h4 className='mb-3'>Ratings</h4>
                        <ul className='pl-0'>
                          {[5, 4, 3, 2, 1].map((star) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={star}
                              onClick={() => {
                                setRating(star);
                              }}
                            >
                              <div className='rating-outer'>
                                <div
                                  className='rating-inner'
                                  style={{
                                    width: `${star * 20}%`,
                                  }}
                                ></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='col-6 col-md-9'>
                    <div className='row'>
                      {products.map((product) => (
                        <Product key={product._id} product={product} col={4} />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))
              )}
            </div>
          </section>

          {resPerPage <= count && (
            <div className='d-flex justify-content-center mt-5'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText={"Next"}
                prevPageText={"Prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass='page-item'
                linkClass='page-link'
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
