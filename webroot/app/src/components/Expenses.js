import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export class AddExpense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                expense_date: '',
                currency_amount: 0,
                currency: 'GBP',
                reason: '',
            },
            errors: {
                expense_date: true,
                amount: true,
                reason: true,
            },
            touched: {},
            formValid: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.convertCurrency = this.convertCurrency.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let values = this.state.values;
        values[name] = value;

        this.setState({
                values: values,
                touched: { ...this.state.touched,
                    [name]: true
                }
            },
            function () {
                return this.validateField(name, value, this.state.values);
            }
        );
    }

    handleAmountChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        let values = this.state.values;
        values[name] = value;

        this.setState({
                values: values,
                touched: { ...this.state.touched,
                    [name]: true
                }
            },
            function () {
                this.validateField(name, value, this.state.values);
                this.convertCurrency();
            }
        );
    }

    validateField(field, value, values) {
        let errors = this.state.errors;

        switch (field) {
            case 'expense_date':
                if (value === '' || value == null) {
                    errors[field] = 'Invalid';
                } else {
                    errors[field] = false;
                }
                break;
            case 'amount':
                if (value === '' || value == 0 || value == undefined) {
                    errors[field] = 'Invalid';
                } else {
                    errors[field] = false;
                }
                break;
            case 'reason':
                if (value === '' || value == null) {
                    errors[field] = 'Invalid';
                } else {
                    errors[field] = false;
                }
                break;
            default:;
        }

        this.setState({
                errors: errors
            },
            function () {
                this.validateForm();
            })
    }

    validateForm() {
        let errors = this.state.errors;
        var hasError = Object.values(errors).some(function (item) {
            return item !== false;
        });

        this.setState({
            formValid: !hasError,
        })
    }

    handleFormSubmit(event) {
        event.preventDefault();

        this.setState({
            formValid: false
        });

        fetch('http://localhost/expenses_saver/api/expenses', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.values)
            })
            .then(res => res.json())
            .then(json => {
                this.setState({
                    formValid: true
                });

                if (json.status === 'Ok') {
                    this.setState({
                        successful: true,
                    });

                    this.props.history.push('/');
                } else {
                    var errors = json.errors;
                    console.log(errors);
                    this.setState({
                        errors: { ...this.state.errors,
                            ...json.errors
                        },
                    });
                }
            }).catch(err => console.log("Error: ", err));
    }

    convertCurrency(){
        let values = this.state.values;
        var amount;
        
        if(values.currency !== 'GBP') { // Check if choosen currency is not GBP, if not convert the amount.
            var rate;
            this.setState({
                errors: { ...this.state.errors, amount: 'converting' }
            },
            function () {
                return this.validateField('amount', amount, this.state.values);
            });
            
            // Get currency rate
            fetch('https://cors-anywhere.herokuapp.com/http://api.openrates.io/latest?base='+values.currency+'&symbols=GBP')
                .then(res => res.json())
                .then(json => {
                    rate = json.rates.GBP;
                    amount = rate * values.currency_amount;

                    let vat = (20 / 100) * amount;
                    values['vat'] = vat;
                    values['amount'] = amount;

                    this.setState({
                        values: values,
                    },
                        function () {
                            return this.validateField('amount', amount, this.state.values);
                        }
                    );
                }).catch(err => console.log("Error: ", err));

        } else { // If currency is GBP update amount.
            amount = values.currency_amount;
            let vat = (20 / 100) * amount;
            values['vat'] = vat;
            values['amount'] = amount;

            this.setState({
                values: values,
            },
                function () {
                    return this.validateField('amount', amount, this.state.values);
                }
            );
        }
        
    }

    render() {
        let {errors, touched, values} = this.state;
        return(
            <div className="my-3 p-3 bg-white rounded box-shadow">
                <h6 className="border-bottom border-gray pb-2 mb-3">
                    New Expenses
                    <small className="float-right"> <Link to="/">Back</Link></small>
                </h6>
                
                <form onSubmit={this.handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="date">Expense Date</label>
                        <input type="date" name="expense_date" id="date" className="form-control" onChange={this.handleChange} value={values.expense_date} />
                        {
                            errors.expense_date && touched.expense_date?
                                <small className="form-text text-muted">{errors.expense_date}</small>:''
                        }
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <div className="input-group">
                            <input type="number" name="currency_amount" id="currency-amount" className="form-control" onChange={this.handleAmountChange} value={values.currency_amount} />
                            <div className="input-group-append">
                                <select name="currency" className="form-control" id="currency" onChange={this.handleAmountChange} value={values.currency}>
                                    <option value="GBP">GBP</option>
                                    <option value="EUR">EUR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                        </div>
                        {
                            errors.amount && touched.currency_amount ?
                                <small className="text-muted"> {errors.amount} </small> : ''
                        }
                        {
                            values.currency !== 'GBP' ? <small className="text-muted"> GBP: {values.amount && currency.format(values.amount)} </small> : ''
                        }
                        <small className="text-muted"> vat: {values.vat && currency.format(values.vat)}</small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="reason">Reason</label>
                        <textarea name="reason" id="reason" className="form-control" onChange={this.handleChange} value={values.reason} ></textarea>
                        {
                            errors.reason && touched.reason?
                                <small className="form-text text-muted">{errors.reason}</small>:''
                        }
                    </div>

                    <button className="btn btn-raised btn-primary" type="submit" disabled={!this.state.formValid}>Save</button>
                </form>
            </div>
        );
    }
}

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2
});

const Expense = (props) => (
    <tr>
        <td>{new Date(props.expense_date).toDateString()}</td>
        <td>{props.reason}</td>
        <td>{currency.format(props.amount)}</td>
        <td>{currency.format(props.vat)}</td>
        <td>{currency.format(parseFloat(props.amount) + parseFloat(props.vat))}</td>
    </tr>
)

export class ExpensesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            isLoaded: false,
        };
    }

    componentDidMount() {
        fetch('http://localhost/expenses_saver/api/expenses', {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                this.setState({
                    isLoaded: true,
                    items: json.data
                });
            }).catch(err => console.log("Error: ", err));
    }

    render() {
        let {isLoaded, items} = this.state;

        return(
            <div className="my-3 p-3 bg-white rounded box-shadow">
                <h6 className="border-bottom border-gray pb-2 mb-2">
                    Expenses List 
                    <small className="float-right"> <Link to="/add">Add New</Link></small>
                </h6>
                
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Expense Date</th>
                                <th>Reason</th>
                                <th>Amount</th>
                                <th>VAT</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {!isLoaded ? 
                            (<tr><td>Looading...</td></tr>):
                            items && items.map((item) => {
                                return (<Expense key={item.id} {...item} />);
                            })}
                        </tbody>
                    </table>
                </div>
                
            </div>
        );
    }
}