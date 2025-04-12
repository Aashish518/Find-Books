import React, { useState } from "react";
import "../pages-css/Useraddress.css";
import {useNavigate } from "react-router-dom";
import { useCart } from "../Context/order";
import { useAlert } from "../Context/AlertContext";

export const Useraddress = () => {
    const Navigate = useNavigate();
    const { cartData } = useCart();
    const [order, setOrder] = useState({});
    const [errors, setErrors] = useState({});
    const { showAlert } = useAlert();

    const [formData, setFormData] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });

    const validateForm = () => {
        const newErrors = {};
        
        if (formData.address.trim().length < 10) {
            newErrors.address = "Address should be at least 10 characters long";
        }

        if (!/^[a-zA-Z\s]{3,}$/.test(formData.city)) {
            newErrors.city = "City should contain only letters and be at least 3 characters long";
        }

        if (!/^[a-zA-Z\s]{3,}$/.test(formData.state)) {
            newErrors.state = "State should contain only letters and be at least 3 characters long";
        }

        if (!/^[a-zA-Z\s]{4,}$/.test(formData.country)) {
            newErrors.country = "Country should contain only letters and be at least 4 characters long";
        }

        if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Pincode must be exactly 6 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch("http://localhost:2606/api/Order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    cartid: cartData.cartid,
                }),
                credentials: "include"
            });

            const json = await response.json();

            if (json.order) {
                setOrder(json.order);
                Navigate("/payment", { 
                    state: { 
                        total: cartData.totalamount, 
                        address: json.order, 
                        cartDatas: cartData 
                    }
                });
            } else {
                showAlert(json.message || "Failed to save address","error");
                Navigate("/cart");
            }
        } catch (error) {
            console.error("Error occurred during submission:", error);
            showAlert("An error occurred. Please try again later.","error");
        }
    };

    return (
        <div className="ua-container">
            <form onSubmit={handleSubmit} className="ua-form">
                <h2 className="ua-title">Delivery Address</h2>
                
                <div className="ua-form-group">
                    <label htmlFor="address" className="ua-label">Address:</label>
                    <textarea
                        id="address"
                        name="address"
                        className={`ua-textarea ${errors.address ? 'ua-input-error' : ''}`}
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Enter your complete address"
                    />
                    {errors.address && <span className="ua-error-text">{errors.address}</span>}
                </div>

                <div className="ua-form-group">
                    <label htmlFor="city" className="ua-label">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        className={`ua-input ${errors.city ? 'ua-input-error' : ''}`}
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Enter city name"
                    />
                    {errors.city && <span className="ua-error-text">{errors.city}</span>}
                </div>

                <div className="ua-form-group">
                    <label htmlFor="state" className="ua-label">State:</label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        className={`ua-input ${errors.state ? 'ua-input-error' : ''}`}
                        value={formData.state}
                        onChange={handleChange}
                        required
                        placeholder="Enter state name"
                    />
                    {errors.state && <span className="ua-error-text">{errors.state}</span>}
                </div>

                <div className="ua-form-group">
                    <label htmlFor="country" className="ua-label">Country:</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        className={`ua-input ${errors.country ? 'ua-input-error' : ''}`}
                        value={formData.country}
                        onChange={handleChange}
                        required
                        placeholder="Enter country name"
                    />
                    {errors.country && <span className="ua-error-text">{errors.country}</span>}
                </div>

                <div className="ua-form-group">
                    <label htmlFor="pincode" className="ua-label">Pincode:</label>
                    <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        className={`ua-input ${errors.pincode ? 'ua-input-error' : ''}`}
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        placeholder="Enter 6-digit pincode"
                        maxLength="6"
                    />
                    {errors.pincode && <span className="ua-error-text">{errors.pincode}</span>}
                </div>

                <button type="submit" className="ua-submit-btn">
                    Continue to Payment
                </button>
            </form>
        </div>
    );
};