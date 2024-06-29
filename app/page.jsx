"use client"

import "@/styles/globals.css"
import InterestSelection from "@/pages/landing";
import NextPageForm from "@/pages/form";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({
    zipcode: '',
    utility_customer_requirements: '',
    household_income: '',
    household_size: '',
    tax_filling_status: 'individual',
    property_type: 'single_family'
  });

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = formData;
    const query = new URLSearchParams(data);
    router.push(`/result?${query.toString()}`);
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
