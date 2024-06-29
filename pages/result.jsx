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
    const costGraphData = price_sample;
    // const energyGraphData = price_sample;
    const [groupSelection, setGroupSelection] = useState([]);

    // Grouped data state variables
    const [groupedData, setGroupedData] = useState({});
    const [groupedDataMinPrice, setGroupedDataMinPrice] = useState({});
    const [groupedDataMaxPrice, setGroupedDataMaxPrice] = useState({});
    const [energyData, setEnergyData] = useState([]);
    const [energyGraphData, setEnergyGraphData] = useState({
        labels: [1,2,3,4,5],
        datasets: [
          {
            label: 'energy savings',
            data: [1,2,3,4,5],
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
    });

    // const data1 = {
    //     labels: energyGraphData.map((key) => key.year),
    //     datasets: [
    //       {
    //         label: 'energy savings',
    //         data: energyGraphData.map((key) => key.price),
    //         fill: false,
    //         backgroundColor: 'rgba(75,192,192,0.4)',
    //         borderColor: 'rgba(75,192,192,1)',
    //       },
    //     ],
    // };

    const data2 = {
        labels: costGraphData.map((key) => key.year),
        datasets: [
          {
            label: 'cost savings',
            data: costGraphData.map((key) => key.price),
            fill: false,
            backgroundColor: 'rgba(153,102,255,0.4)',
            borderColor: 'rgba(153,102,255,1)',
          },
        ],
    };

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

    useEffect(() => {
        console.log(groupSelection);
        console.log(energyData["cost_data"])
        if (energyData["cost_data"] === undefined) {
            return;
        }
        const selected_slugs = groupSelection.map((name) => Object.keys(measureGroupNames).find(key => measureGroupNames[key] === name));
        const Interventions = energyData["cost_data"];
        console.log(Interventions);
        
        const newGraphData = {
            labels: [0,1,2,3,4,5,6,7,8,9,10],
            datasets: [
                {
                    label: 'energy savings',
                    data: [1,2,43,5,6,5],
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                }
            ],
        };
        setEnergyGraphData(newGraphData);
        // console.log(newGraphData);

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
                    <Line data={data2} />
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
            </div>
        </div>
      </div>
    );
}
