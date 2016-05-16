
var DictonaryBox = React.createClass({

  handleInputSubmit: function(answ) {
    var data = this.state.data;
    this.setState({data: data});
    var dataToSent = {id: data.id, genus:answ.genus, sure: answ.sure};
    $.ajax({
      url: this.props.url,
      contentType: 'application/json',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(dataToSent),
      success: function(data) {
        this.setState({data: dataToSent});
        this.componentDidMount();
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: data});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.url, function (result) {
      var dueWord = result;
      var id = dueWord.id;
      this.setState({
        data: dueWord.word
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return (
      <div className="dictonaryBox">
        <h1>GENERA</h1>
        <Word data={this.state.data} />
        <UserInput 
          onInputSubmit={this.handleInputSubmit} 
          sure = {this.state.sure}/>
      </div>
    );
  }
});

var Word = React.createClass({
  render: function() {
    return (
      <div className="word">
        {this.props.data.word}
      </div>
    );
  }
});

var UserInput = React.createClass({
  getInitialState: function() {
    return {genus: '', sure: false};
  },
  handleSureChange: function(e) {
    this.setState({sure: !this.state.sure});
  },
  handleClick: function(answer, e) {
    var genus = answer;
    var sure = this.state.sure;
    this.props.onInputSubmit({genus: genus, sure: sure});
    this.setState({genus: '', sure: false});
  },

  render: function() {
    return (
      <form className="userInput" >
          <input
            type="checkbox"
            checked={this.state.sure}
            ref="sure"
            onChange={this.handleSureChange}
          />
          {' '}
          Sure?
          <p>
        <input type="button" onClick={this.handleClick.bind(this, "F")} value="Femenin" />
        <input type="button" onClick={this.handleClick.bind(this, "M")} value="Maskulin" />
        </p>
      </form>
    );
  }
});

ReactDOM.render(
  <DictonaryBox url="/word" />,
  document.getElementById('content')
);

