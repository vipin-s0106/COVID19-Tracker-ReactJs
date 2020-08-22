import React, {useState, useEffect} from 'react';
import './App.css';
import { 
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent
 } from '@material-ui/core';


import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData} from './util';
import LineGraph from './LineGraph';


function App() {

  const [countries,setCountries] = useState(['USA','INDIA','UK']);

  const [country,setCountry] = useState('worldwide');

  const [countryInfo, setCountryInfo] = useState({})

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data)
    })
  }, [])


  useEffect(() =>{
    const getCountriesData = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) =>{
        const countries = data.map((country) => (
          {
            name: country.country,//USA, India
            value: country.countryInfo.iso2 // UK, USA, FR
          }
        ));

        const sortedData = sortData(data);
      
        setTableData(sortedData);
        setCountries(countries)

      });
    };

    getCountriesData();

  },[])


  const onCountryChange = async (event) =>{
    const countryCode = event.target.value

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' 
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setCountry(countryCode)
      setCountryInfo(data);
    })

  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h2>COVID-19 TRACKER</h2>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) =>{
                  return <MenuItem value={country.value}>{country.name}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__status">
            <InfoBox 
              title="Coronavirus Cases" 
              total={countryInfo.todayCases} 
              cases={countryInfo.cases}
            />
            <InfoBox 
              title="Recovered" 
              total={countryInfo.todayRecovered} 
              cases={countryInfo.recovered}
            />
            <InfoBox 
              title="Deaths" 
              total={countryInfo.todayDeaths} 
              cases={countryInfo.deaths}
            />   
        </div>
        {/* Map */}
        <Map />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
