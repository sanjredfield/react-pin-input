import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PinItem from './PinItem';

/**
 */
class PinInput extends Component {

  constructor(props) {
    super(props);
    this.getValues = this.getValues.bind(this);

    var values = this.getValues();
    this.state = {
      values: this.getValues(this.props.value),
      currentIndex: 0,
    }

    this.elements = [];
  }

  getValues(value) {
    console.log('getValues: ' + value);
    if (!value) return new Array(this.props.length).join('0').split('0');

    var values = new Array(this.props.length);
    for (var i = 0; i < value.length; i++) {
      if (i >= this.props.length) break;
      values[i] = value[i];
    }
    return values;
  }

  componentDidMount() {
    // Setting focus on the first element
    if(this.props.focus && this.props.length) this.elements[0].focus();
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate: ' + prevProps.value);
    console.log(this.props.value);
    if (this.props.value !== prevProps.value) {
      this.setState({
        values: this.getValues(this.props.value)
      })
    }
  }

  clear() {
    this.elements.forEach(e => e.clear());
    this.elements[0].focus();
    var values = this.state.values.map(() => undefined);
    this.setState({ values });
  }

  focus() {
    if(this.props.length) this.elements[0].focus();
  }

  /**
   */
  onItemChange(value, index) {
    const { length, onComplete, onChange } = this.props;
    let currentIndex = index;

    var values = this.state.values.slice();
    values[index] = value;
    this.setState({ values }, () => {
      if (value.length === 1 && index < length - 1) {
        currentIndex += 1;
        this
          .elements[currentIndex]
          .focus();
      }

      const pin = this.state.values.join('');
      onChange(pin, currentIndex);
      if (pin.length === length) {
        onComplete(pin, currentIndex);
      }
    });
  }

  onBackspace(index) {
    if (index > 0) {
      this.elements[index - 1].focus();
    }
  }

  render() {
    return (
      <div style={this.props.style}  className='pincode-input-container'>
        {this.state.values.map((e, i) => <PinItem
            ref={ n => (this.elements[i] = n) }
            key={ i }
            onBackspace={ () => this.onBackspace(i) }
            secret={ this.props.secret || false }
            onChange={ v => this.onItemChange(v, i) }
            type={ this.props.type }
            inputMode={ this.props.inputMode }
            validate={ this.props.validate }
            inputStyle={ this.props.inputStyle }
            inputFocusStyle={ this.props.inputFocusStyle }
            value={e}
          />)
        }
      </div>
    );
  }
}

PinInput.propTypes = {
  length: PropTypes.number.isRequired,
  type: PropTypes.string,
  onComplete: PropTypes.func,
  validate: PropTypes.func,
  secret: PropTypes.bool,
  focus: PropTypes.bool,
  onChange: PropTypes.func,
  inputMode: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  inputStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  inputFocusStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

PinInput.defaultProps = {
  type: 'numeric',
  secret: false,
  validate: null,
  focus: false,
  onChange: () => {},
  onComplete: () => {},
  inputMode: undefined,
  style: {},
  inputStyle: {},
  inputFocusStyle: {},
};

export default PinInput;
