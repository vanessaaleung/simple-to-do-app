// Initialize Tasks Collection

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods'; // register the methods
import '/imports/api/tasksPublication';

const insertTask = (taskText, user) =>
  TasksCollection.insert({ 
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'todoadmin01!';

Meteor.startup(() => {
  // Create a default user 
  if (!Accounts.findUserByUsername(SEED_USERNAME))  {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    })
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  // If the Tasks collection is empty, add some data.
  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(taskText => insertTask(taskText, user));
  }
});
