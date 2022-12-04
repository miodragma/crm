import { useState } from 'react';

import { isPaidDropdownList } from '../../../config/dropdown-list';

import classes from './Dropdown.module.scss';

const Dropdown = props => {

  const { onChangePaidValue } = props;

  const [value, setValue] = useState('All - Paid / Not Paid');
  const [showDropdown, setShowDropdown] = useState(false);

  const onClickInput = e => {
    setShowDropdown(true);
  };

  const onClickItem = item => {
    setValue(item.label);
    const findValue = `${isPaidDropdownList.find(currItem => currItem.label === item.label).value}`;
    onChangePaidValue(findValue);
    setTimeout(() => setShowDropdown(false), 200);
  };

  const dropdownList = isPaidDropdownList.map(item => {
    return (
      <p onClick={() => onClickItem(item)} key={item.label}>{item.label}</p>
    )
  });

  const clickOnBlur = e => {
    e.stopPropagation();
    setTimeout(() => setShowDropdown(false), 200);
  }

  return (
    <div className={`${classes.dropdownInputContent}`}>
      <input onBlur={clickOnBlur} readOnly={true} className={classes.inputField} placeholder='Is Paid'
             onClick={onClickInput} value={value}/>
      {showDropdown && <div className={classes.dropdownContent}>{dropdownList}</div>}
    </div>
  );

};

export default Dropdown;
