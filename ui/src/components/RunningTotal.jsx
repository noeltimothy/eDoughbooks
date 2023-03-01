import React, { useState, useEffect, useMemo } from 'react';
import { MDBSpinner  } from 'mdb-react-ui-kit'
import moment from 'moment';

import './table-component.css';

const Table = (props) => {
  const { dkeys, data, haveHandler } = props

  return (
    <table style={{ border: 'solid 1px blue' }} id={'running_totals'}>
      <tbody>
        {dkeys.map(k => {
          return (
            <tr>
                  <td
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                      color: data[k] ? 'green' : 'red',
                    }}
                  >
                    {k}
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                      color: data[k] ? 'green' : 'red',
                    }}
                  >
                    {data[k]}
                  </td>
	    </tr>
          )
        })}
      </tbody>
    </table>
  );
}

const RunningTotals = (props) => {

  const [ rawData, setRawData ] = useState([])
  const [ dataKeys, setDataKeys ] = useState([])
  const [ loading, setLoading ] = useState(false);
  let updated = [];


  useEffect (() => {
    const fetchData = async() => {
      setLoading(true);
      const url = 'http://localhost:5000/running_totals'
      console.log (url)
      const res = await fetch(url)
      const json_data = await res.json();
      await setRawData(json_data.data)
      console.log (json_data.data)

      setDataKeys(json_data.keys)
      setLoading(false);
    }
    fetchData();
  }, [])

  if (loading) return (
    <>
	<MDBSpinner color='danger'>
        </MDBSpinner>
    </>
  )

  const dkeys = dataKeys
  return (
    <>
      <div>
       <h4> Waters </h4>
      </div>

      <div className='d-flex flex-column d-sm-flex flex-sm-row'>
          {dkeys &&
            <div className='w-100 d-flex flex-row d-sm-flex flex-sm-row yesterday'> 
              <div className="w-75 p-2">
                <Table dkeys={dataKeys} data={rawData}/>
              </div>
            </div>
          }
      </div>
    </>
  );

}

export default RunningTotals;
