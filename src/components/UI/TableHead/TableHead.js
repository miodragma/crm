import classes from './TableHead.module.scss';

const TableHead = props => {

  const { data, sortColumn, sortOrder, onClickSort } = props;

  const onClickSortHandler = item => {
    onClickSort(item);
  };

  const tableHeadData = data.map(item => {
    let activeClass;

    if (item.value === sortColumn) {

      activeClass = `active${sortOrder.toLowerCase().charAt(0).toUpperCase() + sortOrder.toLowerCase().slice(1)}`
    }

    let thContent;

    if (item.value) {
      thContent = <th key={item.id} onClick={() => onClickSortHandler({ item, sortOrder, sortColumn })}>
        <div className={classes.thWrapper}>
          <p>
            {item.label}
          </p>
          <div className={classes.sortByWrapper}>
            <i className={`${classes.sortByAsc} ${sortOrder === 'ASCENDING' ? classes[activeClass] : ''}`}/>
            <i className={`${classes.sortByDesc} ${sortOrder === 'DESCENDING' ? classes[activeClass] : ''}`}/>
          </div>
        </div>
      </th>
    } else {
      thContent = <th key={item.id}>
        <div className={classes.thWrapper}>
          <p>
            {item.label}
          </p>
        </div>
      </th>
    }

    return (thContent)
  })

  return (
    tableHeadData
  )

};

export default TableHead;
