
from dotenv import load_dotenv
import os

from get_appliance_cost import appliance_cost

import uvicorn

from flask import Flask, request, jsonify
from home_energy_data_plots import plot_main

load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_APIKEY")
app = Flask(__name__)

@app.route('/get_data', methods=['GET'])
def get_data():
    # Parse query parameters from the request
    example_zip_code = int(request.args.get('zipcode'))
    example_income = int(request.args.get('household_income'))
    example_num_people = int(request.args.get('household_size'))
    
    # Paths to your data files
    recs_path = 'recs2020_public_v7.csv'
    codebook_path = 'codebook-Table 1.csv'
    zip_code_path = 'uszips.csv'
    electricity_price_filepath = 'electricity_prices.csv'
    intervention_impact_filepath = 'interventions_impact.csv'
    
    # Call your main plotting function
    power_df, cost_df = plot_main(recs_path, codebook_path, zip_code_path, electricity_price_filepath,
                                  intervention_impact_filepath, example_zip_code, example_income, example_num_people)
    
    # Check if data is available
    if power_df is not None and cost_df is not None:
        # Prepare JSON response
        response = {
            'power_data': power_df.to_dict(orient='records'),
            'cost_data': cost_df.to_dict(orient='records')
        }
        return jsonify(response), 200
    else:
        return jsonify({'error': 'Data not found'}), 404
    
@app.route('/get_appliance_cost', methods=['GET'])
def get_appliance_cost():
    # Parse query parameters from the request
    example_zip_code = int(request.args.get('zipcode'))
    example_appliance = str(request.args.get('appliance'))
    
    # Call your main plotting function
    response = appliance_cost(OPENAI_KEY if OPENAI_KEY else "", 'gpt-3.5-turbo', example_zip_code, example_appliance)
    
    # Check if data is available
    if response:
        return jsonify(response), 200
    else:
        return jsonify({'error': 'Data not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)