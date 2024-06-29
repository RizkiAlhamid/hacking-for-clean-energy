import axios from 'axios';

export default async function handler(req, res) {
    const { zipcode, appliance } = req.query;
    const url = 'http://127.0.0.1:5000/get_appliance_cost';
    const body = {
        zipcode,
        appliance,
    };
    console.log(body);

    try {
        const response = await axios({
            url,
            params: body,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { error: 'Internal Server Error' });
    }
}