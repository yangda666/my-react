export const REACT_LEGACY_ELEMENT_TYPE: symbol = Symbol.for('react.element');

export const renameElementSymbol = true;

export const REACT_ELEMENT_TYPE: symbol = renameElementSymbol
  ? Symbol.for('react.transitional.element')
  : REACT_LEGACY_ELEMENT_TYPE;
