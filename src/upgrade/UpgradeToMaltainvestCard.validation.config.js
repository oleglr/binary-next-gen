export const getConstraints = (props) => {
  const constraints = {
    salutation: {
      presence: true,
    },
    first_name: {
      presence: true,
      validateGeneral: true,
    },
    last_name: {
      presence: true,
      validateGeneral: true,
    },
    residence: {
      presence: true,
    },
    address_line_1: {
      presence: true,
      validateAddress: true,
    },
    address_line_2: {
      validateAddress: true,
    },
    address_city: {
      presence: true,
      validateGeneral: true,
    },
    address_state: {
      presence: true,
    },
    place_of_birth: {
      presence: true,
    },
    date_of_birth: {
      presence: true,
    },
    address_postcode: {
      format: {
        /*eslint-disable */
        pattern: /^([a-zA-Z\d-\s])*$/,
        /*eslint-enable */
        message: 'Only letters, numbers, space, and hyphen are allowed.',
      },
    },
    phone: {
      presence: true,
      format: {
        /*eslint-disable */
        pattern: /^\+?[0-9\s]*$/,
        /*eslint-enable */
        message: 'Only numbers and spaces are allowed.',
      },
    },
    forex_trading_experience: {
      presence: true,
    },
    forex_trading_frequency: {
      presence: true,
    },
    indices_trading_experience: {
      presence: true,
    },
    indices_trading_frequency: {
      presence: true,
    },
    commodities_trading_experience: {
      presence: true,
    },
    commodities_trading_frequency: {
      presence: true,
    },
    stocks_trading_experience: {
      presence: true,
    },
    stocks_trading_frequency: {
      presence: true,
    },
    other_derivatives_trading_experience: {
      presence: true,
    },
    other_derivatives_trading_frequency: {
      presence: true,
    },
    other_instruments_trading_experience: {
      presence: true,
    },
    other_instruments_trading_frequency: {
      presence: true,
    },
    employment_industry: {
      presence: true,
    },
    occupation: {
      presence: true,
    },
    education_level: {
      presence: true,
    },
    income_source: {
      presence: true,
    },
    net_income: {
      presence: true,
    },
    estimated_worth: {
      presence: true,
    },
    tax_residence: {
      presence: true,
    },
    tax_identification_number: {
      presence: true,
      format: {
        /*eslint-disable */
        pattern: /^[\w-]{0,20}$/,
        /*eslint-enable */
        message: 'Only letters, numbers, space, and hyphen are allowed.',
      },
    },
    account_turnover: {
      presence: true,
    },
    account_opening_reason: {
      presence: true,
    },
    source_of_wealth: {
      presence: true,
    },
    secret_question: {
      presence: () => {
        if (props.loginid.startsWith('VRTC')) {
          return {
            presence: true,
            message: 'This field is required.',
          };
        }
        return false;
      },
    },
    secret_answer: {
      presence: () => {
        if (props.loginid.startsWith('VRTC')) {
          return {
            presence: true,
            message: 'This field is required.',
          };
        }
        return false;
      },
      format: () => {
        if (props.loginid.startsWith('VRTC')) {
          return {
            /*eslint-disable */
            pattern: /^[\w\-\,\.\' ]+/,
            /*eslint-enable */
            message: 'Only letters, numbers, space, hyphen, period, and apostrophe are allowed.',
          };
        }
        return false;
      },
    },
    PEPDeclaration: {
      presence: {
        message: 'Please confirm that you are not a politically exposed person.'
      }
    },
    accept_risk: {
      presence: {
        message: 'Please accept the terms and conditions.'
      }
    }
  };
  return constraints;
};
