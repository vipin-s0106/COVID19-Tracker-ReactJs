import React from 'react'
import './Table.css'
import numeral from "numeral";

function Table({countries}) {
    return (
        <div className="table">
            {
                countries.map(country =>(
                    <tr>
                        <td>
                            <img className="country__flag" src={country.countryInfo.flag} />{country.country}
                        </td>
                        <td>{numeral(country.cases).format("0,0")}</td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
