import React, { useState,useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [searchAttribute, setSearchAttribute] = useState("package_id");
  const [id, setId] = useState("");
  const [list,setList] = useState([]);


  const thTdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  };
  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
  };



  const handleSubmit1 = async(e) => {
    e.preventDefault();
    const data = await axios.get(`http://0.0.0.0:8002/query-package?${searchAttribute}=${searchTerm}`)
    setList(data.data)
    
  };

  const fetchApi=async()=>{
      const data = await axios.get("http://0.0.0.0:8002/query-package")
      console.log(data.data)
      setList(data.data)
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    await axios.post("http://0.0.0.0:8002/create-package/",{
      "return_address": returnAddress,
      "destination_address": destinationAddress,
      "package_id": id
    })
    setReturnAddress("");
    setDestinationAddress("");
    setId("");
    await fetchApi()
  }
  
  useEffect(()=>{
      fetchApi()
  },[])
  return (
    <div className="App">
      <h1>Package Manager</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Return Address:
          <input
            value={returnAddress}
            onChange={(e) => setReturnAddress(e.target.value)}
          />
        </label>
  
        <label>
          Destination Address:
          <input
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
          />
        </label>
  
        <label>
          Package ID:
          <input value={id} type="number" onChange={(e) => setId(e.target.value)} />
        </label>
  
        <button type="submit">Add Package</button>
      </form>
      <div>
      <form onSubmit={handleSubmit1}>
        <label>
          Search by:
          <select
            value={searchAttribute}
            onChange={(e) => setSearchAttribute(e.target.value)}
          >
            <option value="package_id">ID</option>
            <option value="return_address">Return Address</option>
            <option value="destination_address">Destination Address</option>
          </select>
        </label>
  
        <label>
          Term:
          {searchAttribute==="package_id" ? <input
            value={searchTerm}
            type="number"
            onChange={(e) => setSearchTerm(e.target.value)}
          />:<input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />}
        </label>
  
        <button type="submit">Search</button>
      </form>
      <table style={tableStyle} className="package-table">
      <thead>
        <tr>
          <th style={thTdStyle}>Package ID</th>
          <th style={thTdStyle}>Return Address</th>
          <th style={thTdStyle}>Destination Address</th>
        </tr>
      </thead>
      <tbody>
      {
        list?.map((item)=>(
            <tr key={item.id}>
            <td style={thTdStyle}>{item.package_id}</td>
            <td style={thTdStyle}>{item.return_address}</td>
            <td style={thTdStyle}>{item.destination_address}</td>
          </tr>
            ))
      }
      </tbody>
    </table>
      </div>
    </div>
  );
}
