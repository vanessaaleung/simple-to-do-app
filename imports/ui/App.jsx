import React, { Fragment, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/db/TasksCollection';
import { Task } from './Task';
import { NewTask } from './NewTask';
import { LoginForm } from './LoginForm';

export const App = () => {
  // get the authenticated user or null
  const user = useTracker(() => Meteor.user());

  const [hideCompleted, setHideCompleted] = useState(false);

  //  to see only pending tasks
  const hideCompletedFilter = { isChecked: { $ne: true }}

  // filter tasks by user
  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
    if (!Meteor.user) {
      return noDataAvailable;
    }

    // receive changes from publication
    const handler = Meteor.subscribe('tasks');

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const tasks = TasksCollection.find( 
      hideCompleted ? pendingOnlyFilter : userFilter , {
        sort: { createdAt: -1 },
      }
    ).fetch();

    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
  });

  const toggleChecked = ({ _id, isChecked  }) => {
    Meteor.call('tasks.setIsChecked', _id, !isChecked);
  }

  const pendingTasksTitle = `${
    pendingTasksCount ? `(${pendingTasksCount})` : ''
  }`;
  
  const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);

  const logout = () => Meteor.logout();

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <img className="logoImg" src="/images/check.png" />
            <h1>To Do List</h1>
            {/* {pendingTasksTitle} */}
          </div>
          {user ? 
            (<div className="user" onClick={logout}>
              <img className="userImg" src="/images/profile.png" alt="Avatar" />
              {user.username}
            </div>) : null
          }
        </div>
      </header>

      <div className="main">
        {user ? (
          <Fragment>
            <button className="filterBtn" 
                    onClick={() => setHideCompleted(!hideCompleted)}>
              {hideCompleted ? "\u25BE\xa0\xa0Show All" : "\u25B8\xa0\xa0Hide Completed"}
            </button>

            {isLoading && <div className="loading">Loading...</div>}

            <ul className="tasks">
              {tasks.map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
              <NewTask />
            </ul>
            
            
          </Fragment>
        ) : (
          <LoginForm />
        )}
        
      </div>
    </div>
  );
};
