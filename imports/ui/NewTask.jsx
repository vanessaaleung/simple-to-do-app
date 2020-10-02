import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export const NewTask = ({ user }) => {
  const [text, setText] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    if (!text) return;

    Meteor.call('tasks.insert', text);

    setText("");
  }

  return (
    <div className="task">
      <input type="checkbox"
        className="checkbox-round"
        checked={false}
        readOnly
      />
      <form onSubmit={handleSubmit}>
        <input className="newTask" 
                placeholder="Add a Task"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}></input>
      </form>
    </div>
  )
}