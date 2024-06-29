"use client"

import "@/styles/globals.css"
import InterestSelection from "@/pages/landing";
import NextPageForm from "@/pages/form";
import { useState } from "react";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({
    zipcode: '',
    utilityProvider: '',
    householdIncome: '',
    peopleInHousehold: '',
    taxFilingStatus: 'individual',
    propertyType: 'single_family'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {selectedOption, ...formData};
    console.log(JSON.stringify(data, null, 2));
  }

  return (
    <div>
        <InterestSelection
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        {selectedOption &&
          <NextPageForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        }
    </div>
  );
}
