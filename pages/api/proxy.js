import axios from 'axios';

export default async function handler(req, res) {
    const { method, body } = req;
    const url = 'https://api.eli.build/incentives';

    try {
        const response = await axios({
            method,
            url,
            data: body,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.ELI_TOKEN || ""}`,
            },
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { error: 'Internal Server Error' });
    }
}
