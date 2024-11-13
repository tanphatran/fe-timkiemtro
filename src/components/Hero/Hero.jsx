import React, { useState } from 'react';

const Hero = () => {
    const [priceValue, setPriceValue] = useState(500000);

    return (
        <div className="bg-black/20 h-full">
            <div className="h-full flex justify-center items-center p-4 bg-primary/10">
                <div className="container grid grid-cols-1 gap-4">
                    <div className="text-white">
                        <p data-aos="fade-up" className="text-sm">
                            Cho thuê siêu rẻ, đăng tin siêu lẹ
                        </p>
                        <p
                            data-aos="fade-up"
                            data-aos-delay="300"
                            className="font-bold text-3xl"
                        >
                            Bạn đang tìm kiếm gì
                        </p>
                    </div>

                    {/* Tìm kiếm và giá tối đa */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="600"
                        className="space-y-4 bg-white rounded-md p-4 relative"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 items-center">
                            <div>
                                <label htmlFor="destination" className="opacity-70">
                                    Tìm kiếm phòng trọ
                                </label>
                                <input
                                    type="text"
                                    name="destination"
                                    id="destination"
                                    placeholder="Phòng trọ tốt"
                                    className="w-full bg-gray-100 my-2 focus:outline-primary focus:outline outline-1 rounded-full p-2"
                                />
                            </div>

                            {/* Phần giá tối đa */}
                            <div>
                                <label htmlFor="price" className="opacity-70 block">
                                    <div className="w-full flex justify-between items-center">
                                        <p>Giá tối đa</p>
                                        <p className="font-bold text-xl">{priceValue.toLocaleString()} VND</p>
                                    </div>
                                </label>
                                <div className="bg-gray-100 rounded-full p-2">
                                    <input
                                        type="range"
                                        name="price"
                                        id="price"
                                        className="appearance-none w-full bg-gradient-to-r from-primary to-secondary h-2 rounded-full my-2"
                                        min="500000"
                                        max="10000000"
                                        value={priceValue}
                                        step="500000"
                                        onChange={(e) => setPriceValue(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 px-4 py-2 rounded-full duration-200 absolute -bottom-5 left-1/2 -translate-x-1/2">
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
