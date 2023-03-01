import React, { useState, useEffect, useMemo } from 'react';
import { MDBSpinner  } from 'mdb-react-ui-kit'
import moment from 'moment';
import RunningTotal from './RunningTotal';

import './table-component.css';

const Table = (props) => {
  const { dkeys, dheaders, data, haveHandler, ttype, sendUpdate } = props

  if (!dkeys.hasOwnProperty(ttype)) return;

  return (
    <table className='w-auto table-responsive' style={{ border: 'solid 1px blue' }} id={ttype}>
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
                      "font-weight": (data.updated && data.updated.includes(k)) ? 'bold' : '',
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
                      "font-weight": (data.updated && data.updated.includes(k)) ? 'bold' : '',
                    }}
                  >
                    {(['fixed', 'inset'].includes(ttype)) && data[k]}
                    {(ttype == 'editable') &&  <input type='text' value={data[k]} id={k} onChange={haveHandler} onBlur={(e)=>sendUpdate(e.target.id, e.target.value)}/>}
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
      if (json_data.data[0].hasOwnProperty('created_date')) setDate(json_data.data[0]?.created_date)

      setLoading(false);
    }
    setPizzaType(props.pizza_type);
    setPizzaSize(props.pizza_size);
    if (props.pizza_size) fetchData();
  }, [props.pizza_type, props.pizza_size])

  // Calculate sold based on have from today's value. This is only done on yesterdays table
  useEffect (() => {
    if (props?.have) {
      setRawData({...rawData, 'sold': rawData.need - rawData.burned - props.have, 'updated': ['sold']})
    }
  }, [props?.have])
    
  if (loading) return (
    <>
	<MDBSpinner color='danger'>
        </MDBSpinner>
    </>
  )

  const sendUpdate = async(field, val) => {
    const url = 'http://localhost:5000/update_today/' + props.pizza_type + '/'+ props.pizza_size + '/'+field + '/'+val
    const res = await fetch(url)
    if ((field == 'have') && props.ev) props.ev('refresh')
  }

  // This have handlers only runs on today's table
  const haveHandler = async (e) => { 
    if (e.target.id == 'have') {
      rawData['have'] = e.target.value
      var new_make = rawData.need - e.target.value
      await setRawData({...rawData, 'make': new_make, 'waters': Number(new_make / ratios[pizzaSize]).toFixed(1), 'updated': ['make', 'waters']})
      if (props.ev) props.ev('have', e.target.value)
    } else {
      await setRawData({...rawData, [e.target.id]: e.target.value})
    }
  }

  const burnedHandler = (e) => {
  }

  const dkeys = dataKeys['fixed']
  return (
    <>
      {(tableType == 'yesterday') && date && <div>
        <h3> {pizzaType.toUpperCase()} [{pizzaSize }] </h3>
        <h4 style={{ alignSelf: "right" }}> { moment(date).format('ddd, MM-DD-YYYY') } </h4>
        </div>
      }

      <div className='d-flex flex-column d-sm-flex flex-sm-row'>
        {(tableType == 'today') && dkeys &&
          <div className='d-flex flex-column d-sm-flex flex-sm-row today'> 
              <div className="w-75 p-2">
                <Table dkeys={dataKeys} dheaders={dataHeaders} data={rawData} ttype='editable' haveHandler={haveHandler} sendUpdate={sendUpdate}/>
              </div>
              <div className="w-25 p-2">
                <Table dkeys={dataKeys} dheaders={dataHeaders} data={rawData} ttype='inset' />
              </div>
          </div>
        }
        {(tableType=='yesterday') && dkeys &&
          <div className='d-flex flex-column d-sm-flex flex-sm-row yesterday'> 
            <div className="p-2">
              <Table dkeys={dataKeys} dheaders={dataHeaders} data={rawData} ttype='fixed'/>
            </div>
            <div className="p-2">
              <Table dkeys={dataKeys} dheaders={dataHeaders} data={rawData} ttype='inset'/>
            </div>
          </div>
        }
      </div>
      <div className="d-flex flex-column w-75 p-2">
        {(tableType == 'today') && dkeys && <Table className='today' dkeys={dataKeys} dheaders={dataHeaders} data={rawData} ttype={'fixed'} />}
      </div>
    </>
  );

}

export default SimpleTable;
