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
import {sortData, prettyPrintStat} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


function App() {

  const [countries,setCountries] = useState(['USA','INDIA','UK']);

  const [country,setCountry] = useState('worldwide');

  const [countryInfo, setCountryInfo] = useState({});

  const [tableData, setTableData] = useState([]);

  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746, lng: -40.4796
  });

  const [mapZoom, setMapZoom] = useState(2);

  const [mapCountries, setMapCountries] = useState([]);

  const [casesType, setCasesType] = useState("cases");

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
        setMapCountries(data);
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

      //when user select the country map should move
      if(countryCode === "worldwide"){
        setMapCenter([34.80746,-40.4796])
        setMapZoom(2);
      }else{
        setMapCenter([data.countryInfo.lat,data.countryInfo.long])
        setMapZoom(2);
      }

      
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
              isRed
              active={casesType === "cases"}
              onClick={e => setCasesType('cases')}
              title="Coronavirus Cases" 
              total={prettyPrintStat(countryInfo.todayCases)} 
              cases={prettyPrintStat(countryInfo.cases)}
            />
            <InfoBox 
              active={casesType === "recovered"}
              onClick={e => setCasesType('recovered')}
              title="Recovered" 
              total={prettyPrintStat(countryInfo.todayRecovered)} 
              cases={prettyPrintStat(countryInfo.recovered)}
            />
            <InfoBox 
              isRed
              active={casesType === "deaths"}
              onClick={e => setCasesType('deaths')}
              title="Deaths" 
              total={prettyPrintStat(countryInfo.todayDeaths)} 
              cases={prettyPrintStat(countryInfo.deaths)}
            />   
        </div>
        {/* Map */}
        <Map 
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app_right">
        <CardContent>
          <h4>Live cases by Country</h4>
          <Table countries={tableData} />
          <h4>Worldwide new {casesType}</h4>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
