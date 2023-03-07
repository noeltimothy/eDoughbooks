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
                      'font-weight': (k=='Total') ? 'bold' : '',
                      'font-style': (k=='Total') ? 'italic' : '',
                      'border-top': (k=='Total') ? '1px solid grey' : '',
                      'border-bottom': (k=='Total') ? '1px solid grey' : '',
                      'border-width': (k=='Total') ? '3px' : '',
                      'border-right': 'none',
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
                      'font-weight': (k=='Total') ? 'bold' : '',
                      'font-style': (k=='Total') ? 'italic' : '',
                      'border-top': (k=='Total') ? '1px solid grey' : '',
                      'border-bottom': (k=='Total') ? '1px solid grey' : '',
                      'border-width': (k=='Total') ? '3px' : '',
                      'border-left': 'none',
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
  const [ loading, setLoading ] = useState(true);
  let updated = [];


  useEffect (() => {
    const fetchData = async() => {
      setLoading(true);
      const url = 'http://localhost:5000/running_totals'
      const res = await fetch(url)
      const json_data = await res.json();
      await setRawData(json_data.data)
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

  return (
    <>
      <div>
       <h4> Waters </h4>
      </div>

      <div className='d-flex flex-column d-sm-flex flex-sm-row'>
          {!loading &&
            <div className='w-100 d-flex flex-row d-sm-flex flex-sm-row yesterday'> 
              <div className="w-75 p-2">
                <Table dkeys={Object.keys(rawData.squares)} data={rawData.squares}/>
              </div>
            </div>
          }
      </div>
      <div className='d-flex flex-column d-sm-flex flex-sm-row'>
          {!loading &&
            <div className='w-100 d-flex flex-row d-sm-flex flex-sm-row yesterday'> 
              <div className="w-75 p-2">
                <Table dkeys={Object.keys(rawData.rounds)} data={rawData.rounds}/>
              </div>
            </div>
          }
      </div>
    </>
  );

}

export default RunningTotals;
