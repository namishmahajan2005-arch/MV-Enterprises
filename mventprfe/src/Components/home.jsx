import { Navbar } from "./navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

export function Home() {
  const [products, setProducts] = useState([]);
  console.log(products);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  const categories = [...new Set(products.map(p => p.item_category))];

  return (
    <div className="min-h-screen bg-[#FCFAF8] font-sans">
      <Navbar />

      <header className="py-16 text-center md:py-24 px-4">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-800 tracking-tight mb-4">
          Curated Gifts for Every Occasion
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Find the perfect expression of your love, appreciation, and joy with our thoughtfully selected collections.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {categories.map(category => {
          const subcatlist = products
            .filter(p => p.item_category === category)
            .reduce((acc, product) => {
              if (!acc[product.item_subcategory]) {
                acc[product.item_subcategory] = product;
              }
              return acc;
            }, {});

          return (
            <section key={category} className="mb-20">
              <div className="flex items-center mb-8">
                <h2 className="text-3xl font-serif text-gray-800 capitalize tracking-wide">
                  {category}
                </h2>
                <div className="ml-6 flex-grow border-t border-gray-200"></div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(subcatlist).map(([subcat, product]) => (
                  <Link
                    key={subcat}
                    to={`/subcategory/${encodeURIComponent(subcat)}`}
                    state={{ allproducts: products }}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0ebe1]"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={`http://127.0.0.1:8000${product.images[0]}`}
                        alt={subcat}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>

                    <div className="p-6 flex items-center justify-between bg-white">
                      <h3 className="text-lg font-medium text-gray-800 capitalize group-hover:text-rose-600 transition-colors duration-300">
                        {subcat}
                      </h3>
                      <span className="flex justify-center items-center w-8 h-8 rounded-full bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                        <FaArrowRightLong size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}