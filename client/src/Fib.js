import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const res = await axios.get('/api/values/current');

      // Ensure we store an object (index -> value)
      const values = res && res.data && typeof res.data === 'object' ? res.data : {};
      this.setState({ values });

      // Debug: see what we got back
      // Remove later if you want
      // eslint-disable-next-line no-console
      console.log('GET /api/values/current ->', res.data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch values (/api/values/current):', err);
      this.setState({ values: {} });
    }
  }

  async fetchIndexes() {
    try {
      const res = await axios.get('/api/values/all');

      // Ensure we store an array
      const seenIndexes = Array.isArray(res.data) ? res.data : [];
      this.setState({ seenIndexes });

      // Debug: see what we got back
      // Remove later if you want
      // eslint-disable-next-line no-console
      console.log('GET /api/values/all ->', res.data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch indexes (/api/values/all):', err);
      this.setState({ seenIndexes: [] });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('/api/values', { index: this.state.index });
      this.setState({ index: '' });

      // Optional: refresh after submit so UI updates quickly
      this.fetchValues();
      this.fetchIndexes();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to submit index (/api/values):', err);
    }
  };

  renderSeenIndexes() {
    const seen = Array.isArray(this.state.seenIndexes) ? this.state.seenIndexes : [];
    return seen.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const entries = [];

    const values = this.state.values && typeof this.state.values === 'object' ? this.state.values : {};
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
