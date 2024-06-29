"use client"
import React, { useState } from 'react';

const InterestSelection = ({ selectedOption, setSelectedOption }) => {

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
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
        </div>
    );
};

export default InterestSelection;