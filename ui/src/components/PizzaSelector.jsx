import { useTable } from 'react-table';
import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { MDBSwitch } from 'mdb-react-ui-kit';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';

function PizzaSelector(props) {
  return (
    <div style={{height: "200px"}} className="flex-row align-items-center">
      <div className="p-2"> 
        Squares  &nbsp; &nbsp; &nbsp;
        <MDBSwitch inline defaultChecked id='flexSwitchCheckChecked' /> 
        Rounds
      </div>
    <MDBDropdown>
      <MDBDropdownToggle tag='a' className='btn btn-primary'>
        Pizza Size  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      </MDBDropdownToggle>
      <MDBDropdownMenu>
        <MDBDropdownItem link>Small</MDBDropdownItem>
        <MDBDropdownItem link>Large</MDBDropdownItem>
        <MDBDropdownItem link>X-Large</MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
    </div>
  );
}

export default PizzaSelector;
