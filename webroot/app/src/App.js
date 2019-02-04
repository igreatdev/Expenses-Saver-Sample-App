import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {AddExpense, ExpensesList} from './components/Expenses';
// import logo from './logo.svg';
// import './App.css';

class App extends Component {
  render() {
    return (
      <main role="main" className="container">
        <div className = "d-flex align-items-center p-3 my-3 text-white-50 bg-primary rounded box-shadow" >
          <div className="lh-100">
            <h4 className="text-white">Expenses Saver</h4>
          </div>
        </div>

        <Route exact path="/" component={ExpensesList} />
        <Route path="/add" component={AddExpense} />
      </main>
    );
  }
}

export default App;
