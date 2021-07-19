import React from "react"

export default class QueryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: [props.webId],
      query: `SELECT * WHERE {
    ?s ?p ?o
}`
    };

    this.handleChangeSources = this.handleChangeSources.bind(this);
    this.handleChangeQuery = this.handleChangeQuery.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeSources(event) {
    this.setState({sources: event.target.value.split(",")});
  }
  handleChangeQuery(event) {
    this.setState({query: event.target.value});
  }

  handleSubmit(event) {
    console.log(`An query was submitted: ${this.state.query} for the sources: ${this.state.sources}`);
    event.preventDefault();
    this.props.submit(this.state.query, this.state.sources)
  }
  
  render() {

    const textAreaStyle = {
      width: '100%',
      height: '2em',
    };  
    const textAreaStyle2 = {
      width: '100%',
      height: '10em',
    };  
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Sources (separate by comma because I am lazy)</label>
        <br></br>
        <textarea style={textAreaStyle} value={this.state.sources} onChange={this.handleChangeSources} />
        <br></br>
        <label>Query (I have no error checking here or anything)</label>
        <br></br>
        <textarea style={textAreaStyle2} value={this.state.query} onChange={this.handleChangeQuery} />
        <br></br>
        
        <input type="submit" value="Submit" />
      </form>
    );
  }
}