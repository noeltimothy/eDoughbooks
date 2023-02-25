import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import Jdenticon from '../components/Jdenticon';
import useAuth from '../hooks/useAuth';
import TableComponent from '../components/tableComponent';
import SimpleTable from '../components/SimpleTable';
import Dropdown from 'react-bootstrap/Dropdown';
import { MDBSwitch } from 'mdb-react-ui-kit';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';

function Dashboard() {
  const title = 'Daily values';

  const { getSession } = useAuth();
  const user = getSession();
  const [ pizzaType, setPizzaType ] = useState('squares')
  const [ pizzaSize, setPizzaSize ] = useState('')
  const [ sizes, setSizes ] = useState([ 'small', 'large', 'x-large'])
  const [ have, setHave ] = useState(0)
 
  // Handles pizza type change 
  const handleSwitch = (e) => { (e.target.checked) ? setPizzaType('rounds') : setPizzaType('squares') }

  // handles pizza size selection
  const changePizzaSize = (e) => { setPizzaSize(e.target.text) };

  // handles updating size dropdown based on pizza type
  useEffect(() => {
      if (pizzaType == 'rounds') { setSizes([ 'small', 'large']) } 
      else { setSizes(['small', 'large', 'x-large']) }
  }, [pizzaType])

  // Handles events from today's table and passes it down to yesterdays table using the default case
  const todays_events = (etype, val) => { 
    setHave(val)
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="container-fluid">
        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
          <h1 className="h2">{title}</h1>
        </div>
      </div>
        <div className="d-flex flex-row">
          <div className="w-25 d-flex p-4 flex-column">
            <div className="d-flex p-4 flex-column border rounded shadow-sm overflow-hidden" style={{ 'height': '240px' }}>
              <div className="d-flex flex-row">
                  <div className="p-2">
                    <h2> Squares </h2>
                  </div>
                  <div className="p-2">
                    <MDBSwitch  onChange={handleSwitch} />
                  </div>
                  <div className="p-2">
                    <h2> Rounds </h2>
                  </div>
               </div>

              <div className='d-flex p-2 flex-row w-50'>
      		<MDBDropdown onChange={changePizzaSize}>
        		<MDBDropdownToggle tag='a' className='btn btn-primary'>
                        {pizzaSize ? pizzaSize : "Select Pizza Size"}
        		</MDBDropdownToggle>
        		<MDBDropdownMenu>
                        {sizes.map((s) => (
          		  <MDBDropdownItem active={pizzaSize==s} link onClick={changePizzaSize}>{s}</MDBDropdownItem>
                        ))}
        		</MDBDropdownMenu>
      		</MDBDropdown>
              </div>
            </div>

            <div className="d-flex flex-column position-static border rounded overflow-hidden shadow-sm p-5">
	      <SimpleTable pizza_type={pizzaType} pizza_size={pizzaSize} table_type='yesterday' have={have}/>
            </div>

          </div>
          <div className="w-75 d-flex p-4 flex-column">
            <div className="d-flex flex-column position-static mw-100 border rounded overflow-hidden shadow-sm p-5">
	      <SimpleTable pizza_type={pizzaType} pizza_size={pizzaSize} table_type='today' ev={todays_events}/>
            </div>
          </div>
       </div>
    </>
  );
}

export default Dashboard;
