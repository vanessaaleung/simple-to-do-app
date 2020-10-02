import React from 'react';

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  return (
    <div className="task">
      <input type="checkbox"
            className="checkbox-round"
            checked={!!task.isChecked} // !!: converts object to boolean
            onClick={()  => onCheckboxClick(task)}
            readOnly
        />
      <span>{task.text}</span>
      <button onClick={ () => onDeleteClick(task) }>&times;</button>
    </div>
  );
};