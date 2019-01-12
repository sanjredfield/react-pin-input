import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const styles = {
  input: {
    padding: 0,
    margin: '0 2px',
    textAlign: 'center',
    border: '1px solid',
    background: 'transparent',
    width: '50px',
    height: '50px',
  },
  inputFocus: {
    outline: 'none',
    boxShadow: 'none',
  },
};

/**
 */
class PinItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      focus: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 8 && (!this.state.value || !this.state.value.length)) {
      this.props.onBackspace();
    }

    if (e.keyCode == 13 || e.keyCode == 9) {
      event.preventDefault();
      var inputEl = ReactDOM.findDOMNode(this.input);
      inputEl.blur();
      if (this.props.onContinueClick) this.props.onContinueClick();
    }
  }

  clear() {
    this.setState({
      value: ''
    });
  }

  onChange(e) {
    const value = this.validate(e.target.value);
    if (this.state.value === value) return;
    if (value.length < 2) {
      this.props.onChange(value);
    }
  }

  focus() {
    this
      .input
      .focus();
  }

  validate(value) {
    if(this.props.validate) {
      return this.props.validate(value);
    }

    if(this.props.type === 'numeric') {
      const numCode = value.charCodeAt(0);
      const isInteger = numCode >= '0'.charCodeAt(0) && numCode <= '9'.charCodeAt(0);
      return isInteger ? value : '';
    }
    return value.toUpperCase();
  }

  render() {
    const { value } = this.state;
    const { type, inputMode, inputStyle, inputFocusStyle } = this.props;
    const inputType = this.props.type === 'numeric' ? 'tel' : (this.props.type || 'text');

    return (<input
      className='pincode-input-text'
      onChange={ this.onChange }
      onKeyDown={ this.onKeyDown }
      maxLength='1'
      autoComplete='off'
      type={ this.props.secret ? 'password' : inputType }
      pattern={ this.props.type === 'numeric' ? '[0-9]*' : '[A-Z0-9]*' }
      ref={ n => (this.input = n) }
      style={ Object.assign(
        {},
        styles.input,
        inputStyle
      ) }
      value={ value }
    />);
  }
}

PinItem.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBackspace: PropTypes.func.isRequired,
  secret: PropTypes.bool,
  type: PropTypes.string,
  inputMode: PropTypes.string,
  validate: PropTypes.func,
  inputStyle: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  inputFocusStyle: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

PinItem.defaultProps = {
  secret: false,
  type: 'numeric',
  inputMode: undefined,
  validate: undefined,
};

export default PinItem;
