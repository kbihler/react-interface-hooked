import React, { useState, useEffect} from 'react';
import '../css/App.css';
import AddApointments from './AddAppointments';
import ListApps from './List';
import SearchApps from './Search';

import {findIndex, without} from 'lodash';

const App = () => {
  const [myApts, setApts] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [formDisplay, setFormDisplay] = useState(false);
  const [orderBy, setOrderBy] = useState('petName');
  const [orderDir, setOrderDir] = useState('asc');
  const [queryText, setQueryText] = useState('');

  const deleteAppt = apt => {
    let tempApts = myApts;
    tempApts = without(tempApts, apt);
    setApts(tempApts);
  };

  const toggleForm = () => {
    setFormDisplay(!formDisplay);
  };

  const addAppt = apt => {
    let tempApts = myApts;
    let currentIndex = lastIndex;

    apt.aptId = ++currentIndex;
    tempApts.unshift(apt);
    setApts(tempApts);
    setLastIndex(currentIndex);
  };

  const changeOrder = (order, dir) => {
    setOrderBy(order);
    setOrderDir(dir);
  };

  const updateInfo = (name, value, id) => {
    let tempApts = myApts;
    let aptIndex = findIndex(myApts, {
      aptId: id
    });
    tempApts[aptIndex][name] = value;
    setApts(tempApts);
  }

  const searchApts = (query) => {
    setQueryText(query);
  };

  useEffect(() => {
    let currentIndex = lastIndex;
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = ++currentIndex;
          return item;
        });
        setLastIndex(currentIndex);
        setApts(apts);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let order;
  let filterApts = myApts;
  if(orderDir === 'asc') {
    order = 1;
  } else {
    order = -1;
  }

  filterApts = filterApts.sort((a,b) => {
    if (a[orderBy].toLowerCase() < 
        b[orderBy].toLowerCase()) {
          return -1 * order;
        } else {
          return 1 * order;
        }
  })
  .filter(eachItem => {
    return(
      eachItem['petName']
        .toLowerCase()
        .includes(queryText.toLocaleLowerCase()) ||
      eachItem['ownerName']
        .toLowerCase()
        .includes(queryText.toLocaleLowerCase())
    );
  });

  return (
    <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddApointments 
                  formDisplay={formDisplay} 
                  toggleForm={toggleForm}
                  addAppt={addAppt}
                />
                <SearchApps 
                  orderBy={orderBy} 
                  orderDir={orderDir} 
                  changeOrder={changeOrder} 
                  searchApts={searchApts}
                />
                <ListApps 
                  appts={filterApts} 
                  deleteAppt={deleteAppt} 
                  updateInfo={updateInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}

export default App;
