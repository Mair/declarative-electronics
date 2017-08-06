import * as React from "react";
import * as PropTypes from "prop-types";
import { ChipDefinition } from "../chipDefinitionPins";

interface CreateCompElProviderProps {
  serviceUrl: string;
  chipDefinition?: ChipDefinition | string;
}

export const compElProptypes = {
  chipDefinition: PropTypes.oneOfType([
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      validModes: PropTypes.arrayOf(PropTypes.number)
    }),
    PropTypes.string
  ]),
  serviceUrl: PropTypes.string.isRequired
};

export function createCompElProvider() {
  class Provider extends React.Component<CreateCompElProviderProps> {
    static propTypes = compElProptypes;
    static childContextTypes = compElProptypes;

    serviceUrl: string;
    chipDefinition?: ChipDefinition | string;

    getChildContext() {
      return {
        serviceUrl: this.serviceUrl,
        chipDefinition: this.chipDefinition
      };
    }

    constructor(
      props: CreateCompElProviderProps,
      context: CreateCompElProviderProps
    ) {
      super(props, context);
      this.serviceUrl = props.serviceUrl;
      this.chipDefinition = props.chipDefinition;
    }

    render() {
      return React.Children.only(this.props.children);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    Provider.prototype.componentWillReceiveProps = function(
      nextProps: CreateCompElProviderProps
    ) {
      if (
        this.serviceUrl !== nextProps.serviceUrl &&
        this.chipDefinition !== nextProps.chipDefinition
      ) {
        console.error(
          "Composable Electronics provider should be statically set"
        );
      }
    };
  }

  return Provider;
}

export default createCompElProvider();
