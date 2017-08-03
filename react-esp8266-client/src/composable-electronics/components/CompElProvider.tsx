import * as React from "react";
import * as PropTypes from "prop-types";
import { PinMode } from "../";

interface PinDefinition {
  name: string;
  number: number;
  validModes: PinMode[];
}
interface ChipDefinition {
  pins: PinDefinition[];
}

interface CreateCompElProviderProps {
  serviceUrl: string;
  chipDefinition?: ChipDefinition | string;
}

const jsProptypes = {
      chipDefinition: PropTypes.oneOfType([
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          number: PropTypes.number.isRequired,
          validModes: PropTypes.arrayOf(PropTypes.number)
        }),
        PropTypes.number
      ])
    };

export function createCompElProvider() {
  class Provider extends React.Component<CreateCompElProviderProps> {
    static propTypes = jsProptypes;
    static childContextTypes = jsProptypes;

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
