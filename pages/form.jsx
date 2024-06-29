"use client"
import utility_customer_requirements from "@/utils/enum";

function NextPageForm({ formData, setFormData, handleSubmit }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUtilityCustomerRequirements = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

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
                    <label htmlFor="utility_customer_requirements" className="block text-sm font-medium text-gray-700">Utility Provider</label>
                    <select
                        id="utility_customer_requirements"
                        name="utility_customer_requirements"
                        value={formData.utility_customer_requirements}
                        onChange={handleUtilityCustomerRequirements}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        {Object.keys(utility_customer_requirements).map((key) => (
                            <option key={key} value={utility_customer_requirements[key]}>
                                {utility_customer_requirements[key]}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="household_income" className="block text-sm font-medium text-gray-700">Household Income</label>
                    <input
                        type="text"
                        id="household_income"
                        name="household_income"
                        value={formData.household_income}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="household_size" className="block text-sm font-medium text-gray-700">Number of People in Household</label>
                    <input
                        type="number"
                        id="household_size"
                        name="household_size"
                        value={formData.household_size}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="tax_filling_status" className="block text-sm font-medium text-gray-700">Tax Filing Status</label>
                    <select
                        id="tax_filling_status"
                        name="tax_filling_status"
                        value={formData.tax_filling_status}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="individual">Individual</option>
                        <option value="head_of_household">Head of Household</option>
                        <option value="joint">Joint</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">Property Type</label>
                    <select
                        id="property_type"
                        name="property_type"
                        value={formData.property_type}
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
