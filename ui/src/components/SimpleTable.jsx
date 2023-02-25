import React, { useState, useEffect, useMemo } from 'react';
import { MDBSpinner  } from 'mdb-react-ui-kit'

import './table-component.css';

const Table = (props) => {
  const { dkeys, dheaders, data, haveHandler, ttype } = props

  if (!dkeys.hasOwnProperty(ttype)) return;

  return (
    <table style={{ border: 'solid 1px blue' }}>
      <tbody>
        {dkeys[ttype].map(k => {
          if (dheaders[k]) {
          return (
            <tr>
                  <td
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: (ttype == 'inset') ? 'lightgrey': 'papayawhip',
                      color: (data.updated && data.updated.includes(k)) ? 'red' : 'black',
                    }}
                  >
                    {dheaders[k]}
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: (ttype == 'inset') ? 'lightgrey': 'papayawhip',
                      color: (data.updated && data.updated.includes(k)) ? 'red' : 'black',
                    }}
                  >
                    {(['fixed', 'inset'].includes(ttype)) && data[k]}
                    {(ttype == 'editable') &&  <input type='text' value={data[k]} onChange={haveHandler} />}
                  </td>
	    </tr>
          )
          }
        })}
      </tbody>
    </table>
  );
}

const SimpleTable = (props) => {

  const [ rawData, setRawData ] = useState([])
  const [ dataKeys, setDataKeys ] = useState([])
  const [ dataHeaders, setDataHeaders ] = useState([])
  const [ date, setDate ] = useState('')
  const [ tableType, setTableType ] = useState(props?.table_type || 'yesterday')
  const [ pizzaType, setPizzaType ] = useState(props?.pizza_type)
  const [ pizzaSize, setPizzaSize ] = useState(props?.pizza_size)
  const [ loading, setLoading ] = useState(false);
  let updated = [];

  const ratios = { 'small': 31, 'large': 18, 'x-large': 12 }

  useEffect (() => {
    const fetchData = async() => {
      setLoading(true);
      const url = 'http://localhost:5000/'+tableType + '?' + 'pizza_type='+props.pizza_type + '&pizza_size='+ props.pizza_size
      console.log (url)
      const res = await fetch(url)
      const json_data = await res.json();
      await setRawData(json_data.data[0])
      setDataKeys(json_data.keys)
      setDataHeaders(json_data.headers)
      setDate(json_data.data[0]['created_date'])

      setLoading(false);
    }
    setPizzaType(props.pizza_type);
    setPizzaSize(props.pizza_size);
    if (props.pizza_size) fetchData();
  }, [props.pizza_type, props.pizza_size])

  // Calculate sold based on have from today's value. This is only done on yesterdays table
  useEffect (() => {
    if (props?.have) {
      setRawData({...rawData, 'sold': rawData.need - rawData.burned - props.have, 'updated': ['Sold']})
    }
  }, [props?.have])
    
  if (loading) return (
    <>
	<MDBSpinner color='danger'>
        </MDBSpinner>
    </>
  )

  const haveHandler = async (e) => { 
    rawData['have'] = e.target.value
    var new_make = rawData.need - e.target.value
    await setRawData({...rawData, 'make': new_make, 'waters': Number(new_make / ratios[pizzaSize]).toFixed(2), 'updated': ['MAKE', 'Waters']})
    if (props.ev) props.ev('have', e.target.value)
  }

  const burnedHandler = (e) => {
  }

  const dkeys = dataKeys['fixed']
  return (
    <>
      <h3 style={{ alignSelf: "right" }}> { date } </h3>

      <div style={{ "display": "flex", "flex-direction": "column" }}>
        <div style={{ "display": "flex", "flex-direction": "row", "align-items": "start" }}>
          {dkeys && <Table dkeys={dataKeys} dheaders={dataHeaders} data={rawData} ttype={'fixed'} />}
          {dkeys && <Table dkeys={dataKeys} dheaders={dataHeaders} data={rawData} ttype={'inset'} />}
        </div>
          {dkeys && <Table dkeys={dataKeys} dheaders={dataHeaders} data={rawData} ttype={'editable'} haveHandler={haveHandler}/>}
      </div>

    </>
  );

}

export default SimpleTable;