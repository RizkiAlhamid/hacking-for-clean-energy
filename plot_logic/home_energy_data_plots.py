import pandas as pd # type: ignore

def load_data(recs_path, codebook_path, zip_code_path):
    df = pd.read_csv(recs_path)
    zip_code_df = pd.read_csv(zip_code_path)
    return df, zip_code_df

def preprocess_recs_data(df):
    columns_to_extract = ['state_postal', 'BA_climate', 'TOTALBTU', 'KWH', 'TOTSQFT_EN', 'MONEYPY', 'NHSLDMEM', 'ELXBTU']
    filtered_df = df[columns_to_extract]
    
    income_mapping = {
        1: 1250, 2: 3750, 3: 6250, 4: 8750, 5: 12500, 6: 17500, 
        7: 22500, 8: 30000, 9: 40000, 10: 50000, 11: 60000, 
        12: 70000, 13: 87500, 14: 110000, 15: 130000, 16: 150000, 
        17: 170000, 18: 190000, 19: 225000
    }
    filtered_df['MONEYPY'] = filtered_df['MONEYPY'].map(income_mapping)
    
    filtered_df = filtered_df.astype({
        'TOTALBTU': float, 'KWH': float, 'ELXBTU': float, 
        'TOTSQFT_EN': float, 'NHSLDMEM': int, 'MONEYPY': float
    })
    
    return filtered_df

def create_zip_code_mapping(zip_code_df):
    return zip_code_df.set_index('zip')['state_id'].to_dict()

def closest_income_range(household_income, income_mapping):
    income_values = list(income_mapping.values())
    return min(income_values, key=lambda x: abs(x - household_income))

def descriptive_rep_home_info(representative_home_info):
    return {
        'State_Postal_Code': representative_home_info.get('state_postal'),
        'Climate_Zone': representative_home_info.get('BA_climate'),
        'Total_ThousandBTU': representative_home_info.get('TOTALBTU'),
        'Total_KWH': representative_home_info.get('KWH'),
        'Square_Footage': representative_home_info.get('TOTSQFT_EN'),
        'Household_Income': representative_home_info.get('MONEYPY'),
        'Household_Members': representative_home_info.get('NHSLDMEM'),
        'KWH_ThousandBTU_Conversion_Factor': representative_home_info.get('ELXBTU')
    }

def filter_households(zip_code, household_income, num_people, filtered_df, zip_code_mapping, income_mapping):
    state_postal = zip_code_mapping.get(zip_code)
    
    if not state_postal:
        raise ValueError(f"Zip code {zip_code} not found in the mapping.")
        
    filtered = filtered_df[(filtered_df['state_postal'] == state_postal) & (filtered_df['NHSLDMEM'] == num_people)]
    closest_income = closest_income_range(household_income, income_mapping)
    filtered = filtered[filtered['MONEYPY'] == closest_income]

    if not filtered.empty:
        numerical_cols = ['KWH', 'TOTALBTU', 'TOTSQFT_EN', 'MONEYPY', 'NHSLDMEM', 'ELXBTU']
        representative_home = filtered[numerical_cols].mean().to_dict()
        
        categorical_cols = ['state_postal', 'BA_climate']
        for col in categorical_cols:
            representative_home[col] = filtered[col].mode()[0]
        
        return descriptive_rep_home_info(representative_home)
    return None

def convert_representative_home_info(input_data):
    total_kwh = input_data['Total_KWH'] + (input_data['Total_ThousandBTU'] / input_data['KWH_ThousandBTU_Conversion_Factor'])
    return {
        'State': input_data['State_Postal_Code'],
        'Power_Consumption_KWH': total_kwh
    }

def readying_data_for_output(representative_home_info, electricity_price_filepath):
    electricity_prices = pd.read_csv(electricity_price_filepath)
    rep_df = pd.DataFrame(representative_home_info, index=[0])
    output_df = pd.merge(rep_df, electricity_prices, on='State')
    output_df['Total_Cost'] = output_df['Power_Consumption_KWH'] * output_df['Electricity_Rate_per_kWh']
    output_df = output_df.drop(columns=['Electricity_Rate_per_kWh'])
    return output_df

def prices_for_next_10_years(prepped_data, intervention_impact_filepath):
    intervention_impact = pd.read_csv(intervention_impact_filepath)
    output_df = pd.merge(prepped_data, intervention_impact, on='State')
    
    future_power_consumption = []
    future_total_cost = []
    years = [f'Year_{i}' for i in range(11)]
    
    for _, row in output_df.iterrows():
        annual_power = row['Power_Consumption_KWH']
        annual_cost = row['Total_Cost']
        
        annual_tech_improvement_rate = row['Annual_Tech_Improvement_Rate']
        annual_cost_change_rate = row['Annual_Cost_Change_Rate']
        kwh_reduction = row['KWH_Reduction']
        cost_reduction = row['Cost_Reduction']
        
        annual_power_reductions = [annual_power]
        annual_cost_reductions = [annual_cost]
        
        for year in range(1, 11):
            annual_power *= (1 - kwh_reduction * (1 + annual_tech_improvement_rate) ** year)
            annual_cost *= (1 - cost_reduction * (1 + annual_cost_change_rate) ** year)
            
            annual_power_reductions.append(annual_power)
            annual_cost_reductions.append(annual_cost)
        
        future_power_consumption.append(annual_power_reductions)
        future_total_cost.append(annual_cost_reductions)
    
    power_df = pd.DataFrame(future_power_consumption, columns=years)
    cost_df = pd.DataFrame(future_total_cost, columns=years)
    
    power_df.insert(0, 'Intervention', output_df['Intervention'])
    power_df.insert(1, 'State', output_df['State'])
    
    cost_df.insert(0, 'Intervention', output_df['Intervention'])
    cost_df.insert(1, 'State', output_df['State'])
    
    return power_df, cost_df

def plot_main(recs_path, codebook_path, zip_code_path, electricity_price_filepath, intervention_impact_filepath, example_zip_code, example_income, example_num_people):
    df, zip_code_df = load_data(recs_path, codebook_path, zip_code_path)
    filtered_df = preprocess_recs_data(df)
    
    zip_code_mapping = create_zip_code_mapping(zip_code_df)
    income_mapping = {
        1: 1250, 2: 3750, 3: 6250, 4: 8750, 5: 12500, 6: 17500, 
        7: 22500, 8: 30000, 9: 40000, 10: 50000, 11: 60000, 
        12: 70000, 13: 87500, 14: 110000, 15: 130000, 16: 150000, 
        17: 170000, 18: 190000, 19: 225000
    }
    
    representative_home_info = filter_households(
        example_zip_code, example_income, example_num_people, filtered_df, zip_code_mapping, income_mapping
    )
    
    if representative_home_info:
        representative_home_info = convert_representative_home_info(representative_home_info)
        prepped_data = readying_data_for_output(representative_home_info, electricity_price_filepath)
        power_df, cost_df = prices_for_next_10_years(prepped_data, intervention_impact_filepath)
        return power_df, cost_df
    return None, None


if __name__ == "__main__":
    recs_path = 'recs2020_public_v7.csv'
    codebook_path = 'codebook-Table 1.csv'
    zip_code_path = 'uszips.csv'
    electricity_price_filepath = 'electricity_prices.csv'
    intervention_impact_filepath = 'interventions_impact.csv'
    example_zip_code = 94103
    example_income = 23400
    example_num_people = 1

    power_df, cost_df = plot_main(recs_path, codebook_path, zip_code_path, electricity_price_filepath, intervention_impact_filepath, 
                             example_zip_code, example_income, example_num_people)
    print(power_df)
    print(cost_df)