
var DictonaryBox = React.createClass({

  handleInputSubmit: function(answ) {
    var answer = this.state.data;
    this.setState({data: answer});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: answ,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
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
      this.setState({
        data: dueWord.word.word
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
        <UserInput onInputSubmit={this.handleInputSubmit} />
      </div>
    );
  }
});

var Word = React.createClass({
  render: function() {
    return (
      <div className="word">
        {this.props.data}
      </div>
    );
  }
});

var UserInput = React.createClass({
  getInitialState: function() {
    return {id: '', genus: '', sure: false};
  },
  handleGenusChange: function(e) {
    this.setState({genus: e.target.value});
  },
  handleSureChange: function(e) {
    this.setState({sure: !this.state.sure});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var genus = this.state.genus.trim();
    var sure = this.state.sure;
    if (!genus || !sure) {
      return;
    }
    this.props.onInputSubmit({genus: genus, sure: sure});
    this.setState({genus: '', sure: false});
  },

  render: function() {
    return (
      <form className="userInput" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Genus..."
          value={this.state.genus}
          onChange={this.handleGenusChange}
        />

        <p>
          <input
            type="checkbox"
            sure={this.props.sure}
            ref="sure"
            onChange={this.handleSureChange}
          />
          {' '}
          Sure?
        </p>
        <input type="submit" value="Post" />
      </form>
    );
  }
});

ReactDOM.render(
  <DictonaryBox url="/word" />,
  document.getElementById('content')
);

