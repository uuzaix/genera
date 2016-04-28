
var DictonaryBox = React.createClass({

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
        <UserInput/>
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
  render: function() {
    return (
      <form>
        <input type="text" placeholder="Genus..." />
        <p>
          <input type="checkbox" />
          {' '}
          Sure?
        </p>
      </form>
    );
  }
});

ReactDOM.render(
  <DictonaryBox url="/word" />,
  document.getElementById('content')
);

