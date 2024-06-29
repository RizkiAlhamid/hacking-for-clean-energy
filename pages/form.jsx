"use client"
import { useState } from 'react';

function NextPageForm({ formData, setFormData, handleSubmit }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Enter Your Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">Zipcode</label>
                    <input
                        type="text"
                        id="zipcode"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="utilityProvider" className="block text-sm font-medium text-gray-700">Utility Provider</label>
                    <input
                        type="text"
                        id="utilityProvider"
                        name="utilityProvider"
                        value={formData.utilityProvider}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="householdIncome" className="block text-sm font-medium text-gray-700">Household Income</label>
                    <input
                        type="text"
                        id="householdIncome"
                        name="householdIncome"
                        value={formData.householdIncome}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="peopleInHousehold" className="block text-sm font-medium text-gray-700">Number of People in Household</label>
                    <input
                        type="number"
                        id="peopleInHousehold"
                        name="peopleInHousehold"
                        value={formData.peopleInHousehold}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="taxFilingStatus" className="block text-sm font-medium text-gray-700">Tax Filing Status</label>
                    <select
                        id="taxFilingStatus"
                        name="taxFilingStatus"
                        value={formData.taxFilingStatus}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="individual">Individual</option>
                        <option value="head_of_household">Head of Household</option>
                        <option value="joint">Joint</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
                    <select
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="single_family">Single Family</option>
                        <option value="multi_family">Multi Family</option>
                    </select>
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NextPageForm;
