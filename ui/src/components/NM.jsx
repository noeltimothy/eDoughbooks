import React, { useState, useEffect, useMemo } from 'react';
import { MDBSpinner  } from 'mdb-react-ui-kit'
import moment from 'moment';

import './table-component.css';

const Table = (props) => {
  const { data } = props

  return (
    <table style={{ border: 'solid 1px blue' }} id={'nm'}>
      <thead>
        <tr>
        {data[0].day.map( day => {
          return(
            <th> {day} </th> 
          )
        })}
        </tr>
      </thead>
      <tbody>
        {data.map(d => {
          return (
            <tr>
                  <td
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                    }}
                  >
                    {d['pizza_size']}
                 </td>

                  {d['nm'].map( nm => {
                    return (
                      <td
                        style={{
                          padding: '10px',
                          border: 'solid 1px gray',
                          background: 'papayawhip',
                        }}
                      >
                      {nm}
                      </td>
                  )})}
	    </tr>
          )
        })}
      </tbody>
    </table>
  );
}

const NM = (props) => {

  const [ rawData, setRawData ] = useState([])
  const [ loading, setLoading ] = useState(false);

  useEffect (() => {
    const fetchData = async() => {
      setLoading(true);
      const url = 'nm'
      const res = await fetch(url)
      const json_data = await res.json();
      await setRawData(json_data)
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
    <div className='d-flex flex-column'>
      <div>
       <h4> Next Mornings Table </h4>
      </div>

      <div className='d-flex flex-column d-sm-flex flex-sm-row'>
          {(rawData.length > 0) &&
            <div className='w-100 d-flex flex-row d-sm-flex flex-sm-row'> 
              <div className="w-75 p-2">
                <Table data={rawData}/>
              </div>
            </div>
          }
      </div>
    </div>
  );

}

export default NM;
