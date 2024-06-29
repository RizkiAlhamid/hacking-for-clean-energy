"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';

const InterestSelection = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleNext = () => {
        // Navigate to the next page with selectedOption data
        Router.push({
            pathname: '/next-page',
            query: { selection: selectedOption },
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">What are you interested in?</h1>
            <div className="flex space-x-4">
                <button
                    className={`p-4 border border-gray-300 rounded-md ${selectedOption === 'browse' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => handleOptionSelect('browse')}
                >
                    I'm browsing what is available
                </button>
                <button
                    className={`p-4 border border-gray-300 rounded-md ${selectedOption === 'project' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => handleOptionSelect('project')}
                >
                    I have a specific project that needs incentives
                </button>
            </div>
            {selectedOption && (
                <div className="mt-8">
                    {/* Use Link directly without wrapping in <a> tag */}
                    <Link href="/next-page">
                    </Link>
                </div>
            )}
        </div>
    );
};

export default InterestSelection;