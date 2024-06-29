import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { useRouter } from "next/router";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import utility_customer_requirements from "@/utils/enum";
import sampleData from "@/utils/sample";
import { price_sample } from "@/utils/sample1";
import measureGroupNames from "@/utils/measureGroups";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Result() {
    const router = useRouter();
    const { query } = router; 
    const [eliData, setEliData] = useState(sampleData);
    // const costGraphData = price_sample;
    // const energyGraphData = price_sample;
    const [groupSelection, setGroupSelection] = useState([]);

    // Grouped data state variables
    const [groupedData, setGroupedData] = useState({});
    const [groupedDataMinPrice, setGroupedDataMinPrice] = useState({});
    const [groupedDataMaxPrice, setGroupedDataMaxPrice] = useState({});
    const [energyData, setEnergyData] = useState([]);
    const [costGraphData, setCostGraphData] = useState({
        labels: [1,2,3,4,5],
        datasets: [
          {
            label: 'cost savings',
            data: [1,1,1,1,1],
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
    });

    const [energyGraphData, setEnergyGraphData] = useState({
        labels: [1,2,3,4,5],
        datasets: [
          {
            label: 'energy savings',
            data: [1,1,1,1,1],
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
    });

    const [applianceData, setApplianceData] = useState({});
    const fetchEliData = async () => {
        const options = {
            method: 'POST',
            url: 'api/proxy',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.ELI_TOKEN || ''}`,
            },
            data: {
                address: {zipcode: query.zipcode},
                property_type: query.property_type,
                household_income: query.household_income,
                household_size: query.household_size,
                tax_filing_status: query.tax_filing_status,
                utility_customer_requirements: [query.utility_customer_requirements],
            }
        };
        axios
            .request(options)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                setEliData(response.data);
            })
            .catch(function (error) {
                console.error(error);
            }
        );
    }

    const fetchApplianceData = async () => {
        const options = {
            method: 'GET',
            url: 'api/cost_estimate/proxy',
            headers: {
                'content-type': 'application/json',
            },
            params: {
                zipcode: parseInt(query.zipcode),
                appliance: groupSelection ? groupSelection[0] : "",
            },
        };
        console.log(options.params);
        try {
            const response = await axios.request(options);
            console.log(JSON.stringify(response.data));
            setApplianceData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchGraphData = async () => {
        const options = {
            method: 'GET',
            url: 'api/graph/proxy',
            headers: {
                'content-type': 'application/json',
            },
            params: {
                zipcode: parseInt(query.zipcode),
                household_income: query.household_income,
                household_size: query.household_size,
            },
        };
        console.log(options.params);
        try {
            const response = await axios.request(options);
            // console.log(JSON.stringify(response.data));
            setEnergyData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        document.title = "Dashboard";
        
        const key = Object.keys(utility_customer_requirements).find(key => utility_customer_requirements[key] === query.utility_customer_requirements);
        query.utility_customer_requirements = key;
        query.household_income = parseInt(query.household_income);
        query.household_size = parseInt(query.household_size);
        console.log(query);
        // Fetch data
        fetchEliData();
        fetchGraphData();
        fetchApplianceData();
        const newGroupedData = {};
        const newGroupedDataMinPrice = {};
        const newGroupedDataMaxPrice = {};

        eliData.incentives.forEach(incentive => {
            incentive.upgrade_measure_groups.forEach(group => {
                const name = measureGroupNames[group.slug];
                if (!newGroupedData[name]) {
                    newGroupedData[name] = [];
                    newGroupedDataMinPrice[name] = 0;
                    newGroupedDataMaxPrice[name] = 0;
                }
                newGroupedData[name].push(incentive);
                newGroupedDataMinPrice[name] += typeof incentive.min_amount === 'number' ? incentive.min_amount / 100 : 0;
                newGroupedDataMaxPrice[name] += typeof incentive.max_amount === 'number' ? incentive.max_amount / 100 : 0;
            });
        });

        setGroupedData(newGroupedData);
        setGroupedDataMinPrice(newGroupedDataMinPrice);
        setGroupedDataMaxPrice(newGroupedDataMaxPrice);

        eliData.incentives.sort((a, b) => b.max_amount - a.max_amount);
        const sortedEliData = eliData.incentives.sort((a, b) => b.max_amount - a.max_amount);
        setEliData({ ...eliData, incentives: sortedEliData });
        
    }, [query]);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    useEffect(() => {
        // console.log(groupSelection);
        // console.log(energyData["cost_data"])
        if (energyData["cost_data"] === undefined) {
            return;
        }
        const selected_slugs = groupSelection.map((name) => Object.keys(measureGroupNames).find(key => measureGroupNames[key] === name));
        const Interventions = energyData["cost_data"];
        const transformedData = {};

        Interventions.forEach((item) => {
            const intervention = item.Intervention;
            const years = [];
            for (let i = 0; i <= 10; i++) {
                const yearKey = `Year_${i}`;
                years.push(item[yearKey]);
            }
            transformedData[intervention] = years;
        });
        // console.log(transformedData);
        
        const newCostGraphData = {
            labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: Object.keys(transformedData).filter(key => selected_slugs.includes(key)).map(key => {
                const color = getRandomColor();
                return {
                    label: key,
                    data: transformedData[key],
                    fill: false,
                    backgroundColor: color,
                    borderColor: color,
                };
            })
        };
        setCostGraphData(newCostGraphData);

        const energyInterventions = energyData["power_data"];
        const transformedEnergyData = {};
        energyInterventions.forEach((item) => {
            const intervention = item.Intervention;
            const years = [];
            for (let i = 0; i <= 10; i++) {
                const yearKey = `Year_${i}`;
                years.push(item[yearKey]);
            }
            transformedEnergyData[intervention] = years;
        });
        console.log("Transformed Energy Data: ", transformedEnergyData);
        const newEnergyGraphData = {
            labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: Object.keys(transformedEnergyData).filter(key => selected_slugs.includes(key)).map(key => {
                const color = getRandomColor();
                return {
                    label: key,
                    data: transformedEnergyData[key],
                    fill: false,
                    backgroundColor: color,
                    borderColor: color,
                };
            })
        };
        setEnergyGraphData(newEnergyGraphData);

    }, [groupSelection]);

    // Function to toggle selection
    const toggleSelection = (name) => {
        if (groupSelection.includes(name)) {
            setGroupSelection(groupSelection.filter(group => group !== name));
        } else {
            setGroupSelection([...groupSelection, name]);
        }
    };

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Left side */}
        <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #ccc' }}>
            <h2>Incentive Group List</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Object.entries(measureGroupNames).map(([slug, name]) => (
                    <div key={slug} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: groupSelection.includes(name) ? 'lightblue' : 'white' }} onClick={() => toggleSelection(name)}>
                        <h3>{name}</h3>
                        <p>
                            Incentive available: ${groupedDataMinPrice[name]} - ${groupedDataMaxPrice[name]}
                        </p>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Right side */}
        <div style={{ flex: 2, padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}> Graphs </h2>
            <div style={{ marginTop: '20px' }}>
                <h3> Energy Savings </h3>
                <div style={{ width: '50%', height: '300px', margin: '0 auto' }}>
                    <Line data={energyGraphData} />
                </div>
            </div>
            <div style={{ marginTop: '20px' }}>
                <h3> Cost Savings </h3>
                <div style={{ width: '50%', height: '300px', margin: '0 auto' }}>
                    <Line data={costGraphData} />
                </div>
            </div>
            <hr />
            <div>
                <h2 style={{ textAlign: 'center' }}> Incentives </h2>
                    {groupSelection.length > 0 ? (
                    <div>
                        {eliData.incentives.map((incentive, index) => {
                            if (groupSelection.includes(measureGroupNames[incentive.upgrade_measure_groups[0].slug])) {
                                return (
                                    <div key={index} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                                        <h4>{incentive.title}</h4>
                                        <p>{incentive.name}</p>
                                        <p>Min Amount: ${incentive.min_amount/100}</p>
                                        <p>Max Amount: ${incentive.max_amount/100}</p>
                                    </div>
                                );
                            }
                        })}
                    </div>
                ) : (
                    <p>No group selected.</p>
                )}
                <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                <h3>Appliances Cost:</h3>
                {applianceData !== null || applianceData == {} ? (
                    <pre>{JSON.stringify(applianceData, null, 2)}</pre>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            </div>
        </div>
      </div>
    );
}
