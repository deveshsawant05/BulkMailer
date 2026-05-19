import React from "react";
import PropTypes from "prop-types";
import { Button } from "./ui/button";
const CustomButton = ({ children, onClick, buttonType, className, ...otherProps }) => (
    <Button
        type="submit"
        className={`bg-black text-white hover:bg-[--primary] animation duration-500 ${className}`}
        onClick={onClick}
        {...otherProps}
    >
        {children}
    </Button>
);

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  buttonType: PropTypes.string,
};

CustomButton.defaultProps = {
  onClick: () => {},
  buttonType: "",
};

export default CustomButton;
