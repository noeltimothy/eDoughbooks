import { useTable } from 'react-table';
import React, { useState, useEffect, useMemo } from 'react';
import { MDBSpinner  } from 'mdb-react-ui-kit'


import './table-component.css';

function TableComponent(props) {

  const [ rawData, setRawData ] = useState([])
  const [ dataKeys, setDataKeys ] = useState([])
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
    
  const data = useMemo(() => {
    console.log (rawData)

    if (rawData) {
      return Object.keys(dataKeys).map((k) => ({'col1': dataKeys[k], 'col2': rawData[k]}))
    } 
    return [{'col1': '', 'col2': '<no data>'}]
  }, [rawData]);

  const columns = React.useMemo(() => [
    {
      Header: 'Column 1',
      accessor: 'col1', // accessor is the "key" in the data
    },
    {
      Header: 'Column 2',
      accessor: 'col2',
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  if (loading) return (
    <>
	<MDBSpinner color='danger'>
        </MDBSpinner>
    </>
  )

  const haveHandler = async (e) => { 
    var new_make = rawData.need - e.target.value
    await setRawData({...rawData, 'make': new_make, 'waters': Number(new_make / ratios[pizzaSize]).toFixed(2), 'updated': ['MAKE', 'Waters']})
    if (props.ev) props.ev('have', e.target.value)
  }

  const burnedHandler = (e) => {
  }

  return (
    <>
    <p style={{ alignSelf: "right" }}> { date } </p>

    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: 'solid 3px red',
                  background: 'aliceblue',
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map( (cell, idx) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                      color: (rawData.updated && rawData.updated.includes(row.cells[0].value)) ? 'red' : 'black',
                    }}
                  >
                    {
                      ((tableType == 'today') && 
                       (idx == 1) && 
                       ((row.cells[0].value == 'Have') || (row.cells[0].value == ['Burned']))) ?
                      <input placeholder={row.cells[1].value} onChange={ (row.cells[0].value == 'Have') ? haveHandler : burnedHandler} /> : cell.render('Cell') 
                    }
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>

    {(rawData.length > 0) && <div> 
    MAKE {rawData['make']} 
    </div>}

    </>
  )
}

export default TableComponent;
